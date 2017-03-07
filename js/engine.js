let $addNewMessage = $('#add-message');
let $saveMessageModal = $('#modal-overlay-new-message');
let $saveMessageCloseBtn = $('#save-modal-close-btn');
let $saveMessageSaveBtn = $('#save-modal-save-btn');

let $successMessageModal = $('#modal-overlay-success-message');
let $successModalOkayButton = $('#success-modal-okay-btn');
let $successModalCloseButton = $('#success-modal-close-btn');

let $viewMessageModal = $('#modal-overlay-view-message');
let $viewMessageModalCloseBtn = $('#view-modal-close-btn');

let $editMessageModal = $('#modal-overlay-edit-message');
let $editMessageModalCloseBtn = $('#edit-modal-close-btn');
let $editMessageModalSaveBtn = $('#edit-modal-save-btn');

let $deleteMessageModal = $('#modal-overlay-delete-message');
let $deleteMessageModalCloseBtn = $('#delete-modal-close-btn');
let $deleteMessageModalNopeBtn = $('#delete-modal-nope-btn');
let $deleteMessageModalYupBtn = $('#delete-modal-yup-btn');

let $messagePreviewContainer = $('#message-preview-container');

let animationFlowDown = 'slideInDown';
let animationFlowUp = 'slideInUp';

let db;
let request = window.indexedDB.open("notePad2", 3);

request.onsuccess = (event) => {
	db = event.target.result;
};

request.onerror = (event) => {
	console.log("Error in loading database\n");
	console.log(request);
};

request.onupgradeneeded = (event) => {
	db = event.target.result;
	db.createObjectStore("messageTable",{keyPath:"messageID", autoIncrement:true});
};

let format = (value) => (value < 10) ? `0${value}` : value;

let showMessage = (message) =>{
	showSuccessMessageModal(message);
}

let addNewMessage = (name, subject, message, color, timeStamp) => {
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	let request = objectStore.add({Name: name, Subject: subject, Message: message, Color: color, Timestamp: timeStamp});

	request.onsuccess = (event) => {
	}
}

let editMessage = (msgID, name, subject, message, color, timeStamp) => {
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	let editedObj = {messageID: msgID, Name: name, Subject: subject, Message: message, Color: color, Timestamp: timeStamp}	
	var request = objectStore.put(editedObj);
	request.onsuccess = function(event){
	}
}

let deleteMessage = (msgID) =>{
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	var request = objectStore.delete(msgID);
	request.onsuccess = function(event){
	}
}

let constructMessagePreview = (animationDirection, messageID, name, subject, message, color, timeStamp) =>{
	let preview = `<div class="row custom-row">
						<div class="small-1 medium-2 columns">
						</div>
						<div  id="${messageID}" class="small-10 medium-8 columns custom-columns message-container animated ${animationDirection} ${color}">
							<div class="row message-preview">
								<div class="small-4 columns text-left">
									<i class="material-icons label-icon">turned_in_not</i><span class="msg-subject" >${subject}</span>
								</div>
								<div class="small-4 columns">
										<i class="material-icons label-icon" >
							date_range
						</i> <span class="msg-date-time" >${timeStamp.date} - ${timeStamp.month} - ${timeStamp.year} <i class="material-icons label-icon">
							access_time
						</i> ${timeStamp.hour} : ${timeStamp.minute} : ${timeStamp.second}</span>
								</div>
								<div class="small-4 columns text-right">
									<i id="open-message-btn-${messageID}" data-messageID="${messageID}" class="material-icons msg-prv-controllers open-message-btn btn">open_in_new</i>
									<i id="edit-message-btn-${messageID}" data-messageID="${messageID}" class="material-icons msg-prv-controllers edit-message-btn btn">mode_edit</i>
									<i id="delete-message-btn-${messageID}" data-messageID="${messageID}" class="material-icons msg-prv-controllers delete-message-btn btn">delete</i>
								</div>
							</div>
						</div>
						<div class="small-1 medium-2 columns">	
						</div>
					</div>`
	return preview;
};

