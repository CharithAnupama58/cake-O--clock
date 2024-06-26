import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const CancelOrders = () => {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [showOrdersToPrepare, setShowOrdersToPrepare] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuery1, setSearchQuery1] = useState('');

    useEffect(() => {   
        setSelectedOption('Customize Orders')       
        handleAllOrders();
        
    },[]);

    const handleAllOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/order/AllorderDetails'); 
            setItems(response.data.items);
            setShowAllOrders(true);
            setShowOrdersToPrepare(false);
            if (response.data.items.length === 0) {
                Swal.fire({
                    title: 'No Orders',
                    text: 'There are no customize orders available.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            }
          } catch (error) {
            console.error('Error fetching items:', error);
          }
        };
        const handleOrdersToPrepare = async () => {
            try {
                const response = await axios.get('http://localhost:3001/server/order/AllPictureorderDetails');
                
                if (response.status === 200 && response.data.items.length > 0) {
                    setOrders(response.data.items);
                } else {
                    setOrders([]);
                    Swal.fire({
                        title: 'No Orders',
                        text: 'There are no picture orders available.',
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });
                }
                setShowOrdersToPrepare(true);
                setShowAllOrders(false);
            } catch (error) {
                console.error('Error fetching items:', error);
                Swal.fire({
                    title: 'No Orders',
                    text: 'There are no picture orders available.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            }
        };
        
        const handleCustomizeDelete = async (orderId) => {
            console.log(orderId);
            try {
                const response = await axios.post('http://localhost:3001/server/order/deleteCustomizeOrder', {
                    orderId,
                });
    
                if (response.status === 200) {
                    handleAllOrders();
                } else {
                    console.error('Invalid username or password');
                }
            } catch (error) {
                console.error('Login failed:', error);
                console.error('Failed to login. Please try again later.');
            }
        };
        const handlePictureDelete = async (picOrderId) => {
            console.log(picOrderId);
            try {
                const response = await axios.post('http://localhost:3001/server/order/deletePictureUploadOrder', {
                    picOrderId,
                });
    
                if (response.status === 200) {
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
    const confirmDelete = (orderId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this item!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                handleCustomizeDelete(orderId);
                handleAllOrders();
                Swal.fire(
                    'Deleted!',
                    'Your item has been deleted.',
                    'success'
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your item is safe :)',
                    'error'
                );
            }
        });
    };
    const confirmDelete1 = (picOrderId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this item!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                handlePictureDelete(picOrderId);
                handleOrdersToPrepare();
                Swal.fire(
                    'Deleted!',
                    'Your item has been deleted.',
                    'success'
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your item is safe :)',
                    'error'
                );
            }
        });
    };
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleSearch1 = (e) => {
        setSearchQuery1(e.target.value);
    };

    const filteredItems = items.filter(item =>
        (typeof item.orderId === 'string' && item.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.name === 'string' && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.contact === 'string' && item.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.quantity === 'string' && item.quantity.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.pickupDate === 'string' && item.pickupDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.status === 'string' && item.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const filteredOrders = orders.filter(item =>
        (typeof item.picOrderId === 'string' && item.picOrderId.toLowerCase().includes(searchQuery1.toLowerCase())) ||
        (typeof item.name === 'string' && item.name.toLowerCase().includes(searchQuery1.toLowerCase())) ||
        (typeof item.contact === 'string' && item.contact.toLowerCase().includes(searchQuery1.toLowerCase())) ||
        (typeof item.quantity === 'string' && item.quantity.toLowerCase().includes(searchQuery1.toLowerCase())) ||
        (typeof item.pickupDate === 'string' && item.pickupDate.toLowerCase().includes(searchQuery1.toLowerCase())) ||
        (typeof item.status === 'string' && item.status.toLowerCase().includes(searchQuery1.toLowerCase()))
    );

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
                <div>
                    <div className='flex justify-center'>
                            <label className="font-semibold text-xl mt-8">Search Order:</label>
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
                                        <th className="border border-gray-400 px-12 py-3">Cake Text</th>
                                        <th className="border border-gray-400 px-8 py-3">Delete</th>
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
                                            <td className="px-4 text-center border-r border-gray-400 py-3">{item.cakeText}</td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">
                                                <button className='rounded-xl w-20 text-white font-bold' disabled={item.status === "Deleted"} style={{ backgroundColor: item.status === "Deleted" ? "grey" : "red" }} onClick={() => confirmDelete(item.orderId)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                    </table>
                </div>
            );
        } else if (showOrdersToPrepare) {
            return (
                <div>
                    <div className='flex justify-center'>
                        <label className="font-semibold text-xl mt-8">Search Order:</label>
                        <input type="text" className=" ml-4 border border-gray-400 px-4 py-0 mt-8 rounded-xl" placeholder="Search Orders" onChange={handleSearch1} />
                    </div> 
                    <table className="table-auto border border-collapse border-gray-400 mt-10" id='orderPrepareTable'>
                        <thead>
                                    <tr>
                                        <th className="border border-gray-400 px-5 py-3">Order ID</th>
                                        <th className="border border-gray-400 px-10 py-3">Name</th>
                                        <th className="border border-gray-400 px-12 py-3">Contact</th>
                                        <th className="border border-gray-400 px-2 py-3">Quantity</th>
                                        <th className="border border-gray-400 px-4 py-3">Pickup Date</th>
                                        <th className="border border-gray-400 px-12 py-3">Cake Text</th>
                                        <th className="border border-gray-400 px-8 py-3">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className='flex-row justify-center items-center'>
                                    {filteredOrders.map((item, index) => (
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
                                            <td className="px-4 text-center border-r border-gray-400 py-3">
                                                <button className='rounded-xl w-20 text-white font-bold ' disabled={item.status === "Deleted"} style={{ backgroundColor: item.status === "Deleted" ? "grey" : "red" }} onClick={() => confirmDelete1(item.picOrderId)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                    </table>
                </div>
            );
        }
    };
    
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Cancel Cake Orders</h1>
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
                        {/* <button className='flex bg-custom-blue text-white font-bold rounded-xl mt-12 py-1 px-6' onClick={handleDownload}>Download Report</button> */}
                </div>
        </div>
    );
};

export default CancelOrders;
