const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5001;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://Task-Management:fvrIMpo2zrgEcadQ@cluster0.vboitvz.mongodb.net/?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const AllTaskCollection = client.db('Task-Managment').collection('Alltask');
const AllServiceCollection = client.db('Task-Managment').collection('All-Service');

async function run() {

  try {
    await client?.connect();
    await client?.db("admin")?.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/alltask', async (req, res) => {
      const result = await AllTaskCollection?.find()?.toArray();
      res?.send(result)
    })

    app.get('/alltask/:id', async (req, res) => {
      const id = req?.params?.id
      const qurey = { _id: new ObjectId(id) }

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          plot: `A harvest of random numbers, such as: ${Math.random()}`
        },
      };
      const result = await AllTaskCollection?.findOne(qurey)
      res?.send(result)
    })

    // all service 
    app.get('/allservice', async (req, res) => {
      const result = await AllServiceCollection?.find()?.toArray();
      res?.send(result)
    })

    app.post('/addCard', async (req, res) => {
      try {
        const addCard = req.body;
        if (!addCard) {
          return res.status(400).json({ error: 'Invalid data' });
        }
        const collection = AllTaskCollection;
        const result = await collection.insertOne(addCard);
        res.status(201).json(result.ops[0]);
      } catch (error) {
        console.error('Error adding card:', error);
        res.status(500).json({ error: 'Internal server error' });
      } finally {
      }
    });

    app.patch('/setdeveloper', async (req, res) => {
      try {
        const obj = req.body.data; // 
        res.json({ modifiedCount: 1 });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

  } finally {
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send(" server is work well")
})

app.listen(port, () => {
  console.log(`Server is running port : ${port}`)
})
