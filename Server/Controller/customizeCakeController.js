import {db} from '../server.js'

export const getCakeTypes = async (req, res) => {
    try {
        const options = await new Promise((resolve, reject) => {
            db.query('SELECT DISTINCT cakeType FROM cake', (error, results) => {
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

export const getIcingFlavour = async (req, res) => {
    try {
        const options = await new Promise((resolve, reject) => {
            db.query('SELECT DISTINCT icingType FROM cake', (error, results) => {
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


export const getCakeDetails = async (req, res) => {
    // console.log("sampath");
    // console.log(req.params);
    const {selectedOption, selectedOption1} = req.params
    console.log(selectedOption,selectedOption1);
    

    
    // console.log(itemName);
    try {
        // Query to retrieve all item details from the database
        const options = await new Promise((resolve, reject) => {
            db.query('SELECT c.CID,c.price, i.imgLink FROM cake c INNER JOIN image i ON c.imgID = i.imgID WHERE c.cakeType = ? AND c.icingType = ?', [selectedOption, selectedOption1], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);

                }
            });
        });
        console.log("Wada yakooo1");
        console.log(options);

        if (options.length > 0) {
            return res.status(200).json( {options});
        } else {
            return res.status(404).json({ error: 'No items found' });
        }
    } catch (error) {
        console.log('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getBranchIds = async (req, res) => {
    try {
        const options = await new Promise((resolve, reject) => {
            db.query('SELECT branchName FROM Branch', (error, results) => {
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

async function generateNewOrderId() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Orders ORDER BY orderId DESC LIMIT 1', (error, result) => {
            if (error) {
                reject(error);
            } else {
                const latestOrderId = result[0]?.orderId || 'O-0000'; 
                
                const currentOrderIdNumber = parseInt(latestOrderId.split('-')[1], 10); 
                const newOrderIdNumber = currentOrderIdNumber + 1;
                const newOrderId = `O-${newOrderIdNumber.toString().padStart(4, '0')}`;
                
                resolve(newOrderId);
                return newOrderId;
            }
        });
    });
}

export const placeCustomizeOrder = async (req, res) => {
    const { Name, Contact,Quantity,formattedDate,additionalText,PickupDate,cakeId } = req.body;
    const orderId=await generateNewOrderId();
    console.log(orderId);
    console.log(req.body);
    

    if (!orderId||!Name|| !Contact||!Quantity||!formattedDate||!additionalText||!PickupDate||!cakeId) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO Orders (orderId, name, contact, quantity, orderDate, cakeText, pickupDate, cakeId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [orderId,Name, Contact,Quantity,formattedDate,additionalText,PickupDate,cakeId], (error, result) => {
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