import React from 'react'

import '../styles/TaskTitle.css'

const TaskTitle = ({url, title, completed}) => {
    return <div className = {'taskTitleDiv'}>
            <a href = {url} className = {'taskLink' + (completed ? ' completed': '')} target = '_blank'>{title}</a>
            <div className = 'timeDiv'>1 ч 20 мин</div>
        </div>
}

export default TaskTitle