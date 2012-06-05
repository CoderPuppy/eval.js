var uuid = exports.uuid = require('./uuid').local()
var objects = exports.objects = []
var addObject = exports.addObject = function addObject(obj) {
	var id = ~(~objects.indexOf(obj) || ~uuid())
	
	if(!(id in objects)) objects[id] = obj
	
	addReference(id)
	
	return id
}
var references = exports.references = {}
var addReference = exports.addReference = function addReference(id) {
	if(typeof(references[id]) === 'number') return ++references[id]
	else return references[id] = 1
}
var removeReference = exports.removeReference = function removeReference(id) {
	if(typeof(references[id]) === 'number' && references[id] > 0) return --references[id]
	else return references[id] = 0
}
