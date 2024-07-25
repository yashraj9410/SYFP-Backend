const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db.config');
const userRoutes = require('./routes/user.routes');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Use Morgan for logging
app.use(morgan('dev'));

// Use the user routes
app.use('/api', userRoutes);

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
