import express from 'express';
import data from './data';
import dotenv from 'dotenv';
import cors from 'cors';
import uuid from 'uuid';
import config from './config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import Stripe from 'stripe';

const stripe = new Stripe("pk_test_51GukltFjCkAyS0oDV6s3ZMe8V2FuE6vCg0hhdUfIJBnhfPbcv7fDcdMmrGmHBWzXEQc5L6PcpkamyepmvBqpBkpM00hsi03sxX");


dotenv.config()

const mongodbUrl = config.MONGODB_URL;
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).catch((error) => console.log(error.reason));

const app = express();
app.use(bodyParser.json());

app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use(express.json());
app.use(cors());

// app.get("/api/products/:id", (req,res)=>{
//     const productId = req.params.id;
//     const product = data.products.find(x => x._id === productId);
//     // res.send(data.products.find(x => x._id === productId));
//     if(product)
//         res.send(product);
//     else
//         res.status(404).send({msg:"product not found"});
// });

app.get("/api/products", (req,res)=>{
    res.send(data.products);
});

app.post("/payment", async(req,res)=>{
  console.log("i am the payment backend")
  // const { productCart, token} = req.body
  console.log(req.body, "look");
  res.status(200).end()

  // const idempontencyKey = uuid();

  // return stripe.customers.create({
  //   email: token.email,
  //   source: token.id
  // }).then (customer => {
  //   stripe.charges.create({
  //     amount:productCart.price *100,
  //     currency: 'eur',
  //     customer: customer.id,
  //     receipt_email: token.email,
  //     description: productCart.name,
  //   }, {idempontencyKey});
  // })
  // .then(result => res.status(200).json(result))
  // .catch(err => console.log("error"))         

})

app.listen(4000, ()=>{console.log("server started at port 4000")});

