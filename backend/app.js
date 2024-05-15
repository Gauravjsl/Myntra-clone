const express = require('express');
const bodyParser = require('body-parser');
const {getStoredItems, storeItems} = require('./data/items');
const app = express();
app.use(bodyParser.json());
const PORT = 8080;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.get('/items', async(req, res) => {
  const storedItems = await getStoredItems();
  await new Promise((resolve, reject) => setTimeout(()=>resolve(), 2000))
  res.json({items: storedItems});
  })

  app.get('/items/:id', async(req, res) => {
    const storedItems = await getStoredItems();
    const item = storedItems.find((item)=> item.id === req.params.id);
    req.json({item})
  })


  app.post('/items', async(req, res) => {
    const existingItems = await getStoredItems();
    const itemData = req.body;
    const newItem = {
        ...itemData,
        id: Math.random().toString(),
    }
    const updatedItems = [newItem, ...existingItems];
    await storeItems(updatedItems);
    res.status(201).json({message: 'Stored new item', item: newItem});
  })


  app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
  });