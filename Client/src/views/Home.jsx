import { useState } from 'react';
import image2 from '../assets/images/image 3.png';
import Header from '../assets/components/Header';
import image4 from '../assets/images/image 4 (1).png'
import image5 from '../assets/images/image 5.png'
import image6 from '../assets/images/image 6.png'
import image7 from '../assets/images/Vector (2).png'
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFeedback = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/server/feedback/feedback', {
                name,
                email,
                message
            });

            if (response.status === 200) {
                alert('Feedback submitted successfully');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                // If login fails, display error message
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            // If login fails due to network error or server down, display generic error message
            setError('Failed to login. Please try again later.');
        }
    };
    return (
        <section className="relative">
            <Header />
            <img src={image2} className='object-cover w-full h-full overflow-hidden' />
            <div className="absolute top-96 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center text-white font-semibold">
                <h1 className="text-7xl font-bold">Savor the Moment</h1>
                <div  className="mt-14 text-center text-2xl"> 
                    <span className="block">"Discover the magic baked into every creation at</span>
                    <span className="block">Cake O’ Clock. From weddings to birthdays, our</span>
                    <span className="block">cakes are designed to add a touch of sweetness to</span>
                    <span className="block">life's special moments. Immerse yourself in a world</span>
                    <span className="block">where taste and elegance collide."</span>
                </div>
                <Link to='/CustomizeCake'><button className='mt-16 border border-solid border-white-800 border-4 px-4 py-2 rounded-xl text-white-700 hover:bg-slate-500 font-semibold'>
                    Order Online
                </button></Link>
            </div>
            <div className='flex flex-col items-center'>
                <h1 className='text-6xl font-bold text-center mb-12'>Our Services</h1>

                <div className="flex justify-around w-full items-center mb-12">
                
                    <div className="box-content h-72 w-40 p-4 border-4 flex flex-col items-center rounded-xl">
                        <img src={image4} alt="Service Image" />
                        <h1 className='font-bold mt-4 text-4xl'>Order Online</h1>
                    </div>

                
                    <div className="box-content h-72 w-40 p-4 border-4 flex flex-col items-center rounded-xl">
                        <img src={image5} alt="Service Image" />
                        <h1 className='font-bold mt-4 text-4xl'>Customize Cake</h1>
                    </div>

                    
                    <div className="box-content h-72 w-40 p-4 border-4 flex flex-col items-center rounded-xl">
                        <img src={image7} alt="Service Image" />
                        <h1 className='font-bold mt-4 text-4xl'>Picture Uploading</h1>
                    </div>

                
                    <div className="box-content h-72 w-40 p-4 border-4 flex flex-col items-center rounded-xl">
                        <img src={image6} alt="Service Image" />
                        <h1 className='font-bold mt-4 text-4xl'>Bakery Items</h1>
                    </div>
                </div>
            </div>

            <div className='flex w-full h-96 bg-black'>
                <div className='flex-col ml-12 mt-8 text-white flex-grow'>
                    <h1 className='text-4xl font-bold'>Head Office</h1>

                    <span className='text-2xl font-semibold block mt-10'>Cake O’ Clock</span>
                    <span className='text-2xl font-semibold block'>162B, Darlinton Watta, Hapugala,</span>
                    <span className='text-2xl font-semibold block'>Galle.</span>

                    <span className='text-2xl font-semibold block mt-7'>0768667517</span>

                    <span className='text-2xl font-semibold block mt-7'>cakeoclockgalle@gmail.com</span>
                </div>

                <form onSubmit={handleFeedback} className='flex-col justify-end mr-96 mt-5'>
                    <form  className='text-start -mr-44'>
                        <h2 className='text-2xl font-semibold text-white'>Name</h2>
                        <input className='w-96 mt-2 ml-0 rounded-xl' type='text' placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />

                        <h2 className='text-2xl font-semibold mt-4 text-white'>Email</h2>
                        <input className='w-96 mt-2 ml-0 rounded-xl' type='text' placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />

                        <h2 className='text-2xl font-semibold mt-4 text-white'>Message</h2>
                        <textarea rows='2' cols='30' className='w-96 mt-2 ml-0 rounded-xl' type='text' placeholder='Enter Your Message..' value={message} onChange={(e) => setMessage(e.target.value)}/>
                        
                        {error && <p className="text-red-500 mt-4 ml-8">{error}</p>}
                    </form>
                    <button type='submit' className='mt-4 border border-solid border-white-800 border-4 px-4 py-2 rounded-xl text-white hover:bg-slate-500 font-semibold'>
                            Submit
                     </button>
                </form>
            </div>
        </section>
        
    );
};

export default Home;
