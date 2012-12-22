$(document).ready(function() {
	$('.subcommContainer').bind('subcommMessage', function(event, data) {
		$('.subcommHeader').each(function(index, element) {
			$(this).empty();
			var session = data.container.session;
			$(this).append('<p>SubComm connected to ' + session.hostname + ' : ' + session.port + ' as ' + session.username + '.</p>');
		});	
	});
	
	$('.subcommTabMenu').on('click', 'div', function() {
		var container = SubcommUIContainer.getByDiv($(this));
		var containerEl = $(container.selector);
		$('.subcommTabMenu div').removeClass('subcommTabCurrent');
		$(this).addClass('subcommTabCurrent');
		containerEl.children('.subcommTab').hide();
		var tabName = $(this).attr('data-classname');
		containerEl.children('.' + tabName).each(function(index, element) {
			$(this).show();
			$(containerEl).triggerHandler('subcommTabFocus', { container: container, tabName: tabName }); // message event
			$('.subcommHistory').each(function(index, element) {
				if ($(this).attr('data-autoscroll') !== 'false') {
					$(this).scrollTop($(this)[0].scrollHeight);
				}
			});
		});
	});
	
	$('.subcommContainer').bind('subcommDisconnect', function(event, data) {
		$('.subcommHeader').html('<p>SubComm</p>');
	});
});
