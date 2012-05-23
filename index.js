var evalNode = exports.evalNode = function evalNode(node, scope) {
	if(typeof(node.length) === 'number') {
		return evalNodes(node, scope).last;
	} else {
		return (types[node.type] || logger)(node, scope);
	}
}

var evalNodes = exports.evalNodes = function evalNodes(nodes, scope) {
	var vals = [], more = true;
	
	scope.once('stop', function(reason, obj) {
		more = false;
		
		if(reason === 'return') {
			scope.emit('break');
			vals = [obj];
		}
	});
	
	nodes.forEach(function(node) {
		if(more) {
			vals.push(evalNode(node, scope));
		}
		
		return more;
	});
	
	return vals;
}

var esprima = require('esprima');
var Scope = require('./scope');
var FunctionScope = require('./functionScope');
var FunctionType = require('./functionType');

var __uuid = exports.__uuid = 0;

process.on('uncaughtException', function(e) {
	console.error('%s %s', e.stack);
	
	console.error(vals(globalScope.vars));
});

var objects = exports.objects = {};
var uuid = exports.uuid = function() { return __uuid++; };
var addObject = exports.addObject = function addObject(val) {
	var id = uuid();
	
	objects[id] = val;
	
	return id;
};

Object.defineProperties(Array.prototype, {
	last: {
		get: function() {
			return this[this.length - 1];
		}
	}
});

var code =  "function test(foo) {\n" +
			"\tswitch(foo) {\n" +
			"\t\tcase 'hi':\n" +
			"\t\tcase 'hello':\n" +
			"\t\t\treturn 'sayHello';\n" +
			"\t\tcase 'bar':\n" +
			"\t\t\tbar();\n" +
			"\t\t\tbreak;\n" +
			"\t}\n" +
			"}\n" +
			"test('hi');";

var ast = esprima.parse(code);

var globalScope = new Scope();

var types = {
	Literal: function(node, scope) {
		return node.value;
	},
	Identifier: function(node, scope) {
		return objects[scope.get(node.name)];
	},
	VariableDeclaration: function(node, scope) {
		var declarations = node.declarations;
		
		declarations.forEach(function(decl) {
			scope.set(decl.id.name, addObject(evalNode(decl.init, scope)));
		});
	},
	FunctionDeclaration: function(node, scope) {
		scope.set(node.id.name, addObject(types.FunctionExpression(node, scope)));
	},
	BlockStatement: function(node, scope) {
		return evalNodes(node.body, scope).last;
	},
	ExpressionStatement: function(node, scope) {
		return evalNode(node.expression, scope);
	},
	ReturnStatement: function(node, scope) {
		if(scope instanceof FunctionScope) {
			var rtn = evalNode(node.argument, scope);
			scope.stop('return', rtn);
			return rtn;
		} else {
			throw new Error('Return not in function');
		}
	},
	EmptyStatement: function(node, scope) {},
	IfStatement: function(node, scope) {
		var test = evalNode(node.test, scope);
		
		if(test) {
			return evalNode(node.consequent, scope);
		} else if(node.alternate) {
			return evalNode(node.alternate, scope);
		}
	},
	WhileStatement: function(node, scope) {
		var test = node.test,
			body = node.body,
			broken = false,
			res, handler;
		
		scope.on('break', handler = function(label) {
			if(!label) {
				broken = true;
			}
		});
		
		while(evalNode(test, scope) && !broken) {
			res = evalNode(body, scope);
			
			if(broken) {
				break;
			}
		}
		
		scope.removeListener('break', handler);
		
		return res;
	},
	ForStatement: function(node, scope) {
		var init = node.init,
			test = node.test,
			update = node.update,
			body = node.body,
			broken = false,
			res, handler;
		
		scope.on('break', handler = function(label) {
			if(!label) {
				broken = true;
			}
		});
		
		for(evalNode(init, scope); evalNode(test, scope) && !broken; evalNode(update, scope)) {
			res = evalNode(body, scope);
			
			if(broken) {
				break;
			}
		}
		
		scope.removeListener('break', handler);
		
		return res;
	},
	SwitchStatement: function(node, scope) {
		var discriminant = evalNode(node.discriminant, scope),
			cases = node.cases,
			more = false,
			cur, i, handler, res;
				
		scope.on('break', handler = function(label) {
			if(!label) {
				more = false;
			}
		});
				
		for(i = 0; i < cases.length; i++) {
			cur = cases[i];
			
			if(more || ( cur.test !== undefined && cur.test !== null ? evalNode(cur.test, scope) === discriminant : true )) {
				more = true;
				
				res = evalNodes(cur.consequent, scope);
			}
		}
		
		scope.removeListener('break', handler);
		
		return res;
	},
	BreakStatement: function(node, scope) {
		scope.emit('stop', 'break', node.label);
		scope.emit('break', node.label);
	},
	ContinueStatment: function(node, scope) {
		scope.emit('stop', 'continue', node.label);
		scope.emit('continue', node.label);
	},
	AssignmentExpression: function(node, scope) {
		var name = node.left.name,
			id = scope.get(name),
			val = objects[id],
			operator = node.operator,
			right = evalNode(node.right);
		
		switch(operator) {
			case '-=':
				val -= right;
				break;
			default:
				console.warn('Unrecognized operator: %s', operator);
		}
		
		return objects[id] = val;
	},
	ConditionalExpression: function(node, scope) {
		var test = evalNode(node.test, scope);
		
		if(test) {
			return evalNode(node.consequent, scope);
		} else if(node.alternate) {
			return evalNode(node.alternate, scope);
		}
	},
	UpdateExpression: function(node, scope) {
		var name = node.argument.name,
			id = scope.get(name),
			val = objects[id],
			operator = node.operator;
		
		switch(operator) {
			case '++':
				val++;
				break;
			case '--':
				val--;
				break;
			default:
				console.warn('Unrecognized operator: %s', operator);
		}
		
		return objects[id] = val;
	},
	UnaryExpression: function(node, scope) {
		var value = evalNode(node.argument),
			operator = node.operator;
		
		switch(operator) {
			case '!':
				return !value;
			default:
				console.warn('Unrecognized operator: %s', operator);
		}
	},
	FunctionExpression: function(node, scope) {
		return new FunctionType(node);
	},
	BinaryExpression: function(node, scope) {
		var left = evalNode(node.left, scope),
			right = evalNode(node.right),
			operator = node.operator;
		
		switch(operator) {
			case '+':
				return left + right;
			case '<':
				return left < right;
			case '>':
				return left > right;
			case '===':
				return left === right;
			default:
				console.warn('Unrecognized operator: %s', operator);
		}
	},
	CallExpression: function(node, scope) {
		var value, rtn;
		
		value = evalNode(node.callee, scope);
		
		switch(true) {
			case typeof(value) === 'function':
				rtn = value(node, scope);
				break;
			case typeof(value) !== 'undefined' && typeof(value.call) === 'function':
				rtn = value.call(node, scope);
				break;
			default:
				rtn = value;
				break;
		}
		
		return rtn
	}
};

function vals(ids) {
	var vars = {};
	
	for(key in ids) {
		vars[key] = objects[ids[key]];
	}
	
	return vars;
}

console.log('result:', evalNodes(ast.body, globalScope), 'global:', vals(globalScope.vars));

function logger(node, scope) {
	console.log('%s:', node.type, node);
	
	return node.type;
}
