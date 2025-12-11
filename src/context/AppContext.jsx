import { createContext } from "react";
import {doctors} from '../assets/assets.js'

export const AppContext = createContext()

const AppContextProvider = (props)=>{


    const currencySymbol = '$'



    const value = {                          
        doctors , currencySymbol                    // pass "doctor data & currency Symbol" in components
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider




// used in main.jsx