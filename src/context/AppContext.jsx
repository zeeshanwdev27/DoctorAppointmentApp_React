import { createContext, useEffect, useState } from "react";
// import { doctors } from '../assets/assets.js'
import axios from "axios"
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props)=>{


    const backendUrl = import.meta.env.VITE_BACKENDURL
    const [ doctors, setDoctors ] = useState([]) 
    const currencySymbol = '$'
    const [token, setToken] = useState( localStorage.getItem('token') ? localStorage.getItem('token') : '' )
    const [ userData, setUserData ] = useState(false)


    // Event Handlers
    const getDoctorsData = async() =>{
        try {
            const {data} = await axios.get( backendUrl + '/api/doctor/list')
            // console.log(data)
            if(data.success){
                setDoctors(data.doctors)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const loadUserProfileDate = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/get-profile', { headers: { Authorization: `Bearer ${token}`,}})
            if(data.success){
                setUserData(data.userData)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }


    // Share Values
    const value = {                          
        doctors, 
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileDate,
        getDoctorsData,
    }

    // useEffects
    useEffect(()=>{
        getDoctorsData()
    },[])

    useEffect(()=>{
        if(token){
            loadUserProfileDate()
        }else{
            setUserData(false)
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider




// used in main.jsx