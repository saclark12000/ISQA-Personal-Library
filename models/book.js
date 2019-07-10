'use strict';

var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

var bookSchema = new mongoose.Schema({
  _id : { type : mongoose.Schema.Types.ObjectId, default : ObjectId },
  title : { type : String, required: true },
  comments : [ { type: String } ],
  commentcount: { type: Number, default: 0 }
  });

module.exports = mongoose.model("Book", bookSchema);