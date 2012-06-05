var values   = require('./values'),
	Property = require('./property')

var nodes = module.exports = {
	Program: function(node, exec) {
		return exec.eval(node.body)
	},
	Identifier: function(node, exec) {
		return exec.scope.get(node.name)
	},
	Property: function(node, exec, data) {
		return data.object.set(node.key.name, exec.eval(node.value))
	},
	Literal: function(node, exec) {
		return new Property('<literal>', node.value)
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
	AssignmentExpression: function(node, exec) {
		debugger
		var left = exec.eval(node.left),
			right = exec.eval(node.right),
			operator = node.operator,
			newVal
		
		console.log(node)
		
		switch(operator) {
			case '=':
				newVal = right
				break
		}
		
		return exec.scope.set(node.left.name, newVal)
	},
	MemberExpression: function(node, exec) {
		var object = exec.eval(node.object).value.resolve()
		
		return object.get(node.property.name)
	},
	ObjectExpression: function(node, exec) {
		var obj = new values.Object
		
		node.properties.forEach(function(prop) {
			exec.eval(prop, { object: obj })
		})
		
		return new Property('<expression:object>', obj)
	},
	
	// Statements
	ExpressionStatement: function(node, exec) {
		return exec.eval(node.expression)
	}
}
