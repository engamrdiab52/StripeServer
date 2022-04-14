const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: 'http://10.0.2.2:3000' }))
require('dotenv').config()
app.use(express.json())
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const calculateOrderAmount = (items) => {
    //const {money} = items
    // console.log(items.money);
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 7000;
}


app.get('/config', (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
})

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    console.log({ items });
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        }
    })

    res.send({
        clientSecret: paymentIntent.client_secret,
    })
    console.log(paymentIntent.client_secret);
})


app.listen(3000, () => {
    console.log('Node server listening at http://10.0.2.2:3000')
})