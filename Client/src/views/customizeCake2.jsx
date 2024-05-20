import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {  Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import arrowLeft from '../assets/images/arrowLeft.png';
import radiobtn from '../assets/images/Group 127.png';
import radiobtn1 from '../assets/images/Group 127 (1).png';

const stripePromise = loadStripe('pk_test_51PA220JMl6ygdWyRGPa5J7T8DstAqNdfoU9wBJQMaCZHr1UwfP8TLd6zKoQncfWBaAIVrWDudl388EJvkWuoj0Ua00pm2Lz2DH');

const CustomizeCake = () => {
    const { cakeId, additionalText } = useParams();
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [Name, setName] = useState('');
    const [Contact, setContact] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [PickupDate, setPickupDate] = useState('');
    const [branchID, setBranchID] = useState('');
    const [price, setPrice] = useState('');
    const sortedOptions = options.slice().sort((a, b) => a.branchName.localeCompare(b.branchName));

 

    const fetchOptions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/customizeCake/branchIds');
            setOptions(response.data.options);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchCakePrice = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/server/customizeCake/cakePrice/${cakeId}`);
            setPrice(response.data.options);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    useEffect(() => {
        fetchOptions();
        fetchCakePrice();
    }, []);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        const selectedBranch = options.find(option => option.branchName === event.target.value);
        if (selectedBranch) {
            const selectedBranchId = selectedBranch.branchID;
            setBranchID(selectedBranchId);
        }
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        let amount = parseFloat(price[0].price);
        console.log(amount);
        try {
            const response = await axios.post('http://localhost:3001/server/customizeCake/payments', {
                lineItems: [
                    { price_data: { currency: 'usd', product_data: { name: 'Customized Cake' }, unit_amount: parseFloat(price[0].price)*100 }, quantity: Quantity }
                ]
            });

            const sessionId = response.data.id;
            console.log(sessionId);
            

            const stripe = await stripePromise;
            const session = await stripe.redirectToCheckout({ sessionId });
            const checkoutUrl = session.url;
            const result = window.open(checkoutUrl, '_blank');
            console.log(result);
            if (sessionId !== null){
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                
                // Send orderData to your backend to save to the database
                const response = await axios.post('http://localhost:3001/server/customizeCake/placeCustomizeOrder', {
                    Name,
                    Contact,
                    Quantity,
                    formattedDate,
                    additionalText,
                    PickupDate,
                    cakeId,
                    branchID
                });
                if (response.status === 200) {
                    alert('Feedback submitted successfully');
                    setName('');
                    setContact('');
                    setQuantity('');
                    setPickupDate('');
                    setSelectedOption('');
                } else {
                    console.error('Invalid username or password');
                }
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <div className='flex h-screen w-screen justify-between'>
            <Link to='/CustomizeCake'><img src={arrowLeft} className='w-8 h-8 ml-8 mt-10' alt='Icon'></img></Link>
            <div className='flex flex-col w-full mt-6'>
                <div className='flex items-center justify-center'>
                    <h1 className='text-6xl font-bold'>Order Online</h1>
                </div>
                <div className='flex flex-row justify-between'>
                    <Link to='/CustomizeCake'>
                        <div className='flex flex-row'>
                            <img src={radiobtn} className='w-8 h-8 ml-32 mt-12'></img>
                            <h1 className='ml-6 text-4xl mt-10 font-semibold'>Customize Cake</h1>
                        </div>
                    </Link>
                    <Link to='/PictureUploading'>
                        <div className='flex flex-row mr-36'>
                            <img src={radiobtn1} className='w-8 h-8 ml-32 mt-12'></img>
                            <h1 className='ml-6 text-4xl mt-10 font-semibold'>Picture Uploading</h1>
                        </div>
                    </Link>
                </div>
                <div className='flex flex-col mt-10'>
                    <h1 className='flex flex-row text-4xl font-semibold justify-center'>Contact Details</h1>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row'>
                            <input className='mt-12 w-96 h-12 ml-36 border-2 border-black rounded-xl' type='Date' placeholder='Pickup Date' value={PickupDate} onChange={handlePickupChange} />
                        </div>
                        <div className='flex flex-row'>
                            <select id="combo-box" className="w-96 mt-14 ml-36 mr-36 h-10 px-3 rounded border-2 border-black" value={selectedOption} onChange={handleSelectChange}>
                                <option value="">Select a Branch</option>
                                {sortedOptions.map((option, index) => (
                                    <option key={index}>{option.branchName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-row justify-between'>
                            <div className='flex flex-row'>
                                <input className='mt-12 w-96 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Name Of the Owner' value={Name} onChange={handleNameChange} />
                            </div>
                            <div className='flex flex-row'>
                                <input className='mt-12 w-96 ml-8 mr-36 border-2 border-black rounded-xl' type='text' placeholder='Contact' value={Contact} onChange={handleContactChange} />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div className='flex flex-row'>
                                <input className='mt-12 w-96 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Quantity' value={Quantity} onChange={handleQuantityChange} />
                            </div>
                            
                            <div className='flex flex-col mt-6'>
                                <button  className='mt-36 mr-60 bg-blue-500 w-36 text-white rounded'>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const StripeWrappedCustomizeCake = () => {
    return (
        <Elements stripe={stripePromise}>
            <CustomizeCake />
        </Elements>
    );
};

export default StripeWrappedCustomizeCake;
