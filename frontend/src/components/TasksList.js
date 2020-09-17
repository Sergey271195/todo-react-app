import React, {useContext, useState} from 'react';
import { DailyContext } from './context/DailyTasksContext';
import { EmployeeContext } from './context/EmployeeContext';

import '../styles/Tasks.css'
import {fetchDataHandler} from './Utils'

const TasksList = () => {

    const {currEmployee, dispatch} = useContext(EmployeeContext)
    const {dailyTasks, dispatchDaily} = useContext(DailyContext)
    const [newTask, setNewTask] = useState(false)
    const [formTitle, setFormTitle] = useState('')
    const [formComment, setFormComment] = useState('')
    const [validationError, setValidationError] = useState(false)

    const submitHandler = (event) => {

        event.preventDefault()
        if (formTitle == '') {
            setValidationError(true)
        }

        else {
            const data = {
                action: 'Create',
                title: formTitle,
                comment: formComment,
                responsibleId: currEmployee['id']
            }
            fetch(`api/tasks/user${currEmployee['id']}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                body: JSON.stringify(data)
            })
            .then((response) => {return response.json()})
                .then((data) => {
                    if (data.task !== 404) {
                        const task = fetchDataHandler(data)
                        dispatchDaily({type: 'EXTEND_DAILY', task: task})
                        dispatch({type: 'EXTEND_TASKS', task: data['task']})
                    }
                })
        }
    }

    const addExistingTask = ({taskId, emplId}) => {
        fetch(`api/tasks/user${emplId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({
                action: 'Add',
                taskId
            })
        })
        .then((response) => {return response.json()})
            .then((data) => {
                if (data.task !== 404) {
                    const task = fetchDataHandler(data)
                    dispatchDaily({type: 'EXTEND_DAILY', task: task})
                }
        })
    }

    if (currEmployee.tasks.length != 0) {
        return (
            <div className = 'usersTasksDiv'>

              
            {/* MAIN */}
                <h2>{currEmployee.name}</h2>
                {currEmployee.tasks.map(({taskId, title}, index) => {
                    const emplId = currEmployee.emplId
                    const included = dailyTasks.tasksId.includes(parseInt(taskId)) ? true : false
                    return <div key = {taskId} className = {included ? 'tasksDivActive': 'tasksDiv'}
                                onClick = {included ? () => console.log() : () => addExistingTask({taskId, emplId})}
                            >
                                {title}
                            </div>
                })}

                <form className = 'formTag' /* method = 'POST' */ onSubmit = {(event) => {console.log(currEmployee), event.preventDefault()}/* submitHandler(event) */}>
                        <div className = 'newTaskForm'>
                            <label>Title</label>
                                <textarea name = 'title' className = 'titleForm' onChange = {(event) => {setFormTitle(event.target.value),
                                    setValidationError(false)}}>
                                </textarea>
                            <label>Comment</label>
                                <textarea name = 'comment' className = 'commentForm' onChange = {(event) => setFormComment(event.target.value)}>
                                </textarea>
                            <button onClick = {() => {console.log(currEmployee)}}>Create Task</button>
                        </div>
                    </form>
                <div>{validationError ? 'Task field should not be empty': ''}</div>

            </div>
        )
    }
    return (
        <div></div>
    )
    
}

export default TasksList

