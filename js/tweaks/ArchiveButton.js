this.ymail = this.ymail || {};

(function(module) {

    module.ArchiveButton = function() {
        createFolderMenu();
        addArchiveMenuButton();
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
        var $menuButtonIcon = $('<i></i>', { 'class': 'icon-delete'});
        var $menuButtonText = $('<span></span>', { 
            'class': 'icon-text',
            'text': 'Archive'
        });

        // Put the pieces together
        $menuButton.append($menuButtonIcon);
        $menuButton.append($menuButtonText);

        // Add it to the menu bar
        $('#pagetoolbar').append($menuButton);

        // Add our click event
        $('#btn-archive').click(archiveCheckedMessages);
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