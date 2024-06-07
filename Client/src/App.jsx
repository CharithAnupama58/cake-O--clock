import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Home from './views/Home'
import Login from './views/Login'
import StockManagement from './views/stockManagementComponenet'
import FactoryEmployee from './views/factoryEmployee'
import CustomizeCake from './views/customizeCake'
import CustomizeCake2 from './views/customizeCake2'
import PictureUploading from './views/pictureUploading'
import PictureUploading2 from './views/pictureUploading2'
import BranchEmployee from './views/BranchEmployee'
import AdminBoard from './views/AdminDashBoard'
import SuccessPage from './views/SuccessUrl'
import CancelPage from './views/CancelUrl'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../src/Context/AuthProvider'
import PrivateRoute from './PrivateRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    path: '/StockManagement',
    element: (
      <PrivateRoute allowedRoles={['Stock Keeper']}>
        <StockManagement />
      </PrivateRoute>
    )
  },
  {
    path: '/CustomizeCake',
    element: <CustomizeCake />
  },
  {
    path: '/CustomizeCake2/:cakeId/:additionalText/:finalPrice/:selectedOption2',
    element: <CustomizeCake2 />
  },
  {
    path: '/PictureUploading',
    element: <PictureUploading />
  },
  {
    path: '/PictureUploading2/:imageUrl',
    element: <PictureUploading2 />
  },
  {
    path: '/FactoryEmployee',
    element: (
      <PrivateRoute allowedRoles={['Factory Employee']}>
        <FactoryEmployee />
      </PrivateRoute>
    )
  },
  {
    path: '/BranchEmployee/:branchId',
    element: (
      <PrivateRoute allowedRoles={['Branch Employee']}>
        <BranchEmployee />
      </PrivateRoute>
    )
  },
  {
    path: '/AdminDashBoard',
    element: (
      <PrivateRoute allowedRoles={['Admin']}>
        <AdminBoard />
      </PrivateRoute>
    )
  },
  {
    path: '/SuccessPage',
    element: <SuccessPage />
  },
  {
    path: '/CancelPage',
    element: <CancelPage />
  },
])

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  )
}

export default App
