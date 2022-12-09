const HEADERS = ['ID', 'CATEGORY', 'DESCRIPTION', 'PRICE', 'VEGETARIAN'];

window.onload = function () {
  document
    .querySelector('#menuitems')
    .addEventListener('click', handleTableClick);
  document.querySelector('#deleteButton').addEventListener('click', doDelete);
  document.querySelector('#updateButton').addEventListener('click', doUpdate);
  document.querySelector('#addButton').addEventListener('click', checkAdd);
  doGet();
};

//send get request
function doGet() {
  let url = 'http://localhost:8000/api/menuitems';
  fetch(url)
    .then((res) => res.json())
    .then((res) => buildTable(res.data))
    .catch((err) => alert(err));
}
//send push request
function doAdd() {
  let id = Number(document.querySelector('#idInput').value);
  let category = document.querySelector('#categoryInput').value;
  let description = document.querySelector('#descriptionInput').value;
  let price = Number(document.querySelector('#priceInput').value);
  let vegetarian = document.querySelector('#vegetarianInput').checked;
  let url = 'http://localhost:8000/api/menuitems/' + id;
  let options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      id: id,
      category: category,
      description: description,
      price: price,
      vegetarian: vegetarian,
    }),
  };
  console.log(options);

  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      res.data ? alert('Add successful') : alert(res.err + 'data err');
      doGet();
    })
    .catch((err) => alert(err + 'url err' + data));
}
//send put request
function doUpdate() {
  let id = Number(document.querySelector('#idInput').value);
  let category = document.querySelector('#categoryInput').value;
  let description = document.querySelector('#descriptionInput').value;
  let price = Number(document.querySelector('#priceInput').value);
  let vegetarian = document.querySelector('#vegetarianInput').checked;
  let url = 'http://localhost:8000/api/menuitems/' + id;
  let options = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      id: id,
      category: category,
      description: description,
      price: price,
      vegetarian: vegetarian,
    }),
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      res.data ? alert('Update successful') : alert(res.err);
      doGet();
    })
    .catch((err) => alert(err));
}
//send delete reqest
function doDelete() {
  let id = Number(document.querySelector('#idInput').value);
  let url = 'http://localhost:8000/api/menuitems/' + id;
  options = {method: 'DELETE'};

  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      res.data ? alert('Delete successful') : alert(res.err);
      doGet();
    })
    .catch((err) => alert(err));
}

//build table
function buildTable(data) {
  let out = document.querySelector('#menuitems');
  let table = document.createElement('table');
  let thead = table.createTHead();
  let head = thead.insertRow(0);
  let body = table.createTBody();
  table.classList.add('table');
  for (let i = 0; i < HEADERS.length; i++) {
    let th = head.insertCell(i);
    th.innerText = HEADERS[i];
  }
  for (let i = 0; i < data.length; i++) {
    row = body.insertRow(i);
    let id = row.insertCell(0);
    let category = row.insertCell(1);
    let description = row.insertCell(2);
    let price = row.insertCell(3);
    let vegetarian = row.insertCell(4);
    id.textContent = data[i].id;
    category.textContent = data[i].category;
    description.textContent = data[i].description;
    price.textContent = data[i].price;
    vegetarian.textContent = data[i].vegetarian;
  }
  out.innerHTML = null;
  out.appendChild(table);
}

function handleTableClick(evt) {
  let elem = evt.target;
  let row = elem.parentElement;
  let body = row.parentElement;
  if (body.nodeName !== 'TBODY') return;
  let tr = document.querySelectorAll('tr');
  for (let i = 0; i < tr.length; i++) {
    tr[i].classList.remove('selected');
  }
  row.classList.add('selected');
  document.getElementById('idInput').disabled = true;
  populateInputPanel();
}

function populateInputPanel() {
  let row = document.querySelector('.selected');
  let td = row.querySelectorAll('td');
  let id = Number(td[0].textContent);
  let category = td[1].textContent;
  let description = td[2].textContent;
  let price = Number(td[3].textContent);
  let vegetarian = td[4].textContent === 'true' ? true : false;
  document.querySelector('#idInput').value = id;
  document.querySelector('#categoryInput').value = category;
  document.querySelector('#descriptionInput').value = description;
  document.querySelector('#priceInput').value = price;
  document.querySelector('#vegetarianInput').checked = vegetarian;
}

function clearInputPanel() {
  document.querySelector('#idInput').value = null;
  document.querySelector('#categoryInput').value = '';
  document.querySelector('#descriptionInput').value = '';
  document.querySelector('#priceInput').value = null;
  document.querySelector('#vegetarianInput').checked = false;
}

function checkAdd() {
  if (document.getElementById('idInput').disabled) {
    document.getElementById('idInput').disabled = false;
    clearInputPanel();
  } else {
    let id = Number(document.querySelector('#idInput').value);
    let url = 'http://localhost:8000/api/menuitems';
    fetch(url)
      .then((res) => res.json())
      .then((res) => res.data)
      .then((res) => {
        let match = res.filter((item) => item.id === id);
        if (match.length < 1) {
          doAdd();
        } else {
          clearInputPanel();
          alert('An item with that ID already exists');
        }
      })
      .catch((err) => alert(err));
  }
}
