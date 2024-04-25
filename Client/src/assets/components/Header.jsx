
import React from 'react';
import image from '../images/image 2.png';
import image1 from '../images/Vector.png';
import { Link } from 'react-router-dom';

const Header = () => {
    let Links = [
        {name:'Home', link:'/'},
        {name:'Our Services', link:'/'},
        {name:'Contact Us', link:'/'}
    ];

    return (
        <section>
            <div className='flex shadow-md md:w-full h-25 bg-black '>
                <div className='md:px-10 flex  items-center h-25 '>
                    <div className='flex items-center gap-2 '>
                        <img src={image} alt='Icon' className="w-20 h-20" />
                        <span className="text-lg font-bold text-white">Cake O' Clock</span>
                    </div>

                    <ul className='flex font-bold ml-72 '> 
                        {Links.map((link, index) => (
                            <li key={index} className='mx-12 text-lg text-white'>
                                <a href={link.link} className='hover:text-red-500'>{link.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='flex w-72 justify-end items-center gap-2 ml-16'>
                    <a href="/login" className="flex items-center hover:text-blue-500">
                        <Link to='/Login'><span className="text-lg font-bold text-white">Login</span></Link>
                        <img src={image1} alt='Icon' className="w-5 h-5 color-white ml-2" />
                    </a>
                </div>
            </div>
        </section> 
    );
};

export default Header;
