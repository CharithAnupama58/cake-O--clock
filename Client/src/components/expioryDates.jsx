import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const ExpioryDates = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchItems();
    },);
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    const fetchItems = async () => {
        try {
          const response = await axios.get('http://localhost:3001/server/stockManagement/expiredStock'); 
          setItems(response.data.items);
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      };
      const handleDelete = async (StockId) => {        
        console.log(StockId);
        try {
            const response = await axios.post('http://localhost:3001/server/stockManagement/deleteStock', {
                StockId,
            });

            if (response.status === 200) {
                
                fetchItems();
                // navigate(`/CustomizeCake2/${cakeId}/${additionalText}`);
            } else {
                console.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            console.error('Failed to login. Please try again later.');
        }
    };
    const confirmDelete = (StockId) => {
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
                handleDelete(StockId);
                fetchItems();
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
        const headingText = 'Cake O Clock(pvt) Ltd Expired Stock Report';
        const fontSize = 16;
        const textWidth = doc.getStringUnitWidth(headingText) * fontSize / doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.width;
        const xPos = (pageWidth - textWidth) / 2;
        const yPos = 10; // Adjust the y-position of the heading

        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'bold');
        doc.text(headingText, xPos, yPos);

        const spaceHeight = 10;
        const tableYPos = yPos + fontSize + spaceHeight;
        const table = document.getElementById('outOfStockTable');
        doc.autoTable({ html: table, startY: tableYPos });
        doc.save('table.pdf');

    }
    const filteredItems = items.filter(item =>
        (typeof item.itemId === 'string' && item.itemId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.itemName === 'string' && item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.measureUnit === 'string' && item.measureUnit.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.unitQty === 'string' && item.unitQty.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.Quantity === 'string' && item.Quantity.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof item.ExpiryDate === 'string' && item.ExpiryDate.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Expired Stock</h1>
                        <div>
                            <label className="font-semibold text-xl">Search Stock:</label>
                            <input type="text" className=" ml-4 border border-gray-400 px-4 py-0 mt-10 rounded-xl" placeholder="Search Stock" onChange={handleSearch}/>
                        </div>
                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="table-auto border border-collapse border-gray-400 mt-10" id='outOfStockTable'>
                                <thead>
                                    <tr>
                                        <th className="border border-gray-400 px-10 py-2">Stock ID</th>
                                        <th className="border border-gray-400 px-10 py-2">Item ID</th>
                                        <th className="border border-gray-400 px-12 py-2">Item Name</th>
                                        <th className="border border-gray-400 px-10 py-2">Measure Unit</th>
                                        <th className="border border-gray-400 px-4 py-2">Unit Quantity</th>
                                        <th className="border border-gray-400 px-4 py-2">Quantity</th>
                                        <th className="border border-gray-400 px-12 py-2">Expiory Date</th>
                                        <th className="border border-gray-400 px-12 py-2">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className='flex-row justify-center items-center'>
                                {filteredItems.map((item, index) => (
                                            <tr key={index}>
                                            <td className="px-4  text-center border-r border-gray-400">{item.StockId}</td>
                                            <td className="px-4  text-center border-r border-gray-400">{item.itemId}</td>
                                            <td className="px-4  text-center border-r border-gray-400">{item.itemName}</td>
                                            <td className="px-4  text-center border-r border-gray-400">{item.measureUnit}</td>
                                            <td className="px-4  text-center border-r border-gray-400">{item.unitQty}</td>
                                            <td className="px-4  text-center border-r border-gray-400">{item.Quantity}</td>
                                            <td className="px-4  text-center border-r border-gray-400">
                                                {(() => {
                                                    const pickupDate = new Date(item.ExpiryDate);
                                                    pickupDate.setDate(pickupDate.getDate() + 1);
                                                    return pickupDate.toISOString().split('T')[0];
                                                })()}
                                            </td>
                                            <td className="px-4 text-center border-r border-gray-400 py-3">
                                                <button className='rounded-xl w-20 text-white font-bold bg-red' style={{ backgroundColor: "red" }} onClick={() => confirmDelete(item.StockId)}>Delete</button>
                                            </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <button className='flex bg-custom-blue text-white font-bold rounded-xl mt-12 py-1 px-6' disabled={filteredItems.length === 0} onClick={handleDownload}>Download Report</button>
                    </div>
            
        </div>
    );
};

export default ExpioryDates;
