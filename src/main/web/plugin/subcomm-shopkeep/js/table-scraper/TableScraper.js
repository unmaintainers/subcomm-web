var TableScraper = function(observer) {
	this._buffer = [];
	this._table = new ScrapedTable();
	this._observer = observer;
	this.tables = [this._table];
};

/**
 * To be used as a listener when scraping.
 * @param string message
 */
TableScraper.prototype.notifyMessage = function(message) {
	if (!message.match(/^(+|\|)/))
		return;
	
	this._strategy = this._strategy.parseMessage(this._table, message);
	if (this._table.complete) {
		if (this._observer && this._observer instanceof TableScraperObserver) {
			this._observer.notifyTable(this._table, this);
		}
		
		this._table = new ScrapedTable();
		this._tables.push(this._table);
	}
};

TableScraper.Strategy = function() { /* interface */ };

/**
 * Parses a single message, appending processed data to the provided table.
 * @param ScrapedTable table The current table to be appended to.
 * @param string message The message to parse.
 * @returns TableScraper.Strategy The next strategy to use on the next line.
 */
TableScraper.Strategy.prototype.parseMessage = function(table, message) { /* override */ };

TableScraper.HeaderStrategy = function() {};
TableScraper.HeaderStrategy.prototype = new TableScraper.Strategy();
TableScraper.HeaderStrategy.prototype.constructor = TableScraper.HeaderStrategy;

TableScraper.HeaderStrategy.prototype.parseMessage = function(table, message) {
	
};