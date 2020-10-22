import React, { useState, useContext } from 'react'

import '../styles/CommentComponent.css'
import { AuthContext } from './context/AuthContext'
import { DailyContext } from './context/DailyTasksContext'
import { ModeContext } from './context/ModeContext'
import { DARK, LIGHT, postFetchAuth } from './Utils'


const CommentComponent = ({comments, rightDate, pk, index, employee}) => {

    const { mode } = useContext(ModeContext)
    const [commentInput, setCommentInput] = useState('')
    const { dispatchDaily } = useContext(DailyContext)
    const { auth } = useContext(AuthContext)

    const submitComment = (event) => {
        event.preventDefault()

        if (commentInput !== undefined && commentInput !== '') {
            postFetchAuth({url: `api/tasks/comment${pk}`, data: {comment: commentInput}, token: auth.key})
                .then((data) => {
                    if (data.status == 200) {
                        dispatchDaily({type: 'ADD_COMMENT', index: index, employee: employee, comment: commentInput,
                            first_name: auth.firstname, last_name: auth.lastname})
                        setCommentInput('')
                    }
                })
        }
    }

    return (
        <>
        {rightDate && auth.authenticated &&
            <form  className = 'commentForm' method = 'POST' onSubmit = {(event) => submitComment(event)}>
                <input className = 'commentInputForm' placeholder = 'Добавить комментарий' style = {mode ? DARK: LIGHT}
                    onChange = {(event) => setCommentInput(event.target.value)} value = {commentInput}/>
            </form>
        }
        {comments.map((commentContent, commentIndex) => {
            return <CommentItem key = {commentIndex} comment = {commentContent}/>
        })}
        </>
    ) 
}

const CommentItem = ({comment: {content, creator}}) => {
    return (
        <div className = 'commentDiv'>{creator ? `${creator.first_name} ${creator.last_name}:`: ''} {content}</div>
    )
}

export default CommentComponent