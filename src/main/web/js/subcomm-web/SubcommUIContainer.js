var SubcommUIContainer = function(containerId) {
	this.id = containerId;
	this.session = null;
	this.applet = document.applets[0];
	this._nextSessionId = 1; 
};

SubcommUIContainer._registrations = {};

SubcommUIContainer.register = function(containerId) {
	SubcommUIContainer._registrations[containerId] = new SubcommUIContainer(containerId);
};

SubcommUIContainer.get = function(containerId) {
	if (SubcommUIContainer._registrations[containerId] === undefined)
		SubcommUIContainer.register(containerId);
	
	return SubcommUIContainer._registrations[containerId];
};

SubcommUIContainer.getByDiv = function(containerDiv) {
	var containerEl = $($(containerDiv).closest('.subcommContainer')[0]);
	return SubcommUIContainer.get(SubcommUIContainer.get(containerEl.attr('id')));
};

SubcommUIContainer.prototype.nextSessionId = function() {
	return this._nextSessionId++;
};

SubcommUIContainer.prototype.getJavaClient = function() {
	return ( this.session != null ? this.session.getJavaClient() : null );
};

SubcommUIContainer.prototype.changeTab = function(tabClassname) {
	var tabDiv = $('.subcommTabMenu div[data-classname="' + tabClassname + '"]')[0];
	$('.subcommTabMenu div').removeClass('subcommTabCurrent');
	$(tabDiv).addClass('subcommTabCurrent');
	$('.subcommTab').hide();
	$('.' + tabClassname).each(function(index, element) {
		$(this).show();
		$('.subcommHistory').each(function(index, element) {
			if ($(this).attr('data-autoscroll') !== 'false') {
				$(this).scrollTop($(this)[0].scrollHeight);
			}
		});
	});	
};
