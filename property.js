var values = require('./values')

var Property = module.exports = (function() {
	function Property(name, value) {
		this.name = name
		
		this.load(value)
	}
	
	return (function() {
		this.create = function create(val) {
			if(val instanceof Property) return val
			else return new Property('<Property#create>', val)
		}
		
		;(function() {
			this.resolve = function resolve() {
				return new Property(this.name, this.value.resolve())
			}
			
			this.load = function load(val) {
				var newVal;
				
				if(val instanceof values.Value) {
					if(val.constructor.reference) newVal = new values.Reference(val)
					else newVal = val.duplicate()
				}
				else switch(typeof(val)) {
					case 'string':
						newVal = new values.String(val)
						break
					case 'object':
						if(val instanceof Array) {
							newVal = new values.Array(val)
						} else {
							newVal = new values.Object()
						
							for(key in val) {
								newVal.set(key, val[key])
							}
						}
						break;
					case 'undefined':
						newVal = new values.Undefined()
						break
				}
				
				this.value = newVal
				
				return this
			}
		}).call(this.prototype)
		
		return this
	}).call(Property)
})()
