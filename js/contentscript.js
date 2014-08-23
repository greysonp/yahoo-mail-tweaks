this.ymail = this.ymail || null;

(function(module){

    $(window).load(init);

    function init() {
        module.Notifications();
        module.SidebarResize();
        module.AutoRefresh();
    }
    
})(this.ymail);