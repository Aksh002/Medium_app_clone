//import { useState } from 'react'
import './App.css'
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Blogs } from "./pages/Blogs"
import { BrowserRouter,Route,Routes } from 'react-router-dom' 

function App() {
  //const [count, setCount] = useState(0)

  return (
    <div className='bg-#F7F4ED'>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup></Signup>} ></Route>
          <Route path='/signin' element={<Signin></Signin>} ></Route>
          <Route path='/blogs' element={<Blogs></Blogs>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
