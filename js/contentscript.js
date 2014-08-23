(function(){

    var $emailList;
    var $leftPanel;
    var $rightPanel;
    var oldEmailCount;
    var sidebarWidth;
    var contentMargin;

    var oldX;
    var isDragging = false;

    $(window).load(init);

    function init() {
        initExpandButton();
        initNotifications();
        initAutoRefresh();
    }

    // ===============================
    // Expanding Sidebar
    // ===============================
    function initExpandButton() {
        $leftPanel = $('#shellnavigation');
        $rightPanel = $('#shellcontent');
        sidebarWidth = $leftPanel.width();
        contentMargin = $rightPanel.css('margin-left');
        contentMargin = parseInt(contentMargin.substring(0, contentMargin.length - 2));

        $dragBar = $('<div></div>', {
            'class': 'drag-bar'
        })
        $leftPanel.append($dragBar);
        $dragBar.mousedown(function(e) {
            isDragging = true;
            oldX = e.clientX;
        });
        $(document).mouseup(function() {
            isDragging = false;
        });
        $(document).mousemove(function(e) {
            if (isDragging) {
                onExpandBarDrag(e);
            }
            oldX = e.clientX;
        });
    }

    function onExpandBarDrag(e) {
        var deltaX = e.clientX - oldX;
        expandSidebar(deltaX);
    }

    function expandSidebar(amount) {
        sidebarWidth += amount;
        $leftPanel.width(sidebarWidth);

        contentMargin += amount;
        $rightPanel.css('margin-left', contentMargin + 'px');
    }

    // ===============================
    // Notifications
    // ===============================
    function initNotifications() {
        $emailList = $('.list-view-items-page');
        oldEmailCount = getEmailCount();
        setInterval(checkNotifications, 1000);
    }

    function checkNotifications() {
        $emailList = $('.list-view-items-page');
        var emailCount = getEmailCount();

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

    // ===============================
    // AutoRefresh
    // ===============================
    function initAutoRefresh() {
        setInterval(function() {
            $('#btn-checkmail').click();
        }, 5000)
    }

})()