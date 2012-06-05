var values = require('./values')

var Property = module.exports = (function() {
	function Property(name, value) {
		this.name = name
		
		this.load(value)
	}
	
	return (function() {
		(function() {
			this.load = function load(val) {
				var newVal;
				
				if(val instanceof values.Value) newVal = val.duplicate()
				else switch(typeof(val)) {
					
				}
				
				this.value = newVal
				
				return this
			}
		}).call(this.prototype)
		
		return this
	}).call(Property)
})()
