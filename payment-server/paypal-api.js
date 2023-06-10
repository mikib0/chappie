const {default: fetch} = require('node-fetch-cjs');
const uuid = require('uuid');
const { plans } = require('../constants');
const { kFy } = require('../utils');
const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.paypal.com"; // TODO replace with live url

async function createOrder(userId, plan) {
  const thePlan = plans[plan]
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'PayPal-Request-Id': uuid.v4(),
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: `purchase ${kFy(thePlan.tokens)} tokens at $${thePlan.price}`,
          custom_id: userId,
          amount: {
            currency_code: 'USD',
            value: thePlan.price,
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: 'chappie',
            shipping_preference: 'NO_SHIPPING',
            landing_page: 'NO_PREFERENCE',
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            cancel_url: 'https://t.me/gpt3_tgBot',
          },
        },
      },
    }),
  });

  return handleResponse(response);
}

async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  // console.log('the secret: ', auth);
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

module.exports = {
  createOrder,
  capturePayment,
  generateAccessToken
}