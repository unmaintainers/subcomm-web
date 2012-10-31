var SubcommUIMessageTimer = function() {};

/* @var integer milliseconds between each call to run() */
SubcommUIMessageTimer.RUN_INTERVAL_MS = 350;

/**
 * Acts as the internal message loop for the application. Attempts to read new messages for each container and then
 * fires subcommMessage events for any that receive messages.
 * Only this method is allowed to use the SubcommClient.'received() methods.
 */
SubcommUIMessageTimer.run = function() {
	/**
	 * Encodes HTML characters.
	 * @param string text
	 * @returns string
	 */
	function sanitize(text) {
		return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	
	$('.subcommContainer').each(function (index, element) {
		var container = SubcommUIContainer.get($(this).attr('id'));
		if (!container || !container.session) {
			return;
		}

		var session = container.session;
		var message = ISubcommUI.get().nextReceivedMessage(session.uri);
		if (!message) {
			return;
		}

		if (!session.introduced) { // this is the first access to this client from this timer
			session.introduced = true;
			$(this).triggerHandler('subcommConnect', { container: container }); // alert ui
		}
		
		while (message) {
			message = sanitize(''+message);; // encode html
			$(this).triggerHandler('subcommMessage', { container: container, message: message }); // message event
			message = ISubcommUI.get().nextReceivedMessage(session.uri);
		}
	});
	
	setTimeout(SubcommUIMessageTimer.run, SubcommUIMessageTimer.RUN_INTERVAL_MS);
};