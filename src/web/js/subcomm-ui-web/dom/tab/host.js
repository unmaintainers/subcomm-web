$(document).ready(function() {
	$('.subcommFormHostConnect').submit(function(event) {
		event.stopPropagation();
		event.preventDefault();

		if (!subcommContainer.applet) {
			return;
		}
		
		var container = $(this).closest('.subcommContainer');
		var subcommContainer = SubcommUIContainer.get($(container).attr('id'));
		var session = new SubcommUISession();
		session.hostname = $($(container).find('.subcommFormHostConnectHostname')[0]).val();
		session.port = $($(container).find('.subcommFormHostConnectPort')[0]).val();
		session.username = $($(container).find('.subcommFormHostConnectUsername')[0]).val();
		session.password = $($(container).find('.subcommFormHostConnectPassword')[0]).val();
		session.containerId = subcommContainer.id;
		subcommContainer.session = session;

		subcommContainer.applet.connect(
			session.containerId,
			session.hostname,
			session.port,
			session.username,
			session.password
		);
	});
	
	$('.subcommFormHostConnectServer').change(function(event) {
		var container = $(this).closest('.subcommContainer');
		var subcommContainer = SubcommUIContainer.get($(container).attr('id'));
		var value = $(this).val();
		var hostnameInput = $($(container).find('.subcommFormHostConnectHostname')[0]);
		var portInput = $($(container).find('.subcommFormHostConnectPort')[0]);
		if (!value) {
			hostnameInput.attr('disabled', null);
			portInput.attr('disabled', null);
			return;
		}
		
		hostnameInput.attr('disabled', 'disabled');
		portInput.attr('disabled', 'disabled');
		
		var matches = value.split(':');
		var hostname = matches[0];
		var port = matches[1];
		hostnameInput.val(hostname);
		portInput.val(port)
	});

	$('.subcommFormHostConnectServer').each(function(index, element) {
		var container = $($(this).closest('.subcommContainer'));
		var containerId = container.attr('id');
		var servers = SubcommUI.get().getConfig('servers');
		for (var i = 0, n = servers.length; i < n; ++i) {
			var server = servers[i];
			$(this).append('<option value="' + server.hostname + ':' + server.port + '">' + server.name + '</option>')
		}
	});
});
