import  { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'

const ShowStock = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        

        const fetchItems = async () => {
            try {
              const response = await axios.get('http://localhost:3001/server/stockManagement/itemDetails'); 
              setItems(response.data.items);
            } catch (error) {
              console.error('Error fetching items:', error);
            }
          };
          
        
          
          fetchItems();
    },);
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        const table = document.getElementById('stockTable');
        doc.autoTable({ html: table });
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
                        <h1 className='mt-10 font-bold text-4xl'>Show Stock</h1>
                        <div>
                            <label className="font-semibold text-xl">Search Stock:</label>
                            <input type="text" className=" ml-4 border border-gray-400 px-4 py-0 mt-10 rounded-xl" placeholder="Search Stock" onChange={handleSearch}/>
                        </div>
                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="table-auto border border-collapse border-gray-400 mt-10" id='stockTable'>
                                <thead>
                                    <tr>
                                        <th className="border border-gray-400 px-10 py-2">Stock ID</th>
                                        <th className="border border-gray-400 px-10 py-2">Item ID</th>
                                        <th className="border border-gray-400 px-12 py-2">Item Name</th>
                                        <th className="border border-gray-400 px-10 py-2">Measure Unit</th>
                                        <th className="border border-gray-400 px-4 py-2">Unit Quantity</th>
                                        <th className="border border-gray-400 px-4 py-2">Quantity</th>
                                        <th className="border border-gray-400 px-12 py-2">Expiory Date</th>
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
                                            <td className="px-4  text-center border-r border-gray-400">{item.ExpiryDate}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <button className='flex bg-custom-blue text-white font-bold rounded-xl mt-12 py-1 px-6' onClick={handleDownload}>Download Report</button>
                    </div>
            
        </div>
    );
};

export default ShowStock;
