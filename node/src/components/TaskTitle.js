import React, { useContext } from 'react'

import '../styles/TaskTitle.css'
import { ModeContext } from './context/ModeContext'
import { DARK, LIGHT } from './Utils'

const TaskTitle = ({url, titleName, completed}) => {

    const { mode } = useContext(ModeContext)

    return <div className = {'taskTitleDiv'} title = 'Перейти на страницу задачи в Битрикс24'>
            <a href = {url} className = {'taskLink' + (completed ? ' completed': '')} 
                style = {mode ? DARK: LIGHT} target = '_blank'>{titleName}</a>
        </div>
}

export default TaskTitle