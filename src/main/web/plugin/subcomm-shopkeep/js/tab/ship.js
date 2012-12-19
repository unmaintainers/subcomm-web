$('.subcommContainer').bind('shopkeepPluginReady', function(pEvent, pData) {
	function refresh(containerId, shipName, shipId, inventoryTable, shipTable) {
		// clear inventory and ship profile's head and body
		$('#'+containerId+' .shopkeepHistoryPanelShip'+shipName+' .shopkeepShipInventoryPanel table *').empty();
		
		// process inventory head
		var html = '<tr>';
		for (var i = 0, n = inventoryTable.rowTitles.length; i <  n; ++i) {
			html += '<th>' + inventoryTable.rowTitles[i] + '</th>';
		}
		
		html += '</tr>';
		$('#'+containerId+' .shopkeepHistoryPanelShip'+shipName+' .shopkeepShipInventoryPanel table thead').html(html);
		
		// process inventory table
		html = '';
		for (i = 0, n = inventoryTable.numRows(); i < n; ++i) {
			var row = inventoryTable.getRow(i);
			var shadedClass = ( i % 2 === 0 ? ' class="shaded"' : '' );
			html += '<tr'+shadedClass+'>';
			for (var j = 0; j < row.length; ++j) {
				html += '<td>' + row[j] + '</td>';
			}
			
			html += '</tr>';
		}
		
		$('#'+containerId+' .shopkeepHistoryPanelShip'+shipName+' .shopkeepShipInventoryPanel table tbody').html(html);
		
		// process profile table head
		html = '<tr>';
		for (i = 0, n = shipTable.rowTitles.length; i <  n; ++i) {
			html += '<th>' + shipTable.rowTitles[i] + '</th>';
		}
		
		html += '</tr>';
		$('#'+containerId+' .shopkeepHistoryPanelShip'+shipName+' .shopkeepShipProfilePanel table thead').html(html);
		
		// process profile table
		html = '';
		for (i = 0, n = shipTable.numRows(); i < n; ++i) {
			var row = shipTable.getRow(i);
			var shadedClass = ( i % 2 === 0 ? ' class="shaded"' : '' );
			html += '<tr'+shadedClass+'>';
			for (var j = 0; j < row.length; ++j) {
				html += '<td>' + row[j] + '</td>';
			}
			
			html += '</tr>';
		}
		
		$('#'+containerId+' .shopkeepHistoryPanelShip'+shipName+' .shopkeepShipProfilePanel table tbody').html(html);		
	}
	
	$('.shopkeepShipTab').on('click', function(event, data) {
		var shipName = $(this).text();
		var shipId =  $(this).attr('data-shipid');
		// toggle current tab highlighting
		$('.shopkeepShipTab').removeClass('shopkeepShipTabCurrent');
		$(this).addClass('shopkeepShipTabCurrent');
		// show appropriate ship panel, hide the rest
		$('.shopkeepHistoryPanelShip').hide();
		$('.shopkeepHistoryPanelShip' + shipName).show();
		
		var container = SubcommUIContainer.getByDiv($(this));
		
		// show waiting icon
		var panelSelector = container.selector + ' .shopkeepHistoryPanelShip'+shipName;
		var panels = [
            $(panelSelector + ' .shopkeepShipInventoryPanel')[0],
            $(panelSelector + ' .shopkeepShipProfilePanel')[0]
        ];

		for (var i = 0; i < panels.length; ++i) {
			SubcommUIUtility.Ui.toggleSpinner(panels[i], true);
		}
		
		// request a data refresh
		var inventoryTable = null;
		TableScraper.INSTANCES[container.id].subscribeNext(function(table, scraper) {
			inventoryTable = table;
		});
		var shipTable = null;
		TableScraper.INSTANCES[container.id].subscribeNext(function(table, scraper) {
			shipTable = table;
			
			for (var i = 0; i < panels.length; ++i) {
				SubcommUIUtility.Ui.toggleSpinner(panels[i], false);
			}
			
			refresh(container.id, shipName, shipId, inventoryTable, shipTable);
		});
		
		// launch the command
		ISubcommUI.get().chatPublic(container.session.uri, '?shipstatus -v ' + shipId);
	});
});