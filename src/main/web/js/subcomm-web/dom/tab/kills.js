$(document).ready(function() {
	/**
	 * Creates the kill message HTML for a matching message.
	 * @returns string|undefined 
	 */
	function createKillHtml(container, message, showTimestamp) {
		var matches = message.match(/^KILL:(.*?):(.+?):.+?:.+?$/);
		if (!matches) {
			return;
		}

		showTimestamp = ( typeof(showTimestamp) !== 'undefined' ? showTimestamp : true );
		var timestamp = ( showTimestamp ? SubcommUIUtility.makeTimestamp() : '' );
		var killer = matches[1];
		var victim = matches[2];
		var action = 'killed';
		if (killer === '&lt;self&gt;') { // suicide
			killer = victim;
			action = 'committed suicide';
			victim = '';
		}

		return '<p>' + timestamp + '<span style="color: blue;">' + killer + '</span> ' + action + ' <span style="color: red;">' + victim + '</span></p>';
	}
	
	$('.subcommContainer').bind('subcommMessage', function(event, data) {
		var container = data.container;
		var message = data.message;
		var killHtml = createKillHtml(container, message, true);
		if (!killHtml) {
			return;
		}
		
		$('.subcommHistoryPanelKills').each(function(index, element) {
			$(this).append(killHtml);
			$(this).parent().scrollTop($(this).parent()[0].scrollHeight);
		});
	});
	
	$('.subcommContainer').bind('subcommBannerMessage', function(event, data) {
		var container = data.container;
		var message = data.message;
		var killHtml = createKillHtml(container, message, false);
		if (!killHtml) {
			return;
		}

		$('.subcommBanner').each(function(index, element) {
			$(this).html(killHtml);
		});
		
		event.stopImmediatePropagation();
	});
});
