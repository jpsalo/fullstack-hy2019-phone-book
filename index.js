const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

// app.use(morgan('POST body length in bytes :res[content-length] :message'))

app.use(bodyParser.json())

// morgan.token('type', function (req, res) { return req.headers['content-type']  })

// morgan.token('json', (req, res) => {
// 	console.log(req.headers['content-type'])
// 	return req.headers['content-type']
// })

morgan.token('message', function (req, res) { 
	return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :message'))


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

// app.use(requestLogger)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '123-45678',
  },
  {
    id: 2,
    name: 'Arto Järvinen',
    number: '201987423',
  },
  {
    id: 3,
    name: 'Lea Kutvonen',
    number: '25980347695084375',
  },
  {
    id: 4,
    name: 'Pel Herman',
    number: '3490857435',
  },
]

app.get('/', (req, res) => {
  res.send('<h1>Phone World!</h1>')
})

app.get('/info', (req, res) => {
  const info = `Puhelinluettelossa on ${persons.length} henkilön tiedot`
  res.send(`
    <p>${info}</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'person missing',
    })
  }

  const nameLowerCase = body.name.toLowerCase()
  if (persons.find(person => person.name.toLowerCase() === nameLowerCase)) {
    return res.status(409).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: Math.max(...persons.map(person => person.id)) + 1,
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  return res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  const person = persons.find(person => person.id === id)

  if (person) {
    return res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 4200
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
