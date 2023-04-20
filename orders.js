const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Order = require("./model/orders.model");
const { response } = require("express");
require("dotenv").config();
const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(cors({ origin: true, credentials: true }));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
const { v4: uuidv4 } = require("uuid")
const stripe = require("stripe")("sk_test_51Lw56vSFAyIqkgIKVFt0lCVJ4CK0uYfw9TURYk12rZe7DkOLXi67GDzNf9LygQAXgA3JbuM5Ix7epxXCBnEH970t00ZEzu4Awv")
mongoose.connect(
    "mongodb+srv://nasim:nasim@foodapp.m8qxf95.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log("MongoDB connection established");
    }
);
app.post("/generateToken", async (req, res) => {
    const { token, subTotal } = req.body

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const payment = await stripe.paymentIntents.create({
            amount: subTotal * 100,
            customer: customer.id,
            currency: 'inr',
            receipt_email: token.email
        },
            {
                idempotencyKey: uuidv4()
            })

        if (payment) {
            res.send(payment)
        }
        else {
            res.send("something is wrong")
        }
    }
    catch (err) {
        return res.status(400).json({ message: "something went wrong " + err })
    }
})
app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await Order.findOne({ email: email })
        if (user) {
            if (user.password === password) {
                res.send(user)
            }
            else {
                res.send("wrong password")
            }
        }
        else {
            res.send("no user exist")
        }
    }
    catch (err) {
        console.log(err)
    }
})
app.post('/signUp', async (req, res) => {
    try {
        let { Name, email, password } = req.body
        const data = new Order({ Name, email, password })
        const updatedOrder = await data.save()
        res.json(updatedOrder)
    }
    catch (err) {
        console.log(err)
    }
})
app.post('/placeOrder', async (req, res) => {
    let { OrderId, orderItems, orderAmount, transactionId, shippingAddress, name } = req.body;
    const response=await Order.updateOne({ Name: name },
        {
            $set:
            {
                OrderId,
                orderItems,
                orderAmount,
                transactionId,
                shippingAddress
            }
        })
    res.send(response)
})
app.post('/myorder',async(req,res)=>{
    let {Name}=req.body
    const user=await Order.findOne({Name})
    res.send(user)
})
app.get("/",(req,res)=>{
    res.send("success")
})

