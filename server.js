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
  } catch (error) {
    console.error("Error during synchronization and seeding:", error);
  }
};
// synchronizeAndSeed();
// create table in database end.

app.use('/', indexRouter);
app.use('/api', apiRouter);

require('./cronJob/index');

const { betting: BettingModel, bettingUser: BettingUserModel, users: UserModel, Sequelize } = require('./models/index');
const connectedUsers = new Map();
let bettingInterval = null;

// Function to fetch and emit the latest betting event
const sendBettingEvent = async () => {
  try {
    const latestBettingEvent = await BettingModel.findOne({
      attributes: ['id', 'status'],
      order: [["createdAt", "DESC"]],
    });

    // Emit the event to all connected users
    connectedUsers.forEach((userData, socketId) => {
      const socket = userData.socket;
      socket.emit('bettingData', {
        message: 'aviator status.',
        latestBettingEvent
      });
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
  console.log("socket connected");
  connectedUsers.set(socket.id, { socket });

  if (connectedUsers.size === 1) {
    startBettingInterval();
  }

  socket.on("joinBettingEvent", async (data) => {
    try {
      const { userId, amount = 10 } = data;
      // Fetch the betting event with status true and the provided ID
      const bettingEvent = await BettingModel.findOne({
        where: { status: true },
        order: [["createdAt", "DESC"]],
      });
      if (!bettingEvent) {
        socket.emit('joinError', { message: 'Betting not active.' });
        return;
      }
      // Create an entry in the bettingUser table
      const bettingUserData = await BettingUserModel.create({
        user_id: userId,
        betting_id: bettingEvent.id,
        amount
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
      const { userId, bettingId, out_x } = data;
      // Fetch the betting event with status true and the provided ID
      const bettingEvent = await BettingModel.findOne({
        where: { status: true, id: bettingId },
      });
      if (!bettingEvent) {
        socket.emit('exitError', { message: 'Betting not active.' });
        return;
      }
      // Fetch the betting user data
      const bettingUserData = await BettingUserModel.findOne({
        where: { user_id: userId, betting_id: bettingId },
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
    console.log("disconnect socket io.");
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
