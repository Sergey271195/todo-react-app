import React, {useContext} from 'react'

import '../styles/Header.css'
import { CurrentDate } from './context/DateContext'
import { ModeContext } from './context/ModeContext'
import { DARK, LIGHT, LIGHTBACKGROUND, DARKBACKGROUND } from './Utils'

const Months = {
    1:  'Января',
    2:	'Февраля',
    3:	'Марта',
    4:	'Апреля',
    5:	'Мая',
    6:	'Июня',
    7:	'Июля',
    8:	'Августа',
    9:	'Сентября',
    10:	'Октября',
    11:	'Ноября',
    12:	'Декабря',
}

const Weekdays = {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота'
}

const formatDate = (date) => {
    const [year, month, day] = date.split('-')
    const monthName = Months[parseInt(month)].toLowerCase()
    const weekday = new Date(date).getDay()
    return `${day} ${monthName} ${year} (${Weekdays[weekday]})`
}

const DateHeader = ({fetchDailyTasks}) => {

    const {mode} = useContext(ModeContext)
    const {currentDate, setCurrentDate} = useContext(CurrentDate)

    return (
        <div className = 'headerDiv' style = {mode ? {...DARK, ...DARKBACKGROUND} : {...LIGHT, ...LIGHTBACKGROUND}}>
            <div className = 'dateWeek'>{formatDate(currentDate)}</div>
            <input type = 'date' className = 'dateInput' 
                onChange = {(event) => {setCurrentDate(event.target.value), fetchDailyTasks(event.target.value)}}/>
        </div>
    )
}

export default DateHeader