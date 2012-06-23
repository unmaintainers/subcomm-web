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
				client = subcommContainer.applet.getClient(session.containerId);
				if (!client) {
					return;
				}
			}
			
			
			var message = client.nextReceivedMessage();
			while (message) {
				$(this).triggerHandler('subcommMessage', subcommContainer, message);
				message = client.nextReceivedMessage();
			}
		}
	});
}