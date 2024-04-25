import  { useState, useEffect } from 'react';
import axios from 'axios';


const AddItem = () => {
    const [newItemId, setNewItemId] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [newItemMeasureUnit, setnewItemMeasureUnit] = useState('');
    const [newItemUnitQty, setnewItemUnitQty] = useState('');

    
      
 
    useEffect(() => {
        generateNewItemIdFromBackend();


         
    }, []);
    const generateNewItemIdFromBackend = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/stockManagement/generateNewItemId');
            setNewItemId(response.data.newItemId);
            console.log('Before logging newItemId');
            console.log(newItemId);
            console.log('After logging newItemId');
        } catch (error) {
            console.error('Error generating new Item ID:', error);
        }
    };

    const handleSelectChange = (event) => {
        setnewItemMeasureUnit(event.target.value);
    };
    // const handleInputChanges = () => {
    //     setItemId(document.getElementById('input1').value);
    //     setStockQty(document.getElementById('input4').value);
    //     setExpDate(document.getElementById('input5').value);
    // };  
    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        console.log(newItemId, newItemName, newItemMeasureUnit, newItemUnitQty);
        try {
            const response = await axios.post('http://localhost:3001/server/stockManagement/addItem', {
                newItemId,
                newItemName,
                newItemMeasureUnit,
                newItemUnitQty
            });

            if (response.status === 200) {
                alert('Feedback submitted successfully');
                setNewItemId('');
                setNewItemName('');
                setnewItemMeasureUnit('');
                setnewItemUnitQty('');  
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
                        <h1 className='mt-10 font-bold text-4xl'>Add Item</h1>
                        <form className="ml-4 mt-24 w-96" onSubmit={handleAddStockSubmit} >
                            
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input1" className="block text-xl w-60 mr-4">Item ID:</label>
                                    <input type="text" id="input1" className="w-full h-10 px-3 rounded border border-black" placeholder="Item ID" value={newItemId} onChange={(e) => setNewItemId(e.target.value)}/>
                                </div>
                      
                            
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Item Name:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Item Name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                                </div>
                           
                         
                                <div className="mb-8 flex items-center">
                                    <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Measure Unit:</label>
                                    <select id="combo-box" className="w-full h-10 px-3 rounded border border-black" value={newItemMeasureUnit} onChange={handleSelectChange} >
                                        <option value="">Select an option...</option>
                                            <option>Kg</option>
                                            <option>Unit</option>
                                    </select>
                                </div>
                           
                            
                            <div className="mb-8 flex items-center">
                                <label htmlFor="input4" className="block text-xl w-60 mr-4">Unit Qty:</label>
                                <input type="number" id="input4" className="w-full h-10 px-3 rounded border border-black" placeholder="Unit Quantity" value={newItemUnitQty} onChange={(e) => setnewItemUnitQty(e.target.value)} />
                            </div>
                            <button className=' bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6'>Add Item</button>
                        </form>
                    </div>
            
        </div>
    );
};

export default AddItem;