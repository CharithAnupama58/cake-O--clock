import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center bg-green-100 text-green-600 rounded-full h-20 w-20 mb-8">
        <FaCheckCircle className="text-6xl" />
      </div>
      <h1 className="text-4xl font-bold mb-8">Payment Successful!</h1>
      <p className="text-lg mb-4">Thank you for your purchase.</p>
      <Link to="/" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">Continue</Link>
    </div>
  );
};

export default SuccessPage;
