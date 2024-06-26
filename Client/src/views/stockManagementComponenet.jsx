import { useState, useEffect, useContext } from 'react';
import image9 from '../assets/images/Vector (3).png';
import image10 from '../assets/images/image 10.png';
import image4 from '../assets/images/image_4-removebg-preview 1.png';
import image8 from '../assets/images/image 8.png';
import image12 from '../assets/images/image 9.png';
import image11 from '../assets/images/image 11.png';
import image13 from '../assets/images/image 13.png';
import image14 from '../assets/images/images 14.png';
import { useNavigate } from 'react-router-dom';
import ShowStock from '../components/showStock';
import AddStock from '../components/addStock';
import ReleaseStock from '../components/releaseStock';
import AddItem from '../components/addItem';
import DeleteItem from '../components/deleteItem';
import ExpioryDates from '../components/expioryDates';
import { AuthContext } from '../Context/AuthProvider';

const StockManagement = () => {
    const { authState } = useContext(AuthContext);
    const { jobRole, firstName } = authState;
    const [dateTime, setDateTime] = useState(new Date());
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const navigate = useNavigate();
    const [selectedInterface, setSelectedInterface] = useState('showStock');

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
                        {[
                            { name: 'Show Stock', icon: image8, interface: 'showStock' },
                            { name: 'Add Stock', icon: image12, interface: 'addStock' },
                            { name: 'Release Stock', icon: image10, interface: 'releaseStock' },
                            { name: 'Add Item', icon: image11, interface: 'addItem' },
                            { name: 'Delete Item', icon: image13, interface: 'deleteItem' },
                            { name: 'Expiory Dates', icon: image14, interface: 'expioryDates' }
                        ].map((button) => (
                            <button
                                key={button.name}
                                className="w-56 h-12 mb-4 bg-white rounded-xl hover:bg-gray-200"
                                onClick={() => handleInterfaceChange(button.interface)}
                            >
                                <div className='flex w-56 h-12 items-center justify-around border-2 border-black rounded-xl'>
                                    <img src={button.icon} className='w-10 h-10' alt='Icon' />
                                    <h1 className='font-bold text-2xl'>{button.name}</h1>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className='flex w-56 h-12 mb-3 bg-white items-center justify-around border-2 border-black rounded-xl hover:bg-gray-200'>
                        <button className='font-bold text-2xl ' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="flex flex-col items-center text-black flex-grow">
                    {selectedInterface === 'showStock' && <ShowStock />}
                    {selectedInterface === 'addStock' && <AddStock />}
                    {selectedInterface === 'releaseStock' && <ReleaseStock />}
                    {selectedInterface === 'addItem' && <AddItem />}
                    {selectedInterface === 'deleteItem' && <DeleteItem />}
                    {selectedInterface === 'expioryDates' && <ExpioryDates />}
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

export default StockManagement;
