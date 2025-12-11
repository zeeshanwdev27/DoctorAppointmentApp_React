import React from 'react'
import { assets } from "../assets/assets";

function Footer() {
  return (
    <div className='md:mx-10'>

      {/* Top Footer */}
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>


        {/* Left Section */}
        <div>
          <img src={assets.logo} alt="logo_img" className='mb-5 w-40' />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta, minima quam cupiditate eligendi nesciunt, et inventore perspiciatis quae quia deserunt praesentium! Exercitationem voluptatibus earum nihil accusantium minus enim id obcaecati?</p>
        </div>


        {/* Center Section */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>


        {/* Right Section */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-222-444-777</li>
            <li>zeeshanwdev27@gmail.com</li>
          </ul>
        </div>


      </div>


      {/* Bottom Footer */}
      <div>
        <hr className='text-gray-300' />
        <p className='py-5 text-sm text-center'>©️Copyright 2025 @Precripto - All Right Reserved.</p>
      </div>


    </div>
  )
}

export default Footer






// 1: 48: 00