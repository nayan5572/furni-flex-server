const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000



// middlewares
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wlyyget.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const cartCollection = client.db('Furni-Flex').collection('itemCart');
    const storeCollection = client.db('Furni-Flex').collection('carts');


    // collect from the database
    app.get('/itemCart', async(req, res)=>{
        const result = await cartCollection.find().toArray();
        res.send(result);
    });


    // send user data ui to database
    app.post('/carts', async(req, res) =>{
        const cartItem = req.body;
        const result = await storeCollection.insertOne(cartItem);
        res.send(result);
    });

    // get data from database
    app.get('/carts', async(req, res) =>{
        const email = req.query.email;
        const query = {email:email}
        const result = await storeCollection.find(query).toArray();
        res.send(result);
    });











    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) =>{
    res.send('Furni-Flex is Running');
});
app.listen(port, ()=>{
    console.log(`Furni Flex is sitting on port ${port}`);
});