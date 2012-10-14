$(document).ready(function() {
	$('.subcommContainer').bind('subcommMessage', function(event, data) {
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
		
		function entering(player) {
			var html = '<p>' + player + '</p>';
			$('.subcommHistoryPlayers').each(function(index, element) {
				$(this).append(html);
				$(this).scrollTop($(this)[0].scrollHeight);
			});
		}
		
		function leaving(player) {
			$('.subcommHistoryPlayers p').each(function(index, element) {
				if ($(this).html() === player)
					$(this).remove();

				$(this).parent().scrollTop($(this)[0].scrollHeight);
			});
		}
	});
	
});