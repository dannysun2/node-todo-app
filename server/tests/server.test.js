const expect = require('chai').expect
const request = require('supertest');
const { app } = require('../server');
const { Todo } = require('../models/todos');
const {ObjectID} = require('mongodb');

const todos = [{
  _id: new ObjectID(),
  text: 'First Test'
}, {
  _id: new ObjectID(),
  text: 'Second Test'
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
})

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = "Shop for Groceries"

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).to.equal(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).to.equal(1)
          expect(todos[0].text).to.equal(text);
          done();
        }).catch((e) => done(e));
      })
  })


  it('should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).to.equal(2)
          done();
        }).catch((e) => done(e))
      })

  })
})

describe('GET /todos', () => {

  it('should bring back list of todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).to.equal(2)
      })
      .end(done);
  })
})

describe('GET /todos/:id', () => {

  it('should query one record', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).to.equal(todos[0].text)
      })
      .end(done);
  })

  it('should return a 404 if todo not found', (done) => {
    var hexID = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexID}`)
      .expect(404)
      .end(done)
  })

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  })

})
