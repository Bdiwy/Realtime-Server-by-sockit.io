// this file for delete futures     messages && images
var socket = io.connect('http://localhost:5000');


$(document).ready(function() {
    $("#deletemessageForm").on("submit", function(event) {
        event.preventDefault();
        socket.emit('deletemessage', {
            message_id: $('#message_id').val(),
            message_value: $('#message_value').val(),
            RealTimeResponse : RealTimeResponse,
        });
    });
});







// sending id and body of the message to delete form 
document.addEventListener('click', function(event) {
    if (event.target.closest('.idfordelete')) {
        var target = event.target.closest('.idfordelete');
        if (target) {
            
            var messageValue = target.getAttribute('data-messagevalue');
            var messageId = target.getAttribute('data-messageid');

            if (message_value) {
                message_value.value = messageValue;
            } else {
                console.warn('Element with id "message_value" not found');
            }

            if (message_id) {
                message_id.value = messageId;
            } else {
                console.warn('Element with id "message_id" not found');
            }
        }
    }
});
