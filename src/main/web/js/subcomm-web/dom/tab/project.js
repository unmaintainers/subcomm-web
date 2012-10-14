$(document).ready(function() {
	/**
	 * Initializes the project panel with content read for an HTTP call.
	 */
	jQuery.ajax({
		url: "../../../README.md",
		dataType: 'text',
	}).done(function(data) {
		$('.subcommHistoryProject').each(function(index, element) {
			$(this).html('<p><pre>' + data + '</pre></p>');
		});
	});
});