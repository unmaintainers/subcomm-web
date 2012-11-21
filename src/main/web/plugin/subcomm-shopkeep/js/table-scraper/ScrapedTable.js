var ScrapedTable = function() {
	this.title = '';
	this.rowTitles = [];
	/* @var [ [row1 val1, row1 val2,..],.. ] */
	this.data = [];
	this.started = false;
	this.complete = false;
};

ScrapedTable.prototype.get = function(row, column) {
	return this.data[row][column];
};

ScrapedTable.prototype.getRow = function(row) {
	return this.data[row];
};

ScrapedTable.prototype.numRows = function() {
	return this.data.length;
};

