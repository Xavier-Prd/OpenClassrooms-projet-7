const Message = require('../models/message');
const User = require('../models/user');
const Comment = require('../models/comment');

// Methode get - Envoyer tous les messages
exports.get = (req, res, next) =>{
    Message.findAll({
        include: [{
            model: User, 
            attributes: ['username', 'imageUrl']
            }, 
            {
                model: Comment, 
                include: {
                    model: User, 
                    attributes: ['username', 'imageUrl']
                }
            }
        ],
        order:  [['createdAt', 'DESC']]
    })
    .then(messages => {
        res.status(200).json(messages)
    })
    .catch(error => res.status(400).json({ error }));
};

// Methode getOne - Envoyer un message
exports.getOne = (req, res, next) => {
    Message.findOne({
                    where: {
                        id: req.params.id
                    }, 
                    include: [
                        {
                            model: User,
                            attributes: ['username', 'imageUrl']
                        }, 
                        {
                            model : Comment,
                            include: {
                                model: User,
                                attributes: ['username', 'imageUrl']
                            },
                            order: [['createdAt', 'DESC']]
                        }
                    ]
                })
    .then( message => res.status(200).json(message))
    .catch(error => res.status(404).json({ error }));
}


// Methode add - Publier un message
exports.add = (req, res, next) =>{
    let imageUrl = '';
    const messageObject = JSON.parse(req.body.message);
    if(req.file){
        imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    messageObject.imageUrl = imageUrl;
    messageObject.userId = req.token.userId;
    Message.create(messageObject)
    .then(() => res.status(201).json({ message:'Message posté !'}))
    .catch(error => res.status(400).json({ error }));
};

// Methode delete - Supprimer un message
exports.delete = (req, res, next) => {
    Message.findByPk(req.params.id)
    .then( message => {
        if(!message){
            res.status(404).json({error: 'Aucun message trouvé !'});
        }
        if (message.userId !== req.token.userId && req.token.role !== 'admin'){
            res.status(400).json({error:'Utilisateur non autorisé !'});
        }
        else{
            Message.destroy({where: {id: req.params.id}})
            .then(()=> res.status(200).json({message:'Message supprimé !'})) 
            .catch(error => res.status(400).json({ error }));
        }
    })
};

exports.edit =  (req, res, next) => {
    const messageObject = JSON.parse(req.body.message);
    if(req.file){
        let imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        messageObject.imageUrl = imageUrl;
    }
    messageObject.userId = req.token.userId;
    if (messageObject.userId !== req.token.userId) {
        res.status(400).json({error:'Utilisateur non autorisé !'});
    }
    else {
    Message.update(messageObject, {where: {id: req.params.id}})
    .then(() => res.status(201).json({message: 'Le message a été modifié !'}))
    .catch(error => res.status(400).json({error}));
    }
  };