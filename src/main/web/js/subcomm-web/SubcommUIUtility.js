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

SubcommUIUtility.Ui = function() {};

SubcommUIUtility.Ui.toggleSpinner = function(div, spinning) {
	div = $(div);
	var spinningDivs = div.find('.subcommSpinner');
	if (spinning) {
		if (spinningDivs.length !== 0) { // already spinning
			return;
		}
		
		var spinning = $('<div class="subcommSpinner"></div>');
		$(div).append(spinning);
		var spinner = new Spinner({
			length: 10,
			width: 2,
			radius: 8,
		}).spin();
		spinning.append(spinner.el);
		// position the div afterwards, which gives us the computed width/height
		var pos = div.offset();
		var top =  Math.floor(pos.top + (div.innerHeight() / 2) - (spinning.outerHeight() / 2) ) + 8;
		var left = Math.floor(pos.left + (div.innerWidth() / 2) - (spinning.outerWidth() / 2) ) + 8;
		spinning.offset({left: left, top: top});
	} else {
		if (spinningDivs.length !== 0) { // clear spinning divs, not spinning any longer
			$(spinningDivs).remove();
		}
	}
};

