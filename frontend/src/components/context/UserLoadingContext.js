import React, {createContext, useState} from 'react'

export const UserLoading = createContext();

const UserLoadingProvider = (props) => {

    const [loadingUser, setLoadingUser] = useState(false)

    return (
        <UserLoading.Provider value = {{loadingUser, setLoadingUser}}>
            {props.children}
        </UserLoading.Provider>
    )

}

export default UserLoadingProvider