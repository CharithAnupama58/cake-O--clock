import  { useState, useEffect } from 'react';
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
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable'

const StockManagement = () => {
    const [dateTime, setDateTime] = useState(new Date());
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const navigate = useNavigate();
    // const [options, setOptions] = useState([]);
    // const [selectedOption, setSelectedOption] = useState('');
    const [selectedInterface, setSelectedInterface] = useState('showStock');
    // const [items, setItems] = useState([]);
    // const [itemNameDetails, setItemNameDetails] = useState(null);
    // const [searchQuery, setSearchQuery] = useState('');
    // const [ItemId, setItemId] = useState('');
    // let [Quantity, setStockQty] = useState('');
    // const [ExpiryDate, setExpDate] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000); 

    //     const fetchItems = async () => {
    //         try {
    //           const response = await axios.get('http://localhost:3001/server/stockManagement/itemDetails'); 
    //           setItems(response.data.items);
    //         } catch (error) {
    //           console.error('Error fetching items:', error);
    //         }
    //       };
    //     const fetchOptions = async () => {
    //         try {
    //           const response = await axios.get('http://localhost:3001/server/stockManagement/itemIds'); 
    //           setOptions(response.data.options);
    //         } catch (error) {
    //           console.error('Error fetching options:', error);
    //         }
    //       };
        
          
    //       fetchItems();
    //       fetchOptions();

        return () => clearInterval(interval);
    },);
    // const fetchItemDetails = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:3001/server/stockManagement/itemNameDetails/${selectedOption}`);
    //         setItemNameDetails(response.data.itemNameDetails[0]);

    //     } catch (error) {
    //         console.error('Error fetching item details:', error);
    //     }
    // };
    // useEffect(() => {
    //     if (selectedOption) {
    //         fetchItemDetails();
    //     }
    // }, [selectedOption]);

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
    // const handleSearch = (e) => {
    //     setSearchQuery(e.target.value);
    // };
    // const handleSelectChange = (event) => {
    //     setSelectedOption(event.target.value);
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log(ItemId, Quantity, ExpiryDate);
    //     try {
    //         const response = await axios.post('http://localhost:3001/server/stockManagement/addStock', {
    //             ItemId,
    //             Quantity,
    //             ExpiryDate
    //         });

    //         if (response.status === 200) {
    //             alert('Feedback submitted successfully');
    //             setItemId('');
    //         } else {
    //             // If login fails, display error message
    //             console.error('Invalid username or password');
    //         }
    //     } catch (error) {
    //         console.error('Login failed:', error);
    //         // If login fails due to network error or server down, display generic error message
    //         console.error('Failed to login. Please try again later.');
    //     }
    // };
    // const handleInputChanges = () => {
    //     setItemId(document.getElementById('input1').value);
    //     parseInt(setStockQty(document.getElementById('input4').value));
    //     setExpDate(document.getElementById('input5').value);
    // };  


    // const handleDownload = () => {
    //     const doc = new jsPDF();
    //     const table = document.getElementById('stockTable');
    //     doc.autoTable({ html: table });
    //     doc.save('table.pdf');

    // }
    // const filteredItems = items.filter(item =>
    //     (typeof item.itemId === 'string' && item.itemId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //     (typeof item.itemName === 'string' && item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //     (typeof item.measureUnit === 'string' && item.measureUnit.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //     (typeof item.unitQty === 'string' && item.unitQty.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //     (typeof item.Quantity === 'string' && item.Quantity.toLowerCase().includes(searchQuery.toLowerCase())) ||
    //     (typeof item.ExpiryDate === 'string' && item.ExpiryDate.toLowerCase().includes(searchQuery.toLowerCase()))
    // );
    

    // const renderInterface = () => {
    //     switch (selectedInterface) {
    //         case 'showStock':
    //             return (
    //                 <div className='flex flex-col items-center'>
    //                     <h1 className='mt-10 font-bold text-4xl'>Show Stock</h1>
    //                     <div>
    //                         <label className="font-semibold text-xl">Search Stock:</label>
    //                         <input type="text" className=" ml-4 border border-gray-400 px-4 py-0 mt-10 rounded-xl" placeholder="Search Stock" onChange={handleSearch}/>
    //                     </div>
                        
    //                     <table className="table-auto border border-collapse border-gray-400 mt-10" id='stockTable'>
    //                         <thead>
    //                             <tr>
    //                                 <th className="border border-gray-400 px-10 py-2">Stock ID</th>
    //                                 <th className="border border-gray-400 px-10 py-2">Item ID</th>
    //                                 <th className="border border-gray-400 px-12 py-2">Item Name</th>
    //                                 <th className="border border-gray-400 px-10 py-2">Measure Unit</th>
    //                                 <th className="border border-gray-400 px-4 py-2">Unit Quantity</th>
    //                                 <th className="border border-gray-400 px-4 py-2">Quantity</th>
    //                                 <th className="border border-gray-400 px-12 py-2">Expiory Date</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody className='flex-row justify-center items-center'>
    //                         {filteredItems.map((item, index) => (
    //                                     <tr key={index}>
    //                                     <td className="px-4  text-center border-r border-gray-400">{item.StockId}</td>
    //                                     <td className="px-4  text-center border-r border-gray-400">{item.itemId}</td>
    //                                     <td className="px-4  text-center border-r border-gray-400">{item.itemName}</td>
    //                                     <td className="px-4  text-center border-r border-gray-400">{item.measureUnit}</td>
    //                                     <td className="px-4  text-center border-r border-gray-400">{item.unitQty}</td>
    //                                     <td className="px-4  text-center border-r border-gray-400">{item.Quantity}</td>
    //                                     <td className="px-4  text-center border-r border-gray-400">{item.ExpiryDate}</td>
    //                                     </tr>
    //                                 ))}
    //                          </tbody>
    //                     </table>

    //                     <button className='flex bg-custom-blue text-white font-bold rounded-xl mt-12 py-1 px-6' onClick={handleDownload}>Download Report</button>
    //                 </div>
    //             );
    //         case 'addStock':
    //             return (
    //                 <div className='flex flex-col items-center'>
    //                     <h1 className='mt-10 font-bold text-4xl'>Add Stock</h1>
    //                     <form className="ml-4 mt-16 w-96" onSubmit={handleSubmit}>
    //                         <div className="mb-8 flex items-center">
    //                             <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Item Name:</label>
    //                             <select id="combo-box" className="w-full h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange}>
    //                                 <option value="">Select an option...</option>
    //                                 {options.map((option, index) => (
    //                                     <option key={index}>{option.itemName}</option>
    //                                 ))}
    //                             </select>
    //                         </div>
                            
    //                             <div  className="mb-8 flex items-center">
    //                                 <label htmlFor="input1" className="block text-xl w-60 mr-4">Item ID:</label>
    //                                 <input type="text" id="input1" className="w-full h-10 px-3 rounded border border-black" placeholder="Item ID" value={itemNameDetails?.itemId||''} onChange={handleInputChanges}/>
    //                             </div>
                      
                            
    //                             <div  className="mb-8 flex items-center">
    //                                 <label htmlFor="input2" className="block text-xl w-60 mr-4">Measure Unit:</label>
    //                                 <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Measure Unit" value={itemNameDetails?.measureUnit||''} />
    //                             </div>
                           
                         
    //                             <div  className="mb-8 flex items-center">
    //                                 <label htmlFor="input3" className="block text-xl w-60 mr-4">Unit Qty:</label>
    //                                 <input type="text" id="input3" className="w-full h-10 px-3 rounded border border-black" placeholder="Unit Quantity" value={itemNameDetails?.unitQty||''}  />
    //                             </div>
                           
                            
    //                         <div className="mb-8 flex items-center">
    //                             <label htmlFor="input4" className="block text-xl w-60 mr-4">Stock Qty:</label>
    //                             <input type="number" id="input4" className="w-full h-10 px-3 rounded border border-black" placeholder="Stock Quantity" value={parseInt(Quantity)} onChange={handleInputChanges}  />
    //                         </div>
                            
                            
    //                         <div  className="mb-8 flex items-center">
    //                             <label htmlFor="input5" className="block text-xl w-60 mr-4">Expiory Date:</label>
    //                             <input type="date" id="input5" className="w-full h-10 px-3 rounded border border-black" placeholder="Exp Date" value={ExpiryDate} onChange={handleInputChanges} />
    //                         </div>
                
    //                         <button className=' bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6'>Add Stock</button>
                            
    //                     </form>
    //                 </div>



    //             );
    //         case 'ReleaseStock':
    //                 return (
    //                     <div>
    //                         <h1>Release Stock Interface</h1>
    //                     </div>
    //                 );
    //         case 'AddItem':
    //             return (
    //                 <div>
    //                     <h1>Add Item Interface</h1>
    //                 </div>
    //             );
    //         case 'DeleteItem':
    //             return (
    //                 <div>
    //                     <h1>Delete Item Interface</h1>
    //                 </div>
    //             );
    //         case 'ExpioryDates':
    //             return (
    //                 <div>
    //                     <h1>Expiory Dates Out</h1>
    //                 </div>
    //             );
    //         default:
    //             return null;
    //     }
    // };

    return (
        <section className='flex flex-col h-screen'>
            <div className="flex w-full h-16 bg-custom-blue items-center text-white justify-between">
                <h1 className='ml-5 font-bold text-2xl'>{dateTime.toLocaleDateString()}</h1>
                <h1 className='ml-5 font-bold text-2xl'>{dateTime.toLocaleTimeString()}</h1>
                <div className='mr-10 flex items-center'>
                    <img src={image9} alt='Icon' className='mr-2 w-10 h-10' /> 
                    <div className='flex flex-col'> 
                        <h1 className='font-bold text-1xl'>Mr.Pramuddhika</h1> 
                        <h1 className='font-bold text-1xl'>Stock Keeper</h1> 
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
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-4 border-2 border-black rounded-xl' onClick={() => handleInterfaceChange('showStock')} > 
                                <img src={image8} className='w-10 h-10' alt='Icon'></img>
                                <h1 className='font-bold text-2xl'>Show Stock</h1>   
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl `}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-4 border-2 border-black rounded-xl' onClick={() => handleInterfaceChange('addStock')}> 
                                <img src={image12} className='w-10 h-10' alt='Icon'></img>
                                <h1 className='font-bold text-2xl'>Add Stock</h1>   
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl`} >
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-4 border-2 border-black rounded-xl' onClick={() => handleInterfaceChange('releaseStock')}> 
                                <img src={image10} className='w-10 h-10' alt='Icon'></img>
                                <h1 className='font-bold text-2xl'>Release Stock</h1>   
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around mb-4 border-2 border-black rounded-xl' onClick={() => handleInterfaceChange('addItem')}> 
                                <img src={image11} className='w-10 h-10' alt='Icon'></img>
                                <h1 className='font-bold text-2xl'>Add Item</h1>   
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl `} >
                            <div className='flex w-56 h-12 bg-white items-center justify-around border-2 border-black rounded-xl' onClick={() => handleInterfaceChange('deleteItem')}> 
                                <img src={image13} className='w-10 h-10' alt='Icon'></img>
                                <h1 className='font-bold text-2xl'>Delete Item</h1>   
                            </div>
                        </button>
                        <button className={`w-56 h-12 bg-white items-center justify-around mb-4  rounded-xl`}>
                            <div className='flex w-56 h-12 bg-white items-center justify-around border-2 border-black rounded-xl' onClick={() => handleInterfaceChange('expioryDates')}> 
                                <img src={image14} className='w-10 h-10' alt='Icon'></img>
                                <h1 className='font-bold text-2xl'>Expiory Dates</h1>   
                            </div>
                        </button>
                    </div>
                    <div className='flex w-56 h-12 mb-3 bg-white items-center justify-around border-2 border-black rounded-xl'> 
                        <button className='font-bold text-2xl' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="flex flex-col items-center text-black flex-grow">
                    {selectedInterface === 'showStock' && <ShowStock />}
                    {selectedInterface === 'addStock' && <AddStock />}
                    {selectedInterface === 'releaseStock' && <ReleaseStock />}
                    {selectedInterface === 'addItem' && <AddItem />}
                    {selectedInterface === 'deleteItem' && <DeleteItem />}
                    {selectedInterface === 'expioryDates' && <ExpioryDates/>}
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
