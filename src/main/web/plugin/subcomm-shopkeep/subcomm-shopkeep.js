/**
 * Handle plugin enable and disable.
 */
$(document).ready(function() {
	/**
	 * @param event
	 * @param data { pluginToken:string,containerId:string }
	 */
	$('.subcommContainer').bind('subcommPluginEnable', function(event, data) {
		if (data.pluginToken !== 'subcomm-shopkeep')
			return;

		var resources = new SubcommUIPluginResourceSet(data.pluginToken)
		.addTab('ship', 'shopkeepTabShip', data.containerId, 0)
		.addTab('shop', 'shopkeepTabShop', data.containerId, 1)
		.addJs('table-scraper/ScrapedTable.js')
		.addJs('table-scraper/TableScraper.js');

		SubcommUIResourceLoader.get().loadResources(resources, function(resources) {
			/**
			 * Creates an event 'shopkeepTableScraper' that reports back tables it has scraped.
			 */
			var scraper = new TableScraper(data.containerId, function(table, scraper) {
				$('.subcommContainer').triggerHandler('shopkeepTableScraper', {
					containerId: data.containerId,
					table: table,
					scraper: scraper
				});
				
				console.log(table);
			});
			$('.subcommContainer').bind('subcommMessage', function(event, data) {
				scraper.notifyMessage(data.message);
			});
			
			$('#' + data.containerId).triggerHandler('shopkeepPluginReady', data);
		});
	});
	
	/**
	 * @param event
	 * @param data { pluginToken:string,containerId:string }
	 */	
	$('.subcommContainer').bind('subcommPluginDisable', function(event, data) {
		if (data.pluginToken !== 'subcomm-shopkeep')
			return;
		
		//var plugin = SubcommPluginUI.get(data.pluginToken);
		//plugin.disableTab('shop');
	});
	
	(function init() {
		var plugin = SubcommUIPlugin.get('subcomm-shopkeep');
		for (var i = 0; i < plugin.containerIds.length; ++i) {
			var containerId = plugin.containerIds[i];
			$('#' + containerId).triggerHandler('subcommPluginEnable', {
				pluginToken: 'subcomm-shopkeep',
				containerId: containerId
			});
		}
	})();
});