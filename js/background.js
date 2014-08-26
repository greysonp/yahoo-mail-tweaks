var notificationCount = 0;
var oldUnreadCount = 0;

updateBadge();
setInterval(updateBadge, 5000);

chrome.browserAction.onClicked.addListener(function(tab) {
    navigateToMail();
});

chrome.notifications.onClicked.addListener(function(id) {
    navigateToMail();
});

function makeNotification(title, message) {
    chrome.notifications.create('newEmail' + notificationCount, {
        'type': 'basic',
        'iconUrl': chrome.extension.getURL('img/icon-32x32.png'),
        'title': title,
        'message': message,
        'isClickable': true
    }, function(id) {
        // Don't need to do anything
    });
    notificationCount++;
    // Better safe than sorry
    if (notificationCount > 2000000000) {
        notificationCount = 0;
    }
}

function getMailTab(callback) {
    chrome.tabs.query({
        'url': 'https://*.mail.yahoo.com/*'
    }, function(tabs) {
        if (tabs.length == 0) {
            callback(null);
        }
        else {
            callback(tabs[0]);
        }
    });
}

function navigateToMail() {
    getMailTab(function(tab) {
        // If a mail tab isn't open, create one
        if (!tab) {
            chrome.tabs.create({ 
                'url': 'https://mail.yahoo.com/'
            });
        }
        // Otherwise, navigate to the first instance of an open mail tab
        else {
            chrome.tabs.update(tab.id, { 'active': true });
            chrome.windows.update(tab.windowId, { 'focused': true });
        }
    });
}

function updateBadge() {
    getUnreadEmailCount(function(count) {
        chrome.browserAction.setBadgeText({
            'text': count + ''
        });
        if (count.length > 0) {
            count = parseInt(count);
            if (count > oldUnreadCount) {
                var plural = count > 1 ? 's' : '';
                makeNotification('You Have a New Email!', 'You currently have ' + count + ' unread email' + plural + '.');
            }
            oldUnreadCount = count;
        }
    });
    
}

function getUnreadEmailCount(callback) {
    getMailTab(function(tab) {
        if (!tab) {
            callback('');
        }
        else {
            var unreadCount = tab.title.match(/\(([0-9]+) unread\)/);
            if (!unreadCount) {
                unreadCount = 0;
            }
            else {
                unreadCount = unreadCount[1];
            }
            callback(unreadCount);
        }
    });
}