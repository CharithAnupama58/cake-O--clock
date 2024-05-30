import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Make sure to install sweetalert2

const AddStock = () => {
    const [options, setOptions] = useState([]);
    const [itemNameDetails, setItemNameDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [ItemId, setItemId] = useState('');
    const [Quantity, setStockQty] = useState('');
    const [ExpiryDate, setExpDate] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

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
    }, [selectedOption]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        validateForm(event.target.value, Quantity, ExpiryDate);
    };

    const handleInputChanges = (event) => {
        const { id, value } = event.target;
        if (id === 'input4') setStockQty(value);
        if (id === 'input5') setExpDate(value);
        validateForm(selectedOption, id === 'input4' ? value : Quantity, id === 'input5' ? value : ExpiryDate);
    };

    const validateForm = (selectedOption, Quantity, ExpiryDate) => {
        const newErrors = {};
        const quantityPattern = /^[1-9]\d{0,3}$/; // Up to 4 digits
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (!selectedOption) newErrors.selectedOption = true;
        if (!Quantity || !quantityPattern.test(Quantity)) newErrors.Quantity = true;
        if (!ExpiryDate || !datePattern.test(ExpiryDate)) {
            newErrors.ExpiryDate = true;
        } else {
            const selectedDate = new Date(ExpiryDate);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Compare only the date part
            if (selectedDate < currentDate) {
                newErrors.ExpiryDate = true;
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Date',
                    text: 'Expiry date cannot be in the past.',
                });
            }
        }

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0 && selectedOption && Quantity && ExpiryDate);
    };

    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            const response = await axios.post('http://localhost:3001/server/stockManagement/addStock', {
                ItemId,
                Quantity,
                ExpiryDate
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Stock added successfully',
                });
                setItemId('');
                setStockQty('');
                setExpDate('');
                setSelectedOption('');
                setItemNameDetails(null);
                setIsFormValid(false);
            } else {
                console.error('Failed to add stock:', response.data.message);
            }
        } catch (error) {
            console.error('Failed to add stock:', error);
        }
    };

    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-10 font-bold text-4xl'>Add Stock</h1>
                <form className="ml-4 mt-16 w-96" onSubmit={handleAddStockSubmit}>
                    <div className="mb-8 flex items-center">
                        <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Item Name:</label>
                        <select
                            id="combo-box"
                            className={`w-full h-10 px-3 rounded border ${errors.selectedOption ? 'border-red-500' : selectedOption ? 'border-green-500' : 'border-gray-500'}`}
                            value={selectedOption}
                            onChange={handleSelectChange}
                        >
                            <option value="">Select an option...</option>
                            {options.map((option, index) => (
                                <option key={index} value={option.itemName}>{option.itemName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input1" className="block text-xl w-60 mr-4">Item ID:</label>
                        <input
                            type="text"
                            id="input1"
                            className="w-full h-10 px-3 rounded border border-gray-500"
                            placeholder="Item ID"
                            value={itemNameDetails?.itemId || ''}
                            disabled
                        />
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input2" className="block text-xl w-60 mr-4">Measure Unit:</label>
                        <input
                            type="text"
                            id="input2"
                            className="w-full h-10 px-3 rounded border border-gray-500"
                            placeholder="Measure Unit"
                            value={itemNameDetails?.measureUnit || ''}
                            disabled
                        />
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input3" className="block text-xl w-60 mr-4">Unit Qty:</label>
                        <input
                            type="text"
                            id="input3"
                            className="w-full h-10 px-3 rounded border border-gray-500"
                            placeholder="Unit Quantity"
                            value={itemNameDetails?.unitQty || ''}
                            disabled
                        />
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input4" className="block text-xl w-60 mr-4">Stock Qty:</label>
                        <input
                            type="number"
                            id="input4"
                            maxLength="4"
                            className={`w-full h-10 px-3 rounded border ${errors.Quantity ? 'border-red-500' : Quantity ? 'border-green-500' : 'border-gray-500'}`}
                            placeholder="Stock Quantity"
                            value={Quantity}
                            onChange={handleInputChanges}
                        />
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input5" className="block text-xl w-60 mr-4">Expiry Date:</label>
                        <input
                            type="date"
                            id="input5"
                            className={`w-full h-10 px-3 rounded border ${errors.ExpiryDate ? 'border-red-500' : ExpiryDate ? 'border-green-500' : 'border-gray-500'}`}
                            placeholder="Expiry Date"
                            value={ExpiryDate}
                            onChange={handleInputChanges}
                        />
                    </div>

                    <button
                        className='bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6'
                        disabled={!isFormValid}
                    >
                        Add Stock
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStock;
