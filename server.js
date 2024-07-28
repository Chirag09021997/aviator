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

// create table in database start.
const db = require('./models');
const synchronizeAndSeed = async () => {
  try {
    await db.sequelize.sync({ force: true });
    // await db.sequelize.sync();
    await require('./seeder/index').settingSeed();
  } catch (error) {
    console.error("Error during synchronization and seeding:", error);
  }
};
// synchronizeAndSeed();
// create table in database end.

app.use('/', indexRouter);
app.use('/api', apiRouter);


// Socket Code Start 
io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("disconnect", () => {
    console.log("disconnect socket io.");
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
