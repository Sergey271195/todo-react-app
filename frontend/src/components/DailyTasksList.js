import React, {useContext, useEffect, useState} from 'react'
import { DailyContext } from './context/DailyTasksContext'
import DailyTask from './DailyItem'

import {postFetch, fetchDataHandler, getCurrentDate} from './Utils'

import '../styles/Daily.css'
import { UserLoading } from './context/UserLoadingContext'
import { CurrentDate } from './context/DateContext'
import UsernameTitle from './UsernameTitle'



const DailyTasksList = () => {

    const {dailyTasks, dispatchDaily} = useContext(DailyContext)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { setCurrentDate } = useContext(CurrentDate)
    const { loadingUser } = useContext(UserLoading)
    const [dateInput, setDateInput] = useState(getCurrentDate())

    const fecthDailyTasks = () => {
        setLoading(true)
        setCurrentDate(dateInput)
        fetch(`api/daily${dateInput}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.status != 404) {
                const dailyTasksId = data.map(({task: {bitrix_id}}) => bitrix_id)
                const dailyList = prepareDailyList(data)
                dispatchDaily({type: 'GET_DAILY', tasks: dailyList, tasksId: dailyTasksId})
                setError(false)
                setTimeout(setLoading, 100, false)
            }
            else {
                setError(true)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        postFetch({url: `api/tasks/shift`, data: dailyTasks.tasks})
    }, [dailyTasks])


    useEffect(() => {
        fecthDailyTasks()
    }, [])

    const prepareDailyList = (tasks) => {
        const dailyList = tasks.reduce((obj, taskObj) => {
            const task = fetchDataHandler(taskObj)
            obj[task.fullName] = (obj[task.fullName] === undefined) ?  [task] : [...obj[task.fullName], task]
            return obj
        }, {})
        return dailyList
    }

    return (
        <div className = 'dailyTasksDiv' style = {(loading || loadingUser) ? {justifyContent: 'center'} : {justifyContent: 'start'}}>
            {(loading || loadingUser) ? <div className = 'loadingDiv'>Loading...</div>:
                <>
                    {/* <form className = 'dateForm' onSubmit = {(event) => {event.preventDefault(), fecthDailyTasks()}}>
                        <input className = 'dateInput' type = 'date' value = {dateInput} 
                                onChange = {(event) => setDateInput(event.target.value)}/>
                        <button className = 'dateBtn'>Выбрать дату</button>
                    </form> */}
                        {error ? <div className = 'loadingDiv' style = {{height: '100%'}}>{`< List not found />`}</div>:
                            <>
                            {Object.keys(dailyTasks.tasks).map((employee) => {
                                return (
                                <div key = {employee} className = 'mainDailyDiv'>
                                    <UsernameTitle employee = {employee} emplId = {1}/>
                                    {dailyTasks.tasks[employee].map((task, index) => {
                                        return (
                                            <DailyTask key = {task.taskId} {...task} index = {index} employee = {employee} />
                                            )
                                    })}
                                </div>
                                )
                            })}
                            </>
                        }
                </>
            }
        </div>
    )


}

export default DailyTasksList

