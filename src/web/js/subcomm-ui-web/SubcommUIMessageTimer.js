function SubcommUIMessageTimer() {};

SubcommUIMessageTimer.run = function() {
	setTimeout(SubcommUIMessageTimer.run, 350);
	$('.subcommContainer').each(function (index, element) {
		var subcommContainer = $(this).subcommContainer;
		if (!subcommContainer) {
			return;
		}
		
		for (var i = 0, n = subcommContainer.sessions.length; i < n; ++i) {
			var session = subcommContainer.sessions[i];
			var client = session.javaClient;
			if (!client) {
				client = subcommContainer.applet.getClient(session.javaClientId);
				if (!client) {
					return;
				}
			}
			
			var messages = client.nextReceivedMessages();
			if (!messages) {
				return;
			}
			
			for (var mi = 0, mn = messages.length; mi < mn; ++mi) {
				$(this).triggerHandler('subcommMessage', subcommContainer, message)
			}
		}
	});
}