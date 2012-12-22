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
		
		// collect panels
		var container = SubcommUIContainer.getByDiv($(this));
		var panelSelector = container.selector + ' .shopkeepHistoryPanelShip'+shipName;
		var panels = [
            $($(panelSelector + ' .shopkeepShipInventoryPanel')[0]),
            $($(panelSelector + ' .shopkeepShipProfilePanel')[0])
        ];

		// show waiting icon
		for (var i = 0; i < panels.length; ++i) {
			SubcommUIUtility.Ui.toggleSpinner(panels[i], true);
		}
		
		// request a data refresh for inventory
		TableScraper.INSTANCES[container.id].subscribeNext(function(table, scraper) {
			var panel = panels[0];
			// update inventory table
			var tableUi = new ScrapedTableUI(table);
			tableUi.updateTable(panel);
			SubcommUIUtility.Ui.toggleSpinner(panel, false);
		});
		
		// request a data refresh for profile
		TableScraper.INSTANCES[container.id].subscribeNext(function(table, scraper) {
			var panel = panels[1];
			// update profile table
			var tableUi = new ScrapedTableUI(table);
			tableUi.updateTable(panel);
			SubcommUIUtility.Ui.toggleSpinner(panel, false);
		});
		
		// launch the command
		ISubcommUI.get().chatPublic(container.session.uri, '?shipstatus -v ' + shipId);
	});
});