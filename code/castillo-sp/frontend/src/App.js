import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContextProvider } from './context/UserContext';
import {useContext,useEffect,useState} from 'react'
import { UserContext } from './context/UserContext';
import { ClassContext, ClassContextProvider } from './context/ClassContext';
import axios from 'axios'


//pages and components
import Signup from './pages/Signup';
import Login  from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import ViewClass from './pages/ViewClass';
import TeacherClass from './pages/TeacherClass';
import StudentClass from './pages/StudentClass';
import ClassSettings from './pages/ClassSettings';
import SignInSide from './pages/SignUpLogin';
import AccountSettings from './pages/AccountSettings';

import { createTheme, ThemeProvider } from '@mui/material';




function App() {

  return (
    <UserContextProvider>
      <ClassContextProvider>
      <div className="App">
        <BrowserRouter>
          <div className='pages'>
            <Routes>
              <Route exact={true} path="/" element={<SignInSide />}></Route>
              {/* <Route exact={true} path="/login" element={<Login />}></Route> */}
              <Route exact={true} path="/dashboard" element={<Dashboard />}></Route>
              <Route exact={true} path="/viewClass" element={<ViewClass/>}></Route>
              <Route exact={true} path="/teacherClass/:classId" element={<TeacherClass/>}></Route>
              <Route exact={true} path="/studentClass/:classId" element={<StudentClass/>}></Route>
              <Route exact={true} path="/classSettings/:classId" element={<ClassSettings/>}></Route>
              <Route exact={true} path="/accountSettings" element={<AccountSettings/>}></Route>
             
              
              
              
            
            </Routes>
          </div>
        </BrowserRouter>
      </div>
      </ClassContextProvider>
    </UserContextProvider>
  );
}

export default App;
