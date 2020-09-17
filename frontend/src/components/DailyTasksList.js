import React, {useContext} from 'react'
import { DailyContext } from './context/DailyTasksContext'
import DailyTask from './DailyItem'

import '../styles/Daily.css'

const DailyTasksList = () => {

    const {dailyTasks} = useContext(DailyContext)

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
