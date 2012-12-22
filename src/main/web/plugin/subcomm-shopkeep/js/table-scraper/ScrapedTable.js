var ScrapedTable = function() {
	this.title = '';
	this.rowTitles = [];
	/* @var [ [row1 val1, row1 val2,..],.. ] */
	this.data = [];
	this.started = false;
	this.complete = false;
};

ScrapedTable.prototype.get = function(rowIndex, columnIndex) {
	return this.data[rowIndex][columnIndex];
};

ScrapedTable.prototype.getRow = function(rowIndex) {
	return this.data[rowIndex];
};

ScrapedTable.prototype.numRows = function() {
	return this.data.length;
};

ScrapedTable.prototype.getColumn = function(columnIndex) {
	var results = [];
	for (var i = 0, n = this.numRows(); i < n; ++i) {
		results.push(this.get(i, columnIndex));
	}
	
	return results;
};

ScrapedTable.prototype.appendTable = function(table) {
	for (var i = 0, n = table.numRows(); i < n; ++i) {
		this.data.push(table.getRow(i));
	}
};

ScrapedTable.prototype.insertColumn = function(atColumnIndex, title, value) {
	this.rowTitles.splice(atColumnIndex, 0, title);
	for (var r = 0, rn = this.numRows(); r < rn; ++r) {
		this.data[r].splice(atColumnIndex, 0, value);
	}
};