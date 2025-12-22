import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

function MyAppointments() {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [ appointments, setAppointments ] = useState([])
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const slotDateFormat = (slotDate)=>{
    const dataArray = slotDate.split('_')
    return dataArray[0] + " " + months[Number(dataArray[1])] + " " + dataArray[2]
  }

  const getUserAppointments = async()=>{

    try {

      const {data} = await axios.get( backendUrl + '/api/user/appointments', { headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        // console.log(data.appointments)
        setAppointments(data.appointments.reverse())                   //reverse because old appointments came first
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }


  const cancelAppointment = async(userId, appointmentId)=>{

    try {
      const {data} = await axios.post( backendUrl + '/api/user/cancel-appointment', {userId, appointmentId},  { headers: {Authorization: `Bearer ${token}`}})
      if(data.success){
        toast.success('Appointment Cancel Successfully')
        getUserAppointments()
        getDoctorsData()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }



  useEffect(()=>{
    if(token){
      getUserAppointments()
    }
  },[token])


  return (
    <div className='h-screen'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-100'>My Appointments</p>
      <div>
        {
          appointments.map((item)=>(
            <div key={item._id} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-100'>

              <div>
                <img className='w-32 bg-indigo-50' src={item?.docData?.image} alt={item?.docData?.name} />
              </div>

              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item?.docData?.name}</p>
                <p>{item?.docData?.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item?.docData?.address.line1}</p>
                <p className='text-xs'>{item?.docData?.address.line2}</p>
                <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> { slotDateFormat(item?.slotDate) } |  {item?.slotTime}</p>
              </div>

              <div></div>

              <div className='flex flex-col gap-2 justify-end'>
                {
                  !item.cancelled &&
                  <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'>Pay Online</button>
                }
                {
                  !item.cancelled &&
                  <button onClick={ ()=> cancelAppointment(item.userId, item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'>Cancel Appointment</button>
                }
                {
                  item.cancelled &&
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>
                }
              </div>


            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
