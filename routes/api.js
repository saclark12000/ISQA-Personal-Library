/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

var Book = require('../models/book.js');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, foundBooks) => {
        var returnArray = []
        if(err){
          res.send(err);
          return err.name
        } else {
          foundBooks.forEach(book => {
            returnArray.push( {
              title : book.title,
              _id : book._id,
              commentcount : book.commentcount
            });            
          })
          res.json(returnArray)
          return returnArray
        }
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      var newBook = req.body;
    
      Book.create(newBook, (err, createdBook)=>{
        if(err){
          res.send(err.message)
          return err.message
        } else {
          res.json(createdBook)
          return createdBook
        }
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      
      Book.deleteMany({}, (err, deletedBooks) => {
        if(err){
          res.send(err)
          return err.name
        } else {
          res.send('All books deleted successfully.');
          return 'All books deleted successfully.'
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, foundBook) => {
        
        if(err){
          res.send(`Id ${bookid} not found due to error: ${err.name}`)
          return `Id ${bookid} not found due to error: ${err.name}`
        } else {
          
          if (foundBook === null) {
            res.send('Id '+ bookid + ' not found.')
            return 'Id '+ bookid + ' not found.'
          } else {
            res.json(foundBook);
            return foundBook
          }
          
        }
        
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findById(bookid, (err, foundBook) => {
        
        if(err){
          res.send(`Id ${bookid} not found due to error: ${err.name}`)
          return `Id ${bookid} not found due to error: ${err.name}`
        } else {
          
          if (foundBook === null) {
            res.send('Id '+ bookid + ' not found.')
            return 'Id '+ bookid + ' not found.'
          } else {
            foundBook.comments.push(comment);
            foundBook.commentcount = foundBook.comments.length;
            foundBook.save();
            res.send(foundBook);
            return foundBook
          }
          
        }
        
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
    
      Book.findByIdAndDelete(bookid, (err, deletedBook) => {
        if(err){
          res.send(`Id ${bookid} not deleted due to error: ${err.name}`)
          return `Id ${bookid} not deleted due to error: ${err.name}`
        } else {
          
          if (deletedBook === null) {
            res.send('Id '+ bookid + ' not found.')
            return 'Id '+ bookid + ' not found.'
          } else {
            res.send(bookid + ' has been deleted.')
            return bookid + ' has been deleted.'
          }
        }
      })
    });
  
};
