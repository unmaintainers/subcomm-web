$('.subcommContainer').bind('shopkeepPluginReady', function(pEvent, pData) {
	TableScraper.INSTANCES[pData.containerId].subscribeNext(function(table, scraper) {
		console.log(table);
	});
});