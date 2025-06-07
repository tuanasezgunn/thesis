import React, { useState } from "react";
import data_product from "../Assets/data";
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {

//const [popularBook,setPopularBook] = useState([]);

//useEffect(()=>{

  //      fetch('http://localhost:4000/popular')
    //    .then((response)=>response.json)
      //  .then((data)=>setPopularBook(data));
        //},[])
        


    return (
        <div className='new-books'>
<h1>POPULAR BOOKS</h1>
<hr />
<div className="popular-item">
    {data_product.map((item,i)=>{
return <Item key={i} id={item.id}name={item.name} image={item.image } price={item.price}/>

    })}
</div>

        </div>
    )
}

export default Popular;