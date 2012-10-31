if (gSubcommConfig === undefined)
	var gSubcommConfig = {};

$(document).ajaxError(function(e, xhr, settings, exception) {
    console.log('error in: ' + settings.url + ', exception: ' + exception);
});

function SubcommUI() {
	this.servers = this.getConfig('servers');
	this.plugins = this.getConfig('plugins');
};

/**
 * Example config:
 * 
 *  var gSubcommConfig = {
 *      servers: [
 *      	{   name: 'SSSS SubSpace Zone',
 *              containerId: 'subcommContainerIndex',
 *    			hostname: '127.0.0.1',
 *    			port: 5005
 *    		}
 *      ],
 *      plugins: [
 *      	{	token: 'subcomm-shopkeep',
 *      		containerIds: [ 'subcommContainerIndex' ]
 *      	}
 *      ]
 *  }
 */
SubcommUI.DEFAULT_CONFIG = {
	servers: {
		_schema: {
			containerId: null,
			name: null,
			hostname: null,
			port: null,
			tags: [],
		}
	},
	plugins: {
		_schema: {
			token: null,
			containerIds: [],
			tags: [],
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
};

SubcommUI.prototype.start = function() {	
	setTimeout(SubcommUIMessageTimer.run, SubcommUIMessageTimer.RUN_INTERVAL_MS);
	
	ISubcommUI.add(ISubcommUIApplet.NAME, new ISubcommUIApplet());
	ISubcommUI.add(ISubcommUIDemo.NAME, new ISubcommUIDemo());
	ISubcommUI.setCurrent(ISubcommUIApplet.NAME);
	
	// load plugins
	for (var i = 0; i < this.plugins.length; ++i) {
		var pluginConfig = this.plugins[i];
		var plugin = new SubcommUIPlugin(pluginConfig.token, pluginConfig.containerIds);
		SubcommUIPlugin.add(plugin);
		var resources = new SubcommUIResourceSet()
		.addJs(SubcommUIUtility.Url.baseUrl + '/plugin/' + pluginConfig.token + '/' + pluginConfig.token + '.js');
		SubcommUIResourceLoader.get().loadResources(resources);
	}
};


