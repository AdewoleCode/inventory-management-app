const express = require('express');
const app = express();
require('dotenv').config();

const userRouter = require('./routes/userRoute')

const connectDB = require('./db/connect');
const bodyParser = require('body-parser');

const errorHandler = require('./middlewares/errorMiddleware')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())



//routes
app.use('/api/v1/users', userRouter)


app.get('/', (req, res) => {
    res.send('homepage')
})


//error iddleware
app.use(errorHandler)



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
