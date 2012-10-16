$(document).ready(function() {
	/**
	 * Reacts to the subcommMessage event, triggering the subcommBannerMessage event.
	 * 
	 * The subcommBannerMessage passes the same data parameter as this method. Handlers are expected to:
	 *  - Call event.stopImmediatePropagation() if the banner will be changed.
	 *  - Return if the associated panel's UI is already active. i.e., if the chat tab is active, don't show chat.
	 * @param Event event
	 * @param {container: SubcommUIContainer, message: string} data
	 */
	$('.subcommContainer').bind('subcommMessage', function(event, data) {
		$(this).triggerHandler('subcommBannerMessage', data);
	});
	
	$('.subcommContainer').bind('subcommDisconnect', function(event, data) {
		$('.subcommBanner').empty();
	});
});