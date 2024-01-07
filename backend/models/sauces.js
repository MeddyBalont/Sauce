const mongoose = require('mongoose');

//Création du modèle de sauce 
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer : {type: String, require : true},
  description: { type: String, required: true },
  mainPepper : {type: String, require : true},
  imageUrl: { type: String, required: true },
  heat : {type: Number, require : true, min:0, max: 10},
  likes: {type: Number, require : true, default : 0},
  dislikes: {type: Number, require : true, default : 0},
  usersLiked : {type:[String], require : true, default : [""] },
  usersDisliked : {type:[String], require : true, default : [""]} ,
});

module.exports = mongoose.model('sauce', sauceSchema);