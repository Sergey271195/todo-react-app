import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import EmployeeContextProvider from "./context/EmployeeContext";
import DailyContextProvider from "./context/DailyTasksContext";
import MainEmployeeProvider from "./context/MainEmployeeContext";
import UserLoadingProvider from "./context/UserLoadingContext";
import CurrentDateProvider from "./context/DateContext";
import ModeContextProvider from "./context/ModeContext";
import MobileContextProvider from "./context/MobileContext";

import Contorller from "./Controller";
import AuthContextProvider from "./context/AuthContext";
import ViewsContextProvider from "./context/ViewsContext";
import GroupsContextProvider from "./context/GroupsContext";
import TaskAdminMain from "./taskadmin/TaskAdminMain";

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
                                            <GroupsContextProvider>
                                                <Router>
                                                    <Switch>
                                                        <Route path="/taskadmin">
                                                            <TaskAdminMain />
                                                        </Route>
                                                        <Route path="/">
                                                            <Contorller />
                                                        </Route>
                                                    </Switch>
                                                </Router>
                                            </GroupsContextProvider>
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
};

export default App;

const container = document.getElementById("app");
render(<App />, container);
