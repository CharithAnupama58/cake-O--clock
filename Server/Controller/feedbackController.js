import {db} from '../server.js'

export const feedback = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    try {
        // Insert feedback data into the database
        const result = await new Promise((resolve,reject)=>{db.query('INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)', [name, email, message],(error,result)=>{

            if(error){
                reject(error)
            }
            resolve(result)
        })});
        
        // Check if the insert was successful

        if (result.affectedRows >= 1) {
            return res.status(200).json({ message: 'Feedback added successfully' });
        } else {
            return res.status(500).json({ error: 'Failed to add feedback' });
        }
    } catch (error) {
        console.log('Error inserting feedback:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};