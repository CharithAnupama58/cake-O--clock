import { useState } from 'react';
import arrowLeft from '../assets/images/arrowLeft.png';
import radiobtn from '../assets/images/Group 127.png';
import radiobtn1 from '../assets/images/Group 127 (1).png';
import imageBox from '../assets/images/imageBox.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';

export const PictureUploading = () => {
    const [dragging, setDragging] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

   
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

  
    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        console.log(file); 

       
        const formData = new FormData();
        formData.append('image', file);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3001/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const url = response.data.imageUrl;
            setImageUrl(url);
            console.log(url);
            Swal.fire({
                icon: 'success',
                title: 'Image Uploaded Successfully',
                text: 'Your image has been uploaded.',
            });
            setShowModal(true);
        } catch (error) {
            console.error('Error uploading image:', error);
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'There was an error uploading the image. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNextClick = () => {
        if (imageUrl) {
            console.log(imageUrl);
            const encodedUrl = encodeURIComponent(imageUrl);
            navigate(`/PictureUploading2/${encodedUrl}`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className='flex h-screen w-screen justify-between'>
            <Link to='/'><img src={arrowLeft} className='w-8 h-8 ml-8 mt-10' alt='Icon'></img></Link>
            <div className='flex flex-col w-full mt-6'>
                <div className='flex items-center justify-center'>
                    <h1 className='text-6xl font-bold'>Order Online</h1>
                </div>
                <div className='flex flex-row justify-between'>
                    <Link to='/CustomizeCake'>
                        <div className='flex flex-row'>
                            <img src={radiobtn1} className='w-8 h-8 ml-32 mt-12'></img>
                            <h1 className='ml-6 text-4xl mt-10 font-semibold'>Customize Cake</h1>
                        </div>
                    </Link>
                    <Link to='/PictureUploading'>
                        <div className='flex flex-row mr-36'>
                            <img src={radiobtn} className='w-8 h-8 ml-32 mt-12'></img>
                            <h1 className='ml-6 text-4xl mt-10 font-semibold'>Picture Uploading</h1>
                        </div>
                    </Link>
                </div>
                <div className='flex flex-col mt-10'>
                    <h1 className='flex flex-row text-4xl font-semibold justify-center'>Cake Details</h1>

                    <div
                        className={`image-drop-zone ${dragging ? 'dragging' : ''} flex border-4 items-center border-black w-1/2 mx-auto mt-24 rounded-3xl`}
                        onDragOver={handleDragOver}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                    >
                        <img src={imageBox} alt='Drop Zone' />
                        {dragging ? <p className='flex ml-24 text-3xl font-semibold'>Drop the image here</p> : <p className='flex ml-24 text-3xl font-semibold'>Drag and drop an image here</p>}
                    </div>
                    {loading && (
                        <div className='flex justify-center mt-6'>
                            <ClipLoader size={50} color={"#123abc"} loading={loading} />
                        </div>
                    )}
                    <div className='flex mt-24 justify-center'>
                        <button
                            className={`text-xl w-36 bg-blue-500 text-white rounded-xl ${!imageUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleNextClick}
                            disabled={!imageUrl}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-4 rounded-lg'>
                        <h2 className='text-2xl font-bold mb-4'>Uploaded Image</h2>
                        <img src={imageUrl} alt='Uploaded' className='max-w-full max-h-96' />
                        <button className='mt-4 bg-blue-500 text-white px-4 py-2 rounded' onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PictureUploading;
