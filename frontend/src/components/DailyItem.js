import React, {useContext, useState} from 'react'
import { DailyContext } from './context/DailyTasksContext'

import {postFetch} from './Utils'

const DailyTask = ({title, comments, completed, pk, index, employee, emplId, taskId}) => {

    const {dispatchDaily} = useContext(DailyContext)
    const [comment, setComment] = useState({})

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
        <div className = {`dailyDiv ${completed ? 'completed': ''}`}>
            <div className = {`wrapperDiv ${completed ? 'completed': ''}`} >
                <div className = 'titleDiv'>
                    <a href = {`https://illuminator3000.bitrix24.ru/company/personal/user/${emplId}/tasks/task/view/${taskId}/`}
                            target = '_blank'>{`${index+1}. ${title}`}</a>
                </div>
                <div className = {`taskStateDiv ${completed ? 'completed': ''}`} onClick = {() => completeTask()}></div>
            </div>
            <ul className = 'commentList'>
                {comments.map((comment, index) => {
                    return <CommentItem key = {index} comment = {comment}/>
                })}
                <li>
                    <form onSubmit = {(event) => onSubmitHandle(event)}>
                        <input className = 'commentInput' type = 'text' id = {pk}
                            onChange = {(event) => setComment(event.target.value)} placeholder = 'Комментарий...'/>
                    </form>
                </li>
            </ul>
        </div>
    )
}

const CommentItem = ({comment: {content}}) => {
    return (
        <li><i>{content}</i></li>
    )
}


export default DailyTask