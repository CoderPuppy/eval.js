var fs = require('fs')

function propertyName(name) {
	return name[0].toUpperCase() + name.substr(1)
}

var Value = exports.Value = (function() {
	function Value(val) {
		this.value = val
	}
	
	return (function() {
		(function() {
			this.duplicate = function duplicate() {
				return Object.create(this.constructor.prototype, {
					value: {
						value: this.value,
						enumerable: true,
						writable: true,
						configurable: true
					}
				})
			}
		}).call(this.prototype)
		
		return this
	}).call(Value)
})()

fs.readdirSync(__dirname).forEach(function(name) {
	if(name === 'index.js') return
	
	Object.defineProperty(exports, propertyName(name.replace(/\.js$/, '')), {
		get: function() {
			return require(__dirname + '/' + name)
		}
	})
})
