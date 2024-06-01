
import  { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';



const AddUser = () => {
    const [userId, setUserId] = useState('');
    const [firstName, setFirtName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption1, setSelectedOption1] = useState('');
    const [options, setOptions] = useState([]);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [branchID, setBranchID] = useState('');

    
      
 
    useEffect(() => {
        fetchOptions();
        generateNewItemIdFromBackend();


         
    }, []);
    const fetchOptions = async () => {
        try {
          const response = await axios.get('http://localhost:3001/server/customizeCake/branchIds'); 
          setOptions(response.data.options);
        //   console.log(response.data.options);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };
    const generateNewItemIdFromBackend = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/admin/userId');
            setUserId(response.data.newUserId);
            
        } catch (error) {
            console.error('Error generating new Item ID:', error);
        }
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        const selectedBranch = options.find(option => option.branchName === event.target.value);
        if (selectedBranch) {
            const selectedBranchId = selectedBranch.branchID;
            setBranchID(selectedBranchId);
            console.log(selectedBranchId);
            console.log(branchID);
        }
    };
    const handleSelectChange1 = (event) => {
        setSelectedOption1(event.target.value);
    };
    const generatePassword = (firstName) => {
        const userIdNumericPart = userId.match(/\d+/)[0];

        const firstLetter = firstName.trim().toLowerCase().charAt(0);
        const password = `${firstLetter}@${userIdNumericPart}`;
        setPassword(password);
    };
    
    const generateUserName = (firstName) => {
        const userIdNumericPart = userId.match(/\d+/)[0];
        firstName = firstName.trim().toLowerCase();
        const userName = `${firstName}${userIdNumericPart}`;
        setUserName(userName);
    };
    // const handleInputChanges = () => {
    //     setItemId(document.getElementById('input1').value);
    //     setStockQty(document.getElementById('input4').value);
    //     setExpDate(document.getElementById('input5').value);
    // }; 
    
    const handleFirstNameChange = (event) => {
        setFirtName(event.target.value);
        generateUserName(event.target.value);
        generatePassword(event.target.value);
    };
    const handleAddStockSubmit = async (e) => {
        e.preventDefault();
        console.log(userId,firstName,lastName, selectedOption1, userName, password, branchID);
        try {
            const response = await axios.post('http://localhost:3001/server/admin/addUser', {
                userId,
                firstName,
                lastName,
                userName,
                password,
                selectedOption1,
                branchID

            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User added Successfully',
                });
                setFirtName('');
                setLastName('');
                setSelectedOption1('');
                setUserName('');
                setPassword('');
                setBranchID('');
                setSelectedOption('');
                generateNewItemIdFromBackend();
            } else {
                console.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            console.error('Failed to login. Please try again later.');
        }
    };
    
    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                        <h1 className='mt-10 font-bold text-4xl'>Add User</h1>
                        <form className="ml-4 mt-16 w-96" onSubmit={handleAddStockSubmit} >
                            
                                <div  className="mb-4 flex items-center">
                                    <label htmlFor="input1" className="block text-xl w-60 mr-4">User ID:</label>
                                    <input type="text" id="input1" className="w-full h-10 px-3 rounded border border-black" placeholder="User Id" value={userId} onChange={(e) => setUserId(e.target.value)}/>
                                </div>
                      
                            
                                <div  className="mb-4 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">First Name:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="First Name" value={firstName} onChange={handleFirstNameChange} />
                                </div>

                                <div  className="mb-4 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Last Name:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Last Name" value={lastName}  onChange={(e) => setLastName(e.target.value)}/>
                                </div>

                                <div  className="mb-4 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">User Name:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black"  placeholder="User Name" value={userName} disabled />
                                </div>
                                <div  className="mb-4 flex items-center">
                                    <label htmlFor="input2" className="block text-xl w-60 mr-4">Password:</label>
                                    <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="Password" value={password} disabled  />
                                </div>
                           
                         
                                <div className="mb-4 flex items-center">
                                    <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Job Role:</label>
                                    <select id="combo-box" className="w-full h-10 px-3 rounded border border-black" value={selectedOption1} onChange={handleSelectChange1}  >
                                        <option value="">Select an option...</option>
                                            <option>Admin</option>
                                            <option>Stock Keeper</option>
                                            <option>Factory Employee</option>
                                            <option>Branch Employee</option>
                                    </select>
                                </div>
                                <div className="mb-4 flex items-center">
                                    <label htmlFor="combo-box" className="block text-xl w-60 mr-4">Branch:</label>
                                    <select id="combo-box" className="w-full h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange} >
                                        <option value="">Select an option...</option>
                                        {options.map((option, index) => (
                                            <option key={index}>{option.branchName}</option>
                                            
                                        ))}
                                    </select>
                                </div>
                            <button className=' bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6'>Add User</button>
                        </form>
                    </div>
            
        </div>
    );
};

export default AddUser;