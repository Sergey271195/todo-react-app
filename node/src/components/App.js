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
import AuthContextProvider from "./context/AuthContext";
import ViewsContextProvider from "./context/ViewsContext";


const App = () => {

    return (
      <AuthContextProvider>
        <EmployeeContextProvider>
          <DailyContextProvider>
            <MainEmployeeProvider>
              <UserLoadingProvider>
                <CurrentDateProvider>
                  <ViewsContextProvider>
                    <ModeContextProvider>
                      <MobileContextProvider>
                        <Contorller />
                      </MobileContextProvider>
                    </ModeContextProvider>
                  </ViewsContextProvider>
                </CurrentDateProvider>
              </UserLoadingProvider>
            </MainEmployeeProvider>
          </DailyContextProvider>
        </EmployeeContextProvider>
      </AuthContextProvider>
    );
  }

export default App;

const container = document.getElementById("app");
render(<App />, container);