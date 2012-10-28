var SubcommUIPluginResourceSet = function(pluginToken) {
	SubcommUIResourceSet.prototype.constructor.call(this);
	this.pluginUrlPrefix = 'plugin/' + pluginToken;
};

SubcommUIPluginResourceSet.prototype = new SubcommUIResourceSet();
SubcommUIPluginResourceSet.prototype.constructor = SubcommUIPluginResourceSet;

SubcommUIPluginResourceSet.prototype.addJs = function(url) {
	url = this.pluginUrlPrefix + '/js/' + url;
	return SubcommUIResourceSet.prototype.addJs.call(this, url);
};

SubcommUIPluginResourceSet.prototype.addHtml = function(url, ajaxCallback) {
	url = this.pluginUrlPrefix + '/html/' + url;
	return SubcommUIResourceSet.prototype.addHtml.call(this, url, ajaxCallback);
};

SubcommUIPluginResourceSet.prototype.addCss = function(url) {
	url = this.pluginUrlPrefix + '/css/' + url;
	return SubcommUIResourceSet.prototype.addCss.call(this, url);
};

SubcommUIPluginResourceSet.prototype.addTab = function(tabToken, tabClass, containerId, tabIndex) {
	var urlPrefix = 'tab/' + tabToken;
	this.addCss(urlPrefix + '.css');
	this.addHtml(urlPrefix + '.html', function(data) {
		var selector = '#' + containerId;
		$(selector + ' .subcommTabMenu').append('<div data-classname="' + tabClass + '">' + tabToken +'</div>');
		$(selector + ' .subcommTabProject').after(data);
	});

	this.addJs(urlPrefix + '.js');
	return this;
};