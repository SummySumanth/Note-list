var db;
var request = window.indexedDB.open("notepad1", 2);

request.onsuccess = function (event){
	db = event.target.result;
	console.log("Database loaded successfully");
};

request.onerror = function (event){

};

request.onupgradeneeded = function (event){
	db = event.target.result;
	console.log("DB initialized / created");
	db.createObjectStore("nameTbl",{keyPath:"itemId", autoIncrement:true});
};

function addName() {
	let n = $('#name').val();
	let s = $('#subject').val();
	let transaction = db.transaction(["nameTbl"],"readwrite");
	let objectStore = transaction.objectStore("nameTbl");
	let request = objectStore.add({stuName:n, stuSub:s});
	request.onsuccess = function(event){
		var result = event.target.result;
		console.log(result);
		setTimeout(function(){
			getAllNames ();
		},1000);		
	}
}

function getAllNames(){
	let transaction = db.transaction(["nameTbl"],"readwrite");
	let objectStore = transaction.objectStore("nameTbl");
	let request = objectStore.openCursor();
	$('#tableBody').empty();
	request.onsuccess = function (event) {
		var	cursor = event.target.result;

		if(cursor){
			console.log(cursor.value);
			$('#tableBody').append(`<tr>
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

function editNameSubject(){
	let transaction = db.transaction(["nameTbl"],"readwrite");
	let objectStore = transaction.objectStore("nameTbl");
	
	let editedObj = {stuName:n, stuSub:s, itemID:id}

	// id ID exists, it will modify the entry, if not it will edit the entry
	var request = objectStore.put(editedObj);
	request.onsuccess = function(event){
		var obj = event.target.result;
		console.log(obj);
	}
}

function deleteName(){
	let transaction = db.transaction(["nameTbl"],"readwrite");
	let objectStore = transaction.objectStore("nameTbl");
	
	let editedObj = {stuName:n, stuSub:s, itemID:id}

	// id ID exists, it will modify the entry, if not it will edit the entry
	var request = objectStore.delete(id);
	request.onsuccess = function(event){
		var obj = event.target.result;
		console.log(obj);
	}
}