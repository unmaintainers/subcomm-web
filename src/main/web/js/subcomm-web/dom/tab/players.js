$(document).ready(function() {
	$('.subcommContainer').bind('subcommMessage', function(event, data) {		
		function entering(player) {
			var html = '<p>' + player + '</p>';
			$('.subcommHistoryPlayers').each(function(panelIndex, panel) {
				var done = false;
				$(this).children('p').each(function(index, element) { // attempt to insert before this <p>
					if (!done && player < $(this).html()) {
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
	
});