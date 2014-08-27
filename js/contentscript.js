this.ymail = this.ymail || null;

(function(module){

    $(window).load(init);

    function init() {
        module.SidebarResize();
        module.NonInboxUnreadCount();
    }
    
})(this.ymail);