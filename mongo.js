const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://fullstack:${password}@ds223605.mlab.com:23605/fullstack2019-phone-book`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length===3 ) {
  Person.find({}).then(result => {
    console.log('puhelinluettelo:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

person.save().then(result => {
  console.log(`lisätään ${result.name} numero ${result.number} luetteloon`)
  mongoose.connection.close()
})
