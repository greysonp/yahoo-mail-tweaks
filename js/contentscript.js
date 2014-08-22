(function(){

    var EXPAND_DISTANCE = 200;

    var $emailList;
    var oldEmailCount;

    $(document).ready(init);

    function init() {
        initExpandButton();
        initNotifications();
        initAutoRefresh();
    }

    // ===============================
    // Expanding Sidebar
    // ===============================
    function initExpandButton() {
        $('.nav-5').removeClass('nav-5').addClass('nav-6');
        var li = $('<li></li>', {
            'role': 'tab',
            'class': 'nav-item nav-item-messenger mim-minimized',
        });
        var link = $('<a></a>');
        var img = $('<img></img>', {
            'src': chrome.extension.getURL('img/expand-icon.png'),
            'class': 'icon',
            'style': 'width: 20px; height: 20px;'
        });
        link.append(img);
        li.append(link);
        $('#nav ul').append(li);

        $(li).click(onExpandToggleClick);
    }

    function onExpandToggleClick() {
        if (!$(this).data('expanded')) {
            $(this).data('expanded', true);
            $(this).addClass('reflect-y');
            expandSidebar();
        }
        else {
            $(this).data('expanded', false);
            $(this).removeClass('reflect-y');
            shrinkSidebar()
        }
    }

    function expandSidebar() {
        var $leftPanel = $('#shellnavigation');
        var $rightPanel = $('#shellcontent');

        $leftPanel.width($leftPanel.width() + EXPAND_DISTANCE);
        $rightPanel.css('margin-left', EXPAND_DISTANCE + 'px');
    }

    function shrinkSidebar() {
        var $leftPanel = $('#shellnavigation');
        var $rightPanel = $('#shellcontent');

        $leftPanel.width($leftPanel.width() - EXPAND_DISTANCE);
        $rightPanel.css('margin-left', '0');
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