//import { useState } from 'react'
import './App.css'
// import { Signup } from "./pages/Signup"
// import { Signin } from "./pages/Signin"
//import { Blogs } from "./pages/Blogs"
import { BrowserRouter,Route,Routes } from 'react-router-dom' 
//import { FrontPage } from './pages/FrontPage'
//import { Draft } from './pages/Draft'
//import { Blog } from './pages/Blog'
import { lazy, Suspense, useState } from 'react'
//import { Membership } from './pages/Membership'
//import { AboutUs } from './pages/AboutUs'
import { RecoilRoot } from 'recoil'
import LoadingPage from './components/LoadingPage'
const FrontPage=lazy(()=>import('./pages/FrontPage'))
const Signup=lazy(()=>import('./pages/Signup'))
const Signin=lazy(()=>import('./pages/Signin'))
const Blogs=lazy(()=>import('./pages/Blogs'))
const Dashboard=lazy(()=>import('./pages/Dashboard'))
const Draft=lazy(()=>import('./pages/Draft'))
const Blog=lazy(()=>import('./pages/Blog'))
const Membership=lazy(()=>import('./pages/Membership'))
const AboutUs=lazy(()=>import('./pages/AboutUs'))

function App() {
  //const [count, setCount] = useState(0)
  // const { login,setLogin }=  useState(false)
  return (
    <div>
      <RecoilRoot> {/* Wrap the entire app with RecoilRoot */}
        <BrowserRouter>
          <Suspense fallback={<div className='h-screen flex flex-col justify-center'><div className='flex justify-center'><LoadingPage></LoadingPage></div></div>}>
            <Routes>
              <Route path='/' element={<FrontPage />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/signin' element={<Signin />} />
              <Route path='/blogs' element={<Blogs />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/draft' element={<Draft />} />
              <Route path='/blog/:blogId' element={<Blog />} />
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
