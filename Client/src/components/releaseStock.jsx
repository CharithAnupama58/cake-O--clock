import  { useState, useEffect } from 'react';
import axios from 'axios';


const ReleaseStock = () => {
    const [options, setOptions] = useState([]);
    const [ExpioryDates, setExpioryDates] = useState([]);
    const [itemNameDetails, setItemNameDetails] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption1, setSelectedOption1] = useState('');
    const [ItemId, setItemId] = useState(null);
    let [Quantity, setStockQty] = useState('');
    let [releaseQty, setReleaseQty] = useState('');
    const [ExpiryDate, setExpDate] = useState([]);

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
            // setItemNameDetails(response.data.itemNameDetails);
            const itemDetails = response.data.itemNameDetails;
            setItemNameDetails(itemDetails);

        // Find the item with the selected item name and update ItemId state
        const selectedItem = itemDetails.find(item => item.itemName === selectedOption);
        if (selectedItem) {
            setItemId(selectedItem.itemId);
            // console.log(ItemId);
            fetchExpioryDetails();
        }

        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };
    const fetchExpioryDetails = async () => {
        if (!ItemId) {
            console.error('ItemId is not defined');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:3001/server/stockManagement/itemExpiryDates/${ItemId}`);
            setExpioryDates(response.data.ExpioryDates);

        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };
    
    const fetchStockQty = async () => {
        if (!ItemId) {
            console.error('ItemId is not defined');
            return;
        }
        console.log(ItemId);
        console.log(selectedOption1);
        try {
            const response = await axios.get(`http://localhost:3001/server/stockManagement/itemStockQty/${ItemId}/${selectedOption1}`);
            // const response = await axios.get(`http://localhost:3001/server/stockManagement/itemStockQty/${ItemId}/${selectedOption1}`);
            if (response.status === 200) {
                setStockQty(response.data.StockQty[0].Quantity);
                console.log(response.data.StockQty[0].Quantity);
            } else {
                console.error(`Unexpected server response: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching stock quantity:', error);
        }

        // } catch (error) {
        //     console.error('Error fetching item details:', error);
        // }
    };
    useEffect(() => {
        fetchOptions();

        if (selectedOption) {
                 fetchItemDetails();
                 setStockQty('');
        }
        // if(document.getElementById('input6')){
        //     fetchExpioryDetails();
        // }

        // if(document.getElementById('input6').value){
        //     fetchExpioryDetails();
        //     console.log('It is Working');
        // }
        if (ItemId && selectedOption1) {
            // console.log(ItemId)
            // console.log(selectedOption1)
            fetchStockQty();
        }
        // console.log(ItemId); 
         
         
    },[selectedOption,ItemId,selectedOption1]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setItemId('');
        setStockQty('');
        setReleaseQty('');
        setSelectedOption1('');
        setItemNameDetails([]);
    };
    const handleSelectChange1 = (event) => {
        setSelectedOption1(event.target.value);
    };
    const checkIsValidQty = (event) => {
        if(releaseQty>Quantity||releaseQty<0){
            alert('Invalid Quantity');
        }else{
            handleAddStockSubmit(event);
        }
    };
    
    // const handleInputChanges = (event) => {
    //     const { value } = event.target;
    //     const selectedItem = itemNameDetails.find(item => item.itemName === value);
    //     setItemId(selectedItem?.itemId);
    //     console.log(ItemId)
    //     fetchExpioryDetails();
    // }; 
    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        console.log(ItemId, Quantity, releaseQty, selectedOption1);
        try {
            const response = await axios.post('http://localhost:3001/server/stockManagement/releaseStock', {
                ItemId,
                Quantity,
                releaseQty,
                selectedOption1
            });

            if (response.status === 200) {
                alert('Feedback submitted successfully');
                setItemId('');
                setStockQty('');
                setReleaseQty('');
                setSelectedOption('');
                setSelectedOption1('');
                setItemNameDetails([]);
                setExpioryDates([]);
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
                            <h1 className='mt-10 font-bold text-4xl'>Release Stock</h1>
                            <form className="ml-4 mt-12 w-96" onSubmit={checkIsValidQty}>
                                <div className="mb-6 flex items-center">
                                    <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Item Name:</label>
                                    <select id="combo-box" className="w-full h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange} >
                                        <option value="">Select an option...</option>
                                        {options.map((menu, index) => (
                                            <option key={index}>{menu.itemName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-6 flex items-center">
                                    <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Exp Date:</label>
                                    <select id="combo-box" className="w-full h-10 px-3 rounded border border-black" value={selectedOption1} onChange={handleSelectChange1}>
                                        <option value="">Select an option...</option>
                                        {ExpioryDates.map((dateObj, index) => { 
                                            const date = new Date(dateObj.ExpiryDate);
                                            date.setDate(date.getDate() + 1);
                                            const formattedDate = date.toISOString().split('T')[0];
                                            return <option key={index}>{formattedDate}</option>;
                                        })}
                                    </select>

                                </div>
                                
                                {itemNameDetails.map((details, index) => ( 
                                    <div key={index}>
                                        <div className="mb-6 flex items-center">
                                            <label htmlFor={`input6-${index}`} className="block text-xl w-60 mr-4">Item ID:</label>
                                            <input type="text" id='input6' className="w-full h-10 px-3 rounded border border-black" placeholder="Item ID" value={details.itemId} />
                                        </div>
                                        <div className="mb-6 flex items-center">
                                            <label htmlFor={`input7-${index}`} className="block text-xl w-60 mr-4">Measure Unit:</label>
                                            <input type="text" id='input7' className="w-full h-10 px-3 rounded border border-black" placeholder="Measure Unit" value={details.measureUnit} />
                                        </div>
                                        <div className="mb-6 flex items-center">
                                            <label htmlFor={`input8-${index}`} className="block text-xl w-60 mr-4">Unit Qty:</label>
                                            <input type="text" id='input8' className="w-full h-10 px-3 rounded border border-black" placeholder="Unit Quantity" value={details.unitQty}  />
                                        </div>
                                    </div>
                                ))};
                                
                                <div className="mb-6 flex items-center">
                                    <label htmlFor="input9" className="block text-xl w-60 mr-4">Stock Qty:</label>
                                    <input type="number" id="input9" className="w-full h-10 px-3 rounded border border-black" placeholder="Release Quantity" value={Quantity} onChange={(e) => setStockQty(e.target.value)}  />
                                </div>
                                <div className="mb-6 flex items-center">
                                    <label htmlFor="input10" className="block text-xl w-60 mr-4">Release Qty:</label>
                                    <input type="number" id="input10" className="w-full h-10 px-3 rounded border border-black" placeholder="Release Quantity" value={releaseQty} onChange={(e) => setReleaseQty(e.target.value)}   />
                                </div>
                                
                    
                                <button className=' bg-custom-blue text-white font-bold rounded-xl mt-0 ml-20 py-1 px-6'>Release Stock</button>
                                
                            </form>
                    </div>
            
        </div>
    );
};

export default ReleaseStock;