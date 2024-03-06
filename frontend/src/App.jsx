import {Routes, Route} from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route exact path='/register' element= {<Register/>} />
        <Route exact path='/login' element= {<Login/>} />
      </Routes>
        
    </>
  );
}

export default App;
