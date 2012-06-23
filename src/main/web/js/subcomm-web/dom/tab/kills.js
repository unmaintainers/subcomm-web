$(document).ready(function() {
	$('.subcommContainer').bind('subcommMessage', function(event, uiContainer, message) {
		$('.subcommHistoryKills').each(function(index, element) {
			if (!message.match(/^KILL:/))
				return;
			
			var matches = message.match(/^KILL:(.+?):(.+?):.+?:.+?$/);
			var killer = matches[1];
			var victim = matches[2];
			if (killer === null || killer.length == 0) {
				killer = victim;
				victim = 'himself';
			}
			
			var timestamp = makeTimestamp();
			$(this).append('<p>' + timestamp + '<span style="color: blue;">' + killer + '</span> killed <span style="color: red;">' + victim + '</span>.</p>');
			$(this).scrollTop($(this)[0].scrollHeight);
		});
	});
});
