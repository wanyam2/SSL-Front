import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Employment from './component/mydocument/employment';
import Ocr from './component/ocr/ocr';
import ContractPage from "./component/ContractPage/ContractPage"
// import ContractResult from "./component/ContractResult/ContractResult";
import Home from "./component/home/home"
import ChecklistPage from "./component/ChecklistPage/ChecklistPage"
import SignupPage from "./component/ContractPage/SignUp"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/ContractPage" element={<ContractPage/>}/>
                <Route path="/checklist" element={<ChecklistPage />} />
                <Route path="/ocr" element={<Ocr/>}/>
                {/* <Route path="/ContractResultPage" element={<ContractResult/>}/> */}
                <Route path="/employment" element={<Employment/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="/SignupPage" element={<SignupPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
