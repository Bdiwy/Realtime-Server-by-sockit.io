var socket = io.connect('http://localhost:5000');

var chat_id              = document.querySelector('#chat_id');
var body                 = document.querySelector('.message-input');
var chat 	             = document.querySelector('.chat-messages-list');
var boradcast 	         = document.getElementById('boradcast');
const chatHistory        = document.getElementsByClassName('chatidforrealtime');
const deleteMessageLink  = document.getElementById('deleteMessageLink');
var messageSound         = document.getElementById('messageSound');
var message_id           = document.getElementById('message_id') ;
var path                 = document.getElementById('attach-doc');
var filedata             = document.getElementById('filedata');
// Select both buttons
var sendButtons = [
    document.getElementById('sendMessageBtn'),
    document.getElementById('sendFileBtn')
];

  // Function to handle the click event
function handleClick(event) {
    let messageType = '';
    if (event.target.id === 'sendMessageBtn') {
        messageType = 'text';
    } else if (event.target.id === 'sendFileBtn') {
        messageType = 'file';
    }
                const newMessage = {
                    path : path.value ,
                    type : path.value ? 'file' : '' ,
                    id: 'msg_' + Date.now(), // Generating a unique ID for each message
                    RealTimeResponse: RealTimeResponse,
                    messagememberid: RealTimeResponse.memberid,
                    currentUserId: currentUserId,
                    chat_id: chat_id.value,
                    body: body.value,
                };
                socket.emit('message', newMessage);

            setTimeout(() => {
                // socket.emit('new_deleteMessageid', {
                //     newMessagefromdb: newMessagefromdb,
                // });
                console.log(newMessagefromdb);            
                const deleteMessageLink = document.getElementById(newMessagefromdb.content.body);
                const messageElements = document.querySelectorAll('#messageid');
                
                if (deleteMessageLink) {
                    deleteMessageLink.setAttribute('data-messagevalue', `${newMessagefromdb.content.body}`);
                    deleteMessageLink.setAttribute('data-messageid', `${newMessagefromdb.id}`);
                    // deleteMessageLink.setAttribute('id',`${newMessagefromdb.id}+${newMessagefromdb.content.body}`)
                }
                messageElements.forEach((messageElement) => {
                    messageElement.id = newMessagefromdb.id;
                });
            
                const message_id = document.querySelector('#message_id');
                if (message_id) {
                    message_id.id = newMessagefromdb.id;
                }
                }, 3000);
            if (messageType == 'file') {
                setTimeout(() => {
                    socket.emit('fileMessage', filemeessage);
                }, 3000); }
            }     

            socket.on('fileMessage', function(data) {
                var chatMessagesList = document.querySelector('.chat-messages-list');
                var linkElement = document.querySelector('#linkimage.linkimage');
                var imgElement = document.querySelector('#imgsrc.imgsrc');
                var spinnerElement = document.querySelector('#spinner-border');
                var idfordeleteList = document.querySelectorAll('.idfordelete');
                var lastIdForDelete = idfordeleteList[idfordeleteList.length - 1];
                if (linkElement && imgElement) {
                    linkElement.setAttribute('href', '/storage/' + data.content.path);
                    imgElement.setAttribute('src', '/storage/' + data.content.path);
                    if (spinnerElement) {
                        spinnerElement.style.display = 'none';
                    }
                    linkElement.style.display = 'block';
                    lastIdForDelete.setAttribute('id', 'image-' + data.content.path);
                    lastIdForDelete.setAttribute('data-messagevalue', data.content.path);
                    lastIdForDelete.setAttribute('onclick',`handleTakeingIdToDelete("image-${ data.content.path}")`);
                    lastIdForDelete.setAttribute('data-messageid', data.id);
                    linkElement.setAttribute('id', 'linkimage-' + data.content.path);
                    imgElement.setAttribute('id', 'imgsrc-' + data.content.path);
                    if (spinnerElement) {
                        spinnerElement.setAttribute('id', 'loading-' + data.content.path);
                    }
                }
                
                const deleteMessageLink = document.getElementById('image-' + data.content.path);
                const messageElements = document.querySelectorAll('#messageid');
                messageElements.forEach((messageElement) => {
                    messageElement.id = data.id;
                });
            
                const message_id = document.querySelector('#message_id');
                if (message_id) {
                    message_id.id = data.id;
                }
            
                if (deleteMessageLink) {
                    // deleteMessageLink.setAttribute('onclick', `deleteMessage(${data.id} , '${data.content.body}')`);
                    deleteMessageLink.setAttribute('data-messagevalue', `${data.content.body}`);
                    deleteMessageLink.setAttribute('data-messageid', `${data.id}`);
                }

                chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
            });
            
            sendButtons.forEach(function(btn) {
            
                if (btn) {
            
                    btn.addEventListener('click', handleClick);
            
                }
            
            });


$(document).ready(function() {
    $("#deletemessageForm").on("submit", function(event) {
        event.preventDefault();
        socket.emit('deletemessageid', {
            message_id: $('#message_id').val(),
            message_value: $('#message_value').val(),
            RealTimeResponse : RealTimeResponse,
        });
    });
});

function formatDate(date) {
    var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var day = daysOfWeek[date.getDay()];
    var hour = date.getHours() % 12 || 12;
    var period = date.getHours() >= 12 ? 'PM' : 'AM';
    var minutes = ('0' + date.getMinutes()).slice(-2);
    return day + ' ' + hour + ':' + minutes + ' ' + period;
}

// message.addEventListener('keypress',function(){
// 	socket.emit('borad',{
// 		chat_id:chat_id.value
// 	});
// });

socket.on('new_msg',function(data){
//  boradcast.innerHTML = '';
console.log(data);
    handleNewMessage(data) ;
    messageSound.play();
});



