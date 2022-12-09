window.onload = function () {
    document.querySelector('#albums').addEventListener('click', handleTableClick);
    document.querySelector('#addButton').addEventListener('click', addAlbum);
    document.querySelector('#updateButton').addEventListener('click', updateAlbum);
    document.querySelector('#deleteButton').addEventListener('click', deleteAlbum);
    document.querySelector('#clearButton').addEventListener('click', clear);
    loadAlbums();
};
function loadAlbums() {
    let url = 'albums';
    fetch(url)
            .then(res => res.json())
            .then(res => buildTable(res))
            .catch(err => console.log(err));
}

function buildTable(albums) {
    const HEADERS = ['Title', 'Artist', 'Genre', 'Release Year'];
    let out = document.querySelector('#albums');
    let table = document.createElement('table');
    let thead = table.createTHead();
    let head = thead.insertRow(0);
    let body = table.createTBody();
    table.classList.add('table');
    head.classList.add('fw-bold');
    for (let i = 0; i < HEADERS.length; i++) {
        let th = head.insertCell(i);
        th.innerText = HEADERS[i];
    }
    for (let i = 0; i < albums.length; i++) {
        let album = albums[i];
        let row = body.insertRow();
        let title = row.insertCell(0);
        let artist = row.insertCell(1);
        let genre = row.insertCell(2);
        let releaseYear = row.insertCell(3);
        title.textContent = album.title;
        artist.textContent = album.artist;
        genre.textContent = album.genre;
        releaseYear.textContent = album.releaseYear;
        row.id = album.id;
        releaseYear.classList.add("text-end");
    }
    out.innerHTML = null;
    out.appendChild(table);
}

function handleTableClick(evt) {
    let elem = evt.target;
    let row = elem.parentElement;
    let body = row.parentElement;
    if (body.nodeName === 'TBODY') {
        clearSelected();
        row.classList.add('selected');
        let values = row.querySelectorAll('td');
        document.getElementById('id').setAttribute('value', row.id);
        document.getElementById('titleInput').value = values[0].textContent;
        document.getElementById('artistInput').value = values[1].textContent;
        document.getElementById('genreInput').value = values[2].textContent;
        document.getElementById('releaseYearInput').value = values[3].textContent;
    }
    document.getElementById('addButton').setAttribute('disabled', 'disabled');
    document.getElementById('updateButton').removeAttribute('disabled');
    document.getElementById('deleteButton').removeAttribute('disabled');
}

function addAlbum() {
    let title = document.getElementById('titleInput').value;
    let artist = document.getElementById('artistInput').value;
    let genre = document.getElementById('genreInput').value;
    let releaseYear = document.getElementById('releaseYearInput').value;
    let url = 'albums/add';
    let options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: title,
            artist: artist,
            genre: genre,
            releaseYear: releaseYear
        })
    };
    fetch(url, options)
            .then(res => {
                console.log(res);
                if (res == 1) {
                    alert('Add successful');
                } else if (res == 0) {
                    alert('Add failed');
                } else {
                    alert('Server Error');
                }
            })
            .then(res => {
                clear();
                loadAlbums();
            });
}

function updateAlbum() {
    let id = document.getElementById('id').value;
    let title = document.getElementById('titleInput').value;
    let artist = document.getElementById('artistInput').value;
    let genre = document.getElementById('genreInput').value;
    let releaseYear = document.getElementById('releaseYearInput').value;
    let url = 'albums/update';
    let options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: id,
            title: title,
            artist: artist,
            genre: genre,
            releaseYear: releaseYear
        })
    };
    fetch(url, options)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res == 1) {
                    alert('Update successful');
                } else if (res == 0) {
                    alert('Update failed');
                } else {
                    alert('Server Error');
                }
            })
            .then(res => {
                clear();
                loadAlbums();
            });
}

function deleteAlbum() {
    let id = document.getElementById('id').value;
    let url = `albums/delete/${id}`;
    let options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    };
    fetch(url, options)
            .then(res => {
                console.log(res);
                if (res == 1) {
                    alert('Delete successful');
                } else if (res == 0) {
                    alert('Delete failed');
                } else {
                    alert('Server Error');
                }
            }).catch(err => alert(err))
            .finally(res => {
                clear();
                loadAlbums();
            });
}

function clear() {
    document.getElementById('id').setAttribute('value', null);
    document.getElementById('titleInput').value = null;
    document.getElementById('artistInput').value = null;
    document.getElementById('genreInput').value = null;
    document.getElementById('releaseYearInput').value = null;
    document.getElementById('addButton').removeAttribute('disabled');
    document.getElementById('updateButton').setAttribute('disabled', 'disabled');
    document.getElementById('deleteButton').setAttribute('disabled', 'disabled');
    clearSelected();
}

function clearSelected() {
    let selected = document.querySelector('.selected');
    if (selected !== null) {
        selected.classList.remove('selected');
    }
}