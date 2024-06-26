import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import image4 from '../assets/images/image_4-removebg-preview 1.png';
import arrowLeft from '../assets/images/arrowLeft.png';
import radiobtn from '../assets/images/Group 127.png';
import radiobtn1 from '../assets/images/Group 127 (1).png';

const stripePromise = loadStripe('pk_test_51PA220JMl6ygdWyRGPa5J7T8DstAqNdfoU9wBJQMaCZHr1UwfP8TLd6zKoQncfWBaAIVrWDudl388EJvkWuoj0Ua00pm2Lz2DH');

const CustomizeCake = () => {
    const { cakeId, additionalText, finalPrice, selectedOption2 } = useParams();
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [Name, setName] = useState('');
    const [Contact, setContact] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [PickupDate, setPickupDate] = useState('');
    const [branchID, setBranchID] = useState('');
    const [orderId, setOrderId] = useState('');
    const [price, setPrice] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [contactError, setContactError] = useState('');
    const [branchName, setBranchName] = useState('');
    const navigate = useNavigate();

    const sortedOptions = options.slice().sort((a, b) => a.branchName.localeCompare(b.branchName));

    useEffect(() => {
        setPrice(finalPrice);
        fetchOptions();
    }, [finalPrice]);

    useEffect(() => {
        validateForm();
    }, [Name, Contact, Quantity, PickupDate, selectedOption]);

    const fetchOptions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/customizeCake/branchIds');
            setOptions(response.data.options);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleSelectChange = (event) => {
        const selectedBranch = options.find(option => option.branchName === event.target.value);
        setBranchName(selectedBranch.branchName);
        if (selectedBranch) {
            setSelectedOption(event.target.value);
            setBranchID(selectedBranch.branchID);
        }
    };

    const handlePickupChange = (event) => {
        const selectedDate = new Date(event.target.value);
        const today = new Date();
        const minDate = new Date(today.setDate(today.getDate() + 4));
        if (selectedDate >= minDate) {
            setPickupDate(event.target.value);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Date',
                text: 'Please select a date at least 4 days from today.',
            });
        }
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleContactChange = (event) => {
        const contact = event.target.value;
        setContact(contact);
    };

    const handleQuantityChange = (event) => {
        const quantity = event.target.value;
        if (/^\d{0,2}$/.test(quantity) && quantity >= 1 && quantity <= 10) {
            setQuantity(quantity);
        }
    };

    const validateForm = () => {
        const isNameValid = Name.trim() !== '';
        const isContactValid = /^\d{10}$/.test(Contact);
        const isQuantityValid = Quantity.trim() !== '' && /^\d{1,2}$/.test(Quantity) && Quantity >= 1 && Quantity <= 10;
        const isPickupDateValid = PickupDate.trim() !== '';
        const isBranchSelected = selectedOption.trim() !== '';

        setIsFormValid(isNameValid && isContactValid && isQuantityValid && isPickupDateValid && isBranchSelected);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/server/customizeCake/payments', {
                lineItems: [
                    { price_data: { currency: 'usd', product_data: { name: 'Customized Cake' }, unit_amount: parseFloat(price) * 100 }, quantity: Quantity }
                ]
            });

            const { id: sessionId, url: checkoutUrl } = response.data;
            window.open(checkoutUrl, '_blank');

            const checkPaymentStatus = setInterval(async () => {
                try {
                    const updatedSession = await axios.get(`http://localhost:3001/server/customizeCake/paymentStatus/${sessionId}`);
                    if (updatedSession.data.payment_status === 'paid') {
                        clearInterval(checkPaymentStatus);
                        saveOrderDetails();
                    } else if (updatedSession.data.payment_status === 'canceled') {
                        clearInterval(checkPaymentStatus);
                    }
                } catch (error) {
                    console.error('Error checking payment status:', error);
                }
            }, 3000);
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    const saveOrderDetails = async () => {
        try {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            const response = await axios.post('http://localhost:3001/server/customizeCake/placeCustomizeOrder', {
                Name,
                Contact,
                Quantity,
                formattedDate,
                additionalText,
                PickupDate,
                cakeId,
                branchID,
                selectedOption2
            });
            if (response.status === 200) {
                setOrderId(response.data.orderId);
                generatePDF(response.data.orderId);

                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed Successfully',
                    text: `Your order ID is ${response.data.orderId}.`,
                });
                resetForm();
                navigate('/');
            } else {
                console.error('Failed to place order:', response.data.message);
            }
        } catch (error) {
            console.error('Error saving order details:', error);
        }
    };

    const generatePDF = (orderID) => {
        const doc = new jsPDF();

        doc.setLineWidth(1);
        doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const title = 'Order Details';
        const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
        const img = new Image();
        img.src = image4;

        img.onload = () => {
            const imgWidth = 50;
            const imgHeight = (img.height * imgWidth) / img.width;
            const imgX = (pageWidth - imgWidth) / 2;
            const imgY = 40;

            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text(title, titleX, 20);

            doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            const lineSpacing = 10;
            let yOffset = imgY + imgHeight + 20;

            const orderDetails = [
                `Order ID: ${orderID}`,
                `Name: ${Name}`,
                `Contact: ${Contact}`,
                `Quantity: ${Quantity}`,
                `Pickup Date: ${PickupDate}`,
                `Cake ID: ${cakeId}`,
                `Branch Name: ${branchName}`,
                `Size: ${selectedOption2}`,
                `Price: Rs. ${price}`
            ];

            const maxTextWidth = Math.max(...orderDetails.map(detail => doc.getTextWidth(detail)));
            const detailsX = (pageWidth - maxTextWidth) / 2;

            orderDetails.forEach(detail => {
                doc.text(detail, detailsX, yOffset);
                yOffset += lineSpacing;
            });

            doc.save('order_details.pdf');
        };
    };

    const resetForm = () => {
        setName('');
        setContact('');
        setQuantity('');
        setPickupDate('');
        setSelectedOption('');
    };

    return (
        <div className='flex h-screen w-screen justify-between'>
            <Link to='/CustomizeCake'><img src={arrowLeft} className='w-8 h-8 ml-8 mt-10' alt='Icon' /></Link>
            <div className='flex flex-col w-full mt-6'>
                <div className='flex items-center justify-center'>
                    <h1 className='text-6xl font-bold'>Order Online</h1>
                </div>
                <div className='flex flex-row justify-between'>
                    <Link to='/CustomizeCake'>
                        <div className='flex flex-row'>
                            <img src={radiobtn} className='w-8 h-8 ml-32 mt-12' alt='Radio Button' />
                            <h1 className='ml-6 text-4xl mt-10 font-semibold'>Customize Cake</h1>
                        </div>
                    </Link>
                    <Link to='/PictureUploading'>
                        <div className='flex flex-row mr-36'>
                            <img src={radiobtn1} className='w-8 h-8 ml-32 mt-12' alt='Radio Button' />
                            <h1 className='ml-6 text-4xl mt-10 font-semibold'>Picture Uploading</h1>
                        </div>
                    </Link>
                </div>
                <div className='flex flex-col mt-10'>
                    <h1 className='flex flex-row text-4xl font-semibold justify-center'>Contact Details</h1>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row'>
                            <input className='mt-12 w-96 h-12 ml-36 border-2 border-black rounded-xl' type='date' placeholder='Pickup Date' value={PickupDate} onChange={handlePickupChange} />
                        </div>
                        <div className='flex flex-row'>
                            <select id="combo-box" className="w-96 mt-14 ml-36 mr-36 h-10 px-3 rounded border-2 border-black" value={selectedOption} onChange={handleSelectChange}>
                                <option value="">Select a Branch</option>
                                {sortedOptions.map((option, index) => (
                                    <option key={index} value={option.branchName}>{option.branchName}</option>
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
                                {contactError && <p className='text-red-500 ml-2 mt-12'>{contactError}</p>}
                            </div>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div className='flex flex-row'>
                                <input className='mt-12 w-96 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Quantity' value={Quantity} onChange={handleQuantityChange} />
                            </div>
                            <div className='flex flex-col mt-6'>
                                <button className={`mt-36 mr-60 bg-blue-500 w-36 text-white rounded ${isFormValid ? '' : 'opacity-50 cursor-not-allowed'}`} type='submit' disabled={!isFormValid}>Submit</button>
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
