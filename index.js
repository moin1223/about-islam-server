const express = require('express')
const app = express()
const cors =require('cors');
const bobyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bobyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bghwt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const blogCollection = client.db(`${process.env.DB_NAME}`).collection("blogs");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admins");


  app.get('/blogs',(req,res)=>{
    blogCollection.find()
      .toArray((err,items)=>{
          res.send(items)
        
      })

  })

  app.post('/addBlog',(req,res)=>{
      
   const newblog = req.body;
   blogCollection.insertOne(newblog)
   .then(result=>{
       res.send(result.insertedCount > 0)
   })

  })
  app.delete('/deleteblog/:id', (req, res) => {
    blogCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
        res.send(result.deletedCount > 0);
       
    })
  
  })

  app.post('/addAdmin',(req,res)=>{

    const newAdmin = req.body
    adminCollection.insertOne(newAdmin)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
 
   })
   app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0);
      })
  })
 
});


app.listen(port, () => {
  console.log(port)
})