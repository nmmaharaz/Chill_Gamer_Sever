const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh6jx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const reviewcollection = client.db("ChillGameDB").collection("review");
    const mywishlistcollection = client
      .db("ChillGameDB")
      .collection("mywishlist");

    app.get("/rating", async (req, res) => {
      const query = reviewcollection.find().sort({ rating: -1 });
      const result = await query.toArray();
      res.send(result);
    });
    app.get("/publishingyear", async (req, res) => {
      const query = reviewcollection.find().sort({ passingyear: -1 });
      const result = await query.toArray();
      res.send(result);
    });
    app.get("/genres/:Ganres", async (req, res) => {
      const Ganres = req.params.Ganres;
      const query = { Ganres };
      const cursor = reviewcollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/review", async (req, res) => {
      const cursor = reviewcollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/highestratedgame", async (req, res) => {
      const query = reviewcollection.find().sort({ rating: -1 }).limit(6);
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/myreview/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = reviewcollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewcollection.findOne(query);
      res.send(result);
    });

    app.post("/review", async (req, res) => {
      const addReview = req.body;
      console.log(addReview);
      const result = await reviewcollection.insertOne(addReview);
      res.send(result);
    });

    app.patch("/review/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(user);
      const query = { _id: new ObjectId(id) };
      const review = {
        $set: {
          gameName: user?.gameName,
          gameTitle: user?.gameTitle,
          description: user?.description,
          rating: user?.rating,
          passingyear: user?.passingyear,
          Ganres: user?.Ganres,
        },
      };
      const result = await reviewcollection.updateOne(query, review);
      res.send(result);
    });

    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewcollection.deleteOne(query);
      res.send(result);
    });

    app.get("/mywishlist/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = mywishlistcollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/mywishlist", async (req, res) => {
      const addReview = req.body;
      console.log(addReview);
      const result = await mywishlistcollection.insertOne(addReview);
      res.send(result);
    });

    app.delete("/mywishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mywishlistcollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hellow Mama Ki Obostha?");
});

app.listen(port, () => {
  console.log(`example app ${port}`);
});
