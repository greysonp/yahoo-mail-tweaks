this.ymail = this.ymail || {};

(function(module) {

    module.Settings = {
        KEY: 'ymail',
        VISUAL_NOTIFICATIONS: 'visualNotifications',
        NOTIFICATION_UPDATE_INTERVAL: 'notificationUpdateInterval',
        SIDEBAR_RESIZE: 'sidebarResize',
        INCLUDE_FOLDER_UNREAD_COUNT: 'includeFolderUnreadCount',
        ARCHIVE_BUTTON: 'archiveButton'
    };

    var defaultSettings = {};
    defaultSettings[module.Settings.VISUAL_NOTIFICATIONS] = true;
    defaultSettings[module.Settings.NOTIFICATION_UPDATE_INTERVAL] = 5000;
    defaultSettings[module.Settings.SIDEBAR_RESIZE] = true;
    defaultSettings[module.Settings.INCLUDE_FOLDER_UNREAD_COUNT] = false;
    defaultSettings[module.Settings.ARCHIVE_BUTTON] = true;

    module.Settings.getSettings = function(callback) {
        chrome.storage.sync.get(module.Settings.KEY, function(data) {
            // if we don't have any data saved in storage
            if (!data[module.Settings.KEY]) {
                // store a list of default settings
                var settingsWrapper = {};
                settingsWrapper[module.Settings.KEY] = defaultSettings;
                chrome.storage.sync.set(settingsWrapper, function() {
                    callback(defaultSettings);
                });
            }
            // otherwise, we must have put defaults in already
            else {
                // we have to check to make sure a new setting wasn't adding (like in an update)
                var settings = data[module.Settings.KEY];
                if (Object.keys(settings).length !== Object.keys(defaultSettings).length) {
                    for (var key in defaultSettings) {
                        if (!settings.hasOwnProperty(key)) {
                            settings[key] = defaultSettings[key];
                        }
                    }
                    // store the updated settings
                    var settingsWrapper = {};
                    settingsWrapper[module.Settings.KEY] = settings;
                    chrome.storage.sync.set(settingsWrapper, function() {
                        callback(settings);
                    });
                } 
                else {
                    // no new settings, so just give back our copy
                    callback(data[module.Settings.KEY]);
                }
            }
        });
    }

    module.Settings.setSettings = function(settings, callback) {
        var settingsWrapper = {};
        settingsWrapper[module.Settings.KEY] = settings;
        chrome.storage.sync.set(settingsWrapper, function() {
            broadcastSettingsUpdate();
            if (callback) callback()
        });
    }

    function broadcastSettingsUpdate() {
        chrome.runtime.sendMessage({'action': 'settingsUpdate'});
    }
})(this.ymail);