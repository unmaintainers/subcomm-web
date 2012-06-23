var SubcommUIContainer = function(containerId) {
	this.id = containerId;
	this.session = null;
	this.applet = document.applets[0];
	this._nextSessionId = 1; 
}

SubcommUIContainer._registrations = {};

SubcommUIContainer.register = function(containerId) {
	SubcommUIContainer._registrations[containerId] = new SubcommUIContainer(containerId);
}

SubcommUIContainer.get = function(containerId) {
	if (SubcommUIContainer._registrations[containerId] === undefined)
		SubcommUIContainer.register(containerId);
	
	return SubcommUIContainer._registrations[containerId];
}

SubcommUIContainer.prototype.nextSessionId = function() {
	return this._nextSessionId++;
}

SubcommUIContainer.prototype.getJavaClient = function() {
	return ( this.session != null ? this.session.getJavaClient() : null );
}
