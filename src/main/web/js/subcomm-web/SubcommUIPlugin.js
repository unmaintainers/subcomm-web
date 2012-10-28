var SubcommUIPlugin = function(token, containerIds) {
	this.token = token;
	this.containerIds = containerIds;
};

SubcommUIPlugin._instances = {};

SubcommUIPlugin.get = function(pluginToken) {
	if (!SubcommUIPlugin._instances[pluginToken])
		throw new SubcommUIException('Plugin does not exist: ' + pluginToken);

	return SubcommUIPlugin._instances[pluginToken];
};

SubcommUIPlugin.add = function(plugin) {
	SubcommUIPlugin._instances[plugin.token] = plugin;
};

