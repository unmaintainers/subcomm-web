var SubcommUIResourceLoader = function() {
	this._loadedUrls = {}; /* { url:bool,.. } */
};

SubcommUIResourceLoader._instance = null;

SubcommUIResourceLoader.get = function() {
	if (SubcommUIResourceLoader._instance === null)
		SubcommUIResourceLoader._instance = new SubcommUIResourceLoader();
	
	return SubcommUIResourceLoader._instance;
};

/**
 * 
 * @param string url
 * @return bool TRUE if the url has been loaded. false if not.
 */
SubcommUIResourceLoader.prototype.urlLoaded = function(url) {
	url = SubcommUIUtility.Url.getAbsoluteUrl(url);
	return !!this._loadedUrls[url];
};

/**
 * 
 * @param string url
 * @param bool loaded
 */
SubcommUIResourceLoader.prototype._setUrlLoaded = function(url, loaded) {
	url = SubcommUIUtility.Url.getAbsoluteUrl(url);
	this._loadedUrls[url] = !!loaded;
};

SubcommUIResourceLoader.prototype.loadResources = function(resources, onBatchLoadedMethod) {
	this._loadResource(resources, 0, ( typeof(onBatchLoadedMethod) !== 'undefined' ? onBatchLoadedMethod : null ));
};

SubcommUIResourceLoader.prototype._loadResource = function(resources, index, onBatchLoadedMethod) {
	var self = this;
	var resource = resources.get(index);
	var onLoadedMethod = function(url) {
		if (++index < resources.size()) {
			self._loadResource(resources, index, onBatchLoadedMethod);
		} else {
			if (onBatchLoadedMethod) {
				onBatchLoadedMethod(resources);
			}
		}
	};

	if (resource instanceof SubcommUIResourceSet.JsResource) {
		this._loadJs(resource, onLoadedMethod);
	} else if (resource instanceof SubcommUIResourceSet.CssResource) {
		this._loadCss(resource, onLoadedMethod);
	} else if (resource instanceof SubcommUIResourceSet.HtmlResource) {
		this._loadHtml(resource, onLoadedMethod);
	}
};

SubcommUIResourceLoader.prototype._loadJs = function(jsResource, onLoadedMethod) {
	var url = SubcommUIUtility.Url.getAbsoluteUrl(jsResource.url);
	if (this.urlLoaded(url)) {
		if (onLoadedMethod) {
			onLoadedMethod(url);
		}
		
		return;
	}
	
	var self = this;
	jQuery.getScript(url, function(data, textStatus, jqxhr) {
		self._setUrlLoaded(url, true);
		if (jsResource.ajaxCallback) {
			jsResource.ajaxCallback(data, textStatus, jqxhr);
		}
		if (onLoadedMethod) {
			onLoadedMethod(url);
		}
	});
};

SubcommUIResourceLoader.prototype._loadHtml = function(htmlResource, onLoadedMethod) {
	var url = SubcommUIUtility.Url.getAbsoluteUrl(htmlResource.url);
	// we don't cache html loads as they are not global
	jQuery.ajax({
        url: url,
        success: function(data) {
        	if (htmlResource.ajaxCallback) {
        		htmlResource.ajaxCallback(data);
        	}
        	if (onLoadedMethod) {
        		onLoadedMethod(htmlResource.url);
        	}
        }
    });
};

SubcommUIResourceLoader.prototype._loadCss = function(cssResource, onLoadedMethod) {
	var url = SubcommUIUtility.Url.getAbsoluteUrl(cssResource.url);
	if (this.urlLoaded(url)) {
		if (onLoadedMethod) {
			onLoadedMethod(url);
		}
		
		return;
	}
	
	$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', url) );
	if (onLoadedMethod) {
		onLoadedMethod(url);
	}
};



