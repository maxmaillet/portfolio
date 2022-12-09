/**
 * Some useful constants
 *
 * @module Constants
 */

/** The connection URI for MongoDB. */
const DB_URI = "mongodb://localhost:27017";

/** The database name. */
const DB_NAME = "restaurantdb";

/** The collection name. */
const DB_COLLECTION = "menuitems";

/** The number of records in the collection. */
const NUM_MENUITEMS = 39;

exports.Constants = {
    DB_URI: DB_URI,
    DB_NAME: DB_NAME,
    DB_COLLECTION: DB_COLLECTION,
    NUM_MENUITEMS: NUM_MENUITEMS,
};
