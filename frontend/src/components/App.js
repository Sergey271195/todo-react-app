import React, {useEffect, useState} from "react";
import { render } from "react-dom";
import EmployeeContextProvider from './context/EmployeeContext';
import EmployeeList from "./EmloyeeList";
import DailyContextProvider from "./context/DailyTasksContext";
import DailyTasksList from "./DailyTasksList";

import '../styles/App.css';
import TasksList from "./TasksList";
import MainEmployeeProvider from "./context/MainEmployeeContext";
import { getFromLocalStorage } from './Utils';
import UserLoadingProvider from "./context/UserLoadingContext";
import CurrentDateProvider from "./context/DateContext";

const App = () => {

    const [toggleMain, setToggleMain] = useState(true)

    useEffect(() => {
      getFromLocalStorage('employee') ? setToggleMain(false): setToggleMain(true)
    }, [])

    return (
        <EmployeeContextProvider>
          <DailyContextProvider>
            <MainEmployeeProvider>
              <UserLoadingProvider>
                <CurrentDateProvider>
                  <div className = 'mainDiv'>
                    <EmployeeList setToggleMain = {setToggleMain}/>
                    {toggleMain ? <DailyTasksList /> : <TasksList />}
                  </div>
                </CurrentDateProvider>
              </UserLoadingProvider>
            </MainEmployeeProvider>
          </DailyContextProvider>
        </EmployeeContextProvider>
    );
  }

export default App;

const container = document.getElementById("app");
render(<App />, container);