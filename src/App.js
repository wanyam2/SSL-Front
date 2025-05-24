import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './component/login/login';
import Home from './component/home/home';
import Information from './component/information/information';
import Document from './component/mydocument/document';
import Employment from './component/mydocument/employment';
import Others from './component/mydocument/others';
import Mypage from './component/mypage/mypage';
import Ocr from './component/ocr/ocr';
import Result from './component/ocr-result/result';
import Render from './component/ocr-result/render';
import Summary from './component/ocr-summary/summary';
import Eachsummary from './component/ocr-summary/eachsummary';
import Setmyinform from './component/signup/setmyinform';
import Signup from './component/signup/signup';
import Title from './component/title/title';
import Findpw from './component/findpw/findpw';
import Foundpw from './component/findpw/foundpw';
import Mypagepw from './component/mypage/mypagepw';


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/information" element={<Information/>} />
          <Route path="/mydocument" element={<Document/>} />
          <Route path="/employment" element={<Employment/>} />
          <Route path="/others" element={<Others/>} />
          <Route path="/mypage" element={<Mypage/>} />
          <Route path="/mypagepw" element={<Mypagepw/>} />
          <Route path="/ocr" element={<Ocr/>} />
          <Route path="/ocr-result" element={<Result/>} />
          <Route path="/Render" element={<Render/>} />
          <Route path="/ocr-summary" element={<Summary/>} />
          <Route path="/eachsummary" element={<Eachsummary/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/findpw" element={<Findpw/>} />
          <Route path="/foundpw" element={<Foundpw/>} />
          <Route path="/setmyinform" element={<Setmyinform/>} />
          <Route path="/" element={<Title/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
