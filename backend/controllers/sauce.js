const sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   delete sauceObject._userId;
   
   const sauce = new Sauce ({
       ...sauceObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
       likes: 0,
       dislikes: 0,
       usersLiked: [],
       usersDisliked: [],
     
   });
   
   sauce.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
   
};

exports.getAllSauce = (req, res, next) => {
  sauce
  .find()
  .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch(
    (error) => {
      res.status(400).json({ error: error,
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  sauce
  .findOne({_id: req.params.id})
  .then((sauce) => {
  
      res.status(200).json(sauce);
    })
    .catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    });
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file 
  ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename
  }`
  } 
  : { ...req.body };

delete sauceObject._userId;
sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};


exports.likeOrNot = (req, res, next) => {
      const userId = req.body.userId;
      const sauceId = req.param.id;
}