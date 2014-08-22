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
        'iconUrl': chrome.extension.getURL('img/icon.png'),
        'title': title,
        'message': message
    }, function(id) {
        console.log(id);
    });
}