import { useState, useEffect } from 'react';
import arrowLeft from '../assets/images/arrowLeft.png';
import radiobtn from '../assets/images/Group 127.png';
import radiobtn1 from '../assets/images/Group 127 (1).png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CustomizeCake = () => {
    const [options, setOptions] = useState([]);
    const [options1, setOptions1] = useState([]);
    const [cakeDetails, setCakeDetails] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption1, setSelectedOption1] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');
    const [additionalText, setAdditionalText] = useState('');
    const [cakeId, setCakeId] = useState('');
    const [basePrice, setBasePrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
    const navigate = useNavigate();

    const fetchOptions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/customizeCake/cakeTypes');
            setOptions(response.data.options);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchOptions1 = async (selectedOption) => {
        try {
            const response = await axios.get(`http://localhost:3001/server/customizeCake/icingFlavour/${selectedOption}`);
            setOptions1(response.data.options);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    useEffect(() => {
        fetchOptions();
        if (selectedOption && selectedOption1) {
            fetchCakeDetails();
        }
    }, [selectedOption, selectedOption1]);

    useEffect(() => {
        validateForm();
    }, [selectedOption, selectedOption1, selectedOption2, additionalText]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        fetchOptions1(event.target.value);
    };

    const handleSelectChange1 = (event) => {
        setSelectedOption1(event.target.value);
    };

    const handleSelectChange2 = (event) => {
        setSelectedOption2(event.target.value);
        updatePrice(event.target.value);
    };

    const fetchCakeDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/server/customizeCake/cakeDetails/${selectedOption}/${selectedOption1}`);
            if (response.status === 200) {
                const details = response.data.options;
                const cId = response.data.options[0].CID;
                setCakeDetails(details);
                setCakeId(cId);
                setBasePrice(details[0].price);
                updatePrice(selectedOption2, details[0].price);
            } else {
                console.error(`Unexpected server response: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching cake details:', error);
        }
    };

    const updatePrice = (size, basePrice = null) => {
        if (basePrice === null) basePrice = cakeDetails[0]?.price || 0;
        let newPrice = basePrice;
        if (size === 'Small(1 Kilo)') {
            newPrice = basePrice;
        } else if (size === 'Medium(2.5 Kilo)') {
            newPrice = basePrice * 2.5;
        } else if (size === 'Large(4 Kilo)') {
            newPrice = basePrice * 4;
        }
        setFinalPrice(newPrice);
    };

    const handleAdditionalTextChange = (event) => {
        setAdditionalText(event.target.value);
    };

    const handleNextClick = () => {
        navigate(`/CustomizeCake2/${cakeId}/${additionalText}/${finalPrice}/${selectedOption2}`);
    };

    const validateForm = () => {
        if (selectedOption && selectedOption1 && selectedOption2 && additionalText && additionalText.length <= 50) {
            setIsNextButtonDisabled(false);
        } else {
            setIsNextButtonDisabled(true);
        }
    };

    return (
        <div className='flex h-screen w-screen justify-between'>
            <Link to='/'><img src={arrowLeft} className='w-8 h-8 ml-8 mt-10' alt='Icon' /></Link>
            <div className='flex flex-col w-full mt-6'>
                <div className='flex items-center justify-center'>
                    <h1 className='text-6xl font-bold'>Order Online</h1>
                </div>
                <div className='flex flex-row justify-between'>
                    <Link to='/CustomizeCake'><div className='flex flex-row'>
                        <img src={radiobtn} className='w-8 h-8 ml-32 mt-12' alt='Radio Button' />
                        <h1 className='ml-6 text-4xl mt-10 font-semibold'>Customize Cake</h1>
                    </div></Link>
                    <Link to='/PictureUploading'><div className='flex flex-row mr-36'>
                        <img src={radiobtn1} className='w-8 h-8 ml-32 mt-12' alt='Radio Button' />
                        <h1 className='ml-6 text-4xl mt-10 font-semibold'>Picture Uploading</h1>
                    </div></Link>
                </div>
                <div className='flex flex-col mt-10'>
                    <h1 className='flex flex-row text-4xl font-semibold justify-center'>Cake Details</h1>
                    <div className='flex flex-row justify-around'>
                        <div className='flex flex-row'>
                            <select id="combo-box" className="w-72 mt-14 ml-36 h-10 px-3 rounded border-2 border-black" value={selectedOption} onChange={handleSelectChange}>
                                <option value="">Select a Cake Type</option>
                                {options.map((option, index) => (
                                    <option key={index} value={option.cakeType}>{option.cakeType}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-row'>
                            <select id="combo-box" className="w-72 mt-14 ml-40 mr-36 h-10 px-3 rounded border-2 border-black" value={selectedOption1} onChange={handleSelectChange1}>
                                <option value="">Select a Flavour of the Icing</option>
                                {options1.map((option1, index) => (
                                    <option key={index} value={option1.icingType}>{option1.icingType}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-row'>
                            <select id="combo-box" className="w-72 mt-14 ml-12 mr-36 h-10 px-3 rounded border-2 border-black" value={selectedOption2} onChange={handleSelectChange2}>
                                <option value="">Select a Size For Cake</option>
                                <option value="Small(1 Kilo)">Small(1 Kilo)</option>
                                <option value="Medium(2.5 Kilo)">Medium(2.5 Kilo)</option>
                                <option value="Large(4 Kilo)">Large(4 Kilo)</option>
                            </select>
                        </div>
                    </div>
                    {cakeDetails.length > 0 && (
                        <div className='flex flex-row justify-between mt-5'>
                            <div className='flex flex-row'>
                                <input id='txtPrice' className='mt-12 w-72 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Price' value={`${finalPrice}`} readOnly />
                            </div>
                            <div className='flex flex-row'>
                                <input className='mt-12 h-12 w-72 ml-24 mr-36 border-2 border-black rounded-xl' type='text' placeholder='Add A text to add on the Cake' maxLength={50} value={additionalText} onChange={handleAdditionalTextChange} />
                            </div>
                            <div className='flex flex-row'>
                                <img id='cakeImg' src={cakeDetails[0]?.imgLink} className='w-44 h-44 mr-60 mt-12' alt='Cake' />
                            </div>
                        </div>
                    )}
                    {cakeDetails.length > 0 && (
                        <div className='flex flex-row justify-center'>
                            <div className='flex flex-col mt-6 ml-52'>
                                <button className={`mt-12 ml-4 mr-60 w-36 bg-blue-500 text-white rounded ${isNextButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleNextClick} disabled={isNextButtonDisabled}>Next</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomizeCake;
