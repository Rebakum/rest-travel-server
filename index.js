const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.upnu39b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db('TravelDB');
    const travelCollection = database.collection('travel');
    const crantryCollection =client.db('TravelDB').collection('country')


    //--post----

    app.post('/addTouristsSport', async (req, res) => {
      console.log(req.body)
      const result = await travelCollection.insertOne(req.body)
      console.log(result)
      res.send(result)

    })
    // ---get- all data-------

    app.get('/addTouristsSport', async (req, res) => {
      const cursor = travelCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })
    //------get one data------
    app.get('/addTouristsSport/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await travelCollection.findOne(query);
      res.send(result);
    })

    //  -------get  email----

    app.get("/myList/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const data = await travelCollection.find(query).toArray();
      console.log(data)
      res.send(data);
    });

    //------update --email user card-----

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedMyList = req.body;
      const myList = {
        $set: {
          image: updatedMyList.image,
          touristsNam: updatedMyList.touristsNam,
          location: updatedMyList.location,
          travelTime: updatedMyList.travelTime,
          season: updatedMyList.season,
        }
      }
      const result = await travelCollection.updateOne(filter, myList)
      res.send(result)

    })


    //-----delete------

    app.delete('/addTouristsSport/:id', async(req, res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)};
      const result = await travelCollection.deleteOne(query)
      res.send(result)
    })
    

//------country data api----
app.post('/country', async (req, res) => {
  console.log(req.body)
  const result = await crantryCollection.insertOne(req.body)
  console.log(result)
  res.send(result)

})
//------get------
app.get('/country', async (req, res) => {
  const cursor = crantryCollection.find()
  const result = await cursor.toArray();
  res.send(result)
})
//-----get-----

app.get('/country/:countryName', async (req,res)=>{
  const country = req.params.countryName;
  const query = {countryName:country}
  const result = await crantryCollection.findOne(query);
  res.send(result)
})









   
    // Send a ping to confirm a successful connection

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', async (req, res) => {
  res.send('rest travel server going')
})
app.listen(port, () => {
  console.log(`rest travel is running, ${port}`)
})