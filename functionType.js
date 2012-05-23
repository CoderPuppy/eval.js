var index = require('./index');
var FunctionScope = require('./functionScope');

var FunctionType = module.exports = (function FunctionTypeClass() {
	function FunctionType(node) {
		this.node = node;
		
		this.args = node.params.map(function(param) {
			return param.name;
		});
	}
	
	FunctionType.prototype.call = function call(node, scope) {
		return index.evalNode(this.node.body, new FunctionScope(scope, this, index.evalNodes(node.arguments, scope)));
	};
	
	return FunctionType;
})();
