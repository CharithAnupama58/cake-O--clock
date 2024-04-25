import { useState, useEffect } from 'react'
import arrowLeft from '../images/arrowLeft.png'
import radiobtn from '../images/Group 127.png'
import radiobtn1 from '../images/Group 127 (1).png'
import { Link,useParams } from 'react-router-dom';
import axios from 'axios';

export const PictureUploading2 = () => {
    const {imageUrl} =useParams();
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [Name, setName] = useState('');
    const [Contact, setContact] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [PickupDate, setPickupDate] = useState('');
    const [additionalText, setAdditionalText] = useState('');
    


    const fetchOptions = async () => {
        try {
          const response = await axios.get('http://localhost:3001/server/customizeCake/branchIds'); 
          setOptions(response.data.options);
        //   console.log(response.data.options);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };
      useEffect(() => {
        fetchOptions();
        console.log(imageUrl);

        
         
    },[selectedOption]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handlePickupChange = (event) => {
        setPickupDate(event.target.value);
    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleContactChange = (event) => {
        setContact(event.target.value);
    };
    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };
    const handleAdditionalTextChange = (event) => {
        setAdditionalText(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        console.log(imageUrl,PickupDate,Name,Contact,selectedOption,Quantity,formattedDate,additionalText);
        try {
            const response = await axios.post('http://localhost:3001/server/customizeCake/placeCustomizeOrder', {
                Name,
                Contact,
                Quantity,
                formattedDate,
                additionalText,
                PickupDate,
                imageUrl
            });

            if (response.status === 200) {
                alert('Feedback submitted successfully');
                setName('');
                setContact('');
                setQuantity('');
                setPickupDate('');
                setSelectedOption('');
                // navigate(`/CustomizeCake2/${cakeId}/${additionalText}`);
            } else {
                console.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            console.error('Failed to login. Please try again later.');
        }
    };
  return (
    <div className='flex h-screen w-screen justify-between'>
        <Link to='/PictureUploading'><img src={arrowLeft} className='w-8 h-8 ml-8 mt-10' alt='Icon'></img></Link>
        <div className='flex flex-col w-full mt-6'>
            <div className='flex items-center justify-center'>
                <h1 className='text-6xl font-bold'>Order Online</h1>
            </div>
            <div className='flex flex-row justify-between'>
                <Link to='/CustomizeCake'><div className='flex flex-row'>
                    <img src={radiobtn1} className='w-8 h-8 ml-32 mt-12'></img>
                    <h1 className='ml-6 text-4xl mt-10 font-semibold'>Customize Cake</h1>
                </div></Link>
                <Link to='/PictureUploading'><div className='flex flex-row mr-36'>
                    <img src={radiobtn} className='w-8 h-8 ml-32 mt-12'></img>
                    <h1 className='ml-6 text-4xl mt-10 font-semibold'>Picture Uploading</h1>
                </div></Link>
            </div>
            <div className='flex flex-col mt-10 '>
                <h1 className='flex flex-row text-4xl font-semibold justify-center'>Contact Details</h1>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-row'>
                        <input className='mt-12 w-96 mr-36 h-12 ml-36 border-2 border-black rounded-xl' type='Date' placeholder='Select Pickup Date' value={PickupDate} onChange={handlePickupChange}  />
                    </div>
                    <div className='flex flex-row'>
                        <select id="combo-box" className="w-96 mt-14 ml-36 mr-36 h-10 px-3 rounded border-2 border-black" value={selectedOption} onChange={handleSelectChange}>
                                <option value="">Select a Branch</option>
                                {options.map((option, index) => (
                                    <option key={index}>{option.branchName}</option>
                                ))}
                        </select>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-row'>
                        <input className='mt-12 w-96 mr-36 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Add A text to add on the Cake' value={additionalText} onChange={handleAdditionalTextChange}  />
                    </div>
                    <div className='flex flex-row'>
                        <input className='mt-12 w-96 ml-8 mr-36 border-2 border-black rounded-xl' type='text' placeholder='Contact' value={Contact} onChange={handleContactChange} />
                    </div>
                </div>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-row'>
                        <input className='mt-12 w-96 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Name Of the Owner' value={Name} onChange={handleNameChange}  />
                    </div>
                    <div className='flex flex-col mt-6'>
                       <input className='mt-6 w-96 mr-36 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Quantity' value={Quantity} onChange={handleQuantityChange}  />
                       <button className='mt-16 ml-36 w-36 bg-blue-500 text-white rounded-xl'>Submit</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    </div>
  )
}
export default PictureUploading2;