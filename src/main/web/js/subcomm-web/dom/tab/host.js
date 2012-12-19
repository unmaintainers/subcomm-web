$(document).ready(function() {
	$('.subcommFormHostConnect').submit(function(event) {
		event.stopPropagation();
		event.preventDefault();
		
		var containerEl = $(this).closest('.subcommContainer');
		var container = SubcommUIContainer.get($(containerEl).attr('id'));
		if (!container.applet) {
			return;
		}
		
		var submit = $($(containerEl).find('.subcommButtonHostSubmit')[0]);
		if (submit.html() === 'connect') {
			var session = new SubcommUISession();
			session.hostname = ''+$($(containerEl).find('.subcommFormHostConnectHostname')[0]).val().trim();
			session.port = parseInt($($(containerEl).find('.subcommFormHostConnectPort')[0]).val().trim());
			session.username = ''+$($(containerEl).find('.subcommFormHostConnectUsername')[0]).val().trim();
			session.password = ''+$($(containerEl).find('.subcommFormHostConnectPassword')[0]).val().trim();
			session.containerId = ''+container.id;
			container.session = session;
	
			if (session.hostname === 'demo') {
				ISubcommUI.setCurrent(ISubcommUIDemo.NAME);
				if (!session.username) {
					session.username = 'guest';
					$($(containerEl).find('.subcommFormHostConnectUsername')[0]).val(session.username);
				}
			} else {
				ISubcommUI.setCurrent(ISubcommUIApplet.NAME);
			}
			
			session.uri = ISubcommUI.get().connect(
				''+session.containerId,
				''+session.hostname,
				session.port,
				''+session.username,
				''+session.password
			);
			
			submit.html('disconnect');
		} else { // disconnect
			if (container.session) {
				ISubcommUI.get().disconnect(container.session.uri);
				container.session = null;
			}
			
			submit.html('connect');
			$(containerEl).triggerHandler('subcommDisconnect', { container: container });
		}
		
		submit.toggleClass('subcommButtonHostSubmitConnected');
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
		portInput.val(port);
	});

	$('.subcommFormHostConnectServer').each(function(index, element) {
		var servers = SubcommUI.get().getConfig('servers');
		for (var i = 0, n = servers.length; i < n; ++i) {
			var server = servers[i];
			$(this).append('<option value="' + server.hostname + ':' + server.port + '">' + server.name + '</option>');
		}
	});
});
