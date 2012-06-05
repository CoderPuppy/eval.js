var esprima  = require('esprima'),
	nodes    = require('./nodes'),
	Property = require('./property')

var Execution = module.exports = (function() {
	function Execution(scope) {
		this.stack = []
		this.scope = scope
		this.data = {}
	}
	
	return (function() {
		;(function() {
			this.eval = function eval(code, data) {
				var self = this,
					rtn
				
				if(typeof(code) === 'string') code = esprima.parse(code)
				
				if(data) {
					data.__proto__ = this.data
					this.data = data
				}
				
				this.stack.push(code)
				
				if(typeof(code.length) === 'number') {
					rtn = [];
					
					[].slice.call(code, 0).forEach(function(n) {
						rtn.push(self.eval(n))
					})
					
					return rtn
				} else if(typeof(nodes[code.type]) === 'function') rtn = Property.create(nodes[code.type](code, this, this.data)).resolve()
				else console.warn('Unknown Node: %s:', code.type, code)
				
				if(data) {
					this.data = data.__proto__
				}
				
				return rtn
			}
		}).call(this.prototype)
		
		return this
	}).call(Execution)
})()
