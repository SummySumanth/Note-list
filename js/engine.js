let $addNewMessage = $('#add-message');
let $saveMessageModal = $('#modal-overlay-new-message');
let $saveMessageCloseBtn = $('#save-modal-close-btn');
let $saveMessageSaveBtn = $('#save-modal-save-btn');

let $successMessageModal = $('#modal-overlay-success-message');
let $successModalOkayButton = $('#success-modal-okay-btn');
let $successModalCloseButton = $('#success-modal-close-btn');

let $messagePreviewContainer $('#message-preview-container');

let db;
let request = window.indexedDB.open("notePad2", 3);

request.onsuccess = (event) => {
	db = event.target.result;
	console.log("Database loaded successfully\n");
};

request.onerror = (event) => {
	console.log("Error in loading database\n");
	console.log(request);
};

request.onupgradeneeded = (event) => {
	db = event.target.result;
	console.log("Database has been initialized successfully\n");
	db.createObjectStore("messageTable",{keyPath:"messageID", autoIncrement:true});
};

let showMessage = (message) =>{
	showSuccessMessageModal(message);
}

let addNewMessage = (name, subject, message, color, timeStamp) => {
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	let request = objectStore.add({Name: name, Subject: subject, Message: message, Color: color, Timestamp: timeStamp});

	request.onsuccess = (event) => {
		console.log('added to db successfully');
	}
}

let getAllMessagePreview = () =>{
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	let request = objectStore.openCursor();
	$messagePreviewContainer.empty();

	request.onsuccess = function (event) {
		var	cursor = event.target.result;

		if(cursor){
			console.log(cursor.value);
			$('#tableBody').prepend(`<tr>
				<td>${cursor.value.itemId}</td>
				<td>${cursor.value.stuName}</td>
				<td>${cursor.value.stuSub}</td>
				<td>
					<input type="button" id="${cursor.value.itemId}" class="edit" value="Edit">
					<input type="button" id="${cursor.value.itemId}" class="delete" value="Delete">
				</td>
				</tr>`);
			cursor.continue()
		}


	}
}

//######################   Event Listeners ############################

//New message modal
let showNewMessageModal = () => {
	$saveMessageModal
		.css('display', 'block')
		.removeClass('animated fadeOut')
		.addClass('animated fadeIn');
}

let hideNewMessageModal = () => {
	$saveMessageModal
		.removeClass('animated fadeIn')
		.addClass('animated fadeOut');
}

$addNewMessage.on('click', () =>{
	showNewMessageModal();
});

$saveMessageCloseBtn.on('click', () =>{
	hideNewMessageModal();
	setTimeout(() =>{
		$saveMessageModal.css('display', 'none');
	}, 500);
});

$saveMessageSaveBtn.on('click', () =>{
	let currentdate = new Date();
	let $subject = $('#save-modal-subject').val();
	let $message  = $('#save-modal-message-area').val();
	let $color  = $('#save-modal-color-select').val();
	let $name  = $('#save-modal-name').val();
	let time = [{
					"date": currentdate.getDate(),
					"month": currentdate.getMonth(),
					"year": currentdate.getFullYear(),
					"hour": currentdate.getHours(),
					"minute": currentdate.getMinutes(),
					"second": currentdate.getSeconds(),
				}];
	addNewMessage($name, $subject, $message, $color, time);
	hideNewMessageModal();
	setTimeout(() =>{
		$saveMessageModal.css('display', 'none');
		showMessage(' Message has been added successfully');
	}, 1000);
});

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