import  { useState, useEffect, useContext} from 'react';
import image9 from '../assets/images/Vector (3).png';
import image4 from '../assets/images/image_4-removebg-preview 1.png';
import image8 from '../assets/images/image 8.png';
import image12 from '../assets/images/image 9.png';
import image11 from '../assets/images/image 11.png';
import image14 from '../assets/images/images 14.png';
import AddUser from '../components/addUser';
import AllUsers from '../components/All Users';
import AddBranch from '../components/addBranch';
import AddCake from '../components/addNewCake';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthProvider';


const AdminDashBoard = () => {
    const { authState } = useContext(AuthContext);
    const { jobRole,firstName } = authState;
    const [dateTime, setDateTime] = useState(new Date());
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const navigate = useNavigate();
    const [selectedInterface, setSelectedInterface] = useState('addUser');
   


    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
            // pollForNewOrders();
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
    
                    <div className='flex flex-col w-72 justify-center items-center'>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl`} >
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-3 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('addUser')} > 
                                <img src={image8} className='w-8 h-8' alt='Icon'></img>
                                <h1 className='font-bold text-xl'>Add User</h1>   
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl hover:bg-gray-300 `}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-4 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('allUsers')}> 
                                <img src={image12} className='w-8 h-8' alt='Icon'></img>
                                <h1 className='font-bold text-xl'>All Users</h1>   
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('addBranch')}> 
                                <img src={image14} className='w-8 h-8' alt='Icon'></img>
                                <h1 className='font-bold text-xl'>Add Branch</h1>   
                            </div>
                        </button>
                    
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-4 border-2 border-black rounded-xl hover:bg-gray-400' onClick={() => handleInterfaceChange('addNewCake')}> 
                                <img src={image11} className='w-8 h-8' alt='Icon'></img>
                                <h1 className='font-bold text-xl'>Add New Cake</h1>   
                            </div>
                        </button>
                       
                        
                    </div>
                    <div className='flex w-56 h-12 mb-3 bg-white items-center justify-around border-2 border-black rounded-xl hover:bg-gray-400'> 
                        <button className='font-bold text-2xl' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="flex flex-col items-center text-black flex-grow">
                    {selectedInterface === 'addUser' && <AddUser />}
                    {selectedInterface === 'allUsers' && <AllUsers />}
                    {selectedInterface === 'addBranch' && <AddBranch />}
                    {selectedInterface === 'addNewCake' && <AddCake />}
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

export default AdminDashBoard;
