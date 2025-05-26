import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { IoDocumentTextOutline, IoBookOutline } from "react-icons/io5";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { TiDeleteOutline } from "react-icons/ti";
import BottomNav from "../../lib/nav/BottomNav";
import "./information.css";

const Information = () => {
    const navigate = useNavigate();
    const [laws, setLaws] = useState([]);

    const goHome = () => {
        navigate("/home");
    };

    const handleDelete = (id) => {
        const updated = laws.filter(law => law.lawInfoId !== id);
        setLaws(updated);
        localStorage.setItem("allLaws", JSON.stringify(updated));
    };


    useEffect(() => {
        const storedLaws = JSON.parse(localStorage.getItem("allLaws") || "[]");

        // referenceNumber 기준으로 중복 제거
        const uniqueMap = new Map();
        storedLaws.forEach((law) => {
            if (law.referenceNumber && !uniqueMap.has(law.referenceNumber)) {
                uniqueMap.set(law.referenceNumber, law);
            }
        });

        const uniqueLaws = [...uniqueMap.values()];
        setLaws(uniqueLaws);

        // localStorage도 중복 제거된 상태로 갱신
        localStorage.setItem("allLaws", JSON.stringify(uniqueLaws));
    }, []);



    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={goHome} />
                <p>법률 정보</p>
            </header>

            <main className="informPage">
                <p className="main_title">근로자 관련 주요 법률정보를 확인하세요</p>
                <div className="row_inform_box">
                    {laws.map((law, index) => (
                        <div className="row_inform" key={index}
                            onClick={() =>
                                navigate("/eachsummary", {
                                    state: {
                                        lawInfoId: law.lawInfoId,
                                        from: "information"
                                    }
                                })
                            }>
                            <IoDocumentTextOutline className="fileicon" />
                            <div className="row_inform_text">
                                <p>{law.lawName}</p>
                                <span>참조 번호: {law.referenceNumber}</span>
                            </div>
                            <TiDeleteOutline
                                className="delicon"
                                onClick={() => handleDelete(law.lawInfoId)}
                            />
                        </div>
                    ))}
                </div>

                <div className="row_site_box">
                    <div className="row_site_tilte">
                        <IoBookOutline className="icon" />
                        <p>외부 법률 정보 자료</p>
                    </div>
                    <button className="row_site_link" onClick={() => window.open("https://www.moel.go.kr/index.do", "_blank")}>
                        <p>고용노동부</p>
                        <HiArrowTopRightOnSquare />
                    </button>
                    <button className="row_site_link" onClick={() => window.open("https://www.law.go.kr/", "_blank")}>
                        <p>국가법령정보센터</p>
                        <HiArrowTopRightOnSquare />
                    </button>
                </div>
            </main>
            <BottomNav />
        </>
    );
};

export default Information;
