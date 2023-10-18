const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


// autoZone
// DikwR9QqKOBNA2Lc

const uri = "mongodb+srv://autoZone:DikwR9QqKOBNA2Lc@cluster0.ublbqgg.mongodb.net/?retryWrites=true&w=majority";
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
    // await client.connect();

    const database = client.db("brandsDB");
    const brandCollection = database.collection("brand");
    const productCollection = client.db("productsDB").collection("products");

   

    app.get('/brands', async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    // get api for products
    app.get('/products/:brandName', async (req, res) => {
      const brandName = req.params.brandName;
      console.log(`Searching for products with brand: ${brandName}`);
      const result = await productCollection.find({ brand: brandName }).toArray();
      console.log(`Found ${result.length} products.`);
      // const cursor = productCollection.find();
      // const result = await cursor.toArray();
      res.send(result);
    })


    // post api for brand
    app.post('/brands', async (req, res) => {
      const brands = req.body;
      console.log(brands)
      const result = await brandCollection.insertOne(brands);
      res.send(result);
    })
    // post api for products
    app.post('/products', async (req, res) => {
      const products = req.body;
      console.log(products)
      const result = await productCollection.insertOne(products);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server is Running')
})

app.listen(port, () => {
  console.log(`CRUD is running on port ${port}`)
})