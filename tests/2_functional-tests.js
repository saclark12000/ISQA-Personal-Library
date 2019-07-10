/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var Book = require('../models/book.js');
var ObjectId = require('mongodb').ObjectId;

chai.use(chaiHttp);

var testingId = ''

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
     chai.request(server)
      .post('/api/books')
      .send({
         title: "Test post with title"
       })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an array');
        assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body, 'title', 'Books in array should contain title');
        assert.property(res.body, '_id', 'Books in array should contain _id');
        done();
       
       testingId = res.body._id
        // Book.findByIdAndDelete(res.body._id, (err, deletedBook) => {
        // if(err){
        //   res.send(err)
        //   return err
        // }
        // })
      });
        
      })
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Book validation failed: title: Path `title` is required.')
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
      .get('/api/books/5d09362f7fd4de201627c15b')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, "Id 5d09362f7fd4de201627c15b not found.")
        done();
      });
        //done(); 5d09362f7fd4de201627c15b
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + testingId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an array');
          assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          done();
      });
      
    });
    })

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/' + testingId)
        .send({
          comment:'A good comment.'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an array');
          assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          done();
          
          Book.findByIdAndDelete(ObjectId(testingId), (err, deletedBook) => {
          if(err){
            res.send(err)
            return err
          }
          })
      });
    });
    });
  });

});
