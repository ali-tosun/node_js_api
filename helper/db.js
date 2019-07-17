const mongoose = require('mongoose');

module.exports = () => {

    mongoose.set('useCreateIndex', true); //unique:true yapınca gelen sorunu ortadan kaldırıyor.
    mongoose.connect('mongodb://tosun:123456asd@ds151626.mlab.com:51626/heroku_v07rl3rs',
        {useNewUrlParser: true });
   mongoose.connection.on('open',()=>{
       console.log("mongo db connnected.");
   });
    mongoose.connection.on('error',(err)=>{
        console.log("mongo db error."+err);
    });

    mongoose.Promise =global.Promise;
};