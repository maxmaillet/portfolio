const express = require('express');
const path = require('path');
const acc = require('./db/MenuItemAccessor');
const {Constants} = require('./utils/Constants');
const {MenuItem} = require('./entity/MenuItem');
const app = express();

app.use(express.static(Constants.PUBLIC_FOLDER));
app.use(express.json());

//API Routing
//get all menu items
app.get('/api/menuitems', async function (request, response) {
  try {
    let data = await acc.getAllItems();
    response.status(200).json({err: null, data: data});
  } catch (err) {
    response.status(500).json({err: 'could not read data' + err, data: null});
  }
});
//add a menu item
app.post('/api/menuitems/:key(\\d{3})', async function (request, response) {
  let item;
  try {
    let menuData = request.body;
    item = new MenuItem(
      menuData.id,
      menuData.category,
      menuData.description,
      menuData.price,
      menuData.vegetarian
    );
  } catch (err) {
    response
      .status(400)
      .json({err: `MenuItem constructor error: ${err}`, data: null});
    return;
  }
  let ok;
  let exists;
  try {
    exists = await acc.itemExists(item);
    if (!exists) {
      ok = await acc.addItem(item);
      if (ok === true) {
        response.status(201).json({err: null, data: true});
      } else {
        response
          .status(409)
          .json({err: `item ${item.id} already exists`, data: null});
      }
    } else {
      response
        .status(409)
        .json({err: `item ${item.id} already exists`, data: null});
    }
  } catch (err) {
    response.status(500).json({
      err: `Add aborted: ${err}`,
      data: null,
    });
  }
});
//update a menu item
app.put('/api/menuitems/:key(\\d{3})', async function (request, response) {
  let menu;
  try {
    let menuData = request.body;
    menu = new MenuItem(
      menuData.id,
      menuData.category,
      menuData.description,
      menuData.price,
      menuData.vegetarian
    );
  } catch (err) {
    response
      .status(400)
      .json({err: `MenuItem constructor error: ${err}`, data: null});
    return;
  }

  try {
    let ok = await acc.updateItem(menu);
    if (ok) {
      response.status(200).json({err: null, data: true});
    } else {
      response
        .status(404)
        .json({err: `item ${menu.id} does not exist`, data: null});
    }
  } catch (err) {
    response.status(500).json({err: `Update aborted: ${err}`, data: null});
  }
});
//delete a menu item
app.delete('/api/menuitems/:id(\\d{3})', async function (request, response) {
  let item;
  let ok;
  try {
    item = await acc.getItemByID(Number(request.params['id']));
  } catch (err) {
    response.status(404).json({
      err: `item ${request.params['id']} does not exist: ${err}`,
      data: null,
    });
    return;
  }
  try {
    if (item !== null) {
      ok = await acc.deleteItem(item);
      if (ok === true) {
        response.status(200).json({err: null, data: true});
      } else {
        response.status(404).json({
          err: `item ${request.params['id']} does not exist`,
          data: null,
        });
      }
    } else {
      response
        .status(404)
        .json({err: `item ${request.params['id']} does not exist`, data: null});
    }
  } catch (err) {
    response.status(500).json({
      err: `Delete aborted: ${err}`,
      data: null,
    });
  }
});

//*** Invalid URLs ***//
app.get('/api/menuitems/:id(\\d{3})', function (request, response) {
  response.status(405).json({err: 'Single GETs not supported', data: null});
});
app.put('/api/menuitems', function (request, response) {
  response.status(405).json({err: 'Bulk updates not supported', data: null});
});
app.post('/api/menuitems', function (request, response) {
  response.status(405).json({err: 'Bulk inserts not supported', data: null});
});
app.delete('/api/menuitems', function (request, response) {
  response.status(405).json({err: 'Bulk deletes not supported', data: null});
});

// 404
app.use(function (request, response, next) {
  response
    .status(404)
    .sendFile(path.join(__dirname, Constants.PUBLIC_FOLDER, '404.html'));
});

// start the server - should be last step
app.listen(Constants.PORT_NUM, () =>
  console.log(`Menu app listening on port ${Constants.PORT_NUM}!`)
);
