import { useState } from 'react'
import arrowLeft from '../assets/images/arrowLeft.png'
import radiobtn from '../assets/images/Group 127.png'
import radiobtn1 from '../assets/images/Group 127 (1).png'
import imageBox from '../assets/images/imageBox.png'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

export const PictureUploading = () => {
    const [dragging, setDragging] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    // Prevent default drag behaviors
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragging(true);
    };
  
    // Handle file drop
    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0]
        console.log(file); // Get the dropped file

        // Create FormData object
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Send the image file to the backend for uploading
            const response = await axios.post('http://localhost:3001/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle successful upload
            const url = response.data.imageUrl;
            setImageUrl(url);
            console.log(url);
            // console.log('Image uploaded successfully:', response.data.imageUrl);
            alert('Image uploaded successfully. Link: ' + response.data.imageUrl);
        } catch (error) {
            // Handle upload error
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    };
    const handleNextClick = () => {
        console.log(imageUrl);
        const encodedUrl = encodeURIComponent(imageUrl);
        navigate(`/PictureUploading2/${encodedUrl}`);
    }
  return (
    <div className='flex h-screen w-screen justify-between'>
        <Link to='/'><img src={arrowLeft} className='w-8 h-8 ml-8 mt-10' alt='Icon'></img></Link>
        <div className='flex flex-col w-full mt-6'>
            <div className='flex items-center justify-center'>
                <h1 className='text-6xl font-bold'>Order Online</h1>
            </div>
            <div className='flex flex-row justify-between'>
                <Link to='/CustomizeCake'><div className='flex flex-row'>
                    <img src={radiobtn1} className='w-8 h-8 ml-32 mt-12'></img>
                    <h1 className='ml-6 text-4xl mt-10 font-semibold'>Customize Cake</h1>
                </div></Link>
                <Link to='/PictureUploading'><div className='flex flex-row mr-36'>
                    <img src={radiobtn} className='w-8 h-8 ml-32 mt-12'></img>
                    <h1 className='ml-6 text-4xl mt-10 font-semibold'>Picture Uploading</h1>
                </div></Link>
            </div>
            <div className='flex flex-col mt-10 '>
                <h1 className='flex flex-row text-4xl font-semibold justify-center'>Cake Details</h1>

                <div
                    className={`image-drop-zone ${dragging ? 'dragging' : ''} flex border-4 items-center border-black w-1/2 mx-auto mt-24 rounded-3xl`}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    >
                    <img src={imageBox}></img>
                    {dragging ? <p className='flex ml-24 text-3xl font-semibold'>Drop the image here</p> : <p className='flex ml-24 text-3xl font-semibold'>Drag and drop an image here</p>}
                    
                </div>
                <div className='flex mt-24 justify-center'>
                    <button className='text-xl w-36 bg-blue-500 text-white rounded-xl'onClick={handleNextClick}>Next</button>
                </div>
                
            </div>   
        </div>
    </div>
  )
}
export default PictureUploading;