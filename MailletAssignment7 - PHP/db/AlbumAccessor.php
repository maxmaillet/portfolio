<?php

require 'dbconnector.php';
require __DIR__ . '/../entity/Album.php';

class AlbumAccessor {

    function getAllAlbums() {
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("select * from Albums");
            $stmt->execute();
            $albums = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $results = [];
            foreach ($albums as $album) {
                array_push($results, new Album($album));
            }
            echo json_encode($results);
        } catch (PDOException $e) {
            echo "*** ERROR: " . $e->getMessage();
        } finally {
            if ($stmt) {
                $stmt->closeCursor();
            }
        }
    }

    function addAlbum($album) {
        $success;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare('insert into Albums(title, artist, genre, releaseYear) values(?, ?, ?, ?)');
            $title = $album->get_title();
            $artist = $album->get_artist();
            $genre = $album->get_genre();
            $releaseYear = $album->get_releaseYear();
            $stmt->bindParam(1, $title);
            $stmt->bindParam(2, $artist);
            $stmt->bindParam(3, $genre);
            $stmt->bindParam(4, $releaseYear);
            $stmt->execute();
            $success = $stmt->rowCount();
        } catch (PDOException $e) {
            $success = 0;
        } finally {
            if ($stmt) {
                $stmt->closeCursor();
            }
        }
        echo $success;
    }

    function updateAlbum($album) {
        $success;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare('update Albums set title = ?, artist = ?, genre = ?, releaseYear = ? where id = ?');
            $id = $album->get_id();
            $title = $album->get_title();
            $artist = $album->get_artist();
            $genre = $album->get_genre();
            $releaseYear = $album->get_releaseYear();
            $stmt->bindParam(1, $title);
            $stmt->bindParam(2, $artist);
            $stmt->bindParam(3, $genre);
            $stmt->bindParam(4, $releaseYear);
            $stmt->bindParam(5, $id);
            $stmt->execute();
            $success = $stmt->rowCount();
        } catch (PDOException $e) {
            $success = 0;
        } finally {
            if ($stmt) {
                $stmt->closeCursor();
            }
        }
        echo $success;
    }

    function deleteAlbum($album) {
        $success;
        try {
            $conn = connect_db();
            $stmt = $conn->prepare("delete from Albums where id = ?");
            $id = $album->get_id();
            $stmt->bindParam(1, $id);
            $stmt->execute();
            $success = $stmt->rowCount();
        } catch (PDOException $e) {
            $success = 0;
        } finally {
            if ($stmt) {
                $stmt->closeCursor();
            }
        }

        echo $success;
    }

}
