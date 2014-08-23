this.ymail = this.ymail || {};

(function(module) {
	
	module.AutoRefresh = function() {
        setInterval(function() {
            $('#btn-checkmail').click();
        }, 5000)
    }

})(this.ymail);