import {db} from '../server.js'

export const getOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT o.orderId,o.name,o.contact,o.quantity,o.pickupDate,o.status,i.imgLink AS imageLink,o.cakeText FROM Orders o JOIN cake c ON o.cakeId = c.CID JOIN image i ON c.imgID = i.imgID WHERE o.pickupDate = DATE_ADD(CURDATE(), INTERVAL 4 DAY)', (error, results) => {
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

export const getAllOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT o.orderId,o.name,o.contact,o.quantity,o.pickupDate,o.status,i.imgLink AS imageLink,o.cakeText FROM Orders o JOIN cake c ON o.cakeId = c.CID JOIN image i ON c.imgID = i.imgID order by orderId  ASC', (error, results) => {
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