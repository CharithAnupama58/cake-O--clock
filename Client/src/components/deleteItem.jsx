import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DeleteItem = () => {
    const [options, setOptions] = useState([]);
    const [itemNameDetails, setItemNameDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [itemId, setItemId] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        if (selectedOption) {
            fetchItemDetails();
        }
    }, [selectedOption]);

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
            const itemDetails = response.data.itemNameDetails[0];
            setItemNameDetails(itemDetails);
            setItemId(itemDetails.itemId);
            validateForm(itemDetails.itemId);
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const validateForm = (itemId) => {
        setIsFormValid(!!itemId);
    };

    const handleDeleteItemSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        const confirmDeletion = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (confirmDeletion.isConfirmed) {
            try {
                const response = await axios.post('http://localhost:3001/server/stockManagement/deleteItem', { itemId });

                if (response.status === 200) {
                    Swal.fire('Deleted!', 'Item has been deleted.', 'success');
                    setItemId('');
                    setItemNameDetails(null);
                    setSelectedOption('');
                    setIsFormValid(false);
                } else {
                    Swal.fire('Error!', 'Failed to delete item.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete item.', 'error');
            }
        }
    };

    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-10 font-bold text-4xl'>Delete Item</h1>
                <form className="ml-4 mt-16 w-96" onSubmit={handleDeleteItemSubmit}>
                    <div className="mb-8 flex items-center">
                        <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Item Name:</label>
                        <select
                            id="combo-box"
                            className="w-full h-10 px-3 rounded border border-black"
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
                            className="w-full h-10 px-3 rounded border border-black"
                            placeholder="Item ID"
                            value={itemNameDetails?.itemId || ''}
                            readOnly
                        />
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input2" className="block text-xl w-60 mr-4">Measure Unit:</label>
                        <input
                            type="text"
                            id="input2"
                            className="w-full h-10 px-3 rounded border border-black"
                            placeholder="Measure Unit"
                            value={itemNameDetails?.measureUnit || ''}
                            readOnly
                        />
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input3" className="block text-xl w-60 mr-4">Unit Qty:</label>
                        <input
                            type="text"
                            id="input3"
                            className="w-full h-10 px-3 rounded border border-black"
                            placeholder="Unit Quantity"
                            value={itemNameDetails?.unitQty || ''}
                            readOnly
                        />
                    </div>

                    <button
                        type="submit"
                        className='bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6 hover:bg-gray-300'
                        disabled={!isFormValid}
                    >
                        Delete Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeleteItem;
