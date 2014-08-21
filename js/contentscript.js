(function(){

    var EXPAND_DISTANCE = 200;

    $(document).ready(init);

    function init() {
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

})()