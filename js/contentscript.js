this.ymail = this.ymail || null;

(function(module){

    $(window).load(init);

    function init() {
        module.Settings.getSettings(function(settings) {
            if (settings[module.Settings.SIDEBAR_RESIZE]) {
                module.SidebarResize();
            }
            if (settings[module.Settings.INCLUDE_FOLDER_UNREAD_COUNT]) {
                module.NonInboxUnreadCount();   
            }
            module.ArchiveButton();
        });
    }
})(this.ymail);