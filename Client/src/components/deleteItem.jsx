import  { useState, useEffect } from 'react';
import axios from 'axios';


const DeleteItem = () => {
    const [options, setOptions] = useState([]);
    const [itemNameDetails, setItemNameDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [ItemId, setItemId] = useState('');


    const fetchOptions = async () => {
        try {
          const response = await axios.get('http://localhost:3001/server/stockManagement/itemIds'); 
          setOptions(response.data.options);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };
      
    const fetchItemDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/server/stockManagement/itemNameDetails/${selectedOption}`);
            setItemNameDetails(response.data.itemNameDetails[0]);
            setItemId(response.data.itemNameDetails[0].itemId);

        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };
    useEffect(() => {
        fetchOptions();

        if (selectedOption) {
            fetchItemDetails();
        }  
         
    },[selectedOption]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };
    // const handleInputChanges = () => {
    //     setItemId(document.getElementById('input1').value);
    //     setStockQty(document.getElementById('input4').value);
    //     setExpDate(document.getElementById('input5').value);
    // };  
    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        console.log(ItemId);
        try {
            const response = await axios.post('http://localhost:3001/server/stockManagement/deleteItem', {
                ItemId
            });

            if (response.status === 200) {
                alert('Feedback submitted successfully');
                setItemId('');
                setItemNameDetails('');
                setSelectedOption('');
                document.getElementById('input1').value = '';
                document.getElementById('input4').value = '';
                document.getElementById('input5').value = '';

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
                        <h1 className='mt-10 font-bold text-4xl'>Delete Item</h1>
                        <form className="ml-4 mt-16 w-96" onSubmit={handleAddStockSubmit}>
                            <div className="mb-8 flex items-center">
                                <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Item Name:</label>
                                <select id="combo-box" className="w-full h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange}>
                                    <option value="">Select an option...</option>
                                    {options.map((option, index) => (
                                        <option key={index}>{option.itemName}</option>
                                    ))}
                                </select>
                            </div>
                            
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input1" className="block text-xl w-60 mr-4">Item ID:</label>
                                    <input type="text" id="input1" className="w-full h-10 px-3 rounded border border-black" placeholder="Item ID" value={itemNameDetails?.itemId||''} />
                                </div>
                      
                            
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Measure Unit:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Measure Unit" value={itemNameDetails?.measureUnit||''} />
                                </div>
                           
                         
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input3" className="block text-xl w-60 mr-4">Unit Qty:</label>
                                    <input type="text" id="input3" className="w-full h-10 px-3 rounded border border-black" placeholder="Unit Quantity" value={itemNameDetails?.unitQty||''}  />
                                </div>
                           
                
                            <button className=' bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6'>Delete Item</button>
                            
                        </form>
                    </div>
            
        </div>
    );
};

export default DeleteItem;