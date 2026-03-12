import Logo from "./Logo";

export default function LogoContainer({ size = 36 }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
            }}
        >
            <Logo size={size} />
        </div>
    )
}
