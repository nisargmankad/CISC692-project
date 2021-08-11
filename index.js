const health = require('@cloudnative/health-connect');
const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
let healthcheck = new health.HealthChecker();

const app = express();
app.use('/live', health.LivenessEndpoint(healthcheck))
app.use('/ready', health.ReadinessEndpoint(healthcheck))
app.use('/health', health.HealthEndpoint(healthcheck))
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

const uri='mongodb+srv://nisargmankad:temp@cluster0.y2xac.mongodb.net/Cluster0?retryWrites=true&w=majority';
//const uri=encodeURI(urit);
console.log(uri)
// const client = new MongoClient(uri);
// try{
//   client.connect();
//   console.w}

//Connect to MongoDB
mongoose
  .connect(
    uri,//'mongodb+srv://nisargmankad:temp@cluster0.y2xac.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Item');

app.get('/', (req, res) => {
  Item.find()
    .then(items => res.render('index', { items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.redirect('/'));
});

const port = 3000;

app.listen(port, () => console.log('Server running...'));
