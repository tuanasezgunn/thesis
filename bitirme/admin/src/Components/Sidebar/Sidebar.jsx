import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'
const Sidebar = () => {
    return(
        <div className='sidebar'>
<Link to={'/addbook'} style={{textDecoration:"none"}}>
    <div className="sidebar-item">
        <img src={add_product_icon} alt="" style={{ width: '50px', height: 'auto' }}/>
        <p>Add Book</p>
        </div>

        </Link>
     

<Link to={'/listbook'} style={{textDecoration:"none"}}>
    <div className="sidebar-item">
        <img src={list_product_icon} alt="" style={{ width: '50px', height: 'auto' }}/>
        <p>Book List</p>
        </div>

        </Link>
        </div>
    )
}

export default Sidebar