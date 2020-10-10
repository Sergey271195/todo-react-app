import React, {useContext} from 'react'

import '../styles/Header.css'
import { BiCalendarWeek } from 'react-icons/bi'
import { CurrentDate } from './context/DateContext'
import { MobileContext } from './context/MobileContext'
import { ModeContext } from './context/ModeContext'
import { DARK, LIGHT, LIGHTBACKGROUND, DARKBACKGROUND, formatDate } from './Utils'

const DateHeader = ({fetchDailyTasks, mobileDate, setMobileDate}) => {

    const {mode} = useContext(ModeContext)
    const {currentDate, setCurrentDate} = useContext(CurrentDate)
    const {mobileMode}  = useContext(MobileContext)

    return (
        <div className = 'headerDiv' style = {mode ? {...DARK, ...DARKBACKGROUND} : {...LIGHT, ...LIGHTBACKGROUND}}>
            <div className = 'dateWeek'>{formatDate(currentDate)}</div>
            {mobileMode.mode ? <BiCalendarWeek className = 'dateIcon' onClick = {() => setMobileDate(!mobileDate)}/> : 
            <input type = 'date' className = 'dateInput' title = 'Просмотр списка задач всех сотрудников за выбранную дату'
                onChange = {(event) => {setCurrentDate(event.target.value), fetchDailyTasks(event.target.value)}}/>
            }
        </div>
    )
}

export default DateHeader