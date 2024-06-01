import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddCake = () => {
    const [cakeId, setCakeId] = useState('');
    const [cakeType, setCakeType] = useState('');
    const [icingType, setIcingType] = useState('');
    const [price, setPrice] = useState('');
    const [imgUrl, setImgUrl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        generateNewItemIdFromBackend();
    }, []);

    useEffect(() => {
        validateForm();
    }, [cakeType, icingType, price, imgUrl]);

    const generateNewItemIdFromBackend = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/admin/cakeId');
            setCakeId(response.data.newCakeId);
        } catch (error) {
            console.error('Error generating new Item ID:', error);
        }
    };

    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/server/admin/addCake', {
                cakeId,
                cakeType,
                icingType,
                price,
                imgUrl
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Cake added successfully',
                });
                setCakeId('');
                setCakeType('');
                setIcingType('');
                setPrice('');
                setImgUrl(null);
                generateNewItemIdFromBackend();
            }
        } catch (error) {
            console.error('Failed to add cake:', error);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:3001/cakes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const url = response.data.imageUrl;
            setImgUrl(url);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    };

    const validateForm = () => {
        const textRegex = /^[A-Za-z\s]{1,20}$/; // Allows letters and spaces, max length 20
        const priceRegex = /^\d+(\.\d{1,2})?$/; // Allows numbers with up to two decimal places
        const isCakeTypeValid = textRegex.test(cakeType);
        const isIcingTypeValid = textRegex.test(icingType);
        const isPriceValid = priceRegex.test(price) && price > 0;
        const isImageValid = imgUrl !== null;

        setIsFormValid(isCakeTypeValid && isIcingTypeValid && isPriceValid && isImageValid);
    };

    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-10 font-bold text-4xl'>Add Cake</h1>
                <form className="ml-4 mt-16 w-96" onSubmit={handleAddStockSubmit}>
                    <div className="mb-8 flex items-center">
                        <label htmlFor="input1" className="block text-xl w-60 mr-4">Cake ID:</label>
                        <input type="text" id="input1" className="w-full h-10 px-3 rounded border border-black" placeholder="Cake Id" value={cakeId} readOnly />
                    </div>
                    <div className="mb-8 flex items-center">
                        <label htmlFor="input2" className="block text-xl w-60 mr-4">Cake Type:</label>
                        <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Cake Type" value={cakeType} onChange={(e) => setCakeType(e.target.value)} maxLength={20} />
                    </div>
                    <div className="mb-8 flex items-center">
                        <label htmlFor="input2" className="block text-xl w-60 mr-4">Icing Type:</label>
                        <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Icing Type" value={icingType} onChange={(e) => setIcingType(e.target.value)} maxLength={20} />
                    </div>
                    <div className="mb-8 flex items-center">
                        <label htmlFor="input2" className="block text-xl w-60 mr-4">Price:</label>
                        <input type="number" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="mb-8 flex items-center">
                        <label htmlFor="input2" className="block text-xl w-60 mr-4">Image:</label>
                        <input type="file" id="input2" className="w-full h-10 px-3 rounded border border-black" onChange={handleImageChange} />
                    </div>
                    {imgUrl && (
                        <div className="mb-6 flex justify-center">
                            <img src={imgUrl} alt="Cake" className="w-24 h-24 object-cover rounded-lg" />
                        </div>
                    )}
                    <button className={`bg-custom-blue text-white font-bold rounded-xl mt-2 ml-20 px-6 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isFormValid}>Add Cake</button>
                </form>
            </div>
        </div>
    );
};

export default AddCake;
