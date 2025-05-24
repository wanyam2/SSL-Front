import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft, GoPencil, GoCheck } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import BottomNav from "../../lib/nav/BottomNav";
import "./document.css";

const Document = () => {
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [tempTitle, setTempTitle] = useState("");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("savedDocs") || "[]");
        setDocs(stored);
    }, []);

    const startEdit = (id, currentTitle) => {
        setEditingId(id);
        setTempTitle(currentTitle);
    };

    const finishEdit = id => {
        const updated = docs.map(doc =>
            doc.id === id ? { ...doc, title: tempTitle } : doc
        );
        setDocs(updated);
        localStorage.setItem("savedDocs", JSON.stringify(updated));
        setEditingId(null);
        setTempTitle("");
    };

    const onKeyDown = (e, id) => {
        if (e.key === "Enter") finishEdit(id);
    };

    const handleDocClick = (doc) => {
        // 클릭 시 Result 페이지로 이미지 정보 전달
        navigate("/ocr-result", { state: { result: doc } });
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={() => navigate("/home")} />
                <p>내 문서 기록</p>
            </header>
            <main className="docPage">
                <div className="main_main">
                    {docs.map(doc => (
                        <div key={doc.id} className="fileBtn" onClick={() => handleDocClick(doc)}>
                            <IoDocumentTextOutline className="fileicon" />
                            <div className="file_title" onClick={(e) => e.stopPropagation()}>
                                {editingId === doc.id ? (
                                    <input
                                        className="editInput"
                                        value={tempTitle}
                                        onChange={e => setTempTitle(e.target.value)}
                                        onBlur={() => finishEdit(doc.id)}
                                        onKeyDown={e => onKeyDown(e, doc.id)}
                                        autoFocus
                                    />
                                ) : (
                                    <p>{doc.title}</p>
                                )}
                                {editingId === doc.id ? (
                                    <GoCheck className="editIcon" onClick={() => finishEdit(doc.id)} />
                                ) : (
                                    <GoPencil className="editIcon" onClick={() => startEdit(doc.id, doc.title)} />
                                )}
                                <span>{doc.date}</span>
                            </div>
                            <HiArrowTopRightOnSquare className="shareicon" />
                        </div>
                    ))}
                </div>
            </main>
            <BottomNav />
        </>
    );
};

export default Document;
