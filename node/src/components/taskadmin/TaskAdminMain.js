import React, { useContext, useState, useEffect } from "react";
import { GroupsContext } from "../context/GroupsContext";
import "../../styles/Admin.css";
import { getCurrentDate, getCurrentMonthStart } from "../Utils";

const handleTime = (time) => {
    return {
        hours: Math.floor(time / 3600),
        minutes: Math.floor(time / 60) - Math.floor(time / 3600) * 60,
        seconds: time % 60,
        total: time,
    };
};

const TaskAdminMain = () => {
    const { groups } = useContext(GroupsContext);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [tasksList, setTasksList] = useState();
    const [datePeriod, setDatePeriod] = useState({
        startDate: getCurrentDate(),
        endDate: getCurrentMonthStart(),
    });
    const [projectTotalTime, setProjectTotalTime] = useState();

    const fetchProjectData = () => {
        if (
            selectedGroup &&
            selectedGroup !== "" &&
            datePeriod.startDate != "" &&
            datePeriod.endDate != ""
        ) {
            fetch(
                `/api/tasks/groups/${selectedGroup}?startDate=${datePeriod.startDate}&endDate=${datePeriod.endDate}`
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.result);
                    setTasksList(data.result);
                    setProjectTotalTime(handleTime(data.project_time));
                });
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <div>
                <label style={{ marginRight: "10px" }}>С</label>
                <input
                    type="date"
                    placeholder="Начальная дата"
                    style={{ marginRight: "10px" }}
                    onChange={(event) => {
                        setDatePeriod({
                            ...datePeriod,
                            startDate: event.target.value,
                        });
                    }}
                    value={datePeriod.startDate}
                />
                <label style={{ marginRight: "10px" }}>По</label>
                <input
                    type="date"
                    placeholder="Начальная дата"
                    onChange={(event) => {
                        setDatePeriod({
                            ...datePeriod,
                            endDate: event.target.value,
                        });
                    }}
                    value={datePeriod.endDate}
                />
            </div>
            <div>
                {groups && (
                    <select
                        value={selectedGroup}
                        onChange={(event) =>
                            setSelectedGroup(event.target.value)
                        }
                        style={{
                            width: "50%",
                            padding: "10px",
                            paddingLeft: "0",
                            border: "0",
                            borderBottom: "1px solid black",
                            marginBottom: "10px",
                        }}
                    >
                        <option value="">Выбор проекта</option>
                        {groups.map((group) => {
                            return (
                                <option key={group.ID} value={group.ID}>
                                    {group.NAME}
                                </option>
                            );
                        })}
                    </select>
                )}
            </div>
            <div>
                <button type="submit" onClick={fetchProjectData}>
                    Получить данные
                </button>
            </div>
            {projectTotalTime && (
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                    Общее время, затраченное на проект за указанный период:{" "}
                    {projectTotalTime.hours > 0
                        ? projectTotalTime.hours + " часов "
                        : ""}
                    {projectTotalTime.minutes > 0
                        ? projectTotalTime.minutes + " минут "
                        : ""}
                    {projectTotalTime.seconds > 0
                        ? projectTotalTime.seconds + " секунд "
                        : ""}
                </div>
            )}
            <div>
                {tasksList && tasksList.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Задача</th>
                                <th>Ответственный</th>
                                <th>Дата создания</th>
                                <th>Дата завершения</th>
                                <th>Число записей</th>
                                <th>Общее время</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasksList.map((task) => {
                                const mappedTime = handleTime(task.total_time);
                                return (
                                    <tr key={task.task_id}>
                                        <td>{task.title}</td>
                                        <td>{task.responsible}</td>
                                        <td>{task.created_date}</td>
                                        <td>
                                            {task.closed_date
                                                ? task.closed_date
                                                : "В работе"}
                                        </td>
                                        <td>{task.time_records.length}</td>
                                        <td>
                                            {mappedTime.hours > 0
                                                ? mappedTime.hours + " часов "
                                                : ""}
                                            {mappedTime.minutes > 0
                                                ? mappedTime.minutes + " минут "
                                                : ""}
                                            {mappedTime.seconds > 0
                                                ? mappedTime.seconds +
                                                  " секунд "
                                                : ""}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TaskAdminMain;
