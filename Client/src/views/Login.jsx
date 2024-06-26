import { useState, useContext } from 'react';
import image7 from '../assets/images/image 7.png';
import image8 from '../assets/images/_ (1).png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../Context/AuthProvider';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setAuthState } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/server/test/login', {
                username,
                password
            });
            const data = response.data;
            console.log(data);

            if (response.status === 200) {
                Swal.fire({
                    title: 'Login Successful',
                    text: 'Welcome back!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                const { jobRole, branchId, firstName } = data;

                setAuthState({
                    isAuthenticated: true,
                    jobRole,
                    branchId,
                    firstName,
                });

                // Redirect based on job role
                if (jobRole === 'Stock Keeper') {
                    navigate('/StockManagement');
                } else if (jobRole === 'Factory Employee') {
                    navigate('/FactoryEmployee');
                } else if (jobRole === 'Branch Employee') {
                    navigate(`/BranchEmployee/${branchId}`);
                } else if (jobRole === 'Admin') {
                    navigate('/AdminDashBoard');
                }
            } else {
                Swal.fire({
                    title: 'Invalid Login',
                    text: 'Check your username and password',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                setUsername('');
                setPassword('');
            }
        } catch (error) {
            console.error('Login failed:', error);
            Swal.fire({
                title: 'Invalid Login',
                text: 'Check your username and password',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setUsername('');
            setPassword('');
            
        }
    };

    return (
        <section className='flex bg-black items-center'>
            <div className='h-full w-1/2'>
                <img src={image7} className='object-cover' alt='Background' />

                <div className="absolute top-36 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
                    <h1 className="text-5xl font-bold">"Indulge in the</h1>
                    <h1 className='text-5xl font-bold'>extraordinary at Cake O’</h1>
                    <h1 className='text-5xl font-bold'>Clock.”</h1>

                    <div className='absolute top-64 left-12'>
                        <span className="block text-2xl mt-5">"Our cakes are more than desserts; they're</span>
                        <span className="block text-2xl">crafted experiences. From classic recipes to</span>
                        <span className="block text-2xl">innovative designs, we take pride in creating</span>
                        <span className="block text-2xl">confections that elevate your celebrations to</span>
                        <span className="block text-2xl">new heights."</span>
                    </div> 
                </div>
            </div>

            <div className='h-96 w-1/4 flex ml-52 justify-center bg-white rounded-xl border border-gray-300'>
                <div>
                    <Link to='/'><a href='/home'>
                        <img src={image8} alt='Icon' />
                    </a></Link>
                    <h2 className="text-4xl font-bold mt-7 ml-36">Login</h2>
                    <form onSubmit={handleLogin}>
                        <input className='mt-12 w-80 ml-8 border-4 focus:border-black rounded-xl' type='text' placeholder='User Name' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input className='mt-8 w-80 ml-8 border-4 focus:border-black rounded-xl' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type='submit' className='mt-20 w-32 ml-32 border-solid border-white-800 border-4 rounded-xl hover:bg-slate-500 font-semibold'>Login</button>
                    </form>
                    {error && <p className="text-red-500 mt-4 ml-8">{error}</p>}
                </div>
            </div>
        </section>
    );
};

export default Login;
