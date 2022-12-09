const assert = require("chai").assert;
const { ConnectionManager } = require("../db/ConnectionManager");
const dbbuilder = require("../db/DatabaseBuilder");
const acc = require("../db/MenuItemAccessor");
const { MenuItem } = require("../entity/MenuItem");
const { Constants } = require("../utils/Constants");
let testItems;

describe("MenuItemAccessor Tests", function () {
    // Before running any of the tests, ensure that the database
    // has been restored to its original state.
    before("Setup", async function () {
        testItems = await defineTestItems();
        await ConnectionManager.getConnection(); // open a connection to be shared
        await dbbuilder.rebuild();
        console.log("<<setup: Database restored to original state.>>");
    });

    after("Teardown", async function () {
        await ConnectionManager.closeConnection(); // close the shared connection
    });

    describe("Normal Behaviour: operations that should succeed", function () {
        it("get all items returns all the items in the database", async function () {
            let items = await acc.getAllItems();
            assert.equal(items.length, Constants.NUM_MENUITEMS);
            assert.isTrue(
                items[0] instanceof MenuItem && items[38] instanceof MenuItem,
                "items should be instances of MenuItem"
            );
        });

        it("itemExists returns true for an item that exists", async function () {
            let result = await acc.itemExists(testItems.goodItem);
            assert.isTrue(result);
        });

        it("itemExists returns false for an item that does not exist", async function () {
            let result = await acc.itemExists(testItems.badItem);
            assert.isFalse(result);
        });

        it("getItemByID returns correct item if it exists", async function () {
            let item = await acc.getItemByID(testItems.goodItem.id);
            assert.isTrue(
                item instanceof MenuItem,
                "item should be instance of MenuItem"
            );
            assert.equal(item.id, testItems.goodItem.id);
        });

        it("addItem successfully adds an item to the database and returns true", async function () {
            let result = await acc.addItem(testItems.itemToAdd);
            assert.isTrue(result);
            assert.isTrue(await acc.itemExists(testItems.itemToAdd));
        });

        it("deleteItem successfully deletes an item from the database and returns true", async function () {
            let result = await acc.deleteItem(testItems.itemToDelete);
            assert.isTrue(result);
            assert.isFalse(await acc.itemExists(testItems.itemToDelete));
        });

        it("updateItem successfully updates an item in the database and returns true", async function () {
            let result = await acc.updateItem(testItems.itemToUpdate);
            assert.isTrue(result);
            let updatedItem = await acc.getItemByID(testItems.itemToUpdate.id);
            assert.equal(testItems.itemToUpdate.category, updatedItem.category);
            assert.equal(
                testItems.itemToUpdate.description,
                updatedItem.description
            );
            assert.equal(testItems.itemToUpdate.price, updatedItem.price);
            assert.equal(
                testItems.itemToUpdate.vegetarian,
                updatedItem.vegetarian
            );
        });
    });

    describe("Errors: operations that should fail", function () {
        it("getItemByID returns null if item does not exist", async function () {
            let item = await acc.getItemByID(testItems.badItem.id);
            assert.equal(item, null);
        });

        it("addItem returns false, and does not change the database, if item already exists", async function () {
            let result = await acc.addItem(testItems.goodItem);
            let exists = await acc.itemExists(testItems.goodItem);
            assert.isFalse(result);
            assert.isTrue(exists);
        });

        it("deleteItem returns false and does not change the database, if item does not exist", async function () {
            let result = await acc.deleteItem(testItems.badItem);
            let exists = await acc.itemExists(testItems.badItem);
            assert.isFalse(result);
            assert.isFalse(exists);
        });

        it("updateItem returns false and does not change the database, if item does not exist", async function () {
            let result = await acc.updateItem(testItems.badItem);
            let exists = await acc.itemExists(testItems.badItem);
            assert.isFalse(result);
            assert.isFalse(exists);
        });
    });
});

///*** HELPERS ***///
async function defineTestItems() {
    return {
        goodItem: new MenuItem(107, "", "", 0, false),
        badItem: new MenuItem(777, "", "", 0, false),
        itemToAdd: new MenuItem(888, "ENT", "poutine", 11, false),
        itemToDelete: new MenuItem(202, "", "", 30, false),
        itemToUpdate: new MenuItem(303, "ENT", "after update", 11, false),
    };
}
