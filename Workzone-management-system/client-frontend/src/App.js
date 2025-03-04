import React, { useEffect } from "react";
import Index from "./Components/Pages/IndexPage/Index";
import Login from "./Components/Pages/LoginPage/Login";
import Register from "./Components/Pages/RegisterPage/Register";
import Alert from "./Components/AlertSnackBar";
import { BrowserRouter, Switch } from "react-router-dom";
import Boards from "./Components/Pages/BoardsPage/Boards";
import ProtectedRoute from "./Utils/ProtectedRoute";
import { loadUser } from "./Services/userService";
import Store from "./Redux/Store";
import FreeRoute from "./Utils/FreeRoute";
import Board from "./Components/Pages/BoardPage/Board";
import WorkSpaces from "./Components/Pages/WorkSpacesPage/WorkSpaces";
import WorkspaceMembers from "./Components/Pages/WorkspaceMembers/WorkspaceMembers";
import AllUsers from "./Components/Pages/AllUsers/AllUsers";
import RegisterWithInvitation from "./Components/Pages/RegisterWithInvitation/RegisterWithInvitation";

const App = () => {
  useEffect(() => {
    loadUser(Store.dispatch);
  }, []);

  return (

    <BrowserRouter>
      <Alert />
      <Switch>
        <ProtectedRoute exact path="/board/:workspaceId" component={Boards} />
          <ProtectedRoute exact path="/workspaces" component={WorkSpaces} />
          <ProtectedRoute exact path="/board/:workspaceId/:boardId" component={Board} />
          <ProtectedRoute exact path="/checknew/member" component={WorkspaceMembers} />
          <ProtectedRoute exact path="/all/users" component={AllUsers} />
        <FreeRoute exact path="/login" component={Login} />
        <FreeRoute exact path="/register" component={Register} />
        <FreeRoute exact path="/registerWithInvite" component={RegisterWithInvitation} />
        <FreeRoute exact path="/" component={Index} />
      </Switch>
    </BrowserRouter>

  );
};

export default App;
