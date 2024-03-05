import { Button, Navbar, Container, Row, Col,Card } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route ,useNavigate} from "react-router-dom";
import Register from "./components/Register.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/register' element= {<Register/>} />
      </Routes>
        
    </>
  );
}

export default App;
