import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const CustomizeOrder = () => {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [showOrdersToPrepare, setShowOrdersToPrepare] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {    
        setSelectedOption('All Orders');      
        handleAllOrders();

        // setInterval(handleAllOrders, 5000);
        
        
    },[]);

    const handleAllOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/order/AllorderDetails'); 
            setItems(response.data.items);
            setShowAllOrders(true);
            setShowOrdersToPrepare(false);
          } catch (error) {
            console.error('Error fetching items:', error);
            Swal.fire({
                icon: 'info',
                title: 'No Orders Yet',
                text: 'There are currently no orders to prepare.',
            });
          }
        };
        const handleOrdersToPrepare = async () => {
            try {
                const response = await axios.get('http://localhost:3001/server/order/orderDetails'); 
                setOrders(response.data.items);
                setShowOrdersToPrepare(true);
                setShowAllOrders(false);
              } catch (error) {
                
                console.error('Error fetching items:', error);
                Swal.fire({
                    icon: 'info',
                    title: 'No Orders to Prepare',
                    text: 'There are currently no orders to prepare.',
                });
                setSelectedOption('All Orders');
              }
        };
        const updateStatus = async (orderId) => {
            console.log(orderId);
            try {
                const response = await axios.post('http://localhost:3001/server/order/updateStatus', {
                    orderId,
                });
    
                if (response.status === 200) {
                    alert('Feedback submitted successfully');
                    handleOrdersToPrepare();
                } else {
                    console.error('Invalid username or password');
                }
            } catch (error) {
                console.error('Login failed:', error);
                console.error('Failed to login. Please try again later.');
            }
        };
    
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        const selectedOption1 = event.target.value;

        switch (selectedOption1) {
            case "All Orders":
                handleAllOrders();
                break;
                
            case "Orders To Prepare":
                handleOrdersToPrepare();
                break; 
        }
    };
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredItems = items.filter(item =>
        (typeof item.orderId === 'string' && item.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.name === 'string' && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.contact === 'string' && item.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.quantity === 'string' && item.quantity.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.pickupDate === 'string' && item.pickupDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.status === 'string' && item.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleDownload = () => {
        let table;
        let doc;
        let excludedColumnIndex;
        let rows;
        switch (selectedOption) {
            case "All Orders":
                table = document.getElementById('stockTable');
                doc = new jsPDF();
                doc.autoTable({ html: table });
                doc.save('table.pdf');
                break;
                
            case "Orders To Prepare":
                doc = new jsPDF();
                table = document.getElementById('orderPrepareTable');
                if (table) {
                    excludedColumnIndex = 9; 
                    rows = table.getElementsByTagName('td');
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i]) {
                            let cell = rows[i].getElementsByTagName('td')[excludedColumnIndex];
                            if (cell) {
                                rows[i].removeChild(cell);
                            }
                        }
                    }
                    doc.autoTable({ html: table });
                    doc.save('table.pdf'); 
                }
                break;
            }
    }
    const renderTable = () => {
        if (showAllOrders ) {
            return (
                <div>
                    <div className='flex justify-center'>
                        <label className="font-semibold text-xl mt-8">Search Stock:</label>
                        <input type="text" className=" ml-4 border border-gray-400 px-4 py-0 mt-8 rounded-xl" placeholder="Search Orders" onChange={handleSearch} />
                    </div> 
                    <table className="table-auto border border-collapse border-gray-400 mt-14" id='stockTable'>
                        <thead>
                                    <tr>
                                        <th className="border border-gray-400 px-5 py-3">Order ID</th>
                                        <th className="border border-gray-400 px-10 py-3">Name</th>
                                        <th className="border border-gray-400 px-12 py-3">Contact</th>
                                        <th className="border border-gray-400 px-2 py-3">Quantity</th>
                                        <th className="border border-gray-400 px-4 py-3">Pickup Date</th>
                                        <th className="border border-gray-400 px-4 py-3">Image Link</th>
                                        <th className="border border-gray-400 px-12 py-3">Cake Text</th>
                                        <th className="border border-gray-400 px-8 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className='flex-row justify-center items-center'>
                                    {filteredItems.map((item, index) => (
                                        <tr key={index} className="my-4">
                                            <td className="px-4 text-center border-r border-gray-400 py-3">{item.orderId}</td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">{item.name}</td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">{item.contact}</td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">{item.quantity}</td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">
                                                {(() => {
                                                    const pickupDate = new Date(item.pickupDate);
                                                    pickupDate.setDate(pickupDate.getDate() + 1);
                                                    return pickupDate.toISOString().split('T')[0];
                                                })()}
                                            </td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">
                                            <span className='text-blue-700' style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => window.open(item.imageLink, "_blank")}>Link</span>
                                            </td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">{item.cakeText}</td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                    </table>
                </div>
            );
        } else if (showOrdersToPrepare) {
            if (orders.length === 0) {
                console.log("if working");
                return (
                    <div className="text-center mt-5 font-bold text-2xl">No Orders to Prepare</div>
                );
            }else{
            return (
                <table className="table-auto border border-collapse border-gray-400 mt-10" id='orderPrepareTable'>
                    <thead>
                                <tr>
                                    <th className="border border-gray-400 px-5 py-3">Order ID</th>
                                    <th className="border border-gray-400 px-10 py-3">Name</th>
                                    <th className="border border-gray-400 px-12 py-3">Contact</th>
                                    <th className="border border-gray-400 px-2 py-3">Quantity</th>
                                    <th className="border border-gray-400 px-4 py-3">Pickup Date</th>
                                    <th className="border border-gray-400 px-4 py-3">Image Link</th>
                                    <th className="border border-gray-400 px-12 py-3">Cake Text</th>
                                    <th className="border border-gray-400 px-8 py-3">Status</th>
                                    <th className="border border-gray-400 px-8 py-3">Prepare</th>
                                </tr>
                            </thead>
                            <tbody className='flex-row justify-center items-center'>
                                {orders.map((item, index) => (
                                    <tr key={index} className="my-4">
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.orderId}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.name}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.contact}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.quantity}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">
                                            {(() => {
                                                const pickupDate = new Date(item.pickupDate);
                                                pickupDate.setDate(pickupDate.getDate() + 1);
                                                return pickupDate.toISOString().split('T')[0];
                                            })()}
                                        </td>

                                        <td className="px-4 text-center border-r border-gray-400 py-3">
                                            <span className='text-blue-700' style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => window.open(item.imageLink, "_blank")}>Link</span>
                                        </td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.cakeText}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.status}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">
                                            <button className='rounded-xl w-20' disabled={item.status === "Preparing"} style={{ backgroundColor: item.status === "Preparing" ? "grey" : "blue" }} onClick={() => updateStatus(item.orderId)}>Prepare</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                </table>
            );
        }
    }
};
    
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Customize Cake Orders</h1>
                        <div>
                            <label className="font-semibold text-xl">Filter Items:</label>
                            <select id="combo-box" className="mt-12 h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange}  >
                                <option value="">Select a Type</option>
                                    <option>All Orders</option>
                                    <option>Orders To Prepare</option>
                            </select>
                        </div>
                        
                        <div className="w-full max-h-96 overflow-y-auto">
                            {renderTable()}
                        </div>
                        <button className='flex bg-custom-blue text-white font-bold rounded-xl mt-12 py-1 px-6' onClick={handleDownload}>Download Report</button>
                </div>
        </div>
    );
};

export default CustomizeOrder;
