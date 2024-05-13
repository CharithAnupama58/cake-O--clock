import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const TemporaryOrders = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {          
        handleAllTempOrders();
        
        // setInterval(handleAllTempOrders, 5000);
    }, []);

    const handleAllTempOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/order/AllTemporaryOrderDetails'); 
            setItems(response.data.items);
           
          } catch (error) {
            console.error('Error fetching items:', error);
          }
        };
        const handleSend = async (rowData) => {
            // console.log(rowData);
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            const { temporderId,name, contact, quantity,cakeText, pickupDate, imgLink, branchId } = rowData;
            console.log( name, contact, quantity,cakeText, pickupDate, imgLink, branchId,formattedDate);
        try {
            const response = await axios.post('http://localhost:3001/server/order/savePictureOrders', {
                temporderId,
                name,
                contact,
                quantity,
                formattedDate,
                cakeText,
                pickupDate,
                imgLink,
                branchId
                
            });

            if (response.status === 200) {
                alert('Feedback submitted successfully');
                // navigate(`/CustomizeCake2/${cakeId}/${additionalText}`);
            } else {
                console.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            console.error('Failed to login. Please try again later.');
        }
    };
    const handleDelete = async (temporderId) => {        
        console.log(temporderId);
    try {
        const response = await axios.post('http://localhost:3001/server/order/deleteTempOrder', {
            temporderId,
        });

        if (response.status === 200) {
            
            handleAllTempOrders();
            // navigate(`/CustomizeCake2/${cakeId}/${additionalText}`);
        } else {
            console.error('Invalid username or password');
        }
    } catch (error) {
        console.error('Login failed:', error);
        console.error('Failed to login. Please try again later.');
    }
};
const confirmDelete = (temporderId) => {
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
            handleDelete(temporderId);
            renderTable();
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

        
  const handleDownload = () => {
        const doc = new jsPDF();
        const table = document.getElementById('stockTable');
        doc.autoTable({ html: table });
        doc.save('table.pdf');
    }

    const renderTable = () => {
        if (items.length === 0) {
            return (
                <div className="text-center mt-5 font-bold text-2xl">No Temporary Orders found</div>
            );
        } else {
            return (
                <div className="w-full max-h-96 overflow-y-auto">
                    <table className="table-auto border border-collapse border-gray-400 mt-14" id='stockTable'>
                        <thead>
                                <tr>
                                    <th className="border border-gray-400 px-5 py-3">TempOrder ID</th>
                                    <th className="border border-gray-400 px-10 py-3">Name</th>
                                    <th className="border border-gray-400 px-12 py-3">Contact</th>
                                    <th className="border border-gray-400 px-2 py-3">Quantity</th>
                                    <th className="border border-gray-400 px-4 py-3">Pickup Date</th>
                                    <th className="border border-gray-400 px-4 py-3">Image Link</th>
                                    <th className="border border-gray-400 px-12 py-3">Cake Text</th>
                                    <th className="border border-gray-400 px-8 py-3">Send</th>
                                    <th className="border border-gray-400 px-8 py-3">Delete</th>
                                </tr>
                            </thead>
                            <tbody className='flex-row justify-center items-center'>
                                {items.map((item, index) => (
                                    <tr key={index} className="my-4">
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.temporderId}</td>
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
                                        <span className='text-blue-700' style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => window.open(item.imgLink, "_blank")}>Link</span>
                                        </td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">{item.cakeText}</td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">
                                            <button className='rounded-xl w-20 font-bold text-white'  style={{ backgroundColor: "blue" }} onClick={() => handleSend(item)}>Send</button>
                                        </td>
                                        <td className="px-4 text-center border-r border-gray-400 py-3">
                                            <button className='rounded-xl w-20 font-bold text-white'  style={{ backgroundColor: "red" }} onClick={() => confirmDelete(item.temporderId)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                </div>
            );
        }
    }

    
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Temporary Cake Orders</h1>
                        {renderTable()}
                        
                        <button className='flex bg-custom-blue text-white font-bold rounded-xl mt-12 py-1 px-6' disabled={items.length === 0}  onClick={handleDownload}>Download Report</button>
                </div>
        </div>
    );
};

export default TemporaryOrders;
