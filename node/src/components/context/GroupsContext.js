import React, { createContext, useEffect, useState } from "react";

export const GroupsContext = createContext();

const GroupsContextProvider = ({ children }) => {
    const [groups, setGroups] = useState();

    useEffect(() => {
        fetch(`api/tasks/groups`)
            .then((response) => response.json())
            .then((data) => setGroups(data));
    }, []);

    return (
        <GroupsContext.Provider value={{ groups, setGroups }}>
            {children}
        </GroupsContext.Provider>
    );
};

export default GroupsContextProvider;
