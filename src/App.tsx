import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router'
import Authenticate from './Authenticate'
import Mint from './Mint'
import Navbar from './Navbar'
import './App.css'


function App() {


  return (
    <div className='w-full min-h-screen pt-3'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Authenticate />} />
        <Route path='/mint' element={<Mint />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
