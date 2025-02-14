const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lggjuua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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



        // collection for a storing user
        const userCollection = client.db('sakuArtisansDB').collection('users')

        // collection for a storing arts & craft items
        const craftCollection = client.db('sakuArtisansDB').collection('artsCraftItems')

        // category collection
        const craftCategory = client.db('sakuArtisansDB').collection('craftCategory')


        // get the all data of arts & craft items
        app.get('/allCraftItems', async(req, res) => {
            const result = await craftCollection.find().toArray();
            res.send(result)
        })


        // get the single arts & craft items data by id
        app.get('/allCraftItems/:id', async(req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id)}
            const result = await craftCollection.findOne(query);
            res.send(result)
        })

        // get the single arts & craft items data by id
        app.get('/allCraftItems/craftItemsCategory/:subCategory', async(req, res) => {
            const category = req.params.subCategory
            
            const query = { subCategory: category}
            const result = await craftCollection.find(query).toArray();
            res.send(result)
        })


        // get the all data of arts & craft items by email
        app.get('/myCraft/:email', async(req, res) => {
            const email = req.params.email
            const query = { email: email}
            const result = await craftCollection.find(query).toArray();
            res.send(result)
        })

        // get the category data from another collection
        app.get('/craftCategory', async(req, res) => {
            const result = await craftCategory.find().toArray();
            res.send(result)
        })

        // Send User Information to Database 
        app.post('/users', async(req, res) => {
            const users = req.body;
            const result = await userCollection.insertOne(users);
            res.send(result)
        })

        // Send Data to Database
        app.post("/allCraftItems", async(req, res) => {
            const craftItems = req.body;
            const result = await craftCollection.insertOne(craftItems);

            res.send(result)

        })


        // Update Arts & Craft Item Data
        app.put('/allCraftItems/:id', async(req, res) => {
            const id = req.params.id;
            const artsCraft = req.body;
   


            const query = { _id: new ObjectId(id)}
            const option = { upsert: true};

            const updateArtsCraftItem = {
                $set: {
                    itemeName: artsCraft.itemeName,
                    subCategory: artsCraft.subCategory,
                    price: artsCraft.price,
                    rating: artsCraft.rating,
                    customization: artsCraft.customization,
                    processingTime: artsCraft.processingTime,
                    stockStatus: artsCraft.stockStatus,
                    imageUrl: artsCraft.imageUrl,
                    shortDescription: artsCraft.shortDescription,
                }
            }

            const result = await craftCollection.updateOne(query, updateArtsCraftItem, option)
            res.send(result)
            
        })


        // delete craft item data
        app.delete('/allCraftItems/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await craftCollection.deleteOne(query);
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
    res.send(`SakuArtisans Server Running`)
})

app.listen(port, () => {
    console.log(`SakuArtisans Server Running at Port No : ${port}`)
})