$('.subcommContainer').bind('shopkeepPluginReady', function(pEvent, pData) {
	$('.shopkeepShipTab').on('click', function(event, data) {
		var shipName = $(this).text();
		var shipId =  $(this).attr('data-shipid');
		// toggle current tab highlighting
		$('.shopkeepShipTab').removeClass('shopkeepShipTabCurrent');
		$(this).addClass('shopkeepShipTabCurrent');
		// show appropriate ship panel, hide the rest
		$('.shopkeepHistoryPanelShip').hide();
		$('.shopkeepHistoryPanelShip' + shipName).show();
		// request a data refresh
		TableScraper.INSTANCES[pData.containerId].subscribeNext(function(table, scraper) {
			console.log(table);
		});
		
		var containerEl = $($(this).closest('.subcommContainer')[0]);
		var container = SubcommUIContainer.get(containerEl.attr('id'));
		ISubcommUI.get().chatPublic(container.session.uri, '?shipstatus -v ' + shipId);
	});
});