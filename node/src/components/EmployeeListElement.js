import React, { useContext } from "react";
import { FilterUsers } from "./context/FilterUsers";
import { MobileContext } from "./context/MobileContext";

const EmployeeListElement = ({ emplId, photo, fullName, getUsersTasks }) => {
  const { mobileMode, setMobileMode } = useContext(MobileContext);
  const { filterUsers } = useContext(FilterUsers);

  if (
    !filterUsers ||
    filterUsers.length < 2 ||
    fullName.toLowerCase().includes(filterUsers.toLowerCase())
  ) {
    return (
      <div
        key={emplId}
        className="employeeDiv"
        title="Просмотр задач данного сотрудника (из Битрикс24)"
        onClick={() => {
          getUsersTasks(emplId, fullName);
          if (mobileMode.mode) {
            setMobileMode({
              ...mobileMode,
              menu: false,
            });
          }
        }}
      >
        <img
          style={{
            height: "36px",
            width: "36px",
            borderRadius: "50%",
            marginRight: "28px",
          }}
          src={photo}
        />
        {fullName}
      </div>
    );
  }
  return <></>;
};

export default EmployeeListElement;
