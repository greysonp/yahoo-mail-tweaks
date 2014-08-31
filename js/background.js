var notificationCount = 0;
var oldUnreadCount = -1;
var settings = {};
var badgeTimerId;
var prefs = {
    KEY: 'ymail',
    VISUAL_NOTIFICATIONS: 'visualNotifications',
    NOTIFICATION_UPDATE_INTERVAL: 'notificationUpdateInterval',
    SIDEBAR_RESIZE: 'sidebarResize',
    INCLUDE_FOLDER_UNREAD_COUNT: 'includeFolderUnreadCount'
}

updateCachedSettings(function() {
    // This kicks off a repeated process. Do not call again
    // without clearing the timer!
    updateBadge();

    chrome.browserAction.onClicked.addListener(function(tab) {
        navigateToMail();
    });

    chrome.notifications.onClicked.addListener(function(id) {
        navigateToMail();
    });    
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'settingsUpdate') {
        updateCachedSettings(function() {
            // Get rid of the old updat timer and start a new one
            clearTimeout(badgeTimerId);
            updateBadge();
        });
    }
});


function makeNotification(title, message) {
    updateCachedSettings(function() {
        if (!settings[prefs.VISUAL_NOTIFICATIONS]) return;    
        clearAllNotifications(function() {
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
        });
    });
    
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
            if (count > oldUnreadCount && oldUnreadCount >= 0) {
                var plural = count > 1 ? 's' : '';
                makeNotification('You Have a New Email!', 'You currently have ' + count + ' unread email' + plural + '.');
            }
            oldUnreadCount = count;
        }
        else {
            oldUnreadCount = 0;
        }
        // Have to use a timeout instead of an interval in case the interval duration
        // changes via the options
        if (settings[prefs.NOTIFICATION_UPDATE_INTERVAL] > 0) {
            badgeTimerId = setTimeout(updateBadge, settings[prefs.NOTIFICATION_UPDATE_INTERVAL]);
        }
    });
    
}

function getUnreadEmailCount(callback) {
    getMailTab(function(tab) {
        if (!tab || settings[prefs.NOTIFICATION_UPDATE_INTERVAL] < 0) {
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

function clearAllNotifications(callback) {
    chrome.notifications.getAll(function(ids) {
        var target = Object.keys(ids).length;
        var current = 0;
        if (target > 0) {
            for (id in ids) {
                chrome.notifications.clear(id, function(wasCleared) {
                    current++;
                    if (current >= target && callback) {
                        if (callback) callback();
                    }
                })
            }
        }
        else if (callback) {
            callback();
        }
    });
}

function updateCachedSettings(callback) {
    chrome.storage.sync.get(prefs.KEY, function(data) {
        // if we don't have any data saved in storage
        if (!data[prefs.KEY]) {
            // store a list of default settingss
            var defaultSettings = {};
            defaultSettings[prefs.VISUAL_NOTIFICATIONS] = true;
            defaultSettings[prefs.NOTIFICATION_UPDATE_INTERVAL] = 5000;
            defaultSettings[prefs.SIDEBAR_RESIZE] = true;
            defaultSettings[prefs.INCLUDE_FOLDER_UNREAD_COUNT] = false;
            settings = defaultSettings;

            var settingsWrapper = {};
            settingsWrapper[prefs.KEY] = defaultSettings;
            chrome.storage.sync.set(settingsWrapper, callback);

            // If we have to set the default settings, it means it's the
            // first-time launch
            chrome.tabs.create({ 'url': chrome.extension.getURL('welcome.html') });
        }
        // otherwise, we must have put defaults in already, so just update our copy
        else {
            settings = data[prefs.KEY];
            if (callback) callback();
        }
    });
}