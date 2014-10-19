this.ymail = this.ymail || {};

(function(module) {
    $(document).ready(init);
    var settings;

    function init() {
        module.Settings.getSettings(function(updatedSettings) {
            settings = updatedSettings;

            linkCheckboxToSetting('#js-notifications', module.Settings.VISUAL_NOTIFICATIONS);
            linkCheckboxToSetting('#js-sidebar', module.Settings.SIDEBAR_RESIZE);
            linkCheckboxToSetting('#js-unread', module.Settings.INCLUDE_FOLDER_UNREAD_COUNT);
            linkCheckboxToSetting('#js-archive', module.Settings.ARCHIVE_BUTTON);
            linkSelectToSetting('#js-interval', module.Settings.NOTIFICATION_UPDATE_INTERVAL);
        });
    }

    function linkCheckboxToSetting(checkbox, setting) {
        // Set the initial value from the settings
        $(checkbox).prop('checked', settings[setting]);

        // Create listener to update value
        $(checkbox).click(function() {
            settings[setting] = $(this).is(':checked');
            module.Settings.setSettings(settings);
        });
    }

    function linkSelectToSetting(select, setting) {
        // Set the initial value from the settings
        $(select).val(settings[setting]);

        // Create listener to update value
        $(select).change(function() {
            settings[setting] = $(this).val();
            module.Settings.setSettings(settings);
        });
    }

})(this.ymail);