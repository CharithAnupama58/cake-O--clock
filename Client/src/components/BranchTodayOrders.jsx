import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

const BranchTodayOrders = () => {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [showOrdersToPrepare, setShowOrdersToPrepare] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const {branchId} =useParams();

    useEffect(() => {   
        setSelectedOption('Customize Orders');       
        handleAllOrders();
        // console.log(branchId);
        
    },[]);

    const handleAllOrders = async () => {
        console.log(branchId);
        try {
            const response = await axios.get(`http://localhost:3001/server/BranchEmployee/CustomizeDetails/${branchId}`);
            setItems(response.data.items);
            setShowAllOrders(true);
            setShowOrdersToPrepare(false);

        } catch (error) {
            console.error('Error fetching item details:', error);
            Swal.fire({
                icon: 'info',
                title: 'No Picture Orders Today',
                text: 'There are currently no Picture orders to Release.',
            });
        }
    };
        
        const handleOrdersToPrepare = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/server/BranchEmployee/PictureDetails/${branchId}`);
                setOrders(response.data.items);
                setShowAllOrders(false);
                setShowOrdersToPrepare(true);
    
            } catch (error) {
                console.error('Error fetching item details:', error);
                Swal.fire({
                    icon: 'info',
                    title: 'No Picture Orders Today',
                    text: 'There are currently no Picture orders to Release.',
                });
                setSelectedOption('Customize Orders')
            }
        };
        const updateStatus = async (orderId) => {
            console.log(orderId);
            try {
                const response = await axios.post('http://localhost:3001/server/order/updateReleaseStatus', {
                    orderId,
                });
    
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Sms send successfully',
                    });
                    handleAllOrders();
                } else {
                    console.error('Invalid username or password');
                }
            } catch (error) {
                console.error('Login failed:', error);
                console.error('Failed to login. Please try again later.');
            }
        };
        const updatePicStatus = async (picOrderId) => {
            console.log(picOrderId);
            try {
                const response = await axios.post('http://localhost:3001/server/order/updatePicReleaseStatus', {
                    picOrderId,
                });
    
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Sms send successfully',
                    });
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
            case "Customize Orders":
                handleAllOrders();
                break;
                
            case "Picture Orders":
                handleOrdersToPrepare();
                break; 
        }
    };

    const handleDownload = () => {
        let table;
        let doc;
        let excludedColumnIndex;
        let rows;
        switch (selectedOption) {
            case "Picture Orders":
                table = document.getElementById('stockTable');
                doc = new jsPDF();
                doc.autoTable({ html: table });
                doc.save('table.pdf');
                break;
                
            case "Customize Orders":
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
        if (showAllOrders) {
            return (
                <table className="table-auto border border-collapse border-gray-400 mt-14" id='stockTable'>
                    <thead>
                                <tr>
                                    <th className="border border-gray-400 px-5 py-3">Order ID</th>
                                    <th className="border border-gray-400 px-10 py-3">Name</th>
                                    <th className="border border-gray-400 px-12 py-3">Contact</th>
                                    <th className="border border-gray-400 px-2 py-3">Quantity</th>
                                    <th className="border border-gray-400 px-4 py-3">Pickup Date</th>
                                    <th className="border border-gray-400 px-12 py-3">Cake Text</th>
                                    <th className="border border-gray-400 px-8 py-3">Branch Name</th>
                                    <th className="border border-gray-400 px-8 py-3">Release</th>
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
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.cakeText}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.branchName}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">
                                            <button className='rounded-xl w-20 text-white font-bold' disabled={item.status !== "Released"} style={{ backgroundColor: item.status !== "Released" ? "grey" : "blue" }} onClick={() => updateStatus(item.orderId)}>Send</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                </table>
            );
        } else if (showOrdersToPrepare) {
            return (
                <table className="table-auto border border-collapse border-gray-400 mt-10" id='orderPrepareTable'>
                    <thead>
                                <tr>
                                    <th className="border border-gray-400 px-5 py-3">Order ID</th>
                                    <th className="border border-gray-400 px-10 py-3">Name</th>
                                    <th className="border border-gray-400 px-12 py-3">Contact</th>
                                    <th className="border border-gray-400 px-2 py-3">Quantity</th>
                                    <th className="border border-gray-400 px-4 py-3">Pickup Date</th>
                                    <th className="border border-gray-400 px-12 py-3">Cake Text</th>
                                    <th className="border border-gray-400 px-8 py-3">Branch Name</th>
                                    <th className="border border-gray-400 px-8 py-3">Sms</th>
                                </tr>
                            </thead>
                            <tbody className='flex-row justify-center items-center'>
                                {orders.map((item, index) => (
                                    <tr key={index} className="my-4">
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.picOrderId}</td>
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
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.cakeText}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.branchName}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">
                                            <button className='rounded-xl w-20 text-white font-bold ' disabled={item.status !== "Released"} style={{ backgroundColor: item.status !== "Released" ? "grey" : "blue" }} onClick={() => updatePicStatus(item.picOrderId)}>Send</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                </table>
            );
        }
    };
    
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Today's Cake Orders</h1>
                        <div>
                            <label className="font-semibold text-xl">Filter Items:</label>
                            <select id="combo-box" className="mt-12 h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange}  >
                                <option value="">Select a Type</option>
                                    <option>Customize Orders</option>
                                    <option>Picture Orders</option>
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

export default BranchTodayOrders;
