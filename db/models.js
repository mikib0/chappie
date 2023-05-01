const mongoose = require('mongoose');
const logFather = require('../logger');

(async ()=> {
  const logger = logFather.child({ label: 'mongo' })
  try {
    await mongoose.connect(process.env.DB_URI);
    logger.info('DB CONNECTION ESTABLISHED...');
  } catch (error) {
    logger.error('DB CONNNECTION FAILED:', error);
  }
})()

const User = mongoose.model('User', {
  chatTgId: Number,
  firstName: String,
  lastName: String,
  username: String,
  langCode: String,
  translate: Boolean,
  isHavingDialog: Boolean,
  currentDialogId: String,
  tokens: {
    purchased: Number,
    referral: Number,
    free: Number,
    freeTokens_expiryDate_ms: Number,
  },
  purchases: [
    {
      transactionId: String,
      date: Date,
      tokens: Number,
      price: Number,
    },
  ],
  paid: Boolean,
});

const Conversation = mongoose.model('Conversation', {
  messageId: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  type: String,
  text: String,
  response: String,
  date: Date,
  dialogId: String,
  tokens: Number,
  flagged: Boolean
});

module.exports = {
  User,
  Conversation
}