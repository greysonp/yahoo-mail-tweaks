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
        $emailList = $('.list-view-items-page');
        var emailCount = getEmailCount();

        console.log("oldEmailCount: " + oldEmailCount + " | new: " + emailCount);
        // If there's only one new email
        if (emailCount === oldEmailCount + 1) {
            createNotification('You Have a New Email!', 'Go check it out!');
        }
        // If there's more than one new email
        else if (emailCount > oldEmailCount) {
            var numNew = emailCount - oldEmailCount;
            createNotification('You Have ' + numNew + ' New Emails', 'Go check them out!');
        }
        oldEmailCount = emailCount;
    }

    function getEmailCount() {
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