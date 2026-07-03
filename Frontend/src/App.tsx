import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom' 
import { lazy, Suspense } from 'react'
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
const Profile=lazy(()=>import('./pages/Profile'))
const Library=lazy(()=>import('./pages/Library'))
const Series=lazy(()=>import('./pages/Series'))
const Challenges=lazy(()=>import('./pages/Challenges'))
const Tag=lazy(()=>import('./pages/Tag'))

function App() {
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
              <Route path='/write' element={<Draft />} />
              <Route path='/blog/:blogId' element={<Blog />} />
              <Route path='/p/:slug' element={<Blog />} />
              <Route path='/u/:userName' element={<Profile />} />
              <Route path='/library' element={<Library />} />
              <Route path='/series/:slug' element={<Series />} />
              <Route path='/challenges' element={<Challenges />} />
              <Route path='/challenges/:slug' element={<Challenges />} />
              <Route path='/tag/:tag' element={<Tag />} />
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
