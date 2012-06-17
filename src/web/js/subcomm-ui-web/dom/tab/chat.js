$(document).ready(function() {
	$('.subcommContainer').bind('subcommMessage', function(event, uiContainer, message) {
		$('.subcommHistoryChat').each(function(index, element) {
			if (!input.match(/^MSG:/))
				return;
			
			var matches = input.match(/^MSG:(.+?):(.+?):(.+)$/);
			var target = matches[1];
			var origin = matches[2];
			var message = matches[3];
			var timestamp = makeTimestamp();
			var color;
			switch (target) {
			case 'PUB':
				color = 'blue';
				break;
			case 'FREQ':
				color = 'yellow';
				break;
			default:
				color = 'orange';
			}
			
			$(this).append('<p>' + timestamp + '<span style="color: ' + color + ';">&lt;' + origin + '&gt;</span> ' + message + '</p>');
			$(this).scrollTop($(this)[0].scrollHeight);
		});
	});
	
	$('.subcommInputFormChat').submit(function(event) {
		event.stopPropagation();
		event.preventDefault();
		
		var container = $($(this).closest('.subcommContainer')[0]);
		var subcommContainer = SubcommUIContainer.get(container.attr('id'));
		var javaClient = subcommContainer.getJavaClient();
		if (javaClient === null)
			return;
	
		javaClient.messagePublic($(this).val().trim());
		$(this).val('');
	});	
});