import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Employment from './component/mydocument/employment';
import Ocr from './component/ocr/ocr';
import ContractPage from "./component/ContractPage/ContractPage"
// import ContractResult from "./component/ContractResult/ContractResult";
import Home from "./component/home/home"
import ChecklistPage from "./component/ChecklistPage/ChecklistPage"
import SignupPage from "./component/ContractPage/SignUp"

import ProcessingPage from "./component/processing/ProcessingPage";
import ContractResult from "./component/ContractResult/ContractResult";

import Chating from "./component/Chating/Chating";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ContractPage/>}/>
                <Route path="/checklist" element={<ChecklistPage />} />
                <Route path="/ocr" element={<Ocr/>}/>
                <Route path="/processing/:contractId" element={<ProcessingPage />} />
                <Route path="/ContractResultPage" element={<ContractResult/>}/>
                <Route path="/employment" element={<Employment/>}/>
                <Route path="/SignupPage" element={<SignupPage/>}/>
                <Route path="/Chating" element={<Chating/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
