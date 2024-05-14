
import  { useState, useEffect } from 'react';
import axios from 'axios';


const AddCake = () => {
    const [cakeId, setCakeId] = useState('');
    const [cakeType, setCakeType] = useState('');
    const [icingType, setIcingType] = useState('');
    const [price, setPrice] = useState('');
    const [imgUrl, setImgUrl] = useState(null);

    
      
 
    useEffect(() => {
        generateNewItemIdFromBackend();


         
    }, []);
   
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
        console.log(cakeId,cakeType,icingType,price,imgUrl);
        try {
            const response = await axios.post('http://localhost:3001/server/admin/addCake', {
                cakeId,
                cakeType,
                icingType,
                price,
                imgUrl

            });

            if (response.status === 200) {
                alert('Feedback submitted successfully');
                setCakeId('');
                setCakeType('');
                setIcingType('');
                setPrice('');
                setImgUrl(null);
                generateNewItemIdFromBackend();
            } else {
                console.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            console.error('Failed to login. Please try again later.');
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
            console.log(url);
        } catch (error) {
            
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    };
    
    
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Add Cake</h1>
                        <form className="ml-4 mt-16 w-96" onSubmit={handleAddStockSubmit} >
                            
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input1" className="block text-xl w-60 mr-4">Cake ID:</label>
                                    <input type="text" id="input1" className="w-full h-10 px-3 rounded border border-black" placeholder="Cake Id" value={cakeId} onChange={(e) => setCakeId(e.target.value)}/>
                                </div>
                      
                            
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Cake Type:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Cake Type" value={cakeType} onChange={(e) => setCakeType(e.target.value)} />
                                </div>

                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Icing Type:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Icing Type" value={icingType}  onChange={(e) => setIcingType(e.target.value)}/>
                                </div>

                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Price:</label>
                                    <input type="number" id="input2" className="w-full h-10 px-3 rounded border border-black"  placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div  className="mb-8 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Image:</label>
                                    <input type="file" id="input2" className="w-full h-10 px-3 rounded border border-black"  placeholder="Price"  onChange={handleImageChange} />
                                </div>
                            <button className=' bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6'>Add Cake</button>
                        </form>
                    </div>
            
        </div>
    );
};

export default AddCake;