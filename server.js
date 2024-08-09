const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require("morgan");
const compression = require("compression");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');
const { Op, literal } = require('sequelize');
require("dotenv").config();

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();
app.use(compression());
const server = http.createServer(app);
const io = new Server(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./models');
// create table in database start.
const synchronizeAndSeed = async () => {
  try {
    await db.sequelize.sync({ force: true });
    // await db.sequelize.sync();
    await require('./seeder/index').settingSeed();
    await require('./seeder/index').gameStrategySeed();
    await require('./seeder/index').UpiRegisterSeed();
    await require('./seeder/index').betSuggestPlansSeed();
    await require('./seeder/index').cashPlanSeed();
  } catch (error) {
    console.error("Error during synchronization and seeding:", error);
  }
};
// synchronizeAndSeed();
// create table in database end.

app.use('/', indexRouter);
app.use('/api', apiRouter);

require('./cronJob/index');
const PendingTime = Number(process.env.GAME_PENDING_TIME) || 5;
const FlewAway = Number(process.env.FLEW_AWAY) || 3;

const { betting: BettingModel, bettingUser: BettingUserModel, users: UserModel, Sequelize } = require('./models/index');
const connectedUsers = new Map();
let bettingInterval = null;

// Function to fetch and emit the latest betting event
const sendBettingEvent = async () => {
  let bettingUsersData = null;
  try {
    const latestBettingEvent = await BettingModel.findOne({
      attributes: ['id', 'status', 'created_at'],
      order: [["created_at", "DESC"]],
    });

    if (latestBettingEvent) {
      bettingUsersData = await BettingUserModel.findAll({
        attributes: ["amount", "out_amount", "out_x", "position"],
        where: {
          betting_id: latestBettingEvent.id,
          amount: {
            [Op.gt]: literal('out_amount') // Filters rows where 'amount' is greater than 'out_amount'
          }
        },
        include: [{
          model: UserModel,
          attributes: ['mobile_no']
        }],
        order: [["updated_at", "DESC"]],
      });
    }

    const newGameTime = new Date(latestBettingEvent.created_at);
    const currentDateTime = new Date();
    newGameTime.setSeconds(newGameTime.getSeconds() + PendingTime + FlewAway);
    const differenceInSeconds = Math.floor((currentDateTime - newGameTime) / 1000);

    // Emit the event to all connected users
    connectedUsers.forEach((userData, socketId) => {
      const socket = userData.socket;
      socket.emit('bettingData', {
        message: 'aviator status.',
        data: {
          id: latestBettingEvent.id,
          status: latestBettingEvent.status,
          bet_pending_time: differenceInSeconds < 0 ? Math.abs(differenceInSeconds) : 0,
          bet_x_time: differenceInSeconds > 0 ? (differenceInSeconds / 10) : 0,
          frequency: 1000,
          flew_away: (FlewAway * 1000),
          pending_time: (PendingTime * 1000)
        }
      });
      if (differenceInSeconds > 0 && bettingUsersData.length >= 0) {
        socket.emit('betOutUserList', {
          message: 'betting win user list.',
          data: bettingUsersData
        });
      }
      if (differenceInSeconds == 0) {
        socket.emit('betStart', {
          message: 'Betting starting...',
          status: true
        });
      }
      if (differenceInSeconds == -PendingTime || differenceInSeconds == (-PendingTime - 1)) {
        socket.emit('betCrash', {
          message: 'Betting crashed...',
          status: true
        });
      }
    });
  } catch (error) {
    console.error('Error fetching betting event:', error);
  }
};

const startBettingInterval = () => {
  if (!bettingInterval) {
    bettingInterval = setInterval(sendBettingEvent, 1000);
  }
};

const stopBettingInterval = () => {
  if (bettingInterval && connectedUsers.size === 0) {
    clearInterval(bettingInterval);
    bettingInterval = null;
  }
};

// Socket Code Start 
io.on("connection", (socket) => {
  // console.log("socket connected");
  connectedUsers.set(socket.id, { socket });

  if (connectedUsers.size === 1) {
    startBettingInterval();
  }

  socket.on("joinBettingEvent", async (data) => {
    try {
      const { userId, amount = 5, position = 1 } = data;
      // Fetch the betting event with status true and the provided ID
      if (position != 1 && position != 2) {
        socket.emit('joinError', { message: 'Position only 2 limit.' });
        return;
      }
      const bettingEvent = await BettingModel.findOne({
        where: { status: true },
        order: [["created_at", "DESC"]],
      });
      if (!bettingEvent) {
        socket.emit('joinError', { message: 'Betting not active.' });
        return;
      }
      const newGameTime = new Date(bettingEvent.created_at);
      const currentDateTime = new Date();
      newGameTime.setSeconds(newGameTime.getSeconds() + PendingTime);
      if (currentDateTime > newGameTime) {
        socket.emit('exitError', { message: 'Betting join time out.' });
        return;
      }
      // Create an entry in the bettingUser table
      const bettingUserData = await BettingUserModel.create({
        user_id: userId,
        betting_id: bettingEvent.id,
        amount,
        position
      });
      // Emit the betting event to the connected user
      await UserModel.update(
        {
          total_balance: Sequelize.literal(`total_balance - ${amount}`),
          total_bet: Sequelize.literal('total_bet + 1')
        },
        {
          where: { id: userId }
        }
      );
      await BettingModel.update(
        {
          amount: Sequelize.literal(`amount + ${amount}`),
          t_users: Sequelize.literal(`t_users + 1`)
        },
        {
          where: { id: bettingEvent.id }
        }
      );
      socket.emit('joinSuccess', { message: 'Successfully joined the betting event.', data: bettingUserData });
    } catch (error) {
      console.error('Error joining betting event:', error);
      socket.emit('joinError', { message: 'An error occurred while joining the betting event.' });
    }
  });

  socket.on("exitBettingEvent", async (data) => {
    try {
      const { userId, bettingId, out_x = 0, position = 1 } = data;
      if (position != 1 && position != 2) {
        socket.emit('exitError', { message: 'Position only 2 limit.' });
        return;
      }
      // Fetch the betting event with status true and the provided ID
      const bettingEvent = await BettingModel.findOne({
        where: { status: true, id: bettingId },
      });
      if (!bettingEvent) {
        socket.emit('exitError', { message: 'Betting not active.' });
        return;
      }
      const newGameTime = new Date(bettingEvent.created_at);
      const currentDateTime = new Date();
      // newGameTime.setSeconds(newGameTime.getSeconds() + PendingTime);
      if (currentDateTime < newGameTime) {
        socket.emit('exitError', { message: 'Betting not exist.' });
        return;
      }

      // Fetch the betting user data
      const bettingUserData = await BettingUserModel.findOne({
        where: { user_id: userId, betting_id: bettingId, position: position },
      });
      if (!bettingUserData) {
        socket.emit('exitError', {
          message: 'You are not participating in this betting event.'
        });
        return;
      }

      // Update the user's balance and bets
      await UserModel.update(
        {
          total_balance: Sequelize.literal(`total_balance + ${bettingUserData.amount * out_x}`),
        },
        {
          where: { id: userId }
        }
      );
      // Update the betting event's total balance and bets
      await BettingModel.update(
        {
          out_amount: Sequelize.literal(`out_amount + ${bettingUserData.amount * out_x}`)
        },
        {
          where: { id: bettingEvent.id }
        }
      );
      bettingUserData.out_amount = (bettingUserData.amount * out_x);
      bettingUserData.out_x = out_x;
      await bettingUserData.save();
      // Emit a message to the client
      socket.emit('exitSuccess', { message: 'You have successfully exited the betting event.' });
    } catch (error) {
      console.error(error);
      socket.emit('exitError', {
        message: 'An error occurred while exiting the betting event.'
      });
    }
  });

  socket.on("walletEvent", async (data) => {
    try {
      const { userId } = data;
      const user = await UserModel.findOne({ where: { id: userId }, attributes: ['total_balance', 'total_deposit', 'total_withdraw', 'total_bet'], });
      if (!user) {
        socket.emit('walletError', { message: 'User not found.' });
        return;
      }
      socket.emit('walletSuccess', {
        message: 'Wallet updated successfully.',
        data: user
      });
    } catch (error) {
      console.error('Error updating wallet:', error);
      socket.emit('walletError', { message: 'An error occurred while updating the wallet.' });
    }
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    // console.log("disconnect socket io.");
    if (connectedUsers.size <= 0) {
      stopBettingInterval();
    }
  });
});
// Socket Code End


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Port Listen::${port}`);
});
