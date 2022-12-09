const { MongoClient } = require("mongodb");
const { Constants } = require("../utils/Constants");

/**
 * Share a single database connection.
 */
class ConnectionManager {
    static #conn = null;

    /**
     * DO NOT CALL THE CONSTRUCTOR - USE STATIC METHODS
     */
    constructor() {}

    /**
     * Returns the current connection, or creates it if this is the first access.
     *
     * @throws {Error} if database error occurs
     * @returns a Mongo database connection
     */
    static async getConnection() {
        if (this.#conn === null) {
            this.#conn = await MongoClient.connect(Constants.DB_URI);
            console.log("Created new database connection.");
        }
        return this.#conn;
    }

    /**
     * Closes the active connection.
     *
     * @throws {Error} if database error occurs
     */
    static async closeConnection() {
        if (this.#conn !== null) {
            await this.#conn.close();
            console.log("Closed active database connection.");
        }
    }
} // end class

exports.ConnectionManager = ConnectionManager;
