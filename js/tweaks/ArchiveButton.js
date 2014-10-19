this.ymail = this.ymail || {};

(function(module) {

    module.ArchiveButton = function() {
        createFolderMenu();
        addArchiveMenuButton();
        addArchiveActionButton();
    }

    /**
     * To archive, we simply click the "Archive" menu entry in the
     * move drop-down menu.
     */
    function archiveCheckedMessages() {
        var $archiveButton = $('#menu-move-folder li[data-fid="Archive"]');
        if ($archiveButton && $archiveButton.length > 0) {
            $archiveButton.click();
        } else {
            alert('In order to archive, you must create a folder with this exact name: "Archive"');
        }
    }

    function addArchiveMenuButton() {
        // Construct the pieces
        var $menuButton = $('<button></button>', {
            'id': 'btn-archive',
            'class': 'btn multimsg',
            'data-action': 'archive',
        });
        var $menuButtonIcon = $('<img></img>', {
            'src': chrome.extension.getURL('img/icon-archive.png'),
            'class': 'icon-archive-menu'
        });
        var $menuButtonText = $('<span></span>', {
            'class': 'icon-text',
            'text': 'Archive'
        });

        // Put the pieces together
        $menuButton.append($menuButtonIcon);
        $menuButton.append($menuButtonText);

        // Add it to the menu bar
        $('#pagetoolbar #btn-delete').before($menuButton);

        // Add our click event
        $('#btn-archive').click(archiveCheckedMessages);
    }

    function addArchiveActionButton() {
        // Whenever we mouse over an email
        $(document).on('mouseover', '.list-view-item-container', function(event) {
            console.log('roll-over');
            var $container = $(this);

            // If a toolbar exists
            var $toolbar = $container.find('.action-toolbar');
            if ($toolbar && $toolbar.length > 0) {

                // If we didn't add an archive button yet
                var $archiveButton = $toolbar.find('.icon-archive-action');
                if (!$archiveButton || $archiveButton.length === 0) {

                    // Build an archive button and slap it in
                    $toolbar.append($('<img></img>', {
                        'src': chrome.extension.getURL('img/icon-archive.png'),
                        'class': 'icon icon-archive-action'
                    }));

                    // Add our click event
                    $(this).find('.icon-archive-action').click(function(e) {
                        $container.find('input[type="checkbox"]').click();
                        archiveCheckedMessages();
                        e.stopPropagation();
                    });
                } else {
                    $archiveButton.css('visibility', 'visible');
                }
            }
        });

        $(document).on('mouseleave', '.list-view-item-container', function(event) {
            var $archiveButton = $(this).find('.archive-action-btn');
            if ($archiveButton && $archiveButton.length > 0) {
                $archiveButton.css('visibility', 'hidden');
            }
        });
    }

    /**
     * Implementing the functionality of the archive button relies
     * on clicking on the "Archive" entry in the move drop-down list.
     * The list isn't instantiated until it is first opened, so we
     * need to instantiate it ourselves.
     * @return {[type]}
     */
    function createFolderMenu() {
        // Make menu bar clickable, even when no messages are selected
        $('#pagetoolbar').removeClass('hasnomsg');

        // Fake a click, opening the move menu
        $('#btn-move').click(); 

        // Wait until the list is created
        var id = setInterval(function() {
            // When it is created, stop checking and click off the menu to hide it again.
            $menu = $('#menu-move-folder');
            if ($menu && $menu.length > 0) {
                clearInterval(id);
                $('body').click();
                $('#pagetoolbar').addClass('hasnomsg');
            }  
        }, 5);
    }
})(this.ymail);