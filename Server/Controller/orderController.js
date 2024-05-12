import {db} from '../server.js'

export const getOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT o.orderId,o.name,o.contact,o.quantity,o.pickupDate,o.status,i.imgLink AS imageLink,o.cakeText FROM Orders o JOIN cake c ON o.cakeId = c.CID JOIN image i ON c.imgID = i.imgID WHERE o.pickupDate = DATE_ADD(CURDATE(), INTERVAL 4 DAY) AND o.status != "Deleted" AND o.status != "Released" AND o.status != "Completed"', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        // console.log({items});
        if (items.length > 0) {
            return res.status(200).json({ items });
            
        } else {
            return res.status(404).json({items});
            console.log('No items found');
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT o.orderId, o.name, o.contact, o.quantity, o.pickupDate, o.status, i.imgLink AS imageLink, o.cakeText FROM orders o JOIN cake c ON o.cakeId = c.CID JOIN image i ON c.imgID = i.imgID  WHERE o.pickupDate >= CURDATE() AND o.status != "Deleted" AND o.status != "Released" AND o.status != "Completed" ORDER BY orderId ASC', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        // console.log({items});
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
export const updateOrderStatus = async (req, res) => {
    const { orderId} = req.body;
    const status="Preparing"
    console.log(status);
    console.log(orderId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('UPDATE orders SET status = "Preparing" WHERE orderId = ?', [orderId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Order details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllTemporaryOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM tempOrders', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        // console.log({items});
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

async function generateNewOrderId() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM picUploadingOrders ORDER BY picOrderId DESC LIMIT 1', (error, result) => {
            if (error) {
                reject(error);
            } else {
                const latestOrderId = result[0]?.picOrderId || 'P-0000'; 
                
                const currentOrderIdNumber = parseInt(latestOrderId.split('-')[1], 10); 
                const newOrderIdNumber = currentOrderIdNumber + 1;
                const newOrderId = `P-${newOrderIdNumber.toString().padStart(4, '0')}`;
                
                resolve(newOrderId);
                return newOrderId;
            }
        });
    });
}

export const savePicOrders = async (req, res) => {
    const { temporderId, name, contact, quantity, formattedDate, cakeText, pickupDate, imgLink, branchId } = req.body;
    const orderId = await generateNewOrderId();
    const status = 'Pending';
    const date = new Date(pickupDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedPickupDate = `${year}-${month}-${day}`;
    console.log(orderId);
    console.log(req.body);

    if (!orderId || !name || !contact || !quantity || !formattedDate || !cakeText || !pickupDate || !imgLink || !branchId) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
        db.beginTransaction(async function (err) {
            if (err) {
                throw err;
            }

            const InsertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO picUploadingOrders (picOrderId, name, contact, quantity, orderDate, cakeText, pickupDate, imgLink, branchId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [orderId, name, contact, quantity, formattedDate, cakeText, formattedPickupDate, imgLink, branchId, status], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                // If insertion into picUploadingOrders is successful, delete the record from tempOrders
                db.query('DELETE FROM tempOrders WHERE temporderId = ?', [temporderId], function (error, result) {
                    if (error) {
                        return db.rollback(function () {
                            console.error('Error deleting from tempOrders:', error);
                            return res.status(500).json({ error: 'Failed to delete from tempOrders' });
                        });
                    }
                    db.commit(function (err) {
                        if (err) {
                            return db.rollback(function () {
                                console.error('Error committing transaction:', err);
                                return res.status(500).json({ error: 'Transaction failed' });
                            });
                        }
                        console.log('Transaction Complete.');
                        return res.status(200).json({ message: 'Stock details updated successfully' });
                    });
                });
            } else {
                return res.status(500).json({ error: 'Failed to update stock details' });
            }
        });
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllPictureOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM picUploadingOrders WHERE pickupDate >= CURDATE() AND  status != "Deleted" AND status != "Released" AND status != "Completed" ORDER BY picOrderId ASC', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        // console.log({items});
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

export const deletePicOrders = async (req, res) => {
    const { temporderId} = req.body;
    console.log(temporderId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('DELETE FROM tempOrders WHERE temporderId = ?', [temporderId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Order details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getPicOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM picUploadingOrders WHERE pickupDate = DATE_ADD(CURDATE(), INTERVAL 4 DAY)', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        // console.log({items});
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

export const updatePicOrderStatus = async (req, res) => {
    const { orderId} = req.body;
    const status="Preparing"
    console.log(status);
    console.log(orderId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('UPDATE picUploadingOrders SET status = "Preparing" WHERE picOrderId = ?', [orderId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Order details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getTodayCustomOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT o.orderId,o.name,o.contact,o.quantity,o.pickupDate,o.status,o.cakeText,b.branchName AS branchName FROM orders o JOIN branch b ON o.branchId = b.branchId JOIN  cake c ON o.cakeId = c.CID WHERE DATE(o.pickupDate) = CURDATE() AND o.status != "Completed" AND o.status != "Deleted"', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        // console.log({items});
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
export const updateOrderReleseStatus = async (req, res) => {
    const { orderId} = req.body;
    const status="Preparing"
    console.log(status);
    console.log(orderId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('UPDATE orders SET status = "Released" WHERE orderId = ?', [orderId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Order details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getTodayPictureOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT o.picOrderId,o.name,o.contact,o.quantity,o.pickupDate,o.status,o.cakeText,b.branchName AS branchName FROM picUploadingOrders o JOIN branch b ON o.branchId = b.branchId  WHERE DATE(o.pickupDate) = CURDATE() AND status != "Completed" AND status != "Deleted"', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        // console.log({items});
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

export const updatePicOrderReleseStatus = async (req, res) => {
    const { picOrderId} = req.body;
    const status="Preparing"
    console.log(status);
    console.log(picOrderId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('UPDATE picUploadingOrders SET status = "Released" WHERE picOrderId = ?', [picOrderId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Order details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteCustomizeOrders = async (req, res) => {
    const { orderId} = req.body;
    const status="Preparing"
    console.log(status);
    console.log(orderId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('UPDATE orders SET status = "Deleted" WHERE orderId = ?', [orderId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Order details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const deletePictureUploadOrders = async (req, res) => {
    const { picOrderId} = req.body;
    const status="Preparing"
    console.log(status);
    console.log(picOrderId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('UPDATE picUploadingOrders SET status = "Deleted" WHERE picOrderId = ?', [picOrderId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Order details updated successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
