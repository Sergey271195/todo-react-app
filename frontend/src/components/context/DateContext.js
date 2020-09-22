import React, {createContext, useState} from 'react'
import { getCurrentDate } from '../Utils'

export const CurrentDate = createContext();

const CurrentDateProvider = (props) => {

    const [currentDate, setCurrentDate] = useState(getCurrentDate())

    return (
        <CurrentDate.Provider value = {{currentDate, setCurrentDate}}>
            {props.children}
        </CurrentDate.Provider>
    )

}

export default CurrentDateProvider
