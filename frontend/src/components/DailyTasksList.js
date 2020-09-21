import React, {useContext, useEffect} from 'react'
import { DailyContext } from './context/DailyTasksContext'
import DailyTask from './DailyItem'

import {postFetch} from './Utils'

import '../styles/Daily.css'

const DailyTasksList = () => {

    const {dailyTasks} = useContext(DailyContext)

    useEffect(() => {
        postFetch({url: `api/tasks/shift`, data: dailyTasks.tasks})
            .then(data => console.log(data))
    }, [dailyTasks])

    return (
        <div className = 'dailyTasksDiv'>
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
        </div>
    )


}

export default DailyTasksList
