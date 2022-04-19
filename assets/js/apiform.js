const selectElement = (selector) => {
	const element = document.querySelector(selector);
	if (element) return element;
	throw new Error(`Error Selector: ${selector}`);
};

const addUpdateBtn = selectElement('#addBtn');
const cancelBtn = selectElement('#cancBtn');
const usernameInput = selectElement('#username');
const apikeyInput = selectElement('#apikey');
const apisecretInput = selectElement('#apisecret');
const tableRow = selectElement('#tbody');

const cancel = () => {
	cancelBtn.style.display = 'none';
	addUpdateBtn.innerHTML = 'Add';
	usernameInput.value = '';
	apikeyInput.value = '';
	apisecretInput.value = '';
};
cancelBtn.addEventListener('click', (e) => {
	cancel();
});

addUpdateBtn.addEventListener('click', (e) => {
	e.preventDefault();
	let users = getUsersFromDb() || [];
	if (e.target.innerHTML == 'Add') {
		if (usernameInput.value == '' || apikeyInput.value == '' || apisecretInput.value == '') {
			alert('Please fill all the fields');
		} else {
			let user = {
				id: users.length + 1,
				username: usernameInput.value,
				apikey: apikeyInput.value,
				apisecret: apisecretInput.value,
			};
			users = users.concat([user]);
			if (users) localStorage.setItem('dbUser', JSON.stringify(users));
			cancel();
			setTableRows();
		}
	} else {
		update = users.map((p) =>
			p.id === idInput
				? {
						...p,
						username: usernameInput.value,
						apikey: apikeyInput.value,
						apisecret: apisecretInput.value,
				  }
				: p
		);

		localStorage.setItem('dbUser', JSON.stringify(update));
		cancel();
		setTableRows();
	}
});

const getUsersFromDb = () => {
	let users = localStorage.getItem('dbUser');
	return JSON.parse(users);
};

const setTableRows = () => {
	const tableRow = selectElement('#tbody');
	tableRow.innerHTML = '';
	let users = getUsersFromDb();
	users.map((row) => addRowToTable(tableRow, row));
};

const addRowToTable = (tbody, entries) => {
	let tr = document.createElement('TR');
	let td;
	let obj = Object.values(entries);
	obj.map((irow) => {
		td = document.createElement('TD');
		//td.innerHTML = `<input type="text" name="${irow}" id="${irow}" value="${irow}" disabled />`;
		td.innerHTML=irow;
		tr.appendChild(td);
	});
	td = document.createElement('TD');
	td.innerHTML = `<button type="button" class="editBtn btn btn-table">Edit</button>`;
	td.addEventListener('click', (e) => editRow(obj));
	tr.id = 'row' + obj[0];
	tr.appendChild(td);
	td = document.createElement('TD');
	td.innerHTML = `<button type="button" class="deleteBtn btn btn-second btn-table">Delete</button>`;
	td.addEventListener('click', (e) => deleteRow(obj));
	tr.appendChild(td);
	tbody.appendChild(tr);
};

function editRow(row) {
	const [id, username, apikey, apisecret] = row;
	idInput = id;
	usernameInput.value = username;
	apikeyInput.value = apikey;
	apisecretInput.value = apisecret;
	addUpdateBtn.innerHTML = 'Update';
	cancelBtn.style.display = 'block';
}
const deleteRow = (row) => {
	let id = row[0];
	confirm('Are you sure you want to delete this row?') && deleteRowFromDb(id);
};
const deleteRowFromDb = (id) => {
	let users = getUsersFromDb() || [];
	users = users.filter((user) => user.id !== id);
	localStorage.setItem('dbUser', JSON.stringify(users));
	setTableRows();
};
setTableRows();
