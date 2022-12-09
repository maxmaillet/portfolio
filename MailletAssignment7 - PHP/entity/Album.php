<?php

class Album implements JsonSerializable {

    private $id = null;
    private $title;
    private $artist;
    private $genre;
    private $releaseYear;

    /**
     * @param {number} id
     * @param {string} title
     * @param {string} artist
     * @param {string} genre
     * @param {number} releaseYear
     */
    function __construct($album) {
        if (isset($album['id'])) {
            $this->id = $album['id'];
        }
        $this->title = $album['title'];
        $this->artist = $album['artist'];
        $this->genre = $album['genre'];
        $this->releaseYear = $album['releaseYear'];
    }

    function get_id() {
        return $this->id;
    }

    function get_title() {
        return $this->title;
    }

    function get_artist() {
        return $this->artist;
    }

    function get_genre() {
        return $this->genre;
    }

    function get_releaseYear() {
        return $this->releaseYear;
    }

    function jsonSerialize() {
        return get_object_vars($this);
    }

}
