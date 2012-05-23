var inherits = module.exports = function inherits(to, from) {
	Object.getOwnPropertyNames(from.prototype).forEach(function(name) {
		Object.defineProperty(to.prototype, name, Object.getOwnPropertyDescriptor(from.prototype, name))
	});
	
	Object.defineProperty(to.prototype, 'constructor', {
		value: to
	});
};
