chrome.browserAction.onClicked.addListener(function(tab) {
    navigateToMail();
});

chrome.notifications.onClicked.addListener(function(id) {
    navigateToMail();
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('Received a message!');
        if (request.action == 'notification') {
            var params = request.params;
            makeNotification(params.title, params.message)
        }
    }
);

function makeNotification(title, message) {
    chrome.notifications.create('id', {
        'type': 'basic',
        'iconUrl': chrome.extension.getURL('img/icon-32x32.png'),
        'title': title,
        'message': message,
        'isClickable': true
    }, function(id) {
        console.log(id);
    });
}

function navigateToMail() {
    chrome.tabs.query({
        'url': 'https://*.mail.yahoo.com/*'
    }, function(tabs) {
        // If a mail tab isn't open, create one
        if (tabs.length == 0) {
            chrome.tabs.create({ 
                'url': 'https://mail.yahoo.com/'
            });
        }
        // Otherwise, navigate to the first instance of an open mail tab
        else {
            chrome.tabs.update(tabs[0].id, { 'active': true });
            chrome.windows.update(tabs[0].windowId, { 'focused': true });
        }
    });
}