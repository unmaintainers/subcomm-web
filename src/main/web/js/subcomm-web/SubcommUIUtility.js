var SubcommUIUtility = function() {};

SubcommUIUtility.Regex = function() {};

SubcommUIUtility.Regex.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "\\$&");
};

SubcommUIUtility.Url = function() {};

SubcommUIUtility.Url.baseUrl = window.location.toString().match(/^(.*)\/.*$/)[1]; // everything up to the last /
SubcommUIUtility.Url.baseUrlRegExp = new RegExp('^' + SubcommUIUtility.Regex.escape(SubcommUIUtility.Url.baseUrl) + '');

SubcommUIUtility.Url.getAbsoluteUrl = function(url) {
	if (!SubcommUIUtility.Url.baseUrlRegExp.test(url)) { // starts with base url
		url = SubcommUIUtility.Url.baseUrl + '/' + url; // ensure all url keys are absolute (and local)
	}
	
	return url;
};

SubcommUIUtility.makeTimestamp = function() {
	var date = new Date(Date.now());
	var ts = '<span style="color: gray;">['+ SubcommUIUtility.zeroFill(date.getHours(), 2)
	+ ':' + SubcommUIUtility.zeroFill(date.getMinutes(), 2)
	+ ':' + SubcommUIUtility.zeroFill(date.getSeconds(), 2) + ']</span> ';
	return ts;
};

SubcommUIUtility.zeroFill = function(number, width) {
	width -= number.toString().length;
	if ( width > 0 ) {
		return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	}
	
	return number + ""; // always return a string
};