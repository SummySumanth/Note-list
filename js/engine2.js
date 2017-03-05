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
		getAllNames ();
	}
}

function getAllNames(){
	let transaction = db.transaction(["nameTbl"],"readwrite");
	let objectStore = transaction.objectStore("nameTbl");
	let request = objectStore.openCursor();
	request.onsuccess = function (event) {
		var	cursor = event.target.result;
		if(cursor){
			console.log(cursor.value);
			cursor.continue()
		}
	}
}