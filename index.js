const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('json', function(req, res){ return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person) : res.status(404).end(
    '404: These are not the droids you are looking for')
})

app.get('/info', (req, res) => {
  res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
    <p>${Date().toString()}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log(body)
  if (!body.number) {
    return res.status(400).end('error: number is missing')
  } else if (!body.name) {
    return res.status(400).end('error: name is missing')
  } else if (persons.find(x => x.name === body.name)) {
      return res.status(400).end('error: name must be unique')
  }

  const person = {
    id: Math.round(Math.random() * 10**7),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
