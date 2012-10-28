var SubcommUIResourceSet = function() {
	this._resources = [];
};

SubcommUIResourceSet.Resource = function(url, ajaxCallback) {
	this.url = url;
	this.ajaxCallback = ( typeof(ajaxCallback) !== 'undefined' ? ajaxCallback : null );
};

SubcommUIResourceSet.JsResource = function(url) {
	SubcommUIResourceSet.Resource.call(this, url);
};

SubcommUIResourceSet.JsResource.prototype = new SubcommUIResourceSet.Resource();
SubcommUIResourceSet.JsResource.prototype.constructor = SubcommUIResourceSet.JsResource;

SubcommUIResourceSet.HtmlResource = function(url, ajaxCallback) {
	SubcommUIResourceSet.Resource.call(this, url, ajaxCallback);
};

SubcommUIResourceSet.HtmlResource.prototype = new SubcommUIResourceSet.Resource();
SubcommUIResourceSet.JsResource.prototype.constructor = SubcommUIResourceSet.HtmlResource;

SubcommUIResourceSet.CssResource = function(url) {
	SubcommUIResourceSet.Resource.call(this, url);
};

SubcommUIResourceSet.CssResource.prototype = new SubcommUIResourceSet.Resource();
SubcommUIResourceSet.JsResource.prototype.constructor = SubcommUIResourceSet.CssResource;

SubcommUIResourceSet.prototype.get = function(index) {
	return this._resources[index];
};

SubcommUIResourceSet.prototype.size = function() {
	return this._resources.length;
};

SubcommUIResourceSet.prototype.addJs = function(url) {
	this._resources.push(new SubcommUIResourceSet.JsResource(url));
	return this;
};

SubcommUIResourceSet.prototype.addHtml = function(url, ajaxCallback) {
	this._resources.push(new SubcommUIResourceSet.HtmlResource(url, ajaxCallback));
	return this;
};

SubcommUIResourceSet.prototype.addCss = function(url) {
	this._resources.push(new SubcommUIResourceSet.CssResource(url));
	return this;
};