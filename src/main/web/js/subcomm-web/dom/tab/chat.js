$(document).ready(function() {
	/**
	 * Creates the <p> tag and content for showing a message.
	 * @param container
	 * @param message
	 * @returns string
	 */
    function createMessageHtml(container, message, showTimestamp) {
    	var matches = message.match(/^MSG:(.+?):(.+?):(.+)$/);
		if (!matches) {
			return;
		}
		
		showTimestamp = ( typeof(showTimestamp) !== 'undefined' ? showTimestamp : true );
		var timestamp = ( showTimestamp ? SubcommUIUtility.makeTimestamp() : '' );
		var target = matches[1];
		var origin = matches[2];
		
		var content = matches[3];
		if (content.length > 80)
			content = content.substring(0, 80);
		
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
		
		return '<p>' + timestamp + '<span style="color: ' + color + ';">&lt;' + origin + '&gt;</span> ' + content + '</p>';
    }
    
	$('.subcommContainer').bind('subcommMessage', function(event, data) {
		var container = data.container;
		var message = data.message;
		var messageHtml = createMessageHtml(container, message, true);
		if (!messageHtml) {
			return;
		}
		
		$('.subcommHistoryChat').each(function(index, element) {
			$(this).append(messageHtml);
			$(this).scrollTop($(this)[0].scrollHeight);
		});
	});
	
	/**
	 * Prints chat-specific banner messages if found.
	 */
	$('.subcommContainer').bind('subcommBannerMessage', function(event, data) {
		var container = data.container;
		var message = data.message;
		var messageHtml = createMessageHtml(container, message, false);
		if (!messageHtml) {
			return;
		}

		$('.subcommBanner').each(function(index, element) {
			$(this).html(messageHtml);
		});
		
		event.stopImmediatePropagation();
	});
	
	$('.subcommInputFormChat').submit(function(event) {
		event.stopPropagation();
		event.preventDefault();

		var container = $($(this).closest('.subcommContainer')[0]);
		var subcommContainer = SubcommUIContainer.get(container.attr('id'));
		var javaClient = subcommContainer.getJavaClient();
		if (javaClient === null) {
			return;
		}

		var input = $($(this).children('input')[0]);
        var message = input.val().trim();
		javaClient.chatPublic(message);
		input.val('');
		var composed = 'MSG:PUB:' + subcommContainer.session.username + ':' + message;
		$('#'+subcommContainer.id).triggerHandler('subcommMessage', { container: subcommContainer, message: composed });
	});	
});