import React, { useState, useContext } from 'react'

import '../styles/CommentComponent.css'
import { DailyContext } from './context/DailyTasksContext'
import { ModeContext } from './context/ModeContext'
import { DARK, LIGHT, postFetch } from './Utils'


const CommentComponent = ({comments, rightDate, pk, index, employee}) => {

    const { mode } = useContext(ModeContext)
    const [commentInput, setCommentInput] = useState('')
    const { dispatchDaily } = useContext(DailyContext)

    const submitComment = (event) => {
        event.preventDefault()

        if (commentInput !== undefined && commentInput !== '') {
            postFetch({url: `api/tasks/comment${pk}`, data: {comment: commentInput}})
                .then((data) => {
                    if (data.status == 200) {
                        dispatchDaily({type: 'ADD_COMMENT', index: index, employee: employee, comment: commentInput})
                        setCommentInput('')
                    }
                })
        }
    }

    return (
        <>
        {rightDate ?
            (<form  className = 'commentForm' method = 'POST' onSubmit = {(event) => submitComment(event)}>
                <input className = 'commentInputForm' placeholder = 'Добавить комментарий' style = {mode ? DARK: LIGHT}
                    onChange = {(event) => setCommentInput(event.target.value)} value = {commentInput}/>
            </form>)
            : <></>
        }
        {comments.map((commentContent, commentIndex) => {
            return <CommentItem key = {commentIndex} comment = {commentContent}/>
        })}
        </>
    ) 
}

const CommentItem = ({comment: {content}}) => {
    return (
        <div className = 'commentDiv'>{content}</div>
    )
}

export default CommentComponent