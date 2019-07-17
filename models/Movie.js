const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({


    title: {
        type: String,
        required: true,
    },
    category:{
        type: String,
    },
    country:{
        type:String
    },
    year:{
        type:Number,
    },
    imdb_score:{
        type:Number,
    },
    date:{
        type:Date,
        default:Date.now
    },
    director_id:{
        type:Schema.Types.ObjectId
    },
    author:{
        type:String
    }


});

module.exports = mongoose.model('movie',MovieSchema);
