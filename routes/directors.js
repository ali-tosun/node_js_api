const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//MODEL
let Director = require('../models/Director');

/* POST director add. */
router.post('/', (req, res) => {
    let director = new Director(req.body);
    let promise = director.save();
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


router.get('/:director_id', (req, res, next) => {
    let promise = Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.director_id),
            }

        },
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies',
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true, //eşleşmeyen değerleride getirir.ex:yönetmenenin herhangi bir filmi yoksa sadece yönetmeni getirir
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio',

                },
                movies: {
                    $push: '$movies',
                },
                count: {$sum: 1}
            },

        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies',
                count: 1,
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);

    }).catch((err) => {
        res.json(err);
    })

});


router.get('/', (req, res, next) => {
    let promise = Director.aggregate([
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies',
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true, //eşleşmeyen değerleride getirir.ex:yönetmenenin herhangi bir filmi yoksa sadece yönetmeni getirir
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio',
                },
                movies: {
                    $push: '$movies',
                },
                count: {$sum: 1}
            },
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies',
                count: 1,
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);

    }).catch((err) => {
        res.json(err);
    })

});


router.put('/:director_id', (req, res, next) => {

    let promise = Director.findByIdAndUpdate(req.params.director_id, req.body, {new: true});

    promise.then((data) => {
        if (!data) {
            next({message: 'the director was not found.', code: 222});
        } else {
            res.json(data);
        }
    }).catch((err) => {
        res.json(err);
    });


});


router.delete('/:director_id', (req, res, next) => {

    let promise = Director.findByIdAndRemove(req.params.director_id);

    promise.then((data) => {
        if (!data) {
            next({message: 'the director was not found.', code: 222});
        } else {
            res.json({status: 1});
        }
    }).catch((err) => {
        res.json(err);
    });


});


module.exports = router;
