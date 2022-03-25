const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    User.findOne({where:{ email: req.body.email }})
    .then(user => {
        if(user){
             res.status(401).json({ message: 'Email existant', type:'email' })
        }else{
            User.findOne({where:{ username: req.body.username }})
            .then(user => {
                if(user){
                   res.status(401).json({ message: 'Pseudo existant', type:'username' });
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
            res.status(401).json({ message: "Email ou mot de passe invalide !"});
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({ message: "Email ou mot de passe invalide !"});
                }
                res.status(200).json({
                    userId: user.id,
                    username: user.username,
                    imageUrl: user.imageUrl,
                    role: user.role,
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
    };

    exports.delete = (req, res, next) => {
        User.findByPk(req.params.id)
        .then( user => {
            if(!user){
                res.status(404).json({error: new Error('Aucun utilisateur trouvé !')});
            }
            // if (user.id !== req.auth.userId){
            //     res.status(400).json({error: new Error('Utilisateur non autorisé !')});
            // }
            User.destroy({where: {id: req.params.id}})
            .then(()=> res.status(200).json({message:'Utilisateur supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        })
    };

    exports.edit =  (req, res, next) => {
        const userObject = JSON.parse(req.body.user);
        if(req.file){
            let imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            userObject.imageUrl = imageUrl;
        }
        userObject.userId = req.token.userId;
        User.update(userObject, {where: {id: userObject.userId}})
        .then(() => {
            userObject.token = jwt.sign({ userId: userObject.userId },'RANDOM_TOKEN_SECRET',{ expiresIn: '30d' });
            res.status(201).json({user: userObject, message: "L'utilisateur a été modifié !"})
        })
        .catch(error => res.status(400).json({error}));
      };