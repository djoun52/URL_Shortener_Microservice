require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response } = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use("/public", express.static(__dirname + "/public"));
app.use("/controller", express.static(__dirname + '/controller'))
app.use("/model", express.static(__dirname + '/model'))
// app.use(bodyParser.urlencoded({ extended: true}));
// app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

const url = require("./model/url.js").UrlModel

app.use(cors());

// app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


let responceObject = {}
app.post("/api/shorturl", bodyParser.urlencoded({extended: false}) , (req, res)=>{
  let inputUrl = req.body['url']
  responceObject['original_url'] = inputUrl
  let inputShort = 1

  url.findOne({})
      .sort({sort: 'desc'})
      .exec( (err, data)=>{
        if (!err && data != undefined){
          inputShort = data.short +1 
        }
        if(!err){
          url.findOneAndUpdate(
            {original: inputUrl},
            {original: inputUrl, short: inputShort},
            {new: true, upsert: true}, (err , saveUrl) =>{
              if (err) {
                return console.error(err);
              }else{
                responceObject["short_url"] = saveUrl.short;
                res.json(responceObject);
              }
            }
          )
        }
      })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
