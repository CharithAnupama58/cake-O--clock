import { useState, useEffect } from 'react';
import arrowLeft from '../assets/images/arrowLeft.png';
import radiobtn from '../assets/images/Group 127.png';
import radiobtn1 from '../assets/images/Group 127 (1).png';
import { Link, useParams, useNavigate } from 'react-router-dom';
import image4 from '../assets/images/image_4-removebg-preview 1.png'
import axios from 'axios';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';

export const PictureUploading2 = () => {
    const { imageUrl } = useParams();
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [Name, setName] = useState('');
    const [Contact, setContact] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [PickupDate, setPickupDate] = useState('');
    const [additionalText, setAdditionalText] = useState('');
    const [branchID, setBranchID] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    const fetchOptions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/customizeCake/branchIds');
            setOptions(response.data.options);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    useEffect(() => {
        fetchOptions();
        console.log(imageUrl);
    }, []);

    useEffect(() => {
        validateForm();
    }, [Name, Contact, Quantity, PickupDate, selectedOption]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        const selectedBranch = options.find(option => option.branchName === event.target.value);
        if (selectedBranch) {
            const selectedBranchId = selectedBranch.branchID;
            setBranchID(selectedBranchId);
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

    const handleAdditionalTextChange = (event) => {
        setAdditionalText(event.target.value);
    };

    const validateForm = () => {
        const isNameValid = Name.trim() !== '' && Name.length <= 50;
        const isContactValid = /^\d{10}$/.test(Contact);
        const isQuantityValid = Quantity.trim() !== '' && /^\d{1,2}$/.test(Quantity) && Quantity >= 1 && Quantity <= 10;
        const isPickupDateValid = PickupDate.trim() !== '' && validatePickupDate(PickupDate);
        const isBranchSelected = selectedOption.trim() !== '';

        setIsFormValid(isNameValid && isContactValid && isQuantityValid && isPickupDateValid && isBranchSelected);
    };

    const validatePickupDate = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        const minDate = new Date(today.setDate(today.getDate() + 4));

        if (selectedDate < minDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Pickup Date',
                text: 'Pickup date must be at least 4 days from today.',
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        console.log(imageUrl, PickupDate, Name, Contact, selectedOption, Quantity, formattedDate, additionalText, branchID);
        try {
            const response = await axios.post('http://localhost:3001/server/pictureUploading/placePictureUploadingOrder', {
                Name,
                Contact,
                Quantity,
                formattedDate,
                additionalText,
                PickupDate,
                imageUrl,
                branchID
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Order Submitted',
                    text: `Your order ID is ${response.data.orderId}.`,
                });
                setName('');
                setContact('');
                setQuantity('');
                setPickupDate('');
                setSelectedOption('');
                generatePDF(response.data.orderId);
                navigate('/')
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Order Submission Failed',
                    text: 'Please try again later.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Order Submission Failed',
                text: 'Please try again later.',
            });
            console.error('Submission failed:', error);
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
            `Branch: ${selectedOption}`,
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
                            <input className='mt-12 w-96 mr-36 h-12 ml-36 border-2 border-black rounded-xl' type='date' value={PickupDate} onChange={handlePickupChange} />
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
                                <input className='mt-12 w-96 mr-36 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Add A text to add on the Cake' value={additionalText} onChange={handleAdditionalTextChange} maxLength="30" />
                            </div>
                            <div className='flex flex-row'>
                                <input className='mt-12 w-96 ml-8 mr-36 border-2 border-black rounded-xl' type='text' placeholder='Contact' value={Contact} onChange={handleContactChange} maxLength="15" />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <div className='flex flex-row'>
                                <input className='mt-12 w-96 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Name Of the Owner' value={Name} onChange={handleNameChange} maxLength="20" />
                            </div>
                            <div className='flex flex-col mt-6'>
                                <input className='mt-6 w-96 mr-36 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Quantity' value={Quantity} onChange={handleQuantityChange} maxLength="4" />
                                <button type='submit' className={`mt-16 ml-36 w-36 bg-blue-500 text-white rounded-xl ${isFormValid ? '' : 'opacity-50 cursor-not-allowed'}`}  disabled={!isFormValid}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PictureUploading2;
