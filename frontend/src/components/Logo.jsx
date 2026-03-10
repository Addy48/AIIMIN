import { ReactComponent as LogoSymbol } from '../assets/logo-symbol.svg';

export default function Logo({ size = 36 }) {
    return (
        <LogoSymbol
            role="img"
            aria-label="AIIMIN"
            className="aiimin-logo"
            style={{
                width: size,
                height: size,
                display: "block",
                transform: "translateY(-2%)",
                fill: "var(--logo-color)"
            }}
        />
    )
}
