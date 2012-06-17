$(document).ready(function() {
	$('.subcommContainer').bind('subcommMessage', function(event, uiContainer, message) {
		$(this).children('.subcommHistoryRaw').each(function(index, element) {
			$(this).append('<p>' + message + '</p>');
			$(this).scrollTop($(this)[0].scrollHeight);
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
	
		javaClient.sendRaw($(this).val().trim());
		$(this).val('');
	});	
});