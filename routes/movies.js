const express = require('express');
const router = express.Router();

const Movie = require('../models/Movie');

router.post('/add', function (req, res, next) {
    let {title, category, country, year, imdb_score,director_id} = req.body;

    let movie = new Movie({
        title: title,
        category: category,
        country: country,
        year: year,
        imdb_score: imdb_score,
        director_id:director_id
    });

    const promise = movie.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });

    /* movie.save((err,data)=>{
       if(err)
         res.json(err);
       res.json(data);

     });*/


});

//tüm filmler
router.get('/', (req, res, next) => {
    Movie.aggregate([
        {
          $lookup:{
              from:'directors',
              localField:'director_id',
              foreignField:'_id',
              as:'director',
          }
        },
        {
            $unwind:'$director',
        }
    ], (err, data) => {
        if (err)
            res.json(err);
        res.json(data);
    });
});

//top 10
router.get('/top10', (req, res, next) => {
    Movie.find({}, (err, data) => {
        if (err)
            res.json(err);
        res.json(data);
    }).limit(10).sort({imdb_score:-1});
});




//id sine göre filmler
router.get('/:movie_id', (req, res, next) => {
    const promise = Movie.findById(req.params.movie_id);
    promise.then((data) => {
        if (!data) {
            next({message: 'The movie was not found.',code:99});
        } else {
            res.json(data);
        }

    }).catch((err) => {
        res.json(err);
    });
});

//movie update.
router.put('/:movie_id', (req, res, next) => {
    const promise = Movie.findOneAndUpdate(req.params.movie_id,req.body,{new:true});
    //new:True => değişikliği anında json çıktısı olarak göstermemizi sağlar.
    promise.then((data) => {
        if (!data) {
            next({message: 'The movie was not found.',code:99});
        } else {
            res.json(data);
        }

    }).catch((err) => {
        res.json(err);
    });
});


router.delete('/:movie_id', (req, res, next) => {
    const promise = Movie.findOneAndRemove(req.params.movie_id);
    //new:True => değişikliği anında json çıktısı olarak göstermemizi sağlar.
    promise.then((data) => {
        if (!data) {
            next({message: 'The movie was not found.',code:99});
        } else {
            res.json({status:"ok"});
        }

    }).catch((err) => {
        res.json(err);
    });
});


//between

router.get('/between/:start_year/:end_year', (req, res, next) => {
    const {start_year,end_year} = req.params;
    Movie.find({year: {
            "$gte":parseInt(start_year), //greater than or equal büyük veya eşit ise
            "$lte":parseInt(end_year),    //lower than or equal küçük veya eşit ise.
        }}, (err, data) => {
        if (err)
            res.json(err);
        res.json(data);
    }).sort({imdb_score:-1});
});




module.exports = router;
