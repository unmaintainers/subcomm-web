var ISubcommUI = function() {

};

ISubcommUI._interfaces = {};
ISubcommUI._currentName = null;

ISubcommUI.add = function(name, obj) {
	ISubcommUI._interfaces[name] = obj;
};

ISubcommUI.get = function(name) {
	if (typeof(name) === 'undefined') { // current
		return ISubcommUI._interfaces[ISubcommUI._currentName];
	} else { // mutator
		return ISubcommUI._interfaces[ISubcommUI._currentName];
	}
};

ISubcommUI.setCurrent = function(name) {
	ISubcommUI._currentName = name;
};

ISubcommUI.prototype.getName = function() {
	return this.prototype.constructor.NAME;
};

/**
 * Connects to the specified server. Returns a client id by which the client may be referenced.
 * @param string containerId
 * @param string hostname
 * @param int port
 * @param string username
 * @param string password
 * @return string The URI of the client connection. Used as an id.
 * @abstract
 */
ISubcommUI.prototype.connect = function(containerId, hostname, port, username, password) { };

/**
 * Disconnects the specified client URI.
 * @param clientUri
 * @abstract
 */
ISubcommUI.prototype.disconnect = function(clientUri) { };

/**
 * Retrieves the next message received for the specified client.
 * @param string clientUri
 * @abstract
 * @returns string|null message
 */
ISubcommUI.prototype.nextReceivedMessage = function(clientUri) {};

/**
 * Sends a raw message via the specified client.
 * @param string clientUri
 * @param string message
 * @abstract
 */
ISubcommUI.prototype.send = function(clientUri, message) {};

/**
 * Sends a public chat message via the specified client.
 * @param string clientUri
 * @param string message
 * @abstract
 */
ISubcommUI.prototype.chatPublic = function(clientUri, message) {};
