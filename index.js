const express = require('express');
var cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.2n6rtio.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();

        // collection declaration
        const userCollection = client.db('travel-community').collection('users');
        const communityCollection = client.db('travel-community').collection('community');
        const postsCollection = client.db('travel-community').collection('posts');

        // user collection
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            return res.send(result)
        });
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.find(query).toArray();
            return res.send(result);
        });
        app.put('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            return res.send(result);
        })

        // community Collection
        app.get('/communities',async(req,res)=>{
            const result = await communityCollection.find().toArray();
            return res.send(result);
        })
        app.get('/community/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await communityCollection.findOne(query);
            return res.send(result);
        })
        app.put('/create-community', async (req, res) => {
            const community = req.body;
            const result = await communityCollection.insertOne(community);
            return res.send(result);
        })

        // ports Collection
        app.get('/posts/:id',async(req,res)=>{
            const id = req.params?.id;
            const query = {CommunityId:id};
            const result = await postsCollection.find(query).toArray();
            return res.send(result);
        });
        app.put('/create-post',async(req,res)=>{
            const post = req.body;
            const result = await postsCollection.insertOne(post);
            return res.send(result);
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
    res.send("welcome Travel community");
})
app.listen(port, () => {
    console.log(`Success Connect With ${port}`);
})