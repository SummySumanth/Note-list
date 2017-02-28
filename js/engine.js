window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const noteData = [
   { id: "01", name: "Gopal K Varma", subject: "Hello World", message: "welcome to db" },
   { id: "02", name: "summy", subject: "Hello Universe", message: "welcome to cse" }
];


var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function(event) {
	console.log("error: ");
};

request.onsuccess = function(event) {
	db = request.result;
	console.log("success: "+ db);
};

request.onupgradeneeded = function(event) {
	var db = event.target.result;
	var objectStore = db.createObjectStore("employee", {keyPath: "id"});

	for (var i in employeeData) {
		objectStore.add(employeeData[i]);
	}
}

function add() {
   var request = db.transaction(["note"], "readwrite")
   .objectStore("note")
   .add({ id: "01", name: "prasad", age: 24, email: "prasad@tutorialspoint.com" });
   
   request.onsuccess = function(event) {
      alert("Prasad has been added to your database.");
   };
   
   request.onerror = function(event) {
      alert("Unable to add data\r\nPrasad is already exist in your database! ");
   }
}