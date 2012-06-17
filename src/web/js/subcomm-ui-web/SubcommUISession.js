function SubcommUISession() {
    this.hostname = null;
    this.port = null;
    this.username = null;
    this.password = null;
    this.containerId = null;
    this.uri = null
    this._javaClient = null;
}

SubcommUISession.prototype.getJavaClient = function() {
	if (this._javaClient !== null) {
		return this._javaClient;
	}
	
	var applet = SubcommUIContainer.get(this.containerId).applet;
	if (applet === null) {
		return null;
	}
	
	this._javaClient = applet.getClient(this.containerId);
	return this._javaClient;
}