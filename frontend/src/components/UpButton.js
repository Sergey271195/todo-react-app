import React, { useContext } from 'react'
import {FiArrowUp} from 'react-icons/fi'

import '../styles/Button.css'
import { DailyContext } from './context/DailyTasksContext'

const UpButton = ({rightDate, index, employee}) => {

    const { dispatchDaily } = useContext(DailyContext)

    if (rightDate) {
        return <FiArrowUp className = 'btnIcon' 
            onClick = {() => dispatchDaily({type: 'MOVE_UP', employee: employee, index: index})}/>
    }
    return <></>
}

export default UpButton