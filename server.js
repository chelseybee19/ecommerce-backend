const express = require('express');
const data = require('./data');
const dotenv = require('dotenv');
const cors = require('cors');
const config = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const Stripe = require('stripe');
const fileUpload = require('express-fileupload');

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
app.use(fileUpload());


app.post('/upload', (req, res) => {
  if(req.files === null){
    return res.status(400).json({ msg: 'No file uploaded'})
  }
  const file = req.files.file;

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if(err){
      console.log(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}`})
  })

});



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
  console.log(productCart, "productCart")
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: productCart,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
  return res.status(200).send(session);
});

app.listen(process.env.PORT || 4000 , ()=>{console.log("server started at port 4000")});

