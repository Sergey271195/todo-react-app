import React, { useState, useEffect, useContext } from "react";
import { EmployeeContext } from "./context/EmployeeContext";

import EmployeeHeader from "./EmployeeHeader";

import "../styles/EmployeeList.css";
import { MainEmployee } from "./context/MainEmployeeContext";
import { UserLoading } from "./context/UserLoadingContext";
import EmployeeListElement from "./EmployeeListElement";
import { ModeContext } from "./context/ModeContext";
import { DARK, DARKBACKGROUND, LIGHT, LIGHTBACKGROUND } from "./Utils";
import { ViewsContext } from "./context/ViewsContext";

const EmployeeList = () => {
    const { mode } = useContext(ModeContext);
    const { dispatch } = useContext(EmployeeContext);
    const { employee, setEmployee } = useContext(MainEmployee);
    const { setLoadingUser } = useContext(UserLoading);
    const { dispatchView } = useContext(ViewsContext);

    const returnToMain = () => {
        localStorage.removeItem("employee");
        dispatchView({ type: "MAIN" });
    };

    const fetchUsers = () => {
        setEmployee({ type: "FETCH_USERS" });
        fetch(`api/users`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setEmployee({ type: "RETURN_USERS", data });
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getUsersTasks = (emplId, fullName) => {
        setLoadingUser(true);
        fetch(`/api/tasks/user${emplId}`)
            .then((response) => response.json())
            .then((data) =>
                data.reduce((obj, { id: taskId, title }) => {
                    obj = {
                        emplId,
                        fullName,
                        tasks:
                            obj.tasks === undefined
                                ? [{ taskId, title }]
                                : [...obj.tasks, { taskId, title }],
                    };
                    return obj;
                }, {})
            )
            .then((emplData) => {
                dispatch({ type: "CHANGE_USER", emplData: emplData });
                setLoadingUser(false);
                dispatchView({ type: "EMPLOYEE" });
            });
    };

    return (
        <div
            className="employeeListDiv"
            style={
                mode
                    ? { ...DARK, ...DARKBACKGROUND }
                    : { ...LIGHT, ...LIGHTBACKGROUND }
            }
        >
            {!employee || employee.loading ? (
                <div className="loadingDiv">Loading...</div>
            ) : (
                <>
                    <EmployeeHeader returnToMain={returnToMain} />

                    {employee.users.map(
                        ({ bitrix_id: emplId, full_name: fullName, photo }) => {
                            return (
                                <EmployeeListElement
                                    key={emplId}
                                    emplId={emplId}
                                    fullName={fullName}
                                    photo={photo}
                                    getUsersTasks={getUsersTasks}
                                />
                            );
                        }
                    )}
                </>
            )}
        </div>
    );
};

export default EmployeeList;
