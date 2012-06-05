var esprima = require('esprima'),
	nodes = require('./nodes')

var Execution = module.exports = (function() {
	function Execution(scope) {
		this.stack = []
		this.scope = scope
	}
	
	return (function() {
		(function() {
			this.eval = function eval(code) {
				var self = this
				
				if(typeof(code) === 'string') code = esprima.parse(code)
				
				this.stack.push(code)
				
				if(typeof(code.length) === 'number') {
					var rtn = [];
					
					[].slice.call(code, 0).forEach(function(n) {
						rtn.push(self.eval(n))
					})
					
					return rtn
				} else if(typeof(nodes[code.type]) === 'function') return nodes[code.type](code, this)
				else console.warn('Unknown Node: %s:', code.type, code)
			}
		}).call(this.prototype)
		
		return this
	}).call(Execution)
})()
