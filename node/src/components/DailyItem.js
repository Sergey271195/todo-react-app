import React, {useContext, useState, useRef} from 'react'
import CommentComponent from './CommentComponent'
import { DailyContext } from './context/DailyTasksContext'
import { CurrentDate } from './context/DateContext'
import { MobileContext } from './context/MobileContext'
import DownButton from './DownButton'
import TaskCheckbox from './TaskCheckbox'
import TaskTitle from './TaskTitle'
import TimeTracker from './TimeTracker'
import UpButton from './UpButton'

import { getCurrentDate } from './Utils'

const DailyTask = ({title: titleName, comments, completed, pk, index, employee,
                emplId, taskId, time }) => {

    const {dailyTasks, dispatchDaily} = useContext(DailyContext)
    const { currentDate } = useContext(CurrentDate)
    const rightDate = (currentDate == getCurrentDate())
    const {mobileMode} = useContext(MobileContext)

    const completeTask = () => {
        fetch(`api/tasks/complete${pk}`)
        .then((response) => {return response.json()})
        .then((data) => {
            if (data.status !== 404) {
                dispatchDaily({type: 'TOGGLE_TASK', pk: pk, employee: employee})
                if (data.status === 200) return
                dispatchDaily({type: 'SWITCH_ACTIVE', taskId, active: true})
            }
        })
        
    }


    return (
        <div className = 'mainDailyItemDiv'>
            <TaskCheckbox completed = {completed} rightDate = {rightDate} completeTask = {completeTask}/>

            <div className = 'dailyWrapperDiv'>
                <div className = 'dailyItemContentDiv'>

                    <TaskTitle url = {`https://illuminator3000.bitrix24.ru/company/personal/user/${emplId}/tasks/task/view/${taskId}/`} 
                        titleName = {titleName} completed = {completed} />
                    
                    {mobileMode.mode ? 
                    <div className = 'mobileVersionDiv'>
                        <div className ={'timeDiv' + (rightDate ? '': ' only')}>
                            <TimeTracker emplId = {emplId} taskId = {taskId} time = {time} rightDate = {rightDate} employee = {employee} index = {index}/>
                        </div>
                        {
                            index !=  0 ? 
                            <UpButton rightDate = {rightDate} index = {index} employee = {employee}/>
                            : <></>
                        }
                        {
                            index != (dailyTasks.tasks[employee].length -1) ?
                            <DownButton rightDate = {rightDate} index = {index} employee = {employee}/>
                            : <></>
                        }
                    </div>
                    : <></>}

                    <CommentComponent comments = {comments} rightDate = {rightDate} pk ={pk} index = {index} employee = {employee} />

                </div>
                {!mobileMode.mode ?
                <>
                    <div className ={'timeDiv' + (rightDate ? '': ' only')}>
                        <TimeTracker emplId = {emplId} taskId = {taskId} time = {time} rightDate = {rightDate} employee = {employee} index = {index}/>
                    </div>
                    {
                        index !=  0 ? 
                        <UpButton rightDate = {rightDate} index = {index} employee = {employee}/>
                        : <></>
                    }
                    {
                        index != (dailyTasks.tasks[employee].length -1) ?
                        <DownButton rightDate = {rightDate} index = {index} employee = {employee}/>
                        : <></>
                    }
                </>
                : <></>}
                

            </div>
        
        </div>
    )
}

export default DailyTask