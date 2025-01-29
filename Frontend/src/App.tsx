//import { useState } from 'react'
import './App.css'
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Blogs } from "./pages/Blogs"
import { BrowserRouter,Route,Routes } from 'react-router-dom' 
import { FrontPage } from './pages/FrontPage'
import { Draft } from './pages/Draft'
import { Blog } from './pages/Blog'
import { Suspense, useState } from 'react'
import { Membership } from './pages/Membership'
import { AboutUs } from './pages/AboutUs'
import { RecoilRoot } from 'recoil'



function App() {
  //const [count, setCount] = useState(0)
  // const { login,setLogin }=  useState(false)
  return (
    <div>
      <RecoilRoot> {/* Wrap the entire app with RecoilRoot */}
        <BrowserRouter>
          <Suspense fallback={<div>Loading....</div>}>
            <Routes>
              <Route path='/' element={<FrontPage />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/signin' element={<Signin />} />
              <Route path='/blogs' element={<Blogs />} />
              <Route path='/draft' element={<Draft />} />
              <Route path='/blog' element={<Blog />} />
              <Route path='/membership' element={<Membership />} />
              <Route path='/aboutUs' element={<AboutUs />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  )
}

export default App
