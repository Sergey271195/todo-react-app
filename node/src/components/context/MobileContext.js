import React, { useState, createContext } from 'react'

export const MobileContext = createContext();

const MobileContextProvider = (props) => {

    const [mobileMode, setMobileMode] = useState(
        {
            mode: false,
            menu: false
        }
    )

    return (
        <MobileContext.Provider value = {{mobileMode, setMobileMode}}>
            {props.children}
        </MobileContext.Provider>
    )

}

export default MobileContextProvider