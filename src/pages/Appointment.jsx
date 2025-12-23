import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import { assets } from '../assets/assets.js'
import RelatedDoctors from '../components/RelatedDoctors.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

function Appointment() {

  const { doctors, currencySymbol, backendUrl, token, getDoctorsData }  = useContext(AppContext)     //bcz i store assets.js data in context
  const navigate = useNavigate()

  const { docId } = useParams()
  const [ docInfo, setDocInfo ] = useState(null)
  const [ docSlots, setDocSlots ] = useState([])
  const [ slotIndex, setSlotIndex ] = useState(0)
  const [ slotTime, setSlotTime ] = useState('')


  const daysOfWeek = ['SUN', 'MON', "TUE", "WED", "THU", "FRI", "SAT"]


  const fetchDocInfo = async()=>{
    const doctorInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(doctorInfo)
    // console.log(doctorInfo)
  }


  // set available slot
const getAvailableSlots = async () => {

  if (!docInfo) return

  setDocSlots([])

  const today = new Date()
  const now = new Date()

  // Clinic working hours
  const CLINIC_START_HOUR = 10
  const CLINIC_END_HOUR = 21

  // Decide whether to skip today
  const clinicEndTime = new Date()
  clinicEndTime.setHours(CLINIC_END_HOUR, 0, 0, 0)

  const startIndex = now >= clinicEndTime ? 1 : 0

  let allSlots = []

  for (let i = startIndex; i < startIndex + 7; i++) {

    // Base date
    let currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    // End time (21:00) for this day
    let endTime = new Date(currentDate)
    endTime.setHours(CLINIC_END_HOUR, 0, 0, 0)

    // Set starting time
    if (currentDate.toDateString() === today.toDateString()) {

      // Round to next 30-minute slot
      let minutes = currentDate.getMinutes()

      if (minutes > 30) {
        currentDate.setHours(currentDate.getHours() + 1)
        currentDate.setMinutes(0)
      } else {
        currentDate.setMinutes(30)
      }

      if (currentDate.getHours() < CLINIC_START_HOUR) {
        currentDate.setHours(CLINIC_START_HOUR, 0, 0, 0)
      }

    } else {
      currentDate.setHours(CLINIC_START_HOUR, 0, 0, 0)
    }

    let timeSlots = []

    while (currentDate < endTime) {

      const formattedTime = currentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })

      const day = currentDate.getDate()
      const month = currentDate.getMonth() + 1
      const year = currentDate.getFullYear()

      const slotDate = `${day}_${month}_${year}`

      const isSlotAvailable =
        !docInfo?.slots_booked?.[slotDate]?.includes(formattedTime)

      if (isSlotAvailable) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30)
    }

    allSlots.push(timeSlots)
  }

  setDocSlots(allSlots)
}


  // book appoinments Handler
  const handleBookAppointment = async()=>{

    if(!token){
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()

      const slotDate = day + '_' + month + '_' + year
      // console.log(slotDate)

      const { data } = await axios.post( backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime}, { headers: { Authorization: `Bearer ${token}`,}})

      if(data.success){

        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')

      }else{
        toast.error(data.message)
      }


    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }


  }



  useEffect(()=>{
    fetchDocInfo()
  },[doctors, docId])

  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])
  


  return docInfo && (
    <div>

      {/* ------------- Doctor Details ------------- */}
      <div className='flex flex-col sm:flex-row gap-4'>

        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0'>
          {/* ------------- Doctor Info ------------- */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} 
            <img className='w-5' src={assets.verified_icon} alt="verified_icon" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1  text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/* ------------- Doctor About ------------- */}
          <div>
            <p className='flex items-center gap-2 text-sm font-medium text-gray-900 mt-3'>
              About
              <img  className='w-4' src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-900 font-medium mt-4 flex gap-2'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>


      </div>

      {/* ------------- Booking Slots ------------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        
        <p>Booking slots</p>

        <div className='flex gap-3 items-center w-full mt-4 overflow-x-scroll no-scrollbar '>
          {
            docSlots.length && docSlots.map((item, index)=>(
              <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${ slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200' }`} key={index}>
                <p>{ item[0] && daysOfWeek[item[0].datetime.getDay()] }</p>
                <p>{ item[0] && item[0].datetime.getDate() }</p>
                <p></p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full mt-4 overflow-x-scroll py-3'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=> setSlotTime(item.time)} className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white': 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button onClick={ handleBookAppointment } className='cursor-pointer bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>

      </div>

      {/* ------------- Listing Related Doctors ------------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>

    </div> 
  )
}

export default Appointment