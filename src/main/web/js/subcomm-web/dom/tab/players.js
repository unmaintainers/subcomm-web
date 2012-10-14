$(document).ready(function() {
	$('.subcommContainer').bind('subcommMessage', function(event, data) {		
		function entering(player) {
			var html = '<p>' + player + '</p>';
			player = player.toLowerCase();
			$('.subcommHistoryPlayers').each(function(panelIndex, panel) {
				var done = false;
				$(this).children('p').each(function(index, element) { // attempt to insert before this <p>
					if (!done && player < $(this).html().toLowerCase()) {
						$(this).before(html);
						$(panel).scrollTop($(panel)[0].scrollHeight);
						done = true;
					}
				});
				
				if (!done) { // append
					$(this).append(html);
					$(this).scrollTop($(this)[0].scrollHeight);
				}
			});
		}
		
		function leaving(player) {
			$('.subcommHistoryPlayers p').each(function(index, element) {
				if ($(this).html() === player)
					$(this).remove();

				$(this).parent().scrollTop($(this)[0].scrollHeight);
			});
		}
		
		var container = data.container;
		var message = data.message;
		var matches = message.match(/^(?:ENTERING|PLAYER):(.+?):.+?:.+?$/);
		if (matches) {
			return entering(matches[1]);
		}
		matches = message.match(/^LEAVING:(.+?)$/);
		if (matches) {
			return leaving(matches[1]);
		}
	});
	
	$('.subcommContainer').bind('subcommBannerMessage', function(event, data) {
		var container = data.container;
		var message = data.message;
		var action = 'entered';
		var matches = message.match(/^(?:ENTERING):(.+?):.+?:.+?$/);
		if (!matches) {
			action = 'left';
			matches = message.match(/^LEAVING:(.+?)$/);
			if (!matches) {
				return;
			}
		}
		
		var player = matches[1];
		var html = '<p><span style="color: blue;">' + player + '</span> has ' + action + ' the arena'
		$('.subcommBanner').each(function(index, element) {
			$(this).html(html);
		});
		
		event.stopImmediatePropagation();
	});
});