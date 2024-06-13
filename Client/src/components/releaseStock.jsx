import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ReleaseStock = () => {
    const [options, setOptions] = useState([]);
    const [expiryDates, setExpiryDates] = useState([]);
    const [itemNameDetails, setItemNameDetails] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption1, setSelectedOption1] = useState('');
    const [itemId, setItemId] = useState(null);
    const [quantity, setStockQty] = useState('');
    const [releaseQty, setReleaseQty] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [borderColor, setBorderColor] = useState('border-black');

    const fetchOptions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/stockManagement/availableitemIds');
            setOptions(response.data.options || []);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchItemDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/server/stockManagement/itemNameDetails/${selectedOption}`);
            const itemDetails = response.data.itemNameDetails || [];
            setItemNameDetails(itemDetails);

            const selectedItem = itemDetails.find(item => item.itemName === selectedOption);
            if (selectedItem) {
                setItemId(selectedItem.itemId);
                fetchExpiryDetails(selectedItem.itemId);
            }
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    const fetchExpiryDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3001/server/stockManagement/itemExpiryDates/${id}`);
            setExpiryDates(response.data.ExpioryDates || []);
        } catch (error) {
            console.error('Error fetching expiry dates:', error);
        }
    };

    const fetchStockQty = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/server/stockManagement/itemStockQty/${itemId}/${selectedOption1}`);
            if (response.status === 200) {
                setStockQty(response.data.StockQty[0].Quantity || '');
            } else {
                console.error(`Unexpected server response: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching stock quantity:', error);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        if (selectedOption) {
            fetchItemDetails();
            setStockQty('');
            setReleaseQty('');
        }
    }, [selectedOption]);

    useEffect(() => {
        if (itemId && selectedOption1) {
            fetchStockQty();
        }
    }, [itemId, selectedOption1]);

    useEffect(() => {
        if (selectedOption && selectedOption1 && quantity && releaseQty && releaseQty <= quantity) {
            setIsFormValid(true);
            setBorderColor('border-green-500');
        } else {
            setIsFormValid(false);
            setBorderColor('border-red-500');
        }
    }, [selectedOption, selectedOption1, quantity, releaseQty]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setItemId('');
        setStockQty('');
        setReleaseQty('');
        setSelectedOption1('');
        setItemNameDetails([]);
        setExpiryDates([]);
    };

    const handleSelectChange1 = (event) => {
        setSelectedOption1(event.target.value);
    };

    const handleReleaseQtyChange = (event) => {
        const value = event.target.value;
        if (value > 0) {
            setReleaseQty(value);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Quantity',
                text: 'Release quantity cannot be negative or 0.',
            });
        }
    };

    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        if (releaseQty > quantity) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Quantity',
                text: 'Release quantity cannot be greater than stock quantity.',
            });
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/server/stockManagement/releaseStock', {
                itemId,
                quantity,
                releaseQty,
                selectedOption1
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Stock released successfully.',
                });
                setItemId('');
                setStockQty('');
                setReleaseQty('');
                setSelectedOption('');
                setSelectedOption1('');
                setItemNameDetails([]);
                setExpiryDates([]);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to release stock.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to release stock. Please try again later.',
            });
            console.error('Release failed:', error);
        }
    };

    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-10 font-bold text-4xl'>Release Stock</h1>
                <form className="ml-4 mt-12 w-96" onSubmit={handleAddStockSubmit}>
                    <div className="mb-6 flex items-center">
                        <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Item Name:</label>
                        <select id="combo-box" className="w-full h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange}>
                            <option value="">Select an option...</option>
                            {options.length > 0 && options.map((menu, index) => (
                                <option key={index} value={menu.itemName}>{menu.itemName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6 flex items-center">
                        <label htmlFor="combo-box1" className="block text-xl w-60 mr-4">Exp Date:</label>
                        <select id="combo-box1" className="w-full h-10 px-3 rounded border border-black" value={selectedOption1} onChange={handleSelectChange1}>
                            <option value="">Select an option...</option>
                            {expiryDates.length > 0 && expiryDates.map((dateObj, index) => {
                                const date = new Date(dateObj.ExpiryDate);
                                date.setDate(date.getDate() + 1); 
                                const formattedDate = date.toISOString().split('T')[0];
                                return <option key={index} value={formattedDate}>{formattedDate}</option>;
                            })}
                        </select>
                    </div>
                    
                    {itemNameDetails.length > 0 && itemNameDetails.map((details, index) => (
                        <div key={index}>
                            <div className="mb-6 flex items-center">
                                <label htmlFor={`input6-${index}`} className="block text-xl w-60 mr-4">Item ID:</label>
                                <input type="text" id={`input6-${index}`} className="w-full h-10 px-3 rounded border border-black" placeholder="Item ID" value={details.itemId} readOnly />
                            </div>
                            <div className="mb-6 flex items-center">
                                <label htmlFor={`input7-${index}`} className="block text-xl w-60 mr-4">Measure Unit:</label>
                                <input type="text" id={`input7-${index}`} className="w-full h-10 px-3 rounded border border-black" placeholder="Measure Unit" value={details.measureUnit} readOnly />
                            </div>
                            <div className="mb-6 flex items-center">
                                <label htmlFor={`input8-${index}`} className="block text-xl w-60 mr-4">Unit Qty:</label>
                                <input type="text" id={`input8-${index}`} className="w-full h-10 px-3 rounded border border-black" placeholder="Unit Quantity" value={details.unitQty} readOnly />
                            </div>
                        </div>
                    ))}
                    
                    <div className="mb-6 flex items-center">
                        <label htmlFor="input9" className="block text-xl w-60 mr-4">Stock Qty:</label>
                        <input type="number" id="input9" className="w-full h-10 px-3 rounded border border-black" placeholder="Stock Quantity" value={quantity} readOnly />
                    </div>
                    <div className="mb-6 flex items-center">
                        <label htmlFor="input10" className="block text-xl w-60 mr-4">Release Qty:</label>
                        <input type="number" id="input10" className={`w-full h-10 px-3 rounded border ${borderColor}`} placeholder="Release Quantity" value={releaseQty} onChange={handleReleaseQtyChange} />
                    </div>
                    
                    <button type="submit" className='bg-custom-blue text-white font-bold rounded-xl mt-0 ml-20 py-1 px-6 hover:bg-gray-300' disabled={!isFormValid}>
                        Release Stock
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReleaseStock;
