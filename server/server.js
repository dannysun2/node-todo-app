require('./config/config')

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
var { mongoose } = require('./db/mongoose')
var { Todo } = require('./models/todos')
var { User } = require('./models/users')
const _ = require('lodash')

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
});

app.get('/todos', (req,res) => {
  Todo.find()
    .then((todos) => res.send({ todos }))
    .catch((e) => res.send(400).send(e))
})

app.get('/todos/:id', (req,res) => {
  Todo.findById(req.params.id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send('Record not found')
      }

      res.send({todo})
  })
  .catch((e) => {
    res.status(404).send(e)
  })
})

app.delete('/todos/:id', (req,res) => {
  Todo.findByIdAndRemove(req.params.id)
    .then((todo) => {
      if (!todo) {
        res.status(400).send('Record Not Found')
      }
      res.send({todo})
    })
    .catch((e) => {
      res.status(400).send(e)
    })
})

app.patch('/todos/:id', (req, res) => {
  var body = _.pick(req.body, ['text', 'completed'])

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(req.params.id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    res.status(200).send({todo})
  }).catch((e) => {
    res.status(404).send(e)
  })

})



app.listen(process.env.PORT, () => {
  console.log('Server is running on port', process.env.PORT)
})

module.exports = { app }
