var values = require('./values'),
	Property = require('./property')

var nodes = module.exports = {
	Program: function(node, exec) {
		return exec.eval(node.body)
	},
	Identifier: function(node, exec) {
		return exec.scope.get(node.name)
	},
	
	// Declarations
	VariableDeclaration: function(node, exec) {
		exec.eval(node.declarations)
	},
	VariableDeclarator: function(node, exec) {
		if(node.init) exec.scope.define(node.id.name, exec.eval(node.init))
		else exec.scope.define(node.id.name)
	},
	
	// Expressions
	ObjectExpression: function(node, exec) {
		var obj = new values.Object
		
		node.properties.forEach(function(prop) {
			console.log('Property:', prop)
		})
		
		return new Property('<expression:object>', obj)
	},
	
	// Statements
	ExpressionStatement: function(node, exec) {
		return exec.eval(node.expression)
	}
}
