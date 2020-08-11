const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();


const userRouter = require('./routes/userRouter');
const profileRouter = require	('./routes/profileRouter');
const bookRouter = require('./routes/bookRouter');
const categoryRouter = require('./routes/categoryRouter');
const districtRouter = require('./routes/districtRouter');
const uploadRouter = require('./routes/upload');
const auth = require('./routes/authentication'); 


const app = express();
app.use(cors());
mongoose.connect(process.env.DbURI,{
    useNewUrlparser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})
.then(()=> console.log('----------------- Database server connected --------------------'))
.catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome To My App, Stranger!!!');
});

app.use('/api/users', userRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/books', bookRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/districts', districtRouter);
app.use('/api/uploads', uploadRouter);

app.use((req, res, next) =>  {
    let err = Error('Error');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        status: 'err',
        message: err.message
    })
})

app.listen(process.env.Port,  () => {
    console.log(`Server is running at localhost:${process.env.Port}`);
});
