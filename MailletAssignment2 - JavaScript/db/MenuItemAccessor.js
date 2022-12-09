/**
 * Mongo Data Accessor
 *
 * @module MenuItemAccessor
 */
const {Constants} = require('../utils/Constants');
const {MenuItem} = require('../entity/MenuItem');
const {ConnectionManager} = require('./ConnectionManager');

exports.getAllItems = getAllItems;
exports.getItemByID = getItemByID;
exports.itemExists = itemExists;
exports.deleteItem = deleteItem;
exports.addItem = addItem;
exports.updateItem = updateItem;

/**
 * Gets all the items.
 *
 * @example
 * let items = await getAllItems();
 * @throws {MongoError} if a database error occurs
 * @returns {Promise<array<MenuItem>>} resolves to: an array of MenuItem objects (empty if there are none)
 */
async function getAllItems() {
  try {
    let client = await ConnectionManager.getConnection();
    let collection = client
      .db(Constants.DB_NAME)
      .collection(Constants.DB_COLLECTION);
    let objects = await collection.find({}).toArray();

    // 'objects' is an array of objects,
    // but they're not instances of MenuItem.
    let items = [];
    objects.forEach((obj) => {
      let temp = new MenuItem(
        obj.id,
        obj.category,
        obj.description,
        obj.price,
        obj.vegetarian
      );
      items.push(temp);
    });

    return items;
  } catch (err) {
    // re-throw error so Mocha can see it
    throw new Error('Could not complete getAllItems!\n' + err.message);
  }
} // end function

/**
 * Determines if a MenuItem object exists in the database.
 *
 * @param {MenuItem} - the object to find
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item exists; false otherwise
 */
async function itemExists(item) {
  try {
    let items = await getAllItems();
    let exists = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {
        exists = true;
        break;
      }
    }
    return exists;
  } catch (err) {
    throw new Error(`Could not complete itemExists!\n${err.message}`);
  }
} // end function

/**
 * Gets the object with the specified ID.
 *
 * @param {number} itemID - the ID of the object to return
 * @throws {Error} if a database error occurs
 * @returns {Promise<MenuItem>} resolves to: the matching object; or null if the object doesn't exist
 */
async function getItemByID(itemID) {
  try {
    let items = await getAllItems();
    let item = null;
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemID) {
        item = items[i];
        break;
      }
    }
    return item;
  } catch (err) {
    throw new Error(`Could not complete getItemByID!\n${err.message}`);
  }
} // end function

/**
 * Adds the specified item (if it doesn't already exist).
 *
 * @param {MenuItem} item - the item to add
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was added; false if the item already exists.
 */
async function addItem(item) {
  try {
    let exists = await itemExists(item);
    if (!exists) {
      let client = await ConnectionManager.getConnection();
      let collection = client
        .db(Constants.DB_NAME)
        .collection(Constants.DB_COLLECTION);
      await collection.insertOne(item.toJSON());
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(`Could not complete addItem!\n${err.message}`);
  }
} // end function

/**
 * Deletes the specified item (if it exists).
 *
 * @param {MenuItem} item - the item to delete
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was deleted; false if the item doesn't exist.
 */
async function deleteItem(item) {
  try {
    let exists = await itemExists(item);
    if (exists) {
      let client = await ConnectionManager.getConnection();
      let collection = client
        .db(Constants.DB_NAME)
        .collection(Constants.DB_COLLECTION);
      let result = await collection.deleteOne({id: item.id});
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(`Could not complete deleteItem!\n${err.message}`);
  }
} // end function

/**
 * Updates the specified item (if it exists).
 *
 * @param {MenuItem} item - the item to update
 * @throws {Error} if a database error occurs
 * @returns {Promise<boolean>} resolves to: true if the item was updated; false if the item doesn't exist.
 */
async function updateItem(item) {
  try {
    let exists = await itemExists(item);
    if (exists) {
      let client = await ConnectionManager.getConnection();
      let collection = client
        .db(Constants.DB_NAME)
        .collection(Constants.DB_COLLECTION);
      let result = await collection.updateOne(
        {
          id: item.id,
        },
        {
          $set: item.toJSON(),
        }
      );
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(`Could not complete updateItem!\n${err.message}`);
  }
} // end function
