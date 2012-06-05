var objects = require('../objectStore'),
	values  = require('./index'),
	util    = require('util')

var ReferenceValue = module.exports = (function() {
	function ReferenceValue(val) {
		this.id = objects.addObject(val)
	}
	util.inherits(ReferenceValue, values.Value)
	
	return (function() {
		;(function() {
			this.duplicate = function duplicate() {
				return Object.create(ReferenceValue.prototype, {
					id: {
						value: this.id,
						enumerable: true,
						configurable: true,
						writable: true
					}
				})
			}
			
			this.resolve = function resolve() { return objects.objects[this.id] }
		}).call(this.prototype)
		
		return this
	}).call(ReferenceValue)
})()
