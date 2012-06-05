var values   = require('./index'),
	util     = require('util'),
	Property = require('../property')

var ObjectValue = module.exports = (function() {
	function ObjectValue() {
		this.type = 'object'
		this.name = '<' + this.type + '>'
		this.properties = {}
		this.propertyNames = []
	}
	util.inherits(ObjectValue, values.Value)
	
	return (function() {
		var constructor = this
		
		this.reference = true
		
		;(function() {
			this.set = function set(name, val) {
				if(!this.has(name)) this.propertyNames.push(name)
				
				return this.properties[name] = new Property(name, val instanceof Property ? val.value : val)
			}
			
			this.get = function get(name) {
				return this.properties[name]
			}
			
			this.has = function has(name) { return ~this.propertyNames.indexOf(name) }
			
			this.duplicate = function duplicate() {
				return Object.create(constructor, {
					properties: {
						value: this.properties,
						enumerable: true,
						configurable: true,
						writable: true
					},
					propertyNames: {
						value: this.propertyNames,
						enumberable: true,
						configurable: true,
						writable: true
					}
				})
			}
		}).call(this.prototype)
		
		return this
	}).call(ObjectValue)
})()
