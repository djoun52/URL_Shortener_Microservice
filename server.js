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
  let regex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (regex.test(inputUrl) == false) {
    res.json({ error: 'invalid url'})
  }else{
    url.findOne({})
      .sort({short: -1})
      .exec( (err, data)=>{
        if (!err && data != null){
          inputShort = data.short + 1 ;
        }
        if(!err){
          url.findOne({original: inputUrl}, (err , urlPost) =>{
              if (err) {
                return console.error(err);
              }else{
                // console.log(urlPost)
                if (urlPost == undefined){
                  let newUrl = new url({original: inputUrl, short: inputShort})
                  newUrl.save((err, data)=>{
                    if(!err){
                      res.json({original_url : data.original, short_url : data.short} )
                    }
                  })
                }else{
                  responceObject["short_url"] = urlPost.short;
                  res.json(responceObject);
                }

              }
            }
          )
        }
    })
  }
})


app.get('/api/shorturl/:urlShortNumb', (req, res)=>{
  let urlShortNumb = req.params.urlShortNumb
  url.findOne({short: urlShortNumb }, (err, data)=>{
    if (err) return console.log(err);
    if (data == null){
      res.json({error: 'url doesn\'t exist'})
    }else{
      res.redirect(data.original)
    }
    
  })

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
