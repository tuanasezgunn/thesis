import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import {Routes,Route } from 'react-router-dom'
import AddBook from '../../Components/AddBook/AddBook'
import ListBook from '../../Components/ListBook/ListBook'

const Admin = () => {
    return(
        <div className='admin'>
<Sidebar/>
<Routes>
<Route path='/addbook' element={<AddBook/>}/>
<Route path='/listbook' element={<ListBook/>}/>



</Routes>

        </div>
    )
}
export default Admin