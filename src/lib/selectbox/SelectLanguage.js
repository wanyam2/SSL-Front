import React from "react";
import "./Selectbox.css";


const languageOptions = [
    { value: "ko", label: "한국어" },
    { value: "en", label: "English" },
    // 언어 추가…
];

export default function SelectLanguage({
    value,
    onChange,
    placeholder = "사용언어를 선택하세요",
    }) {
    return (
        <select value={value} onChange={onChange}>
            <option value="">{placeholder}</option>

            {languageOptions.map(({ value: val, label }) => (
                <option key={val} value={val}>
                    {label}
                </option>

        ))}
        </select>
    );
}
