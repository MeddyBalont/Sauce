const Sauce = require("../models/sauces");
const fs = require("fs");

//Fonction pour créer la sauce piquante
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  console.log(req.auth.userId);
  console.log(sauceObject);
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [""],
    usersDisliked: [""],
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Fonction pour afficher toutes les sauces piquantes
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      console.log(sauces);
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};


//Fonction pour modifier la sauce piquante
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({_id : req.params.id})
  .then((object) => {
      if(req.file){
          const filename = object.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => { 
              if(err) res.status(500).json({err});
              console.log(`${filename} la sauce est supprimé`);
          });           
      }; 

      const sauceObject = req.file ? 
          {
              ...JSON.parse(req.body.sauce), 
              imageUrl:`${req.protocol}://${req.get("host")}/images/${req.file.filename}`
          } : {
              ...req.body
          }

      //Mettre à jour la base de données. 
      Sauce
      .updateOne({... sauceObject})
      .then(() => res.status(200).json({
          message : "l'objet a été mis à jour",
          contenu : sauceObject}))
      .catch((error) => res.status(404).json({error}))
          
  })
  .catch((err) => res.status(400).json({err}));
};

//Fonction pour effacer la sauce piquante
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé :" + sauce });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};


//Fonction pour liker ou dislike la sauce piquante
exports.likeOrNot = (req, res, next) => {
  const userId = req.body.userId;
  const sauceId = req.params.id;
  if (req.body.like == 1) {
    Sauce.updateOne(
      { _id: sauceId },
      { $push: { usersLiked: userId }, $inc: { likes: +1 } }
    )
      .then(() => res.status(200).json({ messages: "Tu aimes cette sauce " }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like == 0) {
    Sauce.findOne({ _id: sauceId }).then((sauce) => {
      if (sauce.usersLiked.includes(userId)) {
        Sauce.updateOne(
          { _id: sauceId },
          { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
        )
          .then(() =>
            res.status(200).json({ message: "Tu n'aimes plus cette sauce !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (sauce.usersDisliked.includes(userId)) {
        console.log("je suis dans le dislike");
        Sauce.updateOne(
          { _id: sauceId },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
        ).then(() => res.status(200).json({ message: "Plus de dislike !" }));
      }
    });
  } else if (req.body.like == -1) {
    Sauce.updateOne(
      { _id: sauceId },
      { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
    )
      .then(() => res.status(200).json({ messages: "Tu n'aimes cette sauce " }))
      .catch((error) => res.status(400).json({ error }));
  }
};
