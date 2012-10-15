$(document).ready(function() {
	/**
	 * Initializes the project panel with content read for an HTTP call.
	 */
	jQuery.ajax({
		url: "../../../README.md",
		dataType: 'text',
	}).done(function(content) {
		content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		content = new Markdown.Converter().makeHtml(content);
		$('.subcommHistoryPanelProject').each(function(index, element) {
			$(this).html(content);
		});
	});
});