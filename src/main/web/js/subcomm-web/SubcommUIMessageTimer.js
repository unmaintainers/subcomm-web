function SubcommUIMessageTimer() {};

/* @var integer milliseconds between each call to run() */
SubcommUIMessageTimer.RUN_INTERVAL_MS = 350;

/**
 * Acts as the internal message loop for the application. Attempts to read new messages for each container and then
 * fires subcommMessage events for any that receive messages.
 */
SubcommUIMessageTimer.run = function() {
	function htmlEncode(text) {
		return $('<div/>').text(text).html();
	}
	
	$('.subcommContainer').each(function (index, element) {
		var subcommContainer = SubcommUIContainer.get($(this).attr('id'))
		if (!subcommContainer || !subcommContainer.session) {
			return;
		}

		var session = subcommContainer.session;
		var client = session.getJavaClient();
		if (!client) {
		    return;
		}

		var message = client.nextReceivedMessage();
		while (message) {
			message = (''+message).replace(/</g, '&lt;').replace(/>/g, '&gt;');
			$(this).triggerHandler('subcommMessage', { container: subcommContainer, message: message });
			message = client.nextReceivedMessage();
		}
	});
	
	setTimeout(SubcommUIMessageTimer.run, SubcommUIMessageTimer.RUN_INTERVAL_MS);
}