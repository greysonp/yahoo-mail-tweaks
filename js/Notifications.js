this.ymail = this.ymail || {};

(function(module) {
    
    var $emailList;
    var oldEmailCount;

    module.Notifications = function() {
        $emailList = $('.list-view-items-page');
        oldEmailCount = getEmailCount();
        setInterval(checkNotifications, 1000);
    }

    function checkNotifications() {
        // If we don't do this, then switching folders would change the email count
        // and incorrectly trigger a notfication
        if (!module.Utils.isInboxActive()) {
            return;
        }

        var emailCount = getEmailCount();
        if (emailCount > oldEmailCount) {
            createNotification('You Have a New Email!', 'Go check it out!');
        }
        oldEmailCount = emailCount;
    }

    function getEmailCount() {
        // We have to re-query to ensure we get the updated child count
        $emailList = $('.list-view-items-page');
        if ($emailList) {
            return $emailList.children().length;
        }
        return 0;
    }

    function createNotification(title, message) {
        chrome.runtime.sendMessage({ 
            'action': 'notification',
            'params': {
                'title': title,
                'message': message
            }
        });
    }

})(this.ymail)