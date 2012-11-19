$('.subcommContainer').bind('shopkeepPluginReady', function(pEvent, pData) {
	
	TableScraper.INSTANCES[pData.containerId].subscribeNext(function(table, scraper) {
		console.log(table);
	});
	
	$('.shopkeepShipTab').on('click', function(event, data) {
		var shipName = $(this).text();
		$('.shopkeepHistoryPanelShip').hide();
		$('.shopkeepHistoryPanelShip' + shipName).show();
		$('.shopkeepShipTab').removeClass('shopkeepShipTabCurrent');
		$(this).addClass('shopkeepShipTabCurrent');
	});
});