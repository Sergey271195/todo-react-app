import React, {createContext, useState} from 'react'
import { getFromLocalStorage } from '../Utils'

export const ModeContext = createContext()

const ModeContextProvider = (props) => {

    const [mode, setMode] = useState(!getFromLocalStorage('mode') ? false : getFromLocalStorage('mode'))

    return (
        <ModeContext.Provider value = {{mode, setMode}}>
            {props.children}
        </ModeContext.Provider>
    )

}

export default ModeContextProvider