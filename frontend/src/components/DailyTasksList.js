import React, {useContext, useEffect, useState} from 'react'
import { DailyContext } from './context/DailyTasksContext'
import DailyTask from './DailyItem'

import {postFetch, fetchDataHandler} from './Utils'

import '../styles/Daily.css'
import { UserLoading } from './context/UserLoadingContext'

const DailyTasksList = () => {

    const {dailyTasks, dispatchDaily} = useContext(DailyContext)
    const [loading, setLoading] = useState(true)
    const { loadingUser } = useContext(UserLoading)

    useEffect(() => {
        postFetch({url: `api/tasks/shift`, data: dailyTasks.tasks})
    }, [dailyTasks])

    useEffect(() => {
        setLoading(true)
        fetch(`api/daily`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const dailyTasksId = data.map(({task: {bitrix_id}}) => bitrix_id)
            const dailyList = prepareDailyList(data)
            dispatchDaily({type: 'GET_DAILY', tasks: dailyList, tasksId: dailyTasksId})
        }).then(setLoading(false));
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
                    {Object.keys(dailyTasks.tasks).map((employee) => {
                        return (
                        <div key = {employee} className = 'mainDailyDiv'>
                            <h2>{employee}</h2>
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
        </div>
    )


}

export default DailyTasksList

