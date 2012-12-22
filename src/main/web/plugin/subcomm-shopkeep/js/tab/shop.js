$('.subcommContainer').bind('shopkeepPluginReady', function(pEvent, pData) {
	function createCategoryCallback(state) {
		var callback = function(table, scraper) {
			var category = state.categories[state.categoryIndex];

			if (state.itemsTable === null) {
				state.itemsTable = table;
			} else {
				state.itemsTable.appendTable(table);
			}

			// update shop table
			var tableUi = new ScrapedTableUI(state.itemsTable);
			tableUi.updateTable(state.panel);

			if (++state.categoryIndex === state.categories.length) { // if there are more categories
				SubcommUIUtility.Ui.toggleSpinner(state.panel, false);
				return;
			}

			TableScraper.INSTANCES[state.container.id].subscribeNext(createCategoryCallback(state));
			ISubcommUI.get().chatPublic(state.container.session.uri, '?buy ' + category);
		};

		return callback;
	};
	
	$('.subcommContainer').bind('subcommTabFocus', function(event, data) {
		if (data.tabName !== 'shopkeepTabShop') {
			return;
		}
		
		var container = data.container;
		var panel = $($(container.selector + ' .shopkeepTabShop .shopkeepShopPanel')[0]);

		// show waiting icon
		SubcommUIUtility.Ui.toggleSpinner(panel, true);
		
		// request a list of categories
		TableScraper.INSTANCES[container.id].subscribeNext(function(table, scraper) {
			// request a list of items for each category
			var categories = table.getColumn(0);
			var callback = createCategoryCallback({
				container: container,
				itemsTable: null,
				categories: categories,
				categoryIndex: 0,
				panel: panel
			});
			
			TableScraper.INSTANCES[container.id].subscribeNext(callback);
			ISubcommUI.get().chatPublic(container.session.uri, '?buy ' + categories[0]);
		});
		
		// launch the category list command
		ISubcommUI.get().chatPublic(container.session.uri, '?buy');
	});
});