import React, { useContext } from 'react'
import {FiArrowDown} from 'react-icons/fi'

import '../styles/Button.css'
import { DailyContext } from './context/DailyTasksContext'

const DownButton = ({rightDate, index, employee}) => {

    const { dispatchDaily } = useContext(DailyContext)

    if (rightDate) {
        return <FiArrowDown className = 'btnIcon' title = 'Уменьшение приоритета задачи (Опустить задачу в списке)'
            onClick = {() => dispatchDaily({type: 'MOVE_DOWN', employee: employee, index: index})}/>
    }
    return <></>
}

export default DownButton