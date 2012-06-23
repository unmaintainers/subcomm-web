if (gSubcommConfig === undefined)
	var gSubcommConfig = {};

function SubcommUI() {
	this.servers = this.getConfig('servers');
};

/**
 * Example config:
 * 
 *  var gSubcommConfig = {
 *      servers: [
 *      	{   name: 'SSUSCK HyperBola Stair Wears',
 *              containerId: 'subcommContainerIndex',
 *    			hostname: '127.0.0.1',
 *    			port: 5005
 *    		}
 *      ]
 *  }
 */
SubcommUI.DEFAULT_CONFIG = {
	servers: {
		_schema: {
			containerId: null,
			name: null,
			hostname: null,
			port: null
		}
	}
};

SubcommUI.get = function() {
	if (SubcommUI._singleton === undefined)
		SubcommUI._singleton = new SubcommUI();
	
	return SubcommUI._singleton;
},	

SubcommUI.getConfigFor = function(key, config, defaultConfig) {
	var defaultConfig = SubcommUI.DEFAULT_CONFIG[key];
	if (defaultConfig === undefined) {
		throw new 'Subcomm config key `' + key + '` is not supported.';
	}
	
	var results = [];
	if (config[key] === undefined) {
		return results;
	}
	
	var schema = defaultConfig._schema;
	var configObjects = config[key];
	for (var i = 0, n = configObjects.length; i < n; ++i) {
		var configObject = configObjects[i];
		var result = {};
		for (var field in schema) {
			result[field] = ( configObject[field] !== undefined ? configObject[field] : defaultConfig[field] );
		}
		
		results.push(result);
	}
	
	return results;
};
		
SubcommUI.prototype.getConfig = function(key) {
	return SubcommUI.getConfigFor(key, gSubcommConfig, SubcommUI.DEFAULT_CONFIG);
}

SubcommUI.prototype.start = function() {
	setTimeout(SubcommUIMessageTimer.run, 350);
}