let getAllMessagePreview = (animationDirection) =>{
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	let request = objectStore.openCursor();
	
	$messagePreviewContainer.empty();
	
	request.onsuccess = function (event) {
		var	cursor = event.target.result;
		
		if(cursor){
			let messageID = cursor.value.messageID;
			let name = cursor.value.Name;
			let subject = cursor.value.Subject;
			let message = cursor.value.Message;
			let color = cursor.value.Color;
			let time = cursor.value.Timestamp[0];
			let messagePreview = constructMessagePreview(animationDirection, messageID, name, subject, message, color, time);
			$('#message-preview-container').prepend(messagePreview);
			cursor.continue();
			$('#open-message-btn-' + messageID).on('click', () =>{
				viewMessage(messageID);
			});

			$('#edit-message-btn-' + messageID).on('click', () =>{
				showEditMessageModal(messageID);
			});

			$('#delete-message-btn-' + messageID).on('click', () =>{
				showDeleteMessageModal(messageID);
			});
		}
	}
}

//######################   Event Listeners ############################

//New message modal

let clearNewMessageModalContents = () =>{
	$('#save-modal-subject').val("");
	$('#save-modal-message-area').val("");
	$('#save-modal-color-select').val("White");
	$('#save-modal-name').val("");
}

let showNewMessageModal = () => {
	clearNewMessageModalContents();
	$saveMessageModal
		.css('display', 'block')
		.removeClass('animated fadeOut')
		.addClass('animated fadeIn');
}

let hideNewMessageModal = () => {
	$saveMessageModal
		.removeClass('animated fadeIn')
		.addClass('animated fadeOut');
	getAllMessagePreview(animationFlowDown);
}

let hideNewMessageModalCloseBtn = () => {
	$saveMessageModal
		.removeClass('animated fadeIn')
		.addClass('animated fadeOut');
}

$addNewMessage.on('click', () =>{
	showNewMessageModal();
});

$saveMessageCloseBtn.on('click', () =>{
	hideNewMessageModalCloseBtn();
	setTimeout(() =>{
		$saveMessageModal.css('display', 'none');
	}, 500);
});

$saveMessageSaveBtn.on('click', () =>{
	let currentdate = new Date();
	let $subject = $('#save-modal-subject').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let $message  = $('#save-modal-message-area').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let $color  = $('#save-modal-color-select').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let $name  = $('#save-modal-name').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let time = [{
					"date": format(currentdate.getDate()),
					"month": format(currentdate.getMonth()),
					"year": format(currentdate.getFullYear()),
					"hour": format(currentdate.getHours()),
					"minute": format(currentdate.getMinutes()),
					"second": format(currentdate.getSeconds()),
				}];
	addNewMessage($name, $subject, $message, $color, time);
	hideNewMessageModal();
	setTimeout(() =>{
		$saveMessageModal.css('display', 'none');
		showMessage(' Message has been added successfully');
	}, 1000);
});

//Edit Message Modal
let setEditMessageModalFields = (messageID) =>{
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	let request = objectStore.get(messageID);

	let subject;
	let message;
	let author;
	let time;

	request.onsuccess = function(event){
		if(request.result) {
			$('#modal-overlay-edit-message').data("messageID", request.result.messageID);
			$('#edit-modal-subject').val(request.result.Subject);
			$('#edit-modal-color-select').val(request.result.Color);
			$('#edit-modal-message-area').val(request.result.Message);
			$('#edit-modal-name').val(request.result.Name);
		}
	}
}
let showEditMessageModal = (messageID) =>{
	setEditMessageModalFields(messageID);
	$editMessageModal
		.css('display', 'block')
		.removeClass('animated fadeOut')
		.addClass('animated fadeIn');
}
let hideEditMessageModal = () =>{
	$editMessageModal
		.removeClass('animated fadeIn')
		.addClass('animated fadeOut');
}

$editMessageModalSaveBtn.on('click', () =>{
	let currentdate = new Date();
	let $subject = $('#edit-modal-subject').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let $message  = $('#edit-modal-message-area').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let $color  = $('#edit-modal-color-select').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let $name  = $('#edit-modal-name').val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
	let $msgID = $('#modal-overlay-edit-message').data("messageID");
	let time = [{
					"date": currentdate.getDate(),
					"month": currentdate.getMonth(),
					"year": currentdate.getFullYear(),
					"hour": currentdate.getHours(),
					"minute": currentdate.getMinutes(),
					"second": currentdate.getSeconds(),
				}];
	editMessage($msgID, $name, $subject, $message, $color, time);
	hideEditMessageModal();
	getAllMessagePreview(animationFlowDown);
	setTimeout(() =>{
		$editMessageModal.css('display', 'none');
		showMessage(' Message has been modified successfully');
	}, 1000);
})

$editMessageModalCloseBtn.on('click', () =>{
	hideEditMessageModal();
	setTimeout(() =>{
		$editMessageModal.css('display', 'none');
	}, 500);
});

