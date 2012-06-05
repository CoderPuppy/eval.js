var values = require('./index'),
	util = require('util')

var ObjectValue = module.exports = (function() {
	function ObjectValue() {
		this.type = 'object'
		this.name = '<' + this.type + '>'
		this.properties = {}
		this.propertyNames = []
		
		return new values.Reference(this)
	}
	util.inherits(ObjectValue, values.Value)
	
	return (function() {
		(function() {
			this.set = function set(name, val) {
				if(!this.has(name)) this.propertyNames.push(name)
				
				return this.properties[name] = new Property(name, val instanceof Property ? val.value : val)
			}
		}).call(this.prototype)
		
		return this
	}).call(ObjectValue)
})()
