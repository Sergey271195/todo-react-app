import React, {useContext} from 'react'
import { BiCalendarWeek } from "react-icons/bi"

import '../styles/Header.css'
import { CurrentDate } from './context/DateContext'

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
    const weekday = new Date().getDay()
    return `${day} ${monthName} ${year} (${Weekdays[weekday]})`
}

const DateHeader = () => {

    const {currentDate, setCurrentDate} = useContext(CurrentDate)
    formatDate(currentDate)
    return (
        <div className = 'headerDiv'>
            <div className = 'dateWeek'>{formatDate(currentDate)}</div>
            <BiCalendarWeek className = 'dateIcon' size = '20px'/>
        </div>
    )
}

export default DateHeader