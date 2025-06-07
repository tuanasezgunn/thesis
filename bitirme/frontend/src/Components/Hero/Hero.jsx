import React from 'react'
import './Hero.css'
import arrow_icon from '../Assets/arrow2.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
return(
<div className='hero'>
<div className="hero-left">
<h2>NEW BOOKS</h2>
<p>NEW BOOK</p>
    <p>FOR EVERYONE</p>

<div className="hero-latest-btn">
    <div>LATEST BOOK </div>
    <img src={arrow_icon} alt=""style={{ width: '60px', height: '70px' }}/>
    </div>
</div>
<div className="hero-right">
<img src={hero_image}alt="" style={{ width: '300px', height: '300px' }}/>
</div>
</div>
)

}
export default Hero














































