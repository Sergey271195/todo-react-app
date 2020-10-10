import React from 'react'
import {FiCheckCircle, FiCircle} from 'react-icons/fi'

import '../styles/TaskCheckbox.css' 

const TaskCheckbox = ({completed, rightDate, completeTask}) => {
    if (completed) {
        return (
            <div style = {{lineHeight: '32px', marginRight: '20px'}}>
                <FiCheckCircle className = {'iconChecked' + (rightDate ? '': ' disabled')}  onClick = {() => {completeTask()}} title = 'Отметить задачу как незавершенную'/>
            </div>
        )
    }
    return  (
        <div style = {{lineHeight: '32px', marginRight: '20px'}}>
            <FiCircle className = {'iconUnchecked' + (rightDate ? '': ' disabled')} onClick = {() => {completeTask()}} title = 'Отметить задачу как выполненную'/>
        </div>
    )
}

export default TaskCheckbox