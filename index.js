const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = 5000
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://volunteerNetwork:volunteerNetwork@cluster0.gbmds.mongodb.net/volunteerNetwork?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteerNetwork").collection("events");
  
  app.post('/newRegistration', (req, res) => {
    const newEvent = req.body;
    eventCollection.insertOne(newEvent)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/registerdEvents', (req, res) => {
    const queryEmail = req.query.email;
    eventCollection.find({email: queryEmail})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.delete('/deleteEvent', (req, res) => {
    const id = req.query.id;
    console.log(id);
    eventCollection.deleteOne({_id: ObjectId(id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);