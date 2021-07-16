import http from 'http';
import express from 'express';
import morgan from 'morgan';
import history from 'connect-history-api-fallback';
import Application from './src/Application.js';

// HTTP server port
const port = parseInt(process.env.PORT || '3000', 10);

// Create the express application
const app = express();
app.set('port', port);

// Create HTTP server
const httpServer = http.createServer(app);

httpServer.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = `${typeof port === 'string' ? 'Pipe' : 'Port'} ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    // eslint-disable-next-line no-fallthrough
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    // eslint-disable-next-line no-fallthrough
    default:
      throw error;
  }
});

httpServer.on('listening', () => {
  const addr = httpServer.address();
  console.log(`HTTP server running on ${typeof addr === 'string' ? 'pipe' : 'port'} ${port}`);
});

// Create our application
const application = new Application(19132);
app.locals.application = application;

// Setup routes
const content = express.static('public');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', application.router);

// Include static content before and after rewriting (as per connect-history-api-fallback example)
app.use(content);
app.use(history());
app.use(content);

// Custom JSON error handling
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).json(err.message);
})

// Attach the application to the HTTP server (socket.io)
application.attach(httpServer);

// Listen for termination message
process.on('SIGTERM', () => {
  console.log('Exiting due to SIGTERM event.');
  application.close();
  process.exit();
});

// Start the application
application.start()
  .then(() => {
    console.log(`The application was started successfully.`);
    httpServer.listen(port);
  })
  .catch((error) => {
    console.log(`There was a problem starting the application.`);
    console.log(error);
    process.exit(1);
  });