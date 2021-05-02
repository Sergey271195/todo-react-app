import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "../styles/Header.css";
import { BiCalendarWeek } from "react-icons/bi";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { CurrentDate } from "./context/DateContext";
import { MobileContext } from "./context/MobileContext";
import { ModeContext } from "./context/ModeContext";
import {
    DARK,
    LIGHT,
    LIGHTBACKGROUND,
    DARKBACKGROUND,
    formatDate,
} from "./Utils";
import { ViewsContext } from "./context/ViewsContext";
import { AuthContext } from "./context/AuthContext";

const DateHeader = ({ fetchDailyTasks, mobileDate, setMobileDate }) => {
    const { mode } = useContext(ModeContext);
    const { currentDate, setCurrentDate } = useContext(CurrentDate);
    const { mobileMode } = useContext(MobileContext);
    const { dispatchView } = useContext(ViewsContext);
    const { auth, dispatchAuth } = useContext(AuthContext);

    return (
        <div
            className="headerDiv"
            style={
                mode
                    ? { ...DARK, ...DARKBACKGROUND }
                    : { ...LIGHT, ...LIGHTBACKGROUND }
            }
        >
            <div className="dateWeek">{formatDate(currentDate)}</div>
            {auth.firstname ? (
                <div>
                    {auth.firstname} {auth.lastname}
                </div>
            ) : (
                <div>{auth.username}</div>
            )}
            {(auth.bitrix_id == 26 || auth.bitrix_id == 406) && (
                <Link to="/taskadmin">Админка</Link>
            )}
            <div
                className={
                    "dateAndLoginContainer " + (mobileMode.mode ? "" : "normal")
                }
            >
                {mobileMode.mode ? (
                    <BiCalendarWeek
                        className="dateIcon"
                        onClick={() => setMobileDate(!mobileDate)}
                    />
                ) : (
                    <>
                        <input
                            type="date"
                            className="dateInput"
                            title="Просмотр списка задач всех сотрудников за выбранную дату"
                            onChange={(event) => {
                                setCurrentDate(event.target.value),
                                    fetchDailyTasks(event.target.value);
                            }}
                        />
                        {auth.authenticated ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <FiLogOut
                                    onClick={() => {
                                        dispatchAuth({ type: "LOGOUT" }),
                                            dispatchView({ type: "LOGIN" });
                                    }}
                                    className="loginIcons"
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <FiLogIn
                                    className="loginIcons"
                                    onClick={() =>
                                        dispatchView({ type: "LOGIN" })
                                    }
                                />
                                <div>Вход</div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DateHeader;
