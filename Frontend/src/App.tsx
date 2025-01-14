//import { useState } from 'react'
import './App.css'
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Blogs } from "./pages/Blogs"
import { BrowserRouter,Route,Routes } from 'react-router-dom' 
import { FrontPage } from './pages/FrontPage'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FrontPage></FrontPage>}></Route>
          <Route path='/signup' element={<Signup></Signup>} ></Route>
          <Route path='/signin' element={<Signin></Signin>} ></Route>
          <Route path='/blogs' element={<Blogs></Blogs>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
