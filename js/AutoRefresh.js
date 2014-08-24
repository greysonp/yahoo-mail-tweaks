this.ymail = this.ymail || {};

(function(module) {
	
	var $inboxLink;

	module.AutoRefresh = function() {
		$inboxLink = $('#storm-listnav a').first();
        setInterval(function() {
        	if ($inboxLink.attr('aria-selected') == 'true') {
        		$('#btn-checkmail').click();	
        	}
        }, 5000);
    }

})(this.ymail);