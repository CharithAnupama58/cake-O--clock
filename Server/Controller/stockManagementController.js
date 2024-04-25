import {db} from '../server.js'

export const getItemDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT s.*, i.* FROM Stock s JOIN Item i ON s.ItemId = i.ItemId WHERE s.ExpiryDate >= CURDATE() ORDER BY s.ExpiryDate ASC', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (items.length > 0) {
            return res.status(200).json({ items });
        } else {
            return res.status(404).json({ error: 'No items found' });
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getItemIds = async (req, res) => {
    try {
        const options = await new Promise((resolve, reject) => {
            db.query('SELECT itemName FROM item', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (options.length > 0) {
            return res.status(200).json({ options });
        } else {
            return res.status(404).json({ error: 'No items found' });
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getItemNameDetails = async (req, res) => {
    const itemName = req.params.selectedOption;
    console.log(req.params.selectedOption);
    console.log(req.params);
    // console.log(itemName);
    try {
        // Query to retrieve all item details from the database
        const itemNameDetails = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM item WHERE itemName = ?', [itemName], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        console.log(itemNameDetails)

        if (itemNameDetails.length > 0) {
            return res.status(200).json({ itemNameDetails });
        } else {
            return res.status(404).json({ error: 'No items found' });
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const saveStockDetails = async (req, res) => {
    const { ItemId, ExpiryDate } = req.body;
    let Quantity=parseInt(req.body.Quantity);
    console.log(req.body);
    

    if (!ItemId || !Quantity || !ExpiryDate) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
        const existingRecord = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM Stock WHERE ItemId = ? AND ExpiryDate = ?', [ItemId, ExpiryDate], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        if (!existingRecord || existingRecord.length === 0) {
            const insertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO Stock (ItemId, Quantity, ExpiryDate) VALUES (?, ?, ?)', [ItemId, Quantity, ExpiryDate], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (insertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Stock details added successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to add stock details' });
            }
        }else if (existingRecord.length > 0){
            let oldQty=existingRecord[0].Quantity;
            let newQty =Quantity + oldQty;
            Quantity=newQty;
            const updateResult = await new Promise((resolve, reject) => {
                db.query('UPDATE Stock SET Quantity = ? WHERE ItemId = ? AND ExpiryDate = ?', [Quantity, ItemId, ExpiryDate], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (updateResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Stock details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update stock details' });
            }

        }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getItemExpiryDates = async (req, res) => {
    const ItemId = req.params.ItemId;
    // console.log(req.params.selectedOption);
    console.log(req.params);
    // console.log(itemName);
    try {
        // Query to retrieve all item details from the database
        const ExpioryDates = await new Promise((resolve, reject) => {
            db.query('SELECT ExpiryDate FROM Stock WHERE ItemId = ?', [ItemId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        console.log(ExpioryDates)

        if (ExpioryDates.length > 0) {
            return res.status(200).json({ ExpioryDates });
        } else {
            return res.status(404).json({ error: 'No items found' });
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getStockQty = async (req, res) => {
    // console.log("sampath");
    // console.log(req.params);
    const {ItemId, selectedOption1} = req.params
    // const ItemId = req.params.ItemId;
    // const ExpiryDate = req.params.selectedOption1;
    console.log(ItemId);
    console.log(selectedOption1);
    // console.log(selectedOption1);
    // const ExpiryDate = '2025-06-30';
    // covert this format 2025-06-29T18:30:00.000Z to this format 2025-06-30
    const date = new Date(selectedOption1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0'); // Adding 1 to get the next day
    const ExpiryDate = `${year}-${month}-${day}`;
    console.log(ExpiryDate);

    
    // console.log(itemName);
    try {
        // Query to retrieve all item details from the database
        const StockQty = await new Promise((resolve, reject) => {
            db.query('SELECT Quantity FROM Stock WHERE ItemId = ? AND ExpiryDate = ?', [ItemId, ExpiryDate], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);

                }
            });
        });
        console.log("Wada yakooo1");
        console.log(StockQty);

        if (StockQty.length > 0) {
            return res.status(200).json( {StockQty});
        } else {
            return res.status(404).json({ error: 'No items found' });
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const releaseStock = async (req, res) => {
    const { ItemId ,selectedOption1 } = req.body;
    let Quantity=parseInt(req.body.Quantity);
    let releaseQuantity=parseInt(req.body.releaseQty);
    let dbQty=Quantity-releaseQuantity;
    console.log(req.body);

    const date = new Date(selectedOption1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const ExpiryDate = `${year}-${month}-${day}`;
    

    if (!ItemId || !ExpiryDate) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
            const updateResult = await new Promise((resolve, reject) => {
                db.query('UPDATE Stock SET Quantity = ? WHERE ItemId = ? AND ExpiryDate = ?', [dbQty, ItemId, ExpiryDate], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (updateResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Stock details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update stock details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getLatestItemId = async () => {
    try {
        const latestItem = await new Promise((resolve, reject) => {
            db.query('SELECT itemId FROM item ORDER BY itemId DESC LIMIT 1;', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results[0]) {
                        resolve(results[0].itemId); // Change 'ItemId' to 'itemId'
                    } else {
                        resolve(null);
                    }
                }
            });
        });
        console.log(latestItem);
        return latestItem;
    } catch (error) {
        throw error;
    }
};

export const generateNewItemId = async (req, res) => {
    try {
        const latestItemId = await getLatestItemId();
        console.log(latestItemId);
        if (latestItemId === null) {
            return 'I-0001'; 
        }
        const numericPart = parseInt(latestItemId.split('-')[1]);
        const nextNumericPart = numericPart + 1;
        const formattedNumericPart = String(nextNumericPart).padStart(4, '0'); 
        const newItemId = `I-${formattedNumericPart}`;
        console.log(newItemId);
        return res.status(200).json( {newItemId});
    } catch (error) {
        throw error;
    }
};

export const addItem = async (req, res) => {
    const { newItemId, newItemName, newItemMeasureUnit, newItemUnitQty } = req.body;
    // let Quantity=parseInt(req.body.Quantity);
    // let releaseQuantity=parseInt(req.body.releaseQty);
    // let dbQty=Quantity-releaseQuantity;
    console.log(req.body);
    

    if (!newItemId|| !newItemName|| !newItemMeasureUnit|| !newItemUnitQty) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO item (itemId, itemName, measureUnit, unitQty) VALUES (?, ?, ?,?)', [newItemId, newItemName, newItemMeasureUnit, newItemUnitQty], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Stock details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update stock details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteItem = async (req, res) => {
    const { ItemId } = req.body;
    console.log(req.body);

    if (!ItemId) {
        return res.status(400).json({ error: 'ItemId is required' });
    }

    try {
        const stockRecords = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM Stock WHERE ItemId = ?', [ItemId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (stockRecords.length > 0) {
            await new Promise((resolve, reject) => {
                db.query('DELETE FROM Stock WHERE ItemId = ?', [ItemId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });
        }


        const deleteResult = await new Promise((resolve, reject) => {
            db.query('DELETE FROM item WHERE itemId = ?', [ItemId], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        if (deleteResult.affectedRows >= 1) {
            return res.status(200).json({ message: 'Item deleted successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to delete item' });
        }
    } catch (error) {
        console.log('Error deleting item:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getExpiredStock = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT s.*, i.* FROM Stock s JOIN Item i ON s.ItemId = i.ItemId WHERE s.ExpiryDate <= CURDATE() ORDER BY s.ExpiryDate ASC', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        if (items.length > 0) {
            return res.status(200).json({ items });
        } else {
            return res.status(404).json({ error: 'No items found' });
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




