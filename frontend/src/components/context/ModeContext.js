import React, {createContext, useState} from 'react'

export const ModeContext = createContext()

const ModeContextProvider = (props) => {

    const [mode, setMode] = useState(false)

    return (
        <ModeContext.Provider value = {{mode, setMode}}>
            {props.children}
        </ModeContext.Provider>
    )

}

export default ModeContextProvider