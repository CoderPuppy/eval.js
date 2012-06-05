var UUID = (function() {
	function UUID() {
		var self = function uuid() {
			return self.context('default')()
		}
		
		self.release = function release() {
			return self.context('default').release()
		}
		
		self.contexts = {}
		self.Context = Context
		self.context = function context(name) {
			if(typeof(this.contexts[name]) === 'function') return this.contexts[name]
			else return this.contexts[name] = new self.Context()
		}
		
		self.local = function local() {
			return new UUID()
		}
		
		return self
	}
	
	return UUID
})()

var Context = (function() {
	function Context() {
		var self = function uuid() {
			return self.id++
		}
		
		self.id = 0
		
		self.release = function release() {
			self.id--
			
			return self
		}
		
		return self
	}
	
	return Context
})()

module.exports = new UUID()
