const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  mainPepper : {type: String, require : true},
  manufacturer : {type: String, require : true},
  heat : {type: Number, require : true, min:0, max: 10},
  likes: {type: Number, require : true, default : 0},
  dislikes: {type: Number, require : true, default : 0},
  usersLiked : {type:[String], require : true, default : [] },
  usersDisliked : {type:[String], require : true, default : []} ,
});

module.exports = mongoose.model('sauce', sauceSchema);