//Delete message modal
let showDeleteMessageModal = (messageID) =>{
	$deleteMessageModal.data("messageID", messageID);
	$deleteMessageModal
		.css('display', 'block')
		.removeClass('animated fadeOut')
		.addClass('animated fadeIn');
}
let hideDeleteMessageModal = () =>{
	$deleteMessageModal
		.removeClass('animated fadeIn')
		.addClass('animated fadeOut');
}



$deleteMessageModalYupBtn.on('click', () =>{
	let $msgID = $('#modal-overlay-delete-message').data("messageID");
	deleteMessage($msgID);
	hideDeleteMessageModal();
	getAllMessagePreview(animationFlowUp);
	setTimeout(() =>{
		$deleteMessageModal.css('display', 'none');
		showMessage(' Message has been successfully deleted');
	}, 1000);
})

$deleteMessageModalCloseBtn.on('click', () =>{
	hideDeleteMessageModal();
	setTimeout(() =>{
		$deleteMessageModal.css('display', 'none');
	}, 500);
});

$deleteMessageModalNopeBtn.on('click', () =>{
	hideDeleteMessageModal();
	setTimeout(() =>{
		$deleteMessageModal.css('display', 'none');
	}, 500);
});


//#######################################################
// Success Message Modal
let showSuccessMessageModal = (message) =>{
	$('#success-modal-message').html(message);
	$successMessageModal
		.css('display', 'block')
		.removeClass('animated fadeOut')
		.addClass('animated fadeIn');
}

let hideSuccessMessageModal = () => {
	$successMessageModal
		.removeClass('animated fadeIn')
		.addClass('animated fadeOut');
}

$successModalOkayButton.on('click', () =>{
	hideSuccessMessageModal();
	setTimeout(() =>{
		$successMessageModal.css('display', 'none');
	}, 500);
});

$successModalCloseButton.on('click', () =>{
	hideSuccessMessageModal();
	setTimeout(() =>{
		$successMessageModal.css('display', 'none');
	}, 500);
});

let setViewMessageValues = (subject, message, author, timeStamp) =>{
	$('#view-modal-Subject-content').html(subject);
	$('#view-modal-Subject-message').html(message);
	$('#view-modal-Subject-author').html(author);
	$('#view-modal-current-time').html(`<i class="material-icons label-icon" style="color: #999999">
							date_range
						</i> ${timeStamp.date} - ${timeStamp.month} - ${timeStamp.year} <i class="material-icons label-icon" style="color: #999999">
							access_time
						</i> ${timeStamp.hour} : ${timeStamp.minute} : ${timeStamp.second}`);
		
}

//Show Message
let viewMessage = (messageID) =>{
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	let request = objectStore.get(messageID);

	let subject;
	let message;
	let author;
	let time;

	request.onsuccess = function(event){
		if(request.result) {
			subject = request.result.Subject;
			message = request.result.Message;
			author = request.result.Name;
			time = request.result.Timestamp[0];
			setViewMessageValues(subject, message, author, time);
		}
	}

	$viewMessageModal
		.css('display', 'block')
		.removeClass('animated fadeOut')
		.addClass('animated fadeIn');
}

let closeMessage = () =>{
	$viewMessageModal
		.removeClass('animated fadeIn')
		.addClass('animated fadeOut');
}


$viewMessageModalCloseBtn.on('click', () =>{
	closeMessage();
	setTimeout(() =>{
		$viewMessageModal.css('display', 'none');
	}, 500);
});

//get all messages
$( document ).on('ready',() =>{
	setTimeout(()=>{
		getAllMessagePreview(animationFlowDown);
	},1000);
})

let $timer = ('#save-modal-current-time');



setInterval(() =>{
	let currentTime = new Date();

	let date =	format(currentTime.getDate());
	let month =	format(currentTime.getMonth());
	let	year = format(currentTime.getFullYear());

	let	hour = format(currentTime.getHours());
	let	minutes = format(currentTime.getMinutes());
	let seconds = format(currentTime.getSeconds());

	let message = `<i class="material-icons label-icon" style="color: #999999">
			date_range
		</i> ${date} - ${month} - ${year} 

		<i class="material-icons label-icon" style="color: #999999">
			access_time
		</i> ${hour} : ${minutes} : ${seconds}`;

	$('#save-modal-current-time').html(message);
	$('#edit-modal-current-time').html(message);
}, 1000);