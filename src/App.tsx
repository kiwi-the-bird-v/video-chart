import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Room from "./pages/Room/index";
import Main from "./pages/Main/index";
import Error from "./pages/Error/index";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/room/:id' element={<Room/>}/>
          <Route path='/' element={<Main/>}/>
          <Route path='*' element={<Error/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
