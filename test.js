var js = require('./index')

var result

console.log('Result:', result = js.eval( "hi = { name: {first: 'drew'} }\n" +
								"hi.name.last = 'young'\n" +
								"hi.name").value.values)
console.log('ObjectStore:', require('./objectStore').objects)
