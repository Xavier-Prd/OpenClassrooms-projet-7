const Comment = require('../models/comment');

// Methode get - Envoyer tous les commentaires
exports.get = (req, res, next) =>{
    Comment.findAll({
        where : {
            messageId : req.params.id
        }
    })
    .then(comments => {
        res.status(200).json(comments)
    })
    .catch(error => res.status(400).json({ error }));
};

// Methode add - Publier un commentaire
exports.add = (req, res, next) =>{
    let imageUrl = '';
    const commentObject = JSON.parse(req.body.comment);
    if(req.file){
        imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    commentObject.imageUrl = imageUrl;
    commentObject.userId = req.token.userId;
    Comment.create(commentObject)
    .then(() => res.status(201).json({ message:'Commentaire posté !'}))
    .catch(error => res.status(400).json({ error }));
};

// Methode delete - Supprimer un commentaire
exports.delete = (req, res, next) => {
    Comment.findByPk(req.params.id)
    .then( comment => {
        if(!comment){
            res.status(404).json({error: new Error('Aucun commentaire trouvé !')});
        }
        if (comment.userId !== req.auth.userId){
            res.status(400).json({error: new Error('Utilisateur non autorisé !')});
        }
        Comment.destroy({where: {id: req.params.id}})
        .then(()=> res.status(200).json({comment:'Commentaire supprimé !'})) 
        .catch(error => res.status(400).json({ error }));
    })
};