require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    original : {type : String, required: true}, 
    short : {type : Number}  
})

let url = mongoose.model("url", urlSchema);


exports.UrlModel = url