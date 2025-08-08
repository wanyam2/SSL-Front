import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Employment from './component/mydocument/employment';
import Ocr from './component/ocr/ocr';
import ContractPage from "./component/ContractPage/ContractPage"
import ContractResult from "./component/ContractResult/ContractResult";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ContractPage/>}/>
                <Route path="/ocr" element={<Ocr/>}/>
                <Route path="/ContractResultPage" element={<ContractResult/>}/>
                <Route path="/employment" element={<Employment/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
