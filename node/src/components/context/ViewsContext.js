import React, { createContext, useEffect, useReducer } from 'react'
import { ViewsContextReducer } from '../reducers/ViewsContextReducer'
import { getFromLocalStorage, saveToLocalStorage } from '../Utils'

export const ViewsContext = createContext()

const reset_state = {
    main: {
        show: true
    }, employee: {
        show: false
    }, loading: {
        show: false
    }, notFound: {
        show: false
    }, login: {
        show: false
    }, signup: {
        show: false
    }, mobilemenu: {
        show: false
    }
}

const ViewsContextProvider = (props) => {

    const initial_state = getFromLocalStorage('views') ? getFromLocalStorage('views'): reset_state

    const [ view, dispatchView ] = useReducer(ViewsContextReducer, initial_state)

    useEffect(() => {
        saveToLocalStorage({key: 'views', data: view})
    }, [view])

    return (
        <ViewsContext.Provider value = {{view, dispatchView}}>
            {props.children}
        </ViewsContext.Provider>
    )
}

export default ViewsContextProvider
