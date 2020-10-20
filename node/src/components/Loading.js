import React, { useContext } from 'react'

import '../styles/Loading.css'
import { ModeContext } from './context/ModeContext'

const LoadingScreen = () => {

    const { mode } = useContext(ModeContext)

    return (
        <div className = {'loadingScreen' + (mode ? ' dark': ' light')}>{'< Загрузка />'}</div>
    )

}

export default LoadingScreen