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

app.post("/payment", async (req, res) => {
  const { productCart, successUrl, cancelUrl } = req.body;
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: productCart.price,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
  return res.status(200).send(session);
});

app.listen(4000, ()=>{console.log("server started at port 4000")});
