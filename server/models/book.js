const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSquema = new Schema({
  name: String,
  genre: String,
  authorId: String
});

module.exports = mongoose.model('Book', bookSquema);
