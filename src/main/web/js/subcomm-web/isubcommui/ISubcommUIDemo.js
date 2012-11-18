/**
 * An interface implementation of ISubcommUI that replays demo files.
 * @extends ISubcommUIDemo
 */
var ISubcommUIDemo = function() {
	this._demoData = null;
	this._demoDataRequested = false;
	this._index = 0;
	this._nextMessageTime = 0;
};

ISubcommUIDemo.prototype = new ISubcommUI();
ISubcommUIDemo.prototype.constructor = ISubcommUIDemo;
ISubcommUIDemo.NAME = 'demo';
ISubcommUIDemo.MESSAGE_INTERVAL_MS = 1000; // 1 sec

/**
 * Loads the demo data.
 */
ISubcommUIDemo.prototype._loadDemoData = function() {
	if (this._demoDataRequested) {
		return;
	}
	
	this._demoDataRequested = true;
	var self = this;
    var set = new SubcommUIResourceSet();
    set.addHtml('demo/subcomm/subcomm-demo-01.txt', function(data) { //TODO: get from ui or config
    	self._demoData = data.split('\n');
    });
    SubcommUIResourceLoader.get().loadResources(set);
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
ISubcommUIDemo.prototype.connect = function(containerId, hostname, port, username, password) {
	this._loadDemoData();
	var container = SubcommUIContainer.get(containerId);
};

/**
 * Disconnects the specified client URI.
 * @param clientUri
 * @override
 */
ISubcommUIDemo.prototype.disconnect = function(clientUri) {
	this._demoData = null;
	this._demoDataRequested = false; // reset until next connect
	this._nextMessageTime = 0;
	this._index = 0;
};

/**
 * Retrieves the next message received for the specified client.
 * @param string clientUri
 * @override
 * @returns string|null message
 */
ISubcommUIDemo.prototype.nextReceivedMessage = function(clientUri) {
	if (!this._demoData) {
		if (!this._demoDataRequested) {
			throw new SubcommUIException("Not connected.");
		}
		
		return null;
	}
	
	if (this._index >= this._demoData.length) {
		this.disconnect(clientUri);
		return null;
	}
	
	var now = new Date().getTime();
	if (now < this._nextMessageTime) {
		return null;
	}

	var message = this._demoData[this._index++];
	if (message.startsWith('#')) { // ignore comment lines
		message = this._demoData[this._index++];
	}
	if (!message.match(/^(INARENA:|PLAYER:|SHIPFREQCHANGE:)/)) { // fast forward through meta
		this._nextMessageTime = now + ISubcommUIDemo.MESSAGE_INTERVAL_MS;
	}

	return message;
};

/**
 * Sends a raw message via the specified client.
 * @param string clientUri
 * @param string message
 * @override
 */
ISubcommUIDemo.prototype.send = function(clientUri, message) {
	if (!this._demoData) {
		throw new SubcommUIException("Not connected.");
	}
	
	this._demoData.splice(this._index, 0, message);
};

/**
 * Sends a public chat message via the specified client.
 * @param string clientUri
 * @param string message
 * @override
 */
ISubcommUIDemo.prototype.chatPublic = function(clientUri, message) {
	if (!this._demoData) {
		throw new SubcommUIException("Not connected.");
	}
	
	this._demoData.splice(this._index, 0, message);
};
