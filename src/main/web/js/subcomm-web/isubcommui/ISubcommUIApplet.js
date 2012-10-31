/**
 * An interface implementation of ISubcommUI that interacts with Subcomm Web UI applet.
 * @extends ISubcommUIApplet
 */
var ISubcommUIApplet = function() {
	this._appletLoaded = false;
};

ISubcommUIApplet.prototype = new ISubcommUI();
ISubcommUIApplet.prototype.constructor = ISubcommUIApplet;
ISubcommUIApplet.NAME = 'applet';

ISubcommUIApplet.prototype._getJavaClient = function(clientUri) {
	var containerId = clientUri.match(/\#([\w\-]+)$/)[1];
	var container = SubcommUIContainer.get(containerId);
	if (!container || !container.session) {
		return null;
	}

	var applet = container.applet;
	if (!applet) { // not connected yet
	    return null;
	}
	
	var client = applet.getClient(clientUri);
	if (!client)
		return null;
	
	return client;
};

/**
 * Loads the applet.
 */
ISubcommUIApplet.prototype._loadApplet = function() {
	if (this._appletLoaded) {
		return;
	}
    
    this._appletLoaded = true;
};

/**
 * Connects to the specified server. Returns a client id by which the client may be referenced.
 * @param string containerId
 * @param string hostname
 * @param int port
 * @param string username
 * @param string password
 * @returns string The URI of the client connection. Used as an id.
 * @override
 */
ISubcommUIApplet.prototype.connect = function(containerId, hostname, port, username, password) {
	ISubcommUIApplet.prototype._loadApplet();
	var container = SubcommUIContainer.get(containerId);
	return container.applet.connect(containerId, hostname, port, username, password);
};

/**
 * Disconnects the specified client URI.
 * @param clientUri
 * @override
 */
ISubcommUIApplet.prototype.disconnect = function(clientUri) {
	ISubcommUIApplet.prototype._loadApplet();
	var container = SubcommUIContainer.get(containerId);
	container.applet.disconnect(clientUri);
};

/**
 * Retrieves the next message received for the specified client.
 * @param string clientUri
 * @override
 * @returns string|null message
 */
ISubcommUIApplet.prototype.nextReceivedMessage = function(clientUri) {
	ISubcommUIApplet.prototype._loadApplet();
	var client = this._getJavaClient(clientUri);
	if (!client) {
		return null;
	}
	
	return client.nextReceivedMessage();
};

/**
 * Sends a raw message via the specified client.
 * @param string clientUri
 * @param string message
 * @override
 */
ISubcommUIApplet.prototype.send = function(clientUri, message) {
	ISubcommUIApplet.prototype._loadApplet();
	this._getJavaClient(clientUri).send(message);
};

/**
 * Sends a public chat message via the specified client.
 * @param string clientUri
 * @param string message
 * @override
 */
ISubcommUIApplet.prototype.chatPublic = function(clientUri, message) {
	ISubcommUIApplet.prototype._loadApplet();
	this._getJavaClient(clientUri).chatPublic(message);
};
