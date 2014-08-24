this.ymail = this.ymail || {};

(function(module) {
	
	var $inboxLink;


	module.Utils = {};

	module.Utils.isInboxActive = function() {
		// Lazily initialize
		if (!$inboxLink) {
			$inboxLink = $('#storm-listnav a').first();
		}

		return $inboxLink.attr('aria-selected') == 'true';
	}

})(this.ymail);