const express = require('express');
const app = express();
require('dotenv').config();




const connectDB = require('./db/connect')



const port = process.env.PORT || 3000;


//conect to mongodb and start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log('connected');
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
