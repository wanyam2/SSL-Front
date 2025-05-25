import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft, GoPencil, GoCheck } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import BottomNav from "../../lib/nav/BottomNav";
import "./document.css";

const Document = () => {
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [tempTitle, setTempTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        setTimeout(() => {
            navigate("/ocr-result", { state: { result: doc } });
        }, 1000);
    };

    const handleDelete = (id) => {
        const updated = docs.filter(doc => doc.id !== id);
        setDocs(updated);
        localStorage.setItem("savedDocs", JSON.stringify(updated));
    };

    return (
        <>
            <header>
                <GoArrowLeft className="backBtn" onClick={() => navigate("/home")} />
                <p>내 문서 기록</p>
            </header>

            <main className="docPage">
                {isLoading ? (
                    <div className="loadingBox">
                        <p>문서를 불러오는 중입니다...</p>
                    </div>
                ) : (
                    <div className="main_main">
                        {docs.map(doc => (
                            <div key={doc.id} className="fileBtn" onClick={() => handleDocClick(doc)}>
                                <IoDocumentTextOutline className="fileicon" />
                                <div className="file_title" onClick={(e) => e.stopPropagation()}>
                                    <div>
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
                                    </div>
                                    <span>{doc.date}</span>
                                </div>

                                <TiDeleteOutline className="delicon" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(doc.id);
                                }} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <BottomNav />
        </>
    );
};

export default Document;
