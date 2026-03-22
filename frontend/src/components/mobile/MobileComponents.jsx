import React from "react";

export const Chip = ({ label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "4px 10px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: active ? "#D4AF37" : "rgba(255,255,255,0.05)",
                color: active ? "#000" : "#fff",
                fontSize: "11px"
            }}
        >
            {label}
        </button>
    );
};

export const MiniChip = ({ label }) => {
    return (
        <span
            style={{
                padding: "3px 8px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: "10px"
            }}
        >
            {label}
        </span>
    );
};

export const ToggleRow = ({ label, value, onChange }) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{label}</span>
            <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
            />
        </div>
    );
};
