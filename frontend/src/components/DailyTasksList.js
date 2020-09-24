import React, {useContext, useEffect, useState} from 'react'
import { DailyContext } from './context/DailyTasksContext'
import DailyTask from './DailyItem'

import { postFetch } from './Utils'

import '../styles/Daily.css'

import UsernameTitle from './UsernameTitle'
import { ModeContext } from './context/ModeContext'



const DailyTasksList = () => {

    const {mode} = useContext(ModeContext)
    const { dailyTasks } = useContext(DailyContext)

    useEffect(() => {
        postFetch({url: `api/tasks/shift`, data: dailyTasks.tasks})
    }, [dailyTasks])

    return (
        <div className = {'dailyTasksDiv' + (mode ? ' dark': ' light')} >
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
        </div>
    )


}

export default DailyTasksList

