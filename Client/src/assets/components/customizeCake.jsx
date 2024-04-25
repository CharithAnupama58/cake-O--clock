import { useState, useEffect } from 'react'
import arrowLeft from '../images/arrowLeft.png'
import radiobtn from '../images/Group 127.png'
import radiobtn1 from '../images/Group 127 (1).png'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CustomizeCake = () => {
    const [options, setOptions] = useState([]);
    const [options1, setOptions1] = useState([]);
    const [cakeDetails,setCakeDetails] =useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption1, setSelectedOption1] = useState('');
    const [additionalText, setAdditionalText] = useState('');
    const [cakeId, setCakeId] = useState('');
    const navigate = useNavigate();

    const fetchOptions = async () => {
        try {
          const response = await axios.get('http://localhost:3001/server/customizeCake/cakeTypes'); 
          setOptions(response.data.options);
        //   console.log(response.data.options);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };
      const fetchOptions1 = async () => {
        try {
          const response = await axios.get('http://localhost:3001/server/customizeCake/icingFlavour'); 
          setOptions1(response.data.options);
        //   console.log(response.data.options);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };
      useEffect(() => {
        fetchOptions();
        fetchOptions1();
        console.log(selectedOption);
        console.log(selectedOption1); 
        if(selectedOption && selectedOption1){
            fetchCakeDetails();
        }
         
    },[selectedOption,selectedOption1]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSelectChange1 = (event) => {
        setSelectedOption1(event.target.value);
    };
    const fetchCakeDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/server/customizeCake/cakeDetails/${selectedOption}/${selectedOption1}`);
            // const response = await axios.get(`http://localhost:3001/server/stockManagement/itemStockQty/${ItemId}/${selectedOption1}`);
            if (response.status === 200) {
                const details=response.data.options
                const cId=response.data.options[0].CID;
                setCakeDetails(details);
                setCakeId(cId);
                console.log(details);
            } else {
                console.error(`Unexpected server response: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching stock quantity:', error);
        }
      };
      const handleAdditionalTextChange = (event) => {
        setAdditionalText(event.target.value);
    };

    // Handle "Next" button click
    const handleNextClick = () => {
        navigate(`/CustomizeCake2/${cakeId}/${additionalText}`);
    }
  return (
    <div className='flex h-screen w-screen justify-between'>
        <Link to='/'><img src={arrowLeft} className='w-8 h-8 ml-8 mt-10' alt='Icon'></img></Link>
        <div className='flex flex-col w-full mt-6'>
            <div className='flex items-center justify-center'>
                <h1 className='text-6xl font-bold'>Order Online</h1>
            </div>
            <div className='flex flex-row justify-between'>
                <Link to='/CustomizeCake'><div className='flex flex-row'>
                    <img src={radiobtn} className='w-8 h-8 ml-32 mt-12'></img>
                    <h1 className='ml-6 text-4xl mt-10 font-semibold'>Customize Cake</h1>
                </div></Link>
                <Link to='/PictureUploading'><div className='flex flex-row mr-36'>
                    <img src={radiobtn1} className='w-8 h-8 ml-32 mt-12'></img>
                    <h1 className='ml-6 text-4xl mt-10 font-semibold'>Picture Uploading</h1>
                </div></Link>
            </div>
            <div className='flex flex-col mt-10 '>
                <h1 className='flex flex-row text-4xl font-semibold justify-center'>Cake Details</h1>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-row'>
                        <select id="combo-box" className="w-96 mt-14 ml-36 h-10 px-3 rounded border-2 border-black" value={selectedOption} onChange={handleSelectChange}>
                                <option value="">Select a Cake Type</option>
                                {options.map((option, index) => (
                                    <option key={index}>{option.cakeType}</option>
                                ))}
                        </select>
                    </div>
                    <div className='flex flex-row'>
                        <select id="combo-box" className="w-96 mt-14 ml-36 mr-36 h-10 px-3 rounded border-2 border-black" value={selectedOption1} onChange={handleSelectChange1} >
                                <option value="">Select a Flavour of the Icing</option>
                                {options1.map((option1, index) => (
                                    <option key={index}>{option1.icingType}</option>
                                ))}
                        </select>
                    </div>
                </div>
                {cakeDetails.map((details, index) => (
                <div key={index} className='flex flex-row justify-between'>
                    <div className='flex flex-row'>
                        <input id='txtPrice' className='mt-12 w-96 h-12 ml-36 border-2 border-black rounded-xl' type='text' placeholder='Price' value={details.price} />
                    </div>
                    <div className='flex flex-row'>
                        <input  className='mt-12 w-96 ml-8 mr-36 border-2 border-black rounded-xl' type='text' placeholder='Add A text to add on the Cake'value={additionalText} onChange={handleAdditionalTextChange} />
                    </div>
                </div>
            ))};
                {cakeDetails.map((details, index) => (
                <div key={index} className='flex flex-row justify-center'>
                    <div className='flex flex-col mt-6 ml-52'>
                        <img id='cakeImg' src={details.imgLink} className='w-44 h-44 mr-60'></img>
                       <button className='mt-12 ml-4 mr-60 w-36 bg-blue-500 text-white rounded' onClick={handleNextClick}>Next</button>
                    </div>
                </div>
            ))};
                
            </div>
        </div>
        
    </div>
  )
}
export default CustomizeCake;