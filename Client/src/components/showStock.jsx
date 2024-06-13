import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import image4 from '../assets/images/image_4-removebg-preview 1.png';
import 'jspdf-autotable';

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
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); 
    };

    const addTemplate = (doc, title, pageNumber, totalPages) => {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
    
       
        const fontSize = 16;
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 102, 204); 
    
        
        const textWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
        const xPos = (pageWidth - textWidth) / 2;
        const yPos = 10; 
        doc.text(title, xPos, yPos);
    
       
        const logoWidth = 30;
        const logoHeight = 30;
        const logoXPos = (pageWidth - logoWidth) / 2;
        const logoYPos = yPos + 10; 
        doc.addImage(image4, 'PNG', logoXPos, logoYPos, logoWidth, logoHeight);
    
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0); 
        const footerText = `Page ${pageNumber} of ${totalPages}`;
        const footerYPos = pageHeight - 10;
        doc.text(footerText, pageWidth / 2, footerYPos, { align: 'center' });
    
        
        doc.setDrawColor(0, 102, 204); 
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    };
    
    const handleDownload = () => {
        const doc = new jsPDF();
        const title = 'Cake O Clock(pvt) Ltd Stock Report';
    
        
        const table = document.getElementById('stockTable');
        doc.autoTable({
            html: table,
            startY: 60, 
            didDrawPage: function (data) {
                const pageNumber = doc.internal.getNumberOfPages();
                const totalPages = doc.internal.getNumberOfPages();
    
                addTemplate(doc, title, pageNumber, totalPages);
            },
            styles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0], 
                lineColor: [0, 102, 204], 
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [0, 102, 204],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240], 
            },
        });
    
        doc.save('stock_report.pdf');
    };
    
    
    

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
                    <input type="text" className=" ml-4 border border-gray-400 px-4 py-0 mt-10 rounded-xl" placeholder="Search Stock" onChange={handleSearch} />
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
                                <th className="border border-gray-400 px-12 py-2">Expiry Date</th>
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
                                    <td className="px-4  text-center border-r border-gray-400">{formatDateString(item.ExpiryDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button className='flex bg-custom-blue text-white font-bold rounded-xl mt-12 py-1 px-6 hover:bg-gray-300' disabled={filteredItems.length === 0} onClick={handleDownload}>Download Report</button>
            </div>

        </div>
    );
};

export default ShowStock;
