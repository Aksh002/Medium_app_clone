//import { useState } from 'react'
import './App.css'
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Blogs } from "./pages/Blogs"
import { BrowserRouter,Route,Routes } from 'react-router-dom' 
import { FrontPage } from './pages/FrontPage'
import { Draft } from './pages/Draft'
import { Blog } from './pages/Blog'
import { useState } from 'react'



function App() {
  //const [count, setCount] = useState(0)
  // const { login,setLogin }=  useState(false)
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FrontPage></FrontPage>}></Route>
          <Route path='/signup' element={<Signup></Signup>} ></Route>
          <Route path='/signin' element={<Signin></Signin>} ></Route>
          <Route path='/blogs' element={<Blogs></Blogs>}></Route>
          <Route path='/draft' element={<Draft></Draft>}></Route>
          <Route path='/blog' element={<Blog></Blog>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
