import Logo from "./Logo";

export default function LogoContainer({ size = 36 }) {
    const containerSize = size * 1.35;

    return (
        <div
            style={{
                width: containerSize,
                height: containerSize,
                borderRadius: 18,
                background: "var(--logo-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Logo size={size} />
        </div>
    )
}
