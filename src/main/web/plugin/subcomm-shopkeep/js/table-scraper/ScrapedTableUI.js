var ScrapedTableUI = function(scrapedTable) {
	this.scrapedTable = scrapedTable;
};

ScrapedTableUI.prototype = {
	updateTable: function(div) {
		var table = $($(div).find('table')[0]);
		var tableBody = $(table.find('tbody')[0]);
		var tableHead = $(table.find('thead')[0]);

		// clear inventory and ship profile's head and body
		tableBody.empty();
		tableHead.empty();
		
		// process table head
		var html = '<tr>';
		for (var i = 0, n = this.scrapedTable.rowTitles.length; i <  n; ++i) {
			html += '<th>' + this.scrapedTable.rowTitles[i] + '</th>';
		}
		
		html += '</tr>';
		tableHead.html(html);
		
		// process table body
		html = '';
		for (i = 0, n = this.scrapedTable.numRows(); i < n; ++i) {
			var row = this.scrapedTable.getRow(i);
			var shadedClass = ( i % 2 === 0 ? ' class="shaded"' : '' );
			html += '<tr'+shadedClass+'>';
			for (var j = 0; j < row.length; ++j) {
				html += '<td>' + row[j] + '</td>';
			}
			
			html += '</tr>';
		}
		
		tableBody.html(html);	
	},
};