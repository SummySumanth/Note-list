let $addNewMessage = $('#add-message');
let $saveMessageModal = $('#modal-overlay-new-message');
let $saveMessageCloseBtn = $('#save-modal-close-btn');
let $saveMessageSaveBtn = $('#save-modal-save-btn');

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
	alert(message);
}

let addNewMessage = (name, subject, message, color, timeStamp) => {
	let transaction = db.transaction(["messageTable"],"readwrite");
	let objectStore = transaction.objectStore("messageTable");
	let request = objectStore.add({Name: name, Subject: subject, Message: message, Color: color, Timestamp: timeStamp});

	request.onsuccess = (event) => {
		console.log('added to db successfully');
	}
}

//######################   Event Listeners ############################

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
	}, 500);
});