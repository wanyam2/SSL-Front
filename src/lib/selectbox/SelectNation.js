import React from "react";
import "./Selectbox.css";

const nationOptions = [
    { value: "ko", label: "한국" },
    { value: "en", label: "United States" },
    // 국가 추가…
];

export default function SelectNation({
    value,
    onChange,
    placeholder = "국적을 선택하세요",
    }) {
    return (
        <select value="en" onChange={onChange}>
            <option value="">{placeholder}</option>

            {nationOptions.map(({ value: val, label }) => (
                <option key={val} value={val}>
                    {label}
                </option>
        ))}
        </select>
    );
}