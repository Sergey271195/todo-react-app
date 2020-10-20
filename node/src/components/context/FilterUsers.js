import React, {createContext, useState} from 'react'

export const FilterUsers = createContext();

const FilterUsersProvider = (props) => {

    const [filterUsers, setFilterUsers] = useState('')

    return (
        <FilterUsers.Provider value = {{filterUsers, setFilterUsers}}>
            {props.children}
        </FilterUsers.Provider>
    )

}

export default FilterUsersProvider