function handleNewMessage(data) {
    var currentDateTime = new Date(); 
    var formattedDateTime = formatDate(currentDateTime);
    var chatMessagesList = document.querySelector('.chat-messages-list');

    if (data.RealTimeResponse.chatId == data.chat_id && data.RealTimeResponse.chatId == chatHistory.id) {
    var isthismyMessage = data.messagememberid == RealTimeResponse.memberid ;
    var imagePath = data.RealTimeResponse.userdata;
    var senderName;
    if (data.RealTimeResponse.userType == '1') {
        senderName = `<a href="teachers/${data.RealTimeResponse.userdata.id}">${data.RealTimeResponse.userdata.first_name+' '+data.RealTimeResponse.userdata.last_name}</a>`;
    } else if (data.RealTimeResponse.userType == '2') {
        senderName = `<a href="families/${data.RealTimeResponse.userdata.id}">${data.RealTimeResponse.userdata.first_name+' '+data.RealTimeResponse.userdata.last_name}</a>`;
    } else {
        senderName = data.RealTimeResponse.userdata.name;
    }
    var hasImage = data.path.includes('.jpg') || data.path.includes('.png') || data.path.includes('.jpeg');
    var imageSrc = data.RealTimeResponse.userdata.image;
    var dropdown= `<div class="dropdown">
                                <button class="btn p-0" type="button" id="chat-header-actions"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="bx bx-dots-vertical-rounded fs-4"></i>
                                    </button>
                                <div class="dropdown-menu dropdown-menu-start" aria-labelledby="chat-header-actions">
                                    <a href="javascript:void(0)" class="idfordelete forfile" id="${data.body}" onclick="handleTakeingIdToDelete('${data.body}')" style="color:red; text-align:center;" data-bs-toggle="modal" data-bs-target="#deletemessage" data-messagevalue="someValue" data-messageid="someId"><i class="bx bx-trash-alt"></i>Delete </a>
                                </div>
                            </div>`;
                            chat.innerHTML += `
                            <li class="chat-message ${isthismyMessage ? 'chat-message-right' : 'chat-message-left' } ${data.id} ">
                                <div class="d-flex overflow-hidden">
                                    ${!isthismyMessage ? `
                                        <div class="user-avatar flex-shrink-0 ms-3">
                                            <div class="avatar avatar-sm" style="margin-top: 1px;">
                                                <a href="" target="_blank">
                                                    <img src="${imageSrc}" alt="user photo" class="rounded-circle" style="margin-left:10px;" />
                                                </a>
                                            </div>
                                        </div>` : ''}
                                    ${isthismyMessage ? dropdown :''}
                                    <div class="chat-message-wrapper flex-grow-1">
                                        <div class="chat-message-text messageid" id="messageid"  style="${isthismyMessage ? 'margin-right:20px' : 'margin-left:20px'} ;" >
                                            <div class="chat-sender-name text-muted mb-1" style="cursor: pointer;">${!isthismyMessage ? senderName : ''}</div>
                                            ${hasImage ? `
                                            <div id="hasimage">
                                            <div class="spinner-border" id="spinner-border" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                            <a href="" class="linkimage" id="linkimage" target="_blank" style="color:red; display:none;">
                                            <img src="" class="imgsrc" id="imgsrc" alt="Image" style="width: 325px; height: 225px;" />
                                            </a>
                                            </div>
                                            ` :''}
                                            
                                            
                                            <p class="mb-0  ${isthismyMessage ? 'right' : 'left'}">
                                                ${data.body}
                                            </p>
                                        </div>
                                        <div class="text-end text-muted mt-1" style="${isthismyMessage ? 'margin-right:20px' : 'margin-left:20px'} ;">
                                    ${isthismyMessage ? ' <i class="bx bx-check-double text-success"></i>' : ''}
                                    <small>${formattedDateTime}</small>
                                </div>
                                    </div>									
                                </div> 
                            </li>
                        `;
                        
                
    }
    chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
    };

socket.on('new_borad',function(data){
 boradcast.innerHTML = '<strong>'+data.username+': </strong> write message <img src="/write.gif" style="width:25px;height:20px" />';
});







// var deleteButton = document.querySelector('.idfordelete'); // Select the first element with the class 'idfordelete'
// if (deleteButton) {
    
// deleteButton.addEventListener('click', function(event) {
//     var target = event.currentTarget; // Use event.currentTarget to refer to the clicked element
//     var messageValue = target.getAttribute('data-messagevalue');
//     var messageId = target.getAttribute('data-messageid');

//     var message_value = document.getElementById('message_value');
//     var message_id = document.getElementById('message_id');

//     if (message_value) {
//         message_value.value = messageValue;
//     } else {
//         console.warn('Element with id "message_value" not found');
//     }

//     if (message_id) {
//         message_id.value = messageId;
//     } else {
//         console.warn('Element with id "message_id" not found');
//     }
// });
// }


function handleTakeingIdToDelete(id) {
    var deletedata = document.getElementById(id);
    if (deletedata) {
        var messageValue = deletedata.getAttribute('data-messagevalue');
        var messageId = deletedata.getAttribute('data-messageid');
                console.log(messageId);
                console.log(messageValue);
        var message_value = document.getElementById('message_value');
        if (message_value && message_id) {
            message_value.value = messageValue;
            message_id.value = messageId;
        } else {
            console.error("One or both of the elements are null.");
        }
    } else {
        console.error("No element found with ID:", id);
    }
}



 // var messageValue = deletedata.getAttribute('data-messagevalue');
    // var messageId = deletedata.getAttribute('data-messageid');
    // console.log(messageValue);
    // console.log(messageValue);
