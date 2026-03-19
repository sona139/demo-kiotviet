import logoImage from '../assets/image.png';

export function KiotVietLogoIcon({ size = 32 }: { size?: number }) {
  return (
    <img
      src={logoImage}
      alt="KiotViet"
      style={{ width: size, height: size }}
    />
  );
}

interface KiotVietLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export function KiotVietLogo({ size = 32, showText = true, textColor = "white" }: KiotVietLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <KiotVietLogoIcon size={size} />
      {showText && (
        <span
          style={{
            color: textColor,
            fontSize: size * 0.5,
            fontWeight: 600,
            letterSpacing: "-0.5px",
          }}
        >
          KiotViet
        </span>
      )}
    </div>
  );
}
