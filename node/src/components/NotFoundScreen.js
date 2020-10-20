import React, { useContext } from 'react'

import '../styles/NotFoundScreen.css'
import { ModeContext } from './context/ModeContext'

const NotFoundScreen = () => {

    const { mode } = useContext(ModeContext)

    return (
        <div className = {'notFoundDiv' + (mode ? ' dark': ' light')}>{`< Информация по текущей дате не найдена />`}</div>
    )

}

export default NotFoundScreen