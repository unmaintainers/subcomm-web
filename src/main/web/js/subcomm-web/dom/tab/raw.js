$(document).ready(function() {
	$('.subcommContainer').bind('subcommMessage', function(event, data) {
		var container = data.container;
		var message = data.message;
		$('.subcommHistoryPanelRaw').each(function(index, element) {
			$(this).append('<p>' + message + '</p>');
			$(this).parent().scrollTop($(this).parent()[0].scrollHeight);
		});
	});
	
	$('.subcommInputFormRaw').submit(function(event) {
		event.stopPropagation();
		event.preventDefault();
		
		var container = $($(this).closest('.subcommContainer')[0]);
		var subcommContainer = SubcommUIContainer.get(container.attr('id'));
		var javaClient = subcommContainer.getJavaClient();
		if (javaClient === null)
			return;
	
		var input = $($(this).children('input')[0]);
        var message = input.val().trim();
		javaClient.send(message);
		input.val('');
		$('#'+subcommContainer.id).triggerHandler('subcommMessage', { container: subcommContainer, message: message });
	});	
});