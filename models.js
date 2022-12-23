const mongoose = require('mongoose');

(async ()=> {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('DB CONNECTION ESTABLISHED...');
  } catch (error) {
    console.log('DB CONNNECTION FAILED:', error);
  }
})()

const User = mongoose.model('User', {
  chatTgId: Number,
  firstName: String,
  username: String,
});

const Conversation = mongoose.model('Conversation', {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  text: String,
  response: String,
  date: Date,
});

module.exports = {
  User,
  Conversation
}