import {db} from '../server.js'

async function generateTempOrderId() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tempOrders ORDER BY temporderId DESC LIMIT 1', (error, result) => {
            if (error) {
                reject(error);
            } else {
                const latestOrderId = result[0] ? result[0].temporderId : 'T-0000'; 
                
                const currentOrderIdNumber = parseInt(latestOrderId.split('-')[1], 10); 
                const newOrderIdNumber = currentOrderIdNumber + 1;
                const newOrderId = `T-${newOrderIdNumber.toString().padStart(4, '0')}`;
                
                resolve(newOrderId);
            }
        });
    });
}
export const  placePictureUploadingOrder = async (req, res) => {
    const { Name, Contact,Quantity,formattedDate,additionalText,PickupDate,imageUrl,branchID } = req.body;
    const orderId=await generateTempOrderId();
    // const status='Pending';
    console.log(orderId);
    console.log(req.body);
    

    if (!orderId||!Name|| !Contact||!Quantity||!formattedDate||!additionalText||!PickupDate||!branchID) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO tempOrders (temporderId, name, contact, quantity, orderDate, cakeText, pickupDate, imgLink, branchId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [orderId,Name, Contact,Quantity,formattedDate,additionalText,PickupDate,imageUrl,branchID], (error, result) => {
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