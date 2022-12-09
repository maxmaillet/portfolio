/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import javax.json.Json;
import javax.json.JsonObject;

/**
 *
 * @author maxma
 */
public class Album {

    private int id;
    private String title;
    private String artist;
    private String genre;
    private int releaseYear;

    public Album(int id, String title, String artist, String genre, int releaseYear) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.genre = genre;
        this.releaseYear = releaseYear;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getArtist() {
        return artist;
    }

    public String getGenre() {
        return genre;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public JsonObject toJSON() {
        return Json.createObjectBuilder().add("id", String.valueOf(id)).add("title", title).add("artist", artist).add("genre", genre).add("releaseYear", String.valueOf(releaseYear)).build();
    }
}
