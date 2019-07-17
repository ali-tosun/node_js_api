const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

//MODELS
const User = require('../models/User');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/register', function (req, res, next) {
    let {username, password} = req.body;

    bcryptjs.hash(password, 10, (err, hash) => {
        if (err) {
            res.json({
                status: false,
                err
            });
        } else {
            let user = new User({
                username: username,
                password: hash
            });


            let promise = user.save();
            promise.then((data) => {
                res.status(200);
                res.json({
                    status: true,
                    data
                });

                // res.json(data);
            }).catch((err) => {
                res.json({
                    status: false,
                    err
                });

            })


        }
    });


});


router.post('/login', (req, res, next) => {
    let {username, password} = req.body;
    const promise = User.findOne({
        username
    }, (err, user) => {
        if (!user) {
            res.json({
                status: false,
                message: "Böyle bir kullanici yok",
            })
        } else {
            bcryptjs.compare(password, user.password, (err, result) => {
                if (!result) {
                    res.json({
                        status: false,
                        message: "password is wrong",
                    })
                } else {
                    const payload = {
                        username
                    };
                    const token = jwt.sign(payload, req.app.get('api_secret_key'), {
                        expiresIn: 720 //12 hours.
                    });

                    res.cookie('x-access-token', token, {secure: true, httpOnly: true});
                    res.cookie('ali', 'alitosun', {secure: true, httpOnly: true});
                    console.log("token deneme" + token);

                    res.json({
                        status: true,
                        token,
                        user,
                    })
                }
            });
        }

    });


});


module.exports = router;
