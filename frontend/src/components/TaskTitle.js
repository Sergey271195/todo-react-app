import React, { useContext } from 'react'

import '../styles/TaskTitle.css'
import { ModeContext } from './context/ModeContext'
import { DARK, LIGHT } from './Utils'

const TaskTitle = ({url, title, completed}) => {

    const { mode } = useContext(ModeContext)

    return <div className = {'taskTitleDiv'}>
            <a href = {url} className = {'taskLink' + (completed ? ' completed': '')} 
                style = {mode ? DARK: LIGHT} target = '_blank'>{title}</a>
        </div>
}

export default TaskTitle