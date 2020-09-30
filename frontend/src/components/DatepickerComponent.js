import React, { useEffect, useState, useContext } from 'react'
import {FiArrowLeft, FiArrowRight} from 'react-icons/fi'

import { Months_IP } from './Utils'

import '../styles/DatePicker.css'
import { CurrentDate } from './context/DateContext'

/* For Safari users */

const formatDateToString = (date) => {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0'+day: day}`
}

const DaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate()
}

const MonthName = (date) => {
    let month =  date.getMonth()
    return Months_IP[month+1]
}

const YearName = (date) => {
    return date.getFullYear()
}

const DatepickerComponent = ({fetchDailyTasks, mobileDate, setMobileDate}) => {

    const { currentDate, setCurrentDate } = useContext(CurrentDate)
    const [componentsDate, setComponentsDate] = useState(new Date())

    const populateTable = (date) => {
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
        let offset = (firstDay.getDay() + 6 ) % 7
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let daysInMonth = DaysInMonth(year, month)
        for (let i = 0; i < daysInMonth; i++) {
            let cell = document.getElementById('datepickerTable').rows[Math.floor((i+offset)/7)].cells[(i+offset)%7]
            cell.innerHTML = i+1
            cell.id = `${year}-${month < 10 ? '0'+month : month}-${(i+1) < 10 ? '0'+(i+1): (i+1)}`
            cell.className = cell.id === currentDate ?  'active' : ''
        }

        if (offset != 0) {
            let previousMonth = date.getMonth() > 0 ? date.getMonth() : 12
            let year = previousMonth === 12 ? date.getFullYear() - 1 : date.getFullYear()
            let daysInPreviousMonth = DaysInMonth(year, previousMonth) 
            for (let i = 0; i < offset; i ++) {
                let cell = document.getElementById('datepickerTable').rows[0].cells[i]
                let value =  daysInPreviousMonth - offset + i + 1
                cell.innerHTML = value
                cell.id = `${year}-${previousMonth < 10 ? '0' + previousMonth : previousMonth}-${value < 10 ? '0'+value: value}`
                cell.className = cell.id === currentDate ?  'active' : ''
            }
        }

        let filledCells = offset + daysInMonth
        let cellsToFill = 42 - filledCells
        let nextMonth = (date.getMonth() + 2) > 12 ? 1: (date.getMonth() + 2);
        year = nextMonth === 1 ? (date.getFullYear() + 1) : date.getFullYear()

        for (let i = 0; i < cellsToFill; i++) {
            
            let cell = document.getElementById('datepickerTable').rows[Math.floor((i+filledCells)/7)].cells[(i+filledCells)%7]
            cell.innerHTML = i + 1
            cell.id = `${year}-${(nextMonth) < 10 ? '0' + (nextMonth) : (nextMonth)}-${(i+1) < 10 ? '0'+(i+1): (i+1)}`
            cell.className = cell.id === currentDate ?  'active' : ''

        }

    }

    useEffect(() => {
        currentDate ? setComponentsDate(new Date(currentDate)) : setComponentsDate(new Date())
        for (let i = 0; i < 6; i++) {
            let row = document.getElementById('datepickerTable').insertRow()
            for (let j = 0; j < 7; j++) {
                let cell = row.insertCell()
                cell.onclick = (event) => {
                    setMobileDate(!mobileDate),
                    setCurrentDate(event.target.id),
                    fetchDailyTasks(event.target.id)
                }
                
            }
        }
        populateTable(componentsDate)
    }, []) 

    useEffect(() => {
        populateTable(componentsDate)
    }, [componentsDate])
    

    return (
        <div className = 'datePickerMainDiv'>
            <div className = 'mothAndYearDiv'>
                <FiArrowLeft onClick = {() => {
                    setComponentsDate(new Date(componentsDate.setMonth(componentsDate.getMonth()-1)))
                    
                }}/>
                    {MonthName(componentsDate)} {YearName(componentsDate)}
                <FiArrowRight onClick = {() => {
                    setComponentsDate(new Date(componentsDate.setMonth(componentsDate.getMonth()+1)))
                    
                }}/>
            </div>
            <table  className = 'dateTable'>
                <thead>
                    <tr>
                        <td>Пн</td>
                        <td>Вт</td>
                        <td>Ср</td>
                        <td>Чт</td>
                        <td>Пт</td>
                        <td>Сб</td>
                        <td>Вск</td>
                    </tr>
                </thead>
                <tbody id = 'datepickerTable'>

                </tbody>
            </table>
            <div className = 'mothAndYearDiv' onClick = {() => {
                let currDate = formatDateToString(new Date()) 
                setMobileDate(!mobileDate),
                setCurrentDate(currDate),
                fetchDailyTasks(currDate)
            }}>Текущая дата</div>
        </div>
    )

}   

export default DatepickerComponent