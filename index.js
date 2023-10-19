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
    const cartProductCollection = client.db("productsDB").collection("cartProducts");



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
    // For Cart 
    app.get('/cartProducts', async (req, res) => {
      const cursor = cartProductCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    // get api for products
    app.get('/products/:brandName', async (req, res) => {
      const brandName = req.params.brandName;
      // console.log(`Searching for products with brand: ${brandName}`);
      const result = await productCollection.find({ brand: brandName }).toArray();
      // console.log(`Found ${result.length} products.`);
      // const cursor = productCollection.find();
      // const result = await cursor.toArray();
      res.send(result);
    })

    // get api for cartProducts
    app.get('/cartProducts/:userEmail', async(req, res) => {
      const userEmail = req.params.userEmail;
      console.log(`Searching for products with userEmail: ${userEmail}`);
      const result = await cartProductCollection.find({ useremail: userEmail }).toArray();
      console.log(`Found ${userEmail.length} products.`);
      res.send(result);
    })

    // Get specifiq product by id for update
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
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

    // post api for cartProduct
    app.post('/cartProducts' , async (req, res) => {
      const cartProducts = req.body;
      const result = await cartProductCollection.insertOne(cartProducts);
      res.send(result);
    })

    // Update value 
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const newUpdatedProduct = {
        $set: {
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          price: updatedProduct.price,
          ratings: updatedProduct.ratings,
          details: updatedProduct.details,
          photo: updatedProduct.photo
        }
      }
      const result = await productCollection.updateOne(filter, newUpdatedProduct, options)
      res.send(result)
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