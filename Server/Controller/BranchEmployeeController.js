import {db} from '../server.js'


export const getCustomizeOrderDetails = async (req, res) => {
    const branchId = req.params.branchId;
    console.log(branchId);
    try {
            const items = await new Promise((resolve, reject) => {
                db.query('SELECT o.orderId,o.name,o.contact,o.quantity,o.pickupDate,o.status,o.cakeText,b.branchName AS branchName FROM orders o JOIN branch b ON o.branchId = b.branchId JOIN  cake c ON o.cakeId = c.CID WHERE DATE(o.pickupDate) = CURDATE() AND O.branchId = ?', [branchId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (items.length > 0) {
                return res.status(200).json({ items });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getPictureOrderDetails = async (req, res) => {
    const branchId = req.params.branchId;
    console.log(branchId);
    try {
            const items = await new Promise((resolve, reject) => {
                db.query('SELECT o.picOrderId,o.name,o.contact,o.quantity,o.pickupDate,o.status,o.cakeText,b.branchName AS branchName FROM picUploadingOrders o JOIN branch b ON o.branchId = b.branchId  WHERE DATE(o.pickupDate) = CURDATE() AND O.branchId = ?', [branchId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (items.length > 0) {
                return res.status(200).json({ items });
            } else {
                return res.status(500).json({ error: 'Failed to update Order details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
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
                db.query('UPDATE orders SET status = "Completed" WHERE orderId = ?', [orderId], (error, result) => {
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

export const updatePicOrderReleseStatus = async (req, res) => {
    const { picOrderId} = req.body;
    const status="Preparing"
    console.log(status);
    console.log(picOrderId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('UPDATE picUploadingOrders SET status = "Completed" WHERE picOrderId = ?', [picOrderId], (error, result) => {
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
