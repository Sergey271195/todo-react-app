import React from "react";
import { render } from "react-dom";

import EmployeeContextProvider from './context/EmployeeContext';
import DailyContextProvider from "./context/DailyTasksContext";
import MainEmployeeProvider from "./context/MainEmployeeContext";
import UserLoadingProvider from "./context/UserLoadingContext";
import CurrentDateProvider from "./context/DateContext";
import ModeContextProvider from "./context/ModeContext";
import MobileContextProvider from "./context/MobileContext";

import Contorller from "./Controller";


const App = () => {

    return (
      <EmployeeContextProvider>
        <DailyContextProvider>
          <MainEmployeeProvider>
            <UserLoadingProvider>
              <CurrentDateProvider>
                <ModeContextProvider>
                  <MobileContextProvider>
                    <Contorller />
                  </MobileContextProvider>
                </ModeContextProvider>
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