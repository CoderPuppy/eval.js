var objects = require('./objectStore'),
	Scope = require('./scope'),
	Execution = require('./execution')

var js = module.exports = {
	eval: function eval(code, scope) {
		if(!(scope instanceof Scope)) scope = Scope.load(scope)
		
		return new Execution(scope).eval(code)
	}
}
