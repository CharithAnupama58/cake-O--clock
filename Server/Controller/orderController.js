import {db} from '../server.js'

export const getOrderDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT o.orderId,o.name,o.contact,o.quantity,o.pickupDate,i.imgLink AS imageLink,o.cakeText FROM Orders o JOIN cake c ON o.cakeId = c.CID JOIN image i ON c.imgID = i.imgID WHERE o.pickupDate = DATE_ADD(CURDATE(), INTERVAL 4 DAY)', (error, results) => {
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