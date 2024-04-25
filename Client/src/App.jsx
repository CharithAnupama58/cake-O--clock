// eslint-disable-next-line no-unused-vars
import { useState } from 'react'
import './App.css'
import Header from './assets/components/Header'
import Home from './assets/components/Home'
// Removed unused import statement
import Login from './assets/components/Login'
import StockManagement from './assets/components/stockManagementComponenet'
import CustomizeCake  from './assets/components/customizeCake'
import CustomizeCake2  from './assets/components/customizeCake2'
import PictureUploading  from './assets/components/pictureUploading'
import PictureUploading2  from './assets/components/pictureUploading2'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

const router=createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },

  {
    path:'/Login',
    element:<Login/>

  },

  {
    path:'/StockManagement',
    element:<StockManagement/>

  },
  {
    path:'/CustomizeCake',
    element:<CustomizeCake/>

  },
  {
    path:'/CustomizeCake2/:cakeId/:additionalText',
    element:<CustomizeCake2/>

  },
  {
    path:'/PictureUploading',
    element:<PictureUploading/>

  },
  {
    path:'/PictureUploading2/:imageUrl',
    element:<PictureUploading2/>

  }
])

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router}/>
    </div>   
  )
}

export default App
