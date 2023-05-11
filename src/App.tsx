import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Room from "./pages/room/Room";
import Lobby from "./pages/lobby/Lobby";
import Error from "./pages/error/Error";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/room/:id' element={<Room/>}/>
          <Route path='/' element={<Lobby/>}/>
          <Route path='*' element={<Error/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
