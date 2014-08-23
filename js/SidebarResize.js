this.ymail = this.ymail || {};

(function(module) {

    var $leftPanel;
    var $rightPanel;

    var oldX;
    var isDragging = false;

    var sidebarWidth;
    var contentMargin;
    
    module.SidebarResize = function() {
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

})(this.ymail);