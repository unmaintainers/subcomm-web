var TableScraperObserver = function() { /* interface */ };

/**
 * Called by the subject TableScraper when it has scraped an entire table.
 * @param ScrapedTale table
 * @param TableScraper scraper
 */
TableScraperObserver.prototype.notifyTable = function(table, scraper) { /* abstract */ };