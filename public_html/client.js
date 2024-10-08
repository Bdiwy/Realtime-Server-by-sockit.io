var socket = io.connect('http://localhost:5000');
var realtimeMessage      = null;
var messageType          = null;
var isthismyMessage      = null;
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
var userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
localStorage.setItem('userTimezone', userTimezone);
var counter = 1 ;
function generateTempId() {
    counter ++;
    return 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000)+counter;
}
var tempid = generateTempId();


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
        path: path.value,
        type: path.value ? 'file' : '',
        RealTimeResponse: RealTimeResponse,
        messagememberid: RealTimeResponse.memberid,
        currentUserId: currentUserId,
        chat_id: chat_id.value,
        body: body.value,
        tempid:tempid
    };

    socket.emit('message', newMessage);

    if (messageType !== 'file') {
        const checkMessageInterval = setInterval(() => {
            if (newMessagefromdb != null) { // Adjust the condition as needed
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

                clearInterval(checkMessageInterval);
            }
        }, 100); 
    }

    if (messageType === 'file') {
        const checkFileMessageInterval = setInterval(() => {
            if (filemeessage!=null) {
                socket.emit('fileMessage', filemeessage);
                clearInterval(checkFileMessageInterval); 
            }
        }, 100);
    }
}

            socket.on('fileMessage', function(data) {
                console.log('sssheroool');
                console.log(data);
                
                realtimeMessage.innerText=data.content.body;
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
                    if (isthismyMessage == true) {  
                    lastIdForDelete.setAttribute('id', 'image-' + data.content.path);
                    lastIdForDelete.setAttribute('data-messagevalue', data.content.path);
                    lastIdForDelete.setAttribute('onclick',`handleTakeingIdToDelete("image-${ data.content.path}")`);
                    lastIdForDelete.setAttribute('data-messageid', data.tempid);
                    }
                    linkElement.setAttribute('id', 'linkimage-' + data.content.path);
                    imgElement.setAttribute('id', 'imgsrc-' + data.content.path);
                    if (spinnerElement) {
                        spinnerElement.setAttribute('id', 'loading-' + data.content.path);
                    }
                }
                
                const deleteMessageLink = document.getElementById('image-' + data.content.path);
                const messageElements = document.querySelectorAll('#messageid');
                messageElements.forEach((messageElement) => {
                    messageElement.tempid = data.tempid;
                });
            
                const message_id = document.querySelector('#message_id');
                if (message_id) {
                    message_id.tempid = data.tempid;
                }
            
                if (deleteMessageLink) {
                    // deleteMessageLink.setAttribute('onclick', `deleteMessage(${data.id} , '${data.content.body}')`);
                    deleteMessageLink.setAttribute('data-messagevalue', `${data.content.body}`);
                    deleteMessageLink.setAttribute('data-messageid', `${data.tempid}`);
                }

                chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
            });
            
            sendButtons.forEach(function(btn) {
            
                if (btn) {
            
                    btn.addEventListener('click', handleClick);
            
                }
            
            });

document.addEventListener('DOMContentLoaded', function() {
    var realtimeForm = document.getElementById('deletemessageFormRealtime');
    var normalForm = document.getElementById('deletemessageForm');

    function handleFormSubmission(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            var messageId = form.querySelector('input[name="message_id"]').value;
            var messageValue = form.querySelector('input[name="message_value"]').value;
            socket.emit('deletemessageid', {
                message_id: messageId,
                message_value: messageValue,
                RealTimeResponse: RealTimeResponse,
            });
        });
    }

    handleFormSubmission(realtimeForm);
    handleFormSubmission(normalForm);
});


socket.on('new_deletemessageid', function(data) {
    var messageElement = document.getElementsByClassName(data.message_id);
    console.log(messageElement); 
    console.log(data.message_id);
    
    
    var messageBodyfortext = messageElement[0].querySelector('.messagebodyfordelete');
    var messageBodyforfile = messageElement[0].querySelector('a');

    if (messageBodyfortext) {
        messageBodyfortext.innerHTML = `<span style="color: red;">&#x2716; this message was deleted</span>`;
    }else{
        messageBodyforfile.innerHTML = `<span style="color: red;">&#x2716; this message was deleted</span>`;
    }
});
function formatDate(date, timezone) {
    if (timezone) {
        var options = {
            timeZone: timezone,
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        var dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
        var parts = dateTimeFormat.formatToParts(date);
        var day = parts.find(part => part.type === 'weekday').value;
        var hour = parts.find(part => part.type === 'hour').value;
        var minutes = parts.find(part => part.type === 'minute').value;
        var period = parts.find(part => part.type === 'dayPeriod').value;
        minutes = ('0' + minutes).slice(-2);
        return day + ' ' + hour + ':' + minutes + ' ' + period;
    } else {
        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var day = daysOfWeek[date.getDay()];
        var hour = date.getHours() % 12 || 12;
        var period = date.getHours() >= 12 ? 'PM' : 'AM';
        var minutes = ('0' + date.getMinutes()).slice(-2);
        return day + ' ' + hour + ':' + minutes + ' ' + period;
    }
}

function messageSeen(chatId, messageDetails, user_id, user_type) {
    let url;    
    switch (user_type) {
        case 0:
            url = appUrl + '/management/message-seen';
            break;
        case 1:
            url = appUrl + '/teacher/message-seen';
            break;
        case 2:
            url = appUrl + '/student/message-seen';
            break;
        default:
            console.error('Invalid user type');
            return; 
    }

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chatId: chatId,
            messageDetails: messageDetails,
            user_id: user_id,
            user_type: user_type,
            _token: _token 
        })
    };

    fetch(url, fetchOptions)
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Request failed: ${response.status}\n${text}`);
            });
        }
        return response.json();
    })
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));
    .then(data => {
        // Handle the data as needed, or remove this if not required.
    })
    .catch(error => {
        // Handle the error silently, without logging to the console.
        // You can perform other actions here if needed, like displaying a user-friendly message.
    });
}


socket.on('new_msg',function(data){
    realtimeMessage=document.getElementById('gr-'+data.chat_id);
    tempid = generateTempId();
    handleNewMessage(data) ;
    messageSound.play();
    messageSeen(currentGroup,data,currentUserId,user_type);

    if ( messageType != 'file' ) {
    // handelmessageid();
    realtimeMessage.innerText=data.body;
    }
});

// function handelmessageid(){

//     setTimeout(() => {

//     socket.emit('sharingId',{
//             newMessagefromdb:newMessagefromdb
//     });

//     }, 3000);
//     if (isthismyMessage != true) {
        
//     socket.on('sharingId',function (data){

//     const deleteMessageLink = document.getElementById(data.newMessagefromdb.content.body);
//     const messageElements = document.querySelectorAll('#messageid');
    
//     if (deleteMessageLink) {
//         deleteMessageLink.setAttribute('data-messagevalue', `${data.newMessagefromdb.content.body}`);
//         deleteMessageLink.setAttribute('data-messageid', `${data.newMessagefromdb.id}`);
//         // deleteMessageLink.setAttribute('id',`${newMessagefromdb.id}+${newMessagefromdb.content.body}`)
//     }
//     messageElements.forEach((messageElement) => {
//         messageElement.id = data.newMessagefromdb.id;
//     });

//     const message_id = document.querySelector('#message_id');
//     if (message_id) {
//         message_id.id = newMessagefromdb.id;
//     }
// });
// }

// }



function handleNewMessage(data) {
    var currentDateTime = new Date(); 
    var userTimezone = timezone == null ? localStorage.getItem('userTimezone') : timezone;
    var formattedDateTime = formatDate(currentDateTime, userTimezone);
    var chatMessagesList = document.querySelector('.chat-messages-list');
    if (data.RealTimeResponse.chatId == data.chat_id && data.RealTimeResponse.chatId == chatHistory.id) {
    isthismyMessage = data.messagememberid == RealTimeResponse.memberid && user_type == data.RealTimeResponse.userType && data.RealTimeResponse.userdata.id == currentUserId ;
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
                                    <a href="javascript:void(0)" class="idfordelete forfile" onclick="handleTakeingIdToDelete('${data.tempid}')" style="color:red; text-align:center;" data-bs-toggle="modal" data-bs-target="#deletemessage" data-messagevalue="${data.body}" data-messageid="${data.tempid}"><i class="bx bx-trash-alt"></i>Delete </a>
                                </div>
                            </div>`;
                            chat.innerHTML += `
                            <li class="chat-message ${isthismyMessage ? 'chat-message-right' : 'chat-message-left' } ${data.tempid}">
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
                                            <div id="${data.tempid}">
                                            <div class="spinner-border" id="spinner-border" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                            <a href="" class="linkimage" id="linkimage" target="_blank" style="color:red; display:none;">
                                            <img src="" class="imgsrc" id="imgsrc" alt="Image" style="width: 325px; height: 225px;" />
                                            </a>
                                            </div>
                                            ` :''}
                                            
                                            
                                            <p class="mb-0 messagebodyfordelete ${isthismyMessage ? 'right' : 'left'}" dir="auto">
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



function handleTakeingIdToDelete(id) {
    var deletedata = document.getElementById(id);
    if (deletedata) {
        var messageValue = deletedata.getAttribute('data-messagevalue');
        var messageId = deletedata.getAttribute('data-messageid');
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
