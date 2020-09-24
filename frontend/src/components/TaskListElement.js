import React, { useContext } from 'react'
import { DailyContext } from './context/DailyTasksContext'
import { fetchDataHandler, postFetch } from './Utils'

import '../styles/TaskListElement.css'

const TaskListElement = ({taskId, title, emplId, fullName}) => {

    const removeTask = () => {
        postFetch({url: `api/tasks/user${emplId}`, data: {action: 'Remove', taskId}})
            .then(data => 
                {
                if (data.status === 200) {
                    dispatchDaily({type: 'REMOVE_FROM_DAILY', fullName, taskId})
                }
            })
        }

    const addExistingTask = () => {
        postFetch({url: `api/tasks/user${emplId}`, data: {action: 'Add', taskId}})
            .then(data => {
                if (data.status !== 404) {
                    const task = fetchDataHandler(data)
                    dispatchDaily({type: 'EXTEND_DAILY', task: task})
                }
        })
    }

    const {dailyTasks, dispatchDaily} = useContext(DailyContext)
    const included = dailyTasks.tasksId.includes(parseInt(taskId)) ? true : false

    return (
        <div key = {taskId} className = {'tasksDiv' + (included ?  ' included': '')}
                onClick = {included ? () => removeTask() : () => addExistingTask()}
            >
                <div className = 'taskDivWrapper'>
                    {title}
                </div>
                
        </div>
    )
}

export default TaskListElement