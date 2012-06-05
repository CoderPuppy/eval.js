var Property = require('./property')

var Scope = module.exports = (function() {
	function Scope(parent) {
		this.parent = parent
		this.vars = {}
		this.names = []
	}
	
	return (function() {
		this.load = function load(obj) { return new Scope().load(obj) };
		
		(function() {
			this.load = function load(obj) { return this }
			
			this.define = function define(name, init) {
				if(this.defined(name)) console.warn('Redefining variable: %s', name)
				else this.names.push(name)
				
				if(arguments.length > 1) this.set(name, init)
				
				return this
			}
			
			this.defined = function defined(name) { return ~this.names.indexOf(name) }
			
			this.set = function set(name, val) {
				val = new Property(name, val instanceof Property ? val.value : val)
				
				if(this.defined(name) || !this.parent) return this.vars[name] = val
				else return this.parent.set(name, val)
			}
			
			this.get = function get(name, need) {
				if(this.defined(name)) return this.vars[name]
				else if(this.parent) return this.parent.get(name, need)
				else if(need) throw new Error('Undefined Variable: ' + name)
			}
		}).call(this.prototype)
		
		return this
	}).call(Scope)
})()
