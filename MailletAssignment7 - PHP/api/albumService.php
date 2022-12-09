<?php

require __DIR__ . '/../db/AlbumAccessor.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    doGet();
} else if ($method === "POST") {
    doPost();
} else if ($method === "DELETE") {
    doDelete();
} else if ($method === "PUT") {
    doPut();
}

function doGet() {
    $accessor = new AlbumAccessor();
    echo $accessor->getAllAlbums();
}

function doPost() {
    $body = file_get_contents('php://input');
    $album = new Album(json_decode($body, true));
    $accessor = new AlbumAccessor();
    echo $accessor->addAlbum($album);
}

function doDelete() {
    $body = file_get_contents('php://input');
    $album = new Album(json_decode($body, true));
    $accessor = new AlbumAccessor();
    echo $accessor->deleteAlbum($album);
}

function doPut() {
    $body = file_get_contents('php://input');
    $album = new Album(json_decode($body, true));
    $accessor = new AlbumAccessor();
    echo $accessor->updateAlbum($album);
}
