$(document).ready(function() {
	/**
	 * @param data { container:SubcommUIContainer,message:string }
	 */
	$('.subcommContainer').bind('subcommMessage', function(event, data) {
		var message = data.message;
		$('.subcommHistoryPanelRaw').each(function(index, element) {
			$(this).append('<p>' + message + '</p>');
			$(this).parent().scrollTop($(this).parent()[0].scrollHeight);
		});
	});
	
	$('.subcommInputFormRaw').submit(function(event) {
		event.stopPropagation();
		event.preventDefault();
		
		var containerEl = $($(this).closest('.subcommContainer')[0]);
		var container = SubcommUIContainer.get(containerEl.attr('id'));
		var input = $($(this).children('input')[0]);
        var message = input.val().trim();
        ISubcommUI.get().send(container.session.uri, message);
		input.val('');
		$('#'+container.id).triggerHandler('subcommMessage', { container: container, message: message });
	});	
	
	$('.subcommContainer').bind('subcommConnect', function(event, data) {
		$('.subcommHistoryPanelRaw').empty();
		// change to chat tab as soon as we connect
		var container = SubcommUIContainer.getByDiv($(this));
		container.changeTab('subcommTabRaw');
	});
});