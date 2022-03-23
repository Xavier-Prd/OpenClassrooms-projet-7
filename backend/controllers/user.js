const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    User.findOne({where:{ email: req.body.email }})
    .then(user => {
        if(user){
             res.status(401).json({ message: 'Email existant' })
        }else{
            User.findOne({where:{ username: req.body.username }})
            .then(user => {
                if(user){
                   res.status(401).json({ message: 'Pseudo existant' });
                }else{
                    bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: hash
                        });     
                        user.save()
                        .then(() =>  res.status(201).json({ message: 'Utilisateur créé !'}))
                        .catch(error => res.status(400).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));
                 }
            });
        }
    });          
};

exports.login = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
    .then(user => {
        if(!user){
            res.status(401).json({ message: "Utilisateur non trouvé !" });
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({ message: "Mot de passe invalide !" });
                }
                res.status(200).json({
                    userId: user.id,
                    token: jwt.sign(
                        { userId: user.id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '30d' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
            }
            })
            .catch(error => res.status(500).json({ error }));
        };

    exports.get = (req, res, next) => {
        User.findByPk(req.params.id)
        .then( user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
    }