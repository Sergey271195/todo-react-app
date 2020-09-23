import React, {useContext, useEffect, useState} from 'react'
import { DailyContext } from './context/DailyTasksContext'
import DailyTask from './DailyItem'
import DateHeader from './DateHeader'

import {postFetch, fetchDataHandler, getCurrentDate} from './Utils'

import '../styles/Daily.css'
import { UserLoading } from './context/UserLoadingContext'
import UsernameTitle from './UsernameTitle'



const DailyTasksList = () => {

    const {dailyTasks, dispatchDaily} = useContext(DailyContext)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { loadingUser } = useContext(UserLoading)

    const fetchDailyTasks = (date) => {
        setLoading(true)
        fetch(`api/daily${date}`)
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
        fetchDailyTasks(getCurrentDate())
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
        <>
        <DateHeader fetchDailyTasks = {fetchDailyTasks}/>
        <div className = 'dailyTasksDiv' style = {(loading || loadingUser) ? {justifyContent: 'center'} : {justifyContent: 'start'}}>
            {(loading || loadingUser) ? <div className = 'loadingDiv'>Loading...</div>:
                <>
                    {error ? <div className = 'loadingDiv' style = {{height: '100%'}}>{`< List not found />`}</div>:
                        <>
                        {Object.keys(dailyTasks.tasks).map((employee) => {
                            return (
                            <div key = {employee} className = 'mainDailyDiv'>
                                <UsernameTitle employee = {employee} emplId = {dailyTasks.tasks[employee][0].emplId}/>
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
        </>
    )


}

export default DailyTasksList

