this.ymail = this.ymail || {};

(function(module) {
    
    module.NonInboxUnreadCount = function() {
        updateUnread();
        setInterval(updateUnread, 1000);
    }

    function updateUnread() {

        var folderCount = getFolderCount();
        var inboxCount = getInboxCount();

        setTitleUnreadCount(inboxCount + folderCount);
    }

    function getFolderCount() {
        var countText = $('#folder-count').text();
        var count = 0;
        if (countText.length > 2) {
            count = parseInt(countText.match(/\(([0-9]+)\)/)[1]);
        }
        return count;
    }

    function getInboxCount() {
        var countText = $('#inbox-count').text();
        var count = 0;
        if (countText.length > 2) {
            count = parseInt(countText.match(/\(([0-9]+)\)/)[1]);
        }
        return count;
    }

    function setTitleUnreadCount(count) {
        var title = $(document).prop('title');
        if (title.charAt(0) == '(') {
            if (count == 0) {
                $(document).prop('title', title.replace(/\(([0-9]+) unread\) - /, ''));
            } 
            else {
                var newTitle = title.replace(/\(([0-9]+) unread\)/, '(' + count + ' unread)');
                $(document).prop('title', newTitle);    
            }
            
        }
        else if (count > 0) {
            $(document).prop('title', '(' + count + ' unread) - ' + title);   
        }
    }

})(this.ymail);