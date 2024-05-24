import {db} from '../server.js'
import stripe from 'stripe';
const stripeInstance = new stripe('sk_test_51PA220JMl6ygdWyRrpSO9uXv2f9pvvMkVxTjTqW0HuS8lIDVaTCC8ITNccAbCQIoVwTlY7QmwhreXQc7qh2HYXR100sxPvAiwL');

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
    const {selectedOption2} = req.params
    console.log(selectedOption2);
    try {
        const options = await new Promise((resolve, reject) => {
            db.query('SELECT icingType FROM cake WHERE cakeType = ?',[selectedOption2], (error, results) => {
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
            db.query('SELECT * FROM Branch', (error, results) => {
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
    const { Name, Contact, Quantity, formattedDate, additionalText, PickupDate, cakeId, branchID } = req.body;
    const orderId = await generateNewOrderId();
    const status = 'Pending';
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!orderId || !Name || !Contact || !Quantity || !formattedDate || !additionalText || !PickupDate || !cakeId || !branchID) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const InsertResult = await new Promise((resolve, reject) => {
            db.query('INSERT INTO Orders (orderId, name, contact, quantity, orderDate, cakeText, pickupDate, cakeId, status, branchId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [orderId, Name, Contact, Quantity, formattedDate, additionalText, PickupDate, cakeId, status, branchID], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        if (InsertResult.affectedRows >= 1) {
            // Insert notification into the notification table with date and time
            db.query('INSERT INTO notification (order_id, message, created_at) VALUES (?, ?, ?)', [orderId, 'New order placed', createdAt]);
            return res.status(200).json({ message: 'Order placed successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to place order' });
        }
    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCakePrice = async (req, res) => {
    const {cakeId} = req.params
    try {
        const options = await new Promise((resolve, reject) => {
            db.query('SELECT price FROM cake WHERE CID = ?',[cakeId], (error, results) => {
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

export const createPaymentIntent = async (req, res) => {
    const { lineItems } = req.body;

  try {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173/SuccessPage',
      cancel_url: 'http://localhost:5173/CancelPage',
    });

    return res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const loadSessionId= async (req, res) => {
    // console.log(req.params.sessionId)
    try {
        const session = await stripeInstance.checkout.sessions.retrieve(req.params.sessionId);
        console.log(session);
        res.json({ payment_status: session.payment_status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};