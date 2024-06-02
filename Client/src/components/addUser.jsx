import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

const AddUser = () => {
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption1, setSelectedOption1] = useState('');
    const [options, setOptions] = useState([]);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [branchID, setBranchID] = useState('');

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        fetchOptions();
        generateNewItemIdFromBackend();
    }, []);

    useEffect(() => {
        validateForm();
    }, [userId, firstName, lastName, email, selectedOption, selectedOption1]);

    const fetchOptions = async () => {
        try {
            const response = await axios.get('http://localhost:3001/server/customizeCake/branchIds');
            setOptions(response.data.options);
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

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        generateUserName(event.target.value);
        generatePassword(event.target.value);
    };

    const validateForm = () => {
        const nameRegex = /^[A-Za-z]{1,20}$/; // Allows only letters, max length 20
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
        const isFirstNameValid = nameRegex.test(firstName);
        const isLastNameValid = nameRegex.test(lastName);
        const isEmailValid = emailRegex.test(email);
        const isJobRoleSelected = selectedOption1 !== '';
        const isBranchSelected = selectedOption !== '';

        setIsFormValid(isFirstNameValid && isLastNameValid && isEmailValid && isJobRoleSelected && isBranchSelected);
    };

    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill all the required fields correctly.',
            });
            return;
        }

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
                const templateParams = {
                    email: email,
                    userName: userName,
                    password: password,
                    firstName: firstName
                };

                emailjs.send('service_769tgla', 'template_rjbvmfq', templateParams, '5scjLq4jifWZGLOtT')
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: 'User added successfully and email sent',
                        });
                    }, (error) => {
                        console.error('Failed to send email:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'User added but failed to send email.',
                        });
                    });

                setFirstName('');
                setLastName('');
                setEmail('');
                setSelectedOption1('');
                setUserName('');
                setPassword('');
                setBranchID('');
                setSelectedOption('');
                generateNewItemIdFromBackend();
            } else {
                console.error('Error adding user');
            }
        } catch (error) {
            console.error('Failed to add user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add user. Please try again later.',
            });
        }
    };

    return (
        <div className='flex flex-row w-full justify-center'>
            <div className='flex flex-col items-center'>
                <h1 className='mt-10 font-bold text-4xl'>Add User</h1>
                <form className="ml-4 mt-16 w-96" onSubmit={handleAddUserSubmit}>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="input1" className="block text-xl w-60 mr-4">User ID:</label>
                        <input type="text" id="input1" className="w-full h-10 px-3 rounded border border-black" placeholder="User Id" value={userId} disabled />
                    </div>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="input2" className="block text-xl w-60 mr-4">First Name:</label>
                        <input type="text" id="input2" className="w-full h-10 px-3 rounded border border-black" placeholder="First Name" value={firstName} onChange={handleFirstNameChange} />
                    </div>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="input3" className="block text-xl w-60 mr-4">Last Name:</label>
                        <input type="text" id="input3" className="w-full h-10 px-3 rounded border border-black" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="input4" className="block text-xl w-60 mr-4">Email:</label>
                        <input type="email" id="input4" className="w-full h-10 px-3 rounded border border-black" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="combo-box1" className="block text-xl w-60 mr-4">Job Role:</label>
                        <select id="combo-box1" className="w-full h-10 px-3 rounded border border-black" value={selectedOption1} onChange={handleSelectChange1}>
                            <option value="">Select an option...</option>
                            <option>Admin</option>
                            <option>Stock Keeper</option>
                            <option>Factory Employee</option>
                            <option>Branch Employee</option>
                        </select>
                    </div>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="combo-box2" className="block text-xl w-60 mr-4">Branch:</label>
                        <select id="combo-box2" className="w-full h-10 px-3 rounded border border-black" value={selectedOption} onChange={handleSelectChange}>
                            <option value="">Select an option...</option>
                            {options.map((option, index) => (
                                <option key={index}>{option.branchName}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className={`bg-custom-blue text-white font-bold rounded-xl mt-8 ml-20 py-1 px-6 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isFormValid}>Add User</button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
