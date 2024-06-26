import {db} from '../server.js'
import bcrypt from 'bcrypt';

const getLatestUserId = async () => {
    try {
        const latestUser = await new Promise((resolve, reject) => {
            db.query('SELECT userId FROM user ORDER BY userId DESC LIMIT 1;', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results[0]) {
                        resolve(results[0].userId); // Change 'ItemId' to 'userId'
                    } else {
                        resolve('U-0000'); // Return U-0001 if no records are found
                    }
                }
            });
        });
        console.log(latestUser);
        return latestUser;
    } catch (error) {
        throw error;
    }
};


export const generateUserID = async (req, res) => {
    try {
        const latestUserId = await getLatestUserId();
        console.log(latestUserId);
        const numericPart = parseInt(latestUserId.split('-')[1]);
        const nextNumericPart = numericPart + 1;
        const formattedNumericPart = String(nextNumericPart).padStart(4, '0'); 
        const newUserId = `U-${formattedNumericPart}`;
        console.log(newUserId);
        return res.status(200).json( {newUserId});
    } catch (error) {
        throw error;
    }
};

export const addUser = async (req, res) => {
    const { userId,firstName,lastName, userName, password, selectedOption1, branchID } = req.body;
    // let Quantity=parseInt(req.body.Quantity);
    // let releaseQuantity=parseInt(req.body.releaseQty);
    // let dbQty=Quantity-releaseQuantity;
    // console.log(req.body);
    console.log(userId,firstName,lastName, userName, password, selectedOption1, branchID);
    

    if (!userId || !firstName ||!lastName|| !selectedOption1 || !userName || !password || !branchID) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO user (userId, firstName, lastName, userName,password,jobRole,branchId) VALUES (?, ?, ?,?,?,?,?)', [userId,firstName,lastName, userName, hashedPassword, selectedOption1, branchID], (error, result) => {
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

export const getAllUserDetails = async (req, res) => {
    try {
        const items = await new Promise((resolve, reject) => {
            db.query('SELECT u.*, b.branchName FROM User u INNER JOIN Branch b ON u.branchId = b.branchID', (error, results) => {
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

export const deleteUser = async (req, res) => {
    const { userId} = req.body;
    console.log(userId);
    try {
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('DELETE FROM user WHERE userId = ?', [userId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (InsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'User details Deleted successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to delete User details' });
            }
        
    } catch (error) {
        console.log('Error saving stock details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getBranchId = async () => {
    try {
        const latestBranch = await new Promise((resolve, reject) => {
            db.query('SELECT branchID FROM Branch ORDER BY branchID DESC LIMIT 1;', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results[0]) {
                        resolve(results[0].branchID); // Change 'ItemId' to 'userId'
                    } else {
                        resolve('B-0000'); // Return U-0001 if no records are found
                    }
                }
            });
        });
        console.log(latestBranch);
        return latestBranch;
    } catch (error) {
        throw error;
    }
};


export const generateBranchID = async (req, res) => {
    try {
        const latestBranchId = await getBranchId();
        console.log(latestBranchId);
        const numericPart = parseInt(latestBranchId.split('-')[1]);
        const nextNumericPart = numericPart + 1;
        const formattedNumericPart = String(nextNumericPart).padStart(4, '0'); 
        const newBranchId = `B-${formattedNumericPart}`;
        console.log(newBranchId);
        return res.status(200).json( {newBranchId});
    } catch (error) {
        throw error;
    }
};

export const addBranch = async (req, res) => {
    const { branchId,branchName } = req.body;
   
    console.log(branchId,branchName);
    

    if (!branchId || !branchName) {
        return res.status(400).json({ error: 'ItemId, Quantity, and ExpiryDate are required' });
    }

    try {
            
            const InsertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO Branch (branchID,branchName) VALUES (?, ?)', [branchId,branchName], (error, result) => {
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

const getLatestCakeId = async () => {
    try {
        const latestCake = await new Promise((resolve, reject) => {
            db.query('SELECT CID FROM cake ORDER BY CID DESC LIMIT 1;', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results[0]) {
                        resolve(results[0].CID); 
                    } else {
                        resolve('C-0000'); 
                    }
                }
            });
        });
        console.log(latestCake);
        return latestCake;
    } catch (error) {
        throw error;
    }
};


export const generateCakeID = async (req, res) => {
    try {
        const latestCakeId = await getLatestCakeId();
        console.log(latestCakeId);
        const numericPart = parseInt(latestCakeId.split('-')[1]);
        const nextNumericPart = numericPart + 1;
        const formattedNumericPart = String(nextNumericPart).padStart(4, '0'); 
        const newCakeId = `C-${formattedNumericPart}`;
        console.log(newCakeId);
        return res.status(200).json( {newCakeId});
    } catch (error) {
        throw error;
    }
};
const getLatestImageId = async () => {
    try {
        const latestImage = await new Promise((resolve, reject) => {
            db.query('SELECT imgID FROM image ORDER BY imgID DESC LIMIT 1;', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results[0]) {
                        resolve(results[0].imgID); 
                    } else {
                        resolve('IG-0000'); 
                    }
                }
            });
        });
        console.log(latestImage);
        return latestImage;
    } catch (error) {
        throw error;
    }
};

export const addCake = async (req, res) => {
    try {
        const latestImageId = await getLatestImageId();
        const numericPart = parseInt(latestImageId.split('-')[1]);
        const nextNumericPart = numericPart + 1;
        const formattedNumericPart = String(nextNumericPart).padStart(4, '0'); 
        const newImageId = `IG-${formattedNumericPart}`;

        const { cakeId, cakeType, icingType, price, imgUrl } = req.body;

        if (!cakeId || !cakeType || !icingType || !price || !imgUrl) {
            return res.status(400).json({ error: 'CakeId, CakeType, IcingType, Price, and ImageUrl are required' });
        }

        const imageInsertResult = await new Promise((resolve, reject) => {
            db.query('INSERT INTO image (imgID, imgLink) VALUES (?, ?)', [newImageId, imgUrl], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });

        
        if (imageInsertResult.affectedRows >= 1) {
            const cakeInsertResult = await new Promise((resolve, reject) => {
                db.query('INSERT INTO Cake (CID, cakeType, icingType, price, imgID) VALUES (?, ?, ?, ?, ?)', [cakeId, cakeType, icingType, price, newImageId], (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });

            if (cakeInsertResult.affectedRows >= 1) {
                return res.status(200).json({ message: 'Cake details added successfully' });
            } else {
                return res.status(500).json({ error: 'Failed to add cake details' });
            }
        } else {
            return res.status(500).json({ error: 'Failed to add image details' });
        }
    } catch (error) {
        console.error('Error adding cake:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
