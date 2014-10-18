this.ymail = this.ymail || {};

(function(module) {
    
    module.AutoRefresh = function() {
        setInterval(function() {
            // If any checkboxes are selected, auto-refreshing will deselect them
            var numChecked = $('.list-view-items-page input:checked').length;
            if (module.Utils.isInboxActive() && numChecked === 0) {
                $('#btn-checkmail').click();    
            }
        }, 5000);
    }

})(this.ymail);