var SubcommUIUtility = new function() {};

SubcommUIUtility.makeTimestamp = function() {
	var date = new Date(Date.now());
	var ts = '<span style="color: gray;">['+ zeroFill(date.getHours(), 2)
	+ ':' + zeroFill(date.getMinutes(), 2)
	+ ':' + zeroFill(date.getSeconds(), 2) + ']</span> ';
	return ts;
}

SubcommUIUtility.zeroFill = function(number, width) {
	width -= number.toString().length;
	if ( width > 0 ) {
		return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	}
	
	return number + ""; // always return a string
}