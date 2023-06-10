if (process.env.NODE_ENV == 'dev') require('dotenv').config();
const express = require('express');
// const bot = require('../bot.js');
const paypal = require('./paypal-api.js');
const { enigma, getTokensFromPrice } = require('../utils');
const { plans } = require('../constants');
const { User } = require('../db/models.js');
const { updateStock, checkStock, userExists } = require('../db/utils');
const logFather = require('../logger');
const { v4: uuid } = require('uuid');
// const {messagesEnum: {PURCHASED_SUCCESSFUL}, message} = require('../messages')
const { PORT=8888 } = process.env

const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.get('/purchase', async (req, res) => {
  const logId = uuid();
  const logger = logFather.child({ label: 'purchase', id: logId });
  const { uid, plan } = req.query;
  const decryptedUserId = enigma.decrypt(uid);

  logger.info(`a purchase request for ${plan} by ${decryptedUserId}`);

  // if there aren't enough tokens in stock
  if (!checkStock(plans[plan].tokens)) {
    res.send("there aren't enough tokens in stock").end();
    return;
  }

  const user = await User.findOne({ chatTgId: decryptedUserId });
  const planDetails = plans[plan];
  if (!user || !planDetails) {
    res.send('bad url');
    return;
  }

  // TODO validate id
  res.render('index', {
    uid,
    plan,
    name: user.firstName,
    tokens: planDetails.tokens,
    price: planDetails.price,
    logId,
  });
});

// parse post params sent in body in json format
app.use(express.json());

app.post('/create-paypal-order', async (req, res) => {
  const { userId, plan, logId } = req.body;
  const decryptedUserId = enigma.decrypt(userId)
  const logger = logFather.child({ label: 'purchase', id: logId });
  logger.info(`create order`)
  const exists = await userExists(decryptedUserId)
  if (!exists || !plans[plan]) {
    logger.info(
      `there is a problem with the order userExists=${exists} plan=${plan}, aborting...`
    );
    return;
  }; // it's actually chatId not userId

  // if there aren't enough tokens in stock
  if (!checkStock(plans[plan].tokens)) {
    logger.notice(`there arent enough tokens in stock to service the order`)
    res.end();
    return;
  }

  try {
    const order = await paypal.createOrder(userId, plan);
    logger.info(`order has successfully been created`)
    res.json(order);
  } catch (err) {
    logger.error(`there was a problem creating order`, err);
    res.status(500).send(err.message);
  }
});

app.post('/capture-paypal-order', async (req, res) => {
  const { orderID, logId } = req.body;
  const logger = logFather.child({ label: 'purchase', id: logId });
  logger.info(`payment was successful`)
  try {
    logger.info(`capture payment data`);
    const captureData = await paypal.capturePayment(orderID);
    const transaction = captureData.purchase_units[0].payments.captures[0];
    const userId = transaction.custom_id;
    const price = transaction.amount.value;
    const transactionId = transaction.id;
    const date = transaction.create_time;
    const tokens = getTokensFromPrice(price)
    const decryptedUserId = enigma.decrypt(userId);
    const user = await User.findOneAndUpdate(
      { chatTgId: decryptedUserId },
      {
        $set: { paid: true },
        $inc: { 'tokens.purchased': tokens },
        $push: {
          purchases: [
            {
              transactionId,
              date,
              tokens,
              price,
            },
          ],
        },
      }
    );
    // await bot
    //   .sendMessage(
    //     decryptedUserId,
    //     message(PURCHASED_SUCCESSFUL, user.langCode, user.translate, { tokens })
    //   )
    //   .catch((err) => logger.error(`error while sending PURCHASE_SUCCESSFUL`, err));

    logger.info(`update stock`)
    await updateStock(logger, tokens);
    logger.info(`Alhamdulillah, we done!`)
    // TODO calculate shares
    res.json(tokens); // TODO send success message to client
  } catch (err) {
    // TODO i MUST be notified IMMEDIATELY!! because payment is successful but user balance might not have been funded (in which case i would have to confirm. if not funded...i look up transaction history in paypal and manually make the necessary changes in db)
    logger.notice(`there was an error finalizing the purchase`, err)
    res.status(500).send(err.message);
  }
});

app.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}/basic`);
})

module.exports = app;
