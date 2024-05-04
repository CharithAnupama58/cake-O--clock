import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'

const CustomizeOrder = () => {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [showOrdersToPrepare, setShowOrdersToPrepare] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {          
        // handleAllOrders();
        
    },);

    const handleAllOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/order/AllorderDetails'); 
            setItems(response.data.items);
            setShowAllOrders(true);
            setShowOrdersToPrepare(false);
          } catch (error) {
            console.error('Error fetching items:', error);
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

    const handleDownload = () => {
        const doc = new jsPDF();
        const table = document.getElementById('stockTable');
        doc.autoTable({ html: table });
        doc.save('table.pdf');

    }
    
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Customize Cake Orders</h1>
                        <div>
                            <label className="font-semibold text-xl">Filter Items:</label>
                            <select id="combo-box" className="mt-16 h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange}  >
                                <option value="">Select a Type</option>
                                    <option>All Orders</option>
                                    <option>Orders To Prepare</option>
                            </select>
                        </div>
                        {showAllOrders && (
                        <div className="w-full max-h-96 overflow-y-auto">
                        <table className="table-auto border border-collapse border-gray-400 mt-10" id='stockTable'>
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
                                {items.map((item, index) => (
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
                                            <a href={item.imageLink} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>
                                                {item.imageLink}
                                            </a>
                                        </td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.cakeText}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        )}
                        {showOrdersToPrepare && (
                        <div className="w-full max-h-96 overflow-y-auto">
                        <table className="table-auto border border-collapse border-gray-400 mt-10" id='stockTable'>
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
                                            <a href={item.imageLink} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>
                                                {item.imageLink}
                                            </a>
                                        </td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.cakeText}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.status}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">
                                            <button disabled={item.status === "Preparing"} style={{ backgroundColor: item.status === "Preparing" ? "grey" : "blue" }} onClick={() => updateStatus(item.orderId)}>Prepare</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                        )}
                        <button className='flex bg-custom-blue text-white font-bold rounded-xl mt-12 py-1 px-6' onClick={handleDownload}>Download Report</button>
                </div>
        </div>
    );
};

export default CustomizeOrder;