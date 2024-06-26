import  { useState, useEffect } from 'react';
import image9 from '../assets/images/Vector (3).png';
import image4 from '../assets/images/image_4-removebg-preview 1.png';
import image8 from '../assets/images/image 8.png';
import image11 from '../assets/images/image 11.png';
import BranchTodayOrders from '../components/BranchTodayOrders';
import ReleaseOrders from '../components/ReleaseOrders';
import { AuthContext } from '../Context/AuthProvider';
import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';



const BranchEmployee = () => {
    const { authState } = useContext(AuthContext);
    const { jobRole,firstName } = authState;
    const [dateTime, setDateTime] = useState(new Date());
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const navigate = useNavigate();
    const [selectedInterface, setSelectedInterface] = useState('todaysOrder');


    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000); 

 

        return () => clearInterval(interval);
    },);
  

    const handleLogout = () => {
        setShowLogoutPopup(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutPopup(false);
        navigate('/Login');
    };

    const handleCancelLogout = () => {
        setShowLogoutPopup(false);
    };
    const handleInterfaceChange = (interfaceName) => {
        setSelectedInterface(interfaceName);
    };
    

    return (
        <section className='flex flex-col h-screen'>
            <div className="flex w-full h-16 bg-custom-blue items-center text-white justify-between">
                <h1 className='ml-5 font-bold text-2xl'>{dateTime.toLocaleDateString()}</h1>
                <h1 className='ml-5 font-bold text-2xl'>{dateTime.toLocaleTimeString()}</h1>
                <div className='mr-10 flex items-center'>
                    <img src={image9} alt='Icon' className='mr-2 w-10 h-10' /> 
                    <div className='flex flex-col'> 
                        <h1 className='font-bold text-1xl'>Mr.{firstName}</h1> 
                        <h1 className='font-bold text-1xl'>{jobRole}</h1> 
                    </div>
                </div>
            </div>
            <div className="flex flex-row flex-grow">
                <div className="flex flex-col w-72 bg-custom-green items-center justify-between">
                    <div className='flex-row h-44 w-44'>
                        <img src={image4} alt="Service Image" />
                    </div>
    
                    <div className='flex flex-col w-72 justify-center items-center mb-32'>
                       
                        <button className={`w-56 h-12 bg-white items-center  mb-6  rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-4 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('todaysOrder')}> 
                                <img src={image11} className='w-8 h-8' alt='Icon'></img>
                                <h1 className='font-bold text-xl'>Today's Orders</h1>   
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl `} >
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-3 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('releaseOrders')} > 
                                <img src={image8} className='w-8 h-8' alt='Icon'></img>
                                <h1 className='font-bold text-xl'>Release Orders</h1>   
                            </div>
                        </button>
                        
                        
                    </div>
                    <div className='flex w-56 h-12 mb-3 bg-white items-center justify-around border-2 border-black rounded-xl hover:bg-gray-400'> 
                        <button className='font-bold text-2xl ' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="flex flex-col items-center text-black flex-grow">
                    {selectedInterface === 'todaysOrder' && <BranchTodayOrders />}
                    {selectedInterface === 'releaseOrders' && <ReleaseOrders />}
                </div>
                
            </div>

            {showLogoutPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg">
                        <p className="text-lg font-bold mb-4">Are you sure you want to logout?</p>
                        <div className="flex justify-between">
                            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-4" onClick={handleConfirmLogout}>Logout</button>
                            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md" onClick={handleCancelLogout}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );  
};

export default BranchEmployee;
