var inherits = require('./inherits');
var events = require('events');

var Scope = module.exports = (function ScopeClass() {
	function Scope(parent) {
		this.vars = {};
		this.parent = parent;
	}
	inherits(Scope, events.EventEmitter);
	
	Scope.prototype.get = function get(name) {
		var id = this.vars[name];
		
		if(!(name in this.vars)) {
			if(this.parent) {
				id = this.parent.get(name);
			} else {
				throw new Error('Undefined Variable: ' + name, name);
			}
		}
		
		return id;
	};
	
	Scope.prototype.set = function set(name, id) {
		this.vars[name] = id;
	};
	
	Scope.prototype.top = function top() {
		var scope = this;
		
		while(scope.parent) scope = scope.parent;
		
		return scope;
	};
	
	return Scope;
})();
