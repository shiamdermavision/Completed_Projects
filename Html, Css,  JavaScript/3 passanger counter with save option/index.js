let saveEl = document.getElementById("savee");
let countEl = document.getElementById("countt");
let count = 0;

function increment() {
	count = count + 1;
	countEl.textContent = count;
}

function save() {
	let countStr = count + " - ";
	saveEl.textContent = saveEl.textContent + countStr;
	countEl.textContent = 0;
	count = 0;
}
