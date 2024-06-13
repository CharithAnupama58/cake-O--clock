import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddItem = () => {
    const [newItemId, setNewItemId] = useState('');
    const [newItemName, setNewItemName] = useState('');
    const [newItemMeasureUnit, setNewItemMeasureUnit] = useState('');
    const [newItemUnitQty, setNewItemUnitQty] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        generateNewItemIdFromBackend();
    }, []);

    const generateNewItemIdFromBackend = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/stockManagement/generateNewItemId');
            setNewItemId(response.data.newItemId);
        } catch (error) {
            console.error('Error generating new Item ID:', error);
        }
    };

    const handleSelectChange = (event) => {
        const selectedUnit = event.target.value;
        setNewItemMeasureUnit(selectedUnit);
        if (selectedUnit === 'Kg') {
            setNewItemUnitQty('1');
        } else {
            setNewItemUnitQty('');
        }
        validateForm(newItemName, selectedUnit, selectedUnit === 'Kg' ? '1' : newItemUnitQty);
    };

    const handleInputChanges = (event) => {
        const { id, value } = event.target;
        if (id === 'input2') setNewItemName(value);
        if (id === 'input4') setNewItemUnitQty(value);
        validateForm(id === 'input2' ? value : newItemName, newItemMeasureUnit, id === 'input4' ? value : newItemUnitQty);
    };

    const validateForm = (newItemName, newItemMeasureUnit, newItemUnitQty) => {
        const newErrors = {};
        const namePattern = /^.{1,100}$/; // 1 to 100 characters
        const quantityPattern = /^[1-9]\d{0,3}$/; // Up to 4 digits

        if (!newItemName || !namePattern.test(newItemName)) newErrors.newItemName = true;
        if (!newItemMeasureUnit) newErrors.newItemMeasureUnit = true;
        if (!newItemUnitQty || !quantityPattern.test(newItemUnitQty)) newErrors.newItemUnitQty = true;

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0 && newItemName && newItemMeasureUnit && newItemUnitQty);
    };

    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            const response = await axios.post('http://localhost:3001/server/stockManagement/addItem', {
                newItemId,
                newItemName,
                newItemMeasureUnit,
                newItemUnitQty
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Item added successfully',
                });
                setNewItemName('');
                setNewItemMeasureUnit('');
                setNewItemUnitQty('');
                generateNewItemIdFromBackend();
                setIsFormValid(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add item.',
                });
                console.error('Failed to add item:', response.data.message);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add item.',
            });
            console.error('Failed to add item:', error);
        }
    };

    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-10 font-bold text-4xl'>Add Item</h1>
                <form className="ml-4 mt-24 w-96" onSubmit={handleAddStockSubmit}>
                    <div className="mb-8 flex items-center">
                        <label htmlFor="input1" className="block text-xl w-60 mr-4">Item ID:</label>
                        <input
                            type="text"
                            id="input1"
                            className="w-full h-10 px-3 rounded border border-gray-500"
                            placeholder="Item ID"
                            value={newItemId}
                            disabled
                        />
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input2" className="block text-xl w-60 mr-4">Item Name:</label>
                        <input
                            type="text"
                            id="input2"
                            maxLength="30"
                            className={`w-full h-10 px-3 rounded border ${errors.newItemName ? 'border-red-500' : newItemName ? 'border-green-500' : 'border-gray-500'}`}
                            placeholder="Item Name"
                            value={newItemName}
                            onChange={handleInputChanges}
                        />
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Measure Unit:</label>
                        <select
                            id="combo-box"
                            className={`w-full h-10 px-3 rounded border ${errors.newItemMeasureUnit ? 'border-red-500' : newItemMeasureUnit ? 'border-green-500' : 'border-gray-500'}`}
                            value={newItemMeasureUnit}
                            onChange={handleSelectChange}
                        >
                            <option value="">Select an option...</option>
                            <option>Kg</option>
                            <option>Unit</option>
                        </select>
                    </div>

                    <div className="mb-8 flex items-center">
                        <label htmlFor="input4" className="block text-xl w-60 mr-4">Unit Qty:</label>
                        <input
                            type="number"
                            id="input4"
                            maxLength="4"
                            className={`w-full h-10 px-3 rounded border ${errors.newItemUnitQty ? 'border-red-500' : newItemUnitQty ? 'border-green-500' : 'border-gray-500'}`}
                            placeholder="Unit Quantity"
                            value={newItemUnitQty}
                            onChange={handleInputChanges}
                            disabled={newItemMeasureUnit === 'Kg'}
                        />
                    </div>

                    <button
                        type="submit"
                        className='bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6 hover:bg-gray-300'
                        disabled={!isFormValid}
                    >
                        Add Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddItem;
