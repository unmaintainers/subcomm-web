var SubcommUIException = function(message) {
	this.message = message;
};

SubcommUIException.prototype.toString = function() {
	return this.message;
};