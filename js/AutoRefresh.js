this.ymail = this.ymail || {};

(function(module) {
	
	module.AutoRefresh = function() {
        setInterval(function() {
        	if (module.Utils.isInboxActive()) {
        		$('#btn-checkmail').click();	
        	}
        }, 5000);
    }

})(this.ymail);