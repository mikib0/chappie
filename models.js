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
  lastName: String,
  username: String,
  isHavingDialog: Boolean,
  currentDialogId: String,
});

const Conversation = mongoose.model('Conversation', {
  messageId: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  text: String,
  response: String,
  date: Date,
  dialogId: String,
  flagged: Boolean
});

module.exports = {
  User,
  Conversation
}