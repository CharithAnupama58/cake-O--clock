
import  { useState, useEffect } from 'react';
import axios from 'axios';


const AddBranch = () => {
    const [branchId, setBranchId] = useState('');
    const [branchName, setBranchName] = useState('');


    
      
 
    useEffect(() => {
        generateNewItemIdFromBackend();


         
    }, []);
   
    const generateNewItemIdFromBackend = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/admin/branchId');
            setBranchId(response.data.newBranchId);
            
        } catch (error) {
            console.error('Error generating new Item ID:', error);
        }
    };
   
    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        console.log(branchId, branchName);
        try {
            const response = await axios.post('http://localhost:3001/server/admin/addBranch', {
               branchId,
               branchName

            });

            if (response.status === 200) {
                alert('Feedback submitted successfully');
                setBranchName('');
                
                generateNewItemIdFromBackend();
            } else {
                console.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            console.error('Failed to login. Please try again later.');
        }
    };
    
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Add Branch</h1>
                        <form className="ml-4 mt-16 w-96" onSubmit={handleAddStockSubmit} >
                            
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input1" className="block text-xl w-60 mr-4">Branch ID:</label>
                                    <input type="text" id="input1" className="w-full h-10 px-3 rounded border border-black" placeholder="Branch Id" value={branchId} onChange={(e) => setBranchId(e.target.value)}/>
                                </div>
                      
                            
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Branch Name:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
                                </div>

                            <button className=' bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6'>Add User</button>
                        </form>
                    </div>
            
        </div>
    );
};

export default AddBranch;