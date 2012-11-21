
/**
 * @param string containerId
 * @param function(ScrapedTable table, TableScraper scraper) notifyMethod Called when a table has been scraped.
 */
var TableScraper = function(containerId, notifyMethod) {
	this._buffer = [];
	this._table = new ScrapedTable();
	this._strategy = new TableScraper.TitleStrategy();
	this._notifyMethod = ( typeof(notifyMethod) !== 'undefined' ? notifyMethod : null );
	this._nextNotifyMethod = null;
	this._nextNotifyMethods = [];
	TableScraper.INSTANCES[containerId] = this;
};

// assoc by container id
TableScraper.INSTANCES = {}; 

/**
 * To be used as a listener when scraping.
 * @param string message
 */
TableScraper.prototype.notifyMessage = function(message) {
	var matches = message.match(/^MSG:(?:\w+):((?:\+|\|).*)$/); // grab the contents of the message
	if (!matches) {
		return;
	}
	
	var contents = matches[1];
	this._strategy = this._strategy.parseMessage(this._table, contents);
	if (this._table.complete) {
		if (this._notifyMethod) {
			this._notifyMethod(this._table, this);
		}
		if (this._nextNotifyMethod) {
			this._nextNotifyMethod(this._table, this);
		}
		
		this._nextNotifyMethod = this._nextNotifyMethods.shift();
		if (typeof(this._nextNotifyMethod) === 'undefined') {
			this._nextNotifyMethod = null;
		}
		
		this._table = new ScrapedTable();
	}
};

/**
 * Essentially "calls dibs" on the next table that *starts*. The notify method is called once completed.
 * @param function(ScrapedTable table, TableScraper scraper) notifyMethod
 */
TableScraper.prototype.subscribeNext = function(notifyMethod) {
	if (this._table.started || this._nextNotifyMethod !== null) {
		this._nextNotifyMethods.push(notifyMethod);
	} else {
		this._nextNotifyMethod = notifyMethod;
	}
};

TableScraper.Strategy = function() { };
TableScraper.Strategy.HR_REGEX = /^\+[\-\+]+\+$/;
TableScraper.Strategy.ROW_REGEX = /^\|\s+(.*)\s+\|$/;

/**
 * Parses a single message, appending processed data to the provided table.
 * @param ScrapedTable table The current table to be appended to.
 * @param string message The message to parse.
 * @returns TableScraper.Strategy The next strategy to use on the next line.
 */
TableScraper.Strategy.prototype.parseMessage = function(table, message) { /* override */ };

/**
 * Retrieves the row contents, with the enclosing | characters, trimmed.
 * @param string message
 * @returns string|null
 */
TableScraper.Strategy.prototype.getRow = function(message) {
	var row = message.match(TableScraper.Strategy.ROW_REGEX);
	row = ( row ? row[1].trim() : null );
	return row;
};

TableScraper.Strategy.prototype.isHr = function(message) {
	return !!message.match(TableScraper.Strategy.HR_REGEX);
};



TableScraper.TitleStrategy = function() { /* no state */ };

TableScraper.TitleStrategy.TITLE_REGEX = /^\|\s+(.[^\|]*)\s+\|$/;

TableScraper.TitleStrategy.prototype = new TableScraper.Strategy();
TableScraper.TitleStrategy.prototype.constructor = TableScraper.TitleStrategy;

TableScraper.TitleStrategy.prototype.parseMessage = function(table, message) {
	if (!table.started) {
		if (this.isHr(message)) { // the first +----+ starts the table
			table.started = true;
		} else {
			var row = this.getRow(message);
			if (row) {
				table.started = true;
				var strat = new TableScraper.HeaderStrategy();
				return strat.parseMessage(table, message);
			}
		}
		
		return this;
	}

	if (!this.getRow(message)) {
		return this;
	}
	
	// if it only has one column, we assume that it's a title. otherwise, we pass the line to the header strategy
	var matches = message.match(TableScraper.TitleStrategy.TITLE_REGEX);
	if (matches) {
		table.title = matches[1].trim();
	}
	
	return new TableScraper.HeaderStrategy();
};


TableScraper.HeaderStrategy = function() { /* no state */ };

TableScraper.HeaderStrategy.prototype = new TableScraper.Strategy();
TableScraper.HeaderStrategy.prototype.constructor = TableScraper.HeaderStrategy;

TableScraper.HeaderStrategy.prototype.parseMessage = function(table, message) {
	if (this.isHr(message)) {
		return this;
	}
	
	var row = this.getRow(message);
	if (!row) {
		throw new SubcommUIException("No row found during header table scrape.");
	}

	var cells = row.split('|');
	if (!cells) {
		throw new SubcommUIException("Cells not found during header table scrape.");
	}

	for (var i = 0; i < cells.length; ++i) {
		var cell = (''+cells[i]).trim();
		table.rowTitles.push(cell);
	}
	
	return new TableScraper.RowStrategy();
};


TableScraper.RowStrategy = function() {
	this._rowIndex = 0;
};

TableScraper.RowStrategy.ROW_CELL_REGEX = /^\|\s+(.[^\|]*)\s+\|$/;

TableScraper.RowStrategy.prototype = new TableScraper.Strategy();
TableScraper.RowStrategy.prototype.constructor = TableScraper.RowStrategy;

TableScraper.RowStrategy.prototype.parseMessage = function(table, message) {
	if (this.isHr(message)) {
		if (this._rowIndex > 0) { // we're done
			table.complete = true;
			return new TableScraper.TitleStrategy();
		}
		
		return this;
	}
	
 	var row = this.getRow(message);
	if (!row) {
		throw new SubcommUIException("Unexpected string during row table scrape.");
	}
		
	var cells = row.split('|');
	if (!cells) {
		throw new SubcommUIException("Unexpected string during row table scrape.");
	}

	if (table.data.length <= this._rowIndex) {
		table.data.push([]);
	}
	
	for (var i = 0; i < cells.length; ++i) {
		var datum = cells[i].trim();
		table.data[this._rowIndex][i] = datum;
	}
	
	++this._rowIndex;
	return this;
};
