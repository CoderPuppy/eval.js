var Scope = require('./scope');
var index = require('./index');
var inherits = require('./inherits');

var FunctionScope = module.exports = (function FunctionScopeClass() {
	function FunctionScope(parent, func, args) {
		var self = this;
		
		Scope.call(this, parent);
		
		this.args = args;
		this.func = func;
		
		this.func.args.forEach(function(arg, i) {
			self.args[arg] = index.addObject(self.args[i]);
			self.set(arg, self.args[arg]);
		});
		
		this.arguments = [].concat(this.args);
		
		this.set('arguments', index.addObject(this.arguments));
	}
	inherits(FunctionScope, Scope);
	
	FunctionScope.prototype.stop = function stop(reason, obj) {
		this.emit('stop', reason, obj);
		
		return this;
	};
	
	return FunctionScope;
})();
