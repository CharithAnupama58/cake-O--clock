import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const CancelPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center justify-center bg-red-100 text-red-600 rounded-full h-20 w-20 mb-8">
        <FaTimesCircle className="text-6xl" />
      </div>
      <h1 className="text-4xl font-bold mb-8">Payment Cancelled!</h1>
      <p className="text-lg mb-4">Your payment was cancelled.</p>
      <Link to="/" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">Return to Home</Link>
    </div>
  );
};

export default CancelPage;
