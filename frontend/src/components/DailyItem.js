import React, {useContext, useState, useRef} from 'react'
import { DailyContext } from './context/DailyTasksContext'
import { CurrentDate } from './context/DateContext'

import {postFetch, getCurrentDate} from './Utils'

const DailyTask = ({title, comments, completed, pk, index, employee, emplId, taskId}) => {

    const {dailyTasks, dispatchDaily} = useContext(DailyContext)
    const { currentDate } = useContext(CurrentDate)
    const [comment, setComment] = useState({})
    const rightDate = (currentDate == getCurrentDate())

    const moveUp = (index) => {
        if (index != 0) {
            dispatchDaily({type: 'MOVE_UP', employee: employee, index: index})
        }
    }

    const moveDown = (index) => {
        if (index != dailyTasks.tasks[employee].length -1) {
            dispatchDaily({type: 'MOVE_DOWN', employee: employee, index: index})
        }
    }

    const onSubmitHandle = (event) => {

        event.preventDefault()
        if (comment !== undefined && comment !== '') {
            document.getElementById(`${pk}`).value = ''
            postFetch({url: `api/tasks/comment${pk}`, data: {comment: comment}})
                .then((data) => {
                    if (data.status == 200) {
                        dispatchDaily({type: 'ADD_COMMENT', index: index, employee: employee, comment: comment})
                        setComment('')
                    }
                })
        }
    }

    const completeTask = () => {
        fetch(`api/tasks/complete${pk}`)
        .then((response) => {return response.json()})
        .then((data) => {
            if (data.status == 200) {
                dispatchDaily({type: 'TOGGLE_TASK', pk: pk, employee: employee})
            }
        })
        
    }


    return (
        <div style = {{display: 'flex'}}>
            { rightDate ? 
                <>
                    <div style = {{display: 'flex', flexDirection: 'column'}}>
                        <button onClick = {() => moveUp(index)} className = 'moveBtn'>&#8593;</button>
                        <button onClick = {() => moveDown(index)} className = 'moveBtn'>&#8595;</button>
                    </div>
                </>
                : <></>
            }
            <div className = {`dailyDiv ${completed ? 'completed': ''}`}>
                <div className = {`wrapperDiv ${completed ? 'completed': ''}`} >
                    <div className = 'titleDiv'>
                        <a href = {`https://illuminator3000.bitrix24.ru/company/personal/user/${emplId}/tasks/task/view/${taskId}/`}
                                target = '_blank'>{`${index+1}. ${title}`}</a>
                    </div>
                    <div className = {`taskStateDiv ${completed ? 'completed': ''}`} onClick = {() => {
                        if (rightDate) {
                            completeTask()
                        }
                    }}></div>
                </div>
                <ul className = 'commentList'>
                    {comments.map((comment, index) => {
                        return <CommentItem key = {index} comment = {comment}/>
                    })}
                    <li>
                        { rightDate ? 
                            <>
                                <form onSubmit = {(event) => onSubmitHandle(event)}>
                                    <input className = 'commentInput' type = 'text' id = {pk}
                                        onChange = {(event) => setComment(event.target.value)} placeholder = 'Комментарий...'/>
                                </form>
                            </>
                            : <></>
                        }
                    </li>
                </ul>
            </div>
            
        </div>
    )
}

const CommentItem = ({comment: {content}}) => {
    return (
        <li><i>{content}</i></li>
    )
}


export default DailyTask