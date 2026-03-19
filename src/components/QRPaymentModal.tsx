import { useEffect, useState, useRef, type ReactElement } from "react";

type PaymentState = "waiting" | "processing" | "success";

/* ── Realistic QR code (33×33 Version 4) ── */
const QR_ROWS = [
  "111111100101001110001010111111100",
  "100000101110100011100110100000100",
  "101110100010010100011000101110100",
  "101110101101101001110100101110100",
  "101110100100011110100010101110100",
  "100000101010101010101010100000100",
  "111111101010101010101010111111100",
  "000000001100110011001100000000000",
  "110101110110100110110010100110100",
  "011010011001011101001101011010010",
  "110011100110100011010110110101100",
  "001101010011011100101001001110010",
  "011110101100101011110100110011100",
  "110001011011010100001011101100010",
  "001110100110101111010100010111100",
  "010101010001110000101111101000010",
  "111100101110001011110000011011100",
  "001011011001110100001101110110010",
  "110110100110011011010010001101100",
  "011001010011100100101101110010010",
  "001010101100011111110000010111100",
  "110101011011100000001011101000010",
  "011110100110011011110100011011100",
  "101001010001101100001111100110010",
  "010110101110010011010000011101100",
  "000000001011101110101100010010000",
  "111111100100010001010010110111100",
  "100000101011101110001101001100010",
  "101110100110010001110010110011100",
  "101110101001101100101111001110010",
  "101110100010011011010000110101100",
  "100000101101100100101011011010010",
  "111111100010011111110100100111100",
];

function QRCodeSVG() {
  const s = 6; // module size
  const q = 2; // quiet zone
  const n = 33;
  const total = (n + q * 2) * s;
  const rects: ReactElement[] = [];

  for (let r = 0; r < n; r++) {
    const row = QR_ROWS[r];
    for (let c = 0; c < n; c++) {
      if (row[c] === "1") {
        rects.push(<rect key={`${r}-${c}`} x={(c + q) * s} y={(r + q) * s} width={s} height={s} />);
      }
    }
  }

  return (
    <div style={{ position: "relative", width: `${total}px`, height: `${total}px` }}>
      <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`} fill="none">
        <rect width={total} height={total} fill="white" />
        <g fill="#222">{rects}</g>
      </svg>
      {/* Center logo */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "34px", height: "34px", borderRadius: "7px", backgroundColor: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 8L12 4L20 8V16L12 20L4 16V8Z" fill="#E53935" />
          <path d="M12 4L20 8L12 12L4 8L12 4Z" fill="#EF5350" />
          <path d="M12 12V20L4 16V8L12 12Z" fill="#C62828" />
        </svg>
      </div>
    </div>
  );
}

interface QRPaymentModalProps {
  onClose: () => void;
  amount?: number;
}

export function QRPaymentModal({ onClose, amount = 150000 }: QRPaymentModalProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>("waiting");
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [successTime, setSuccessTime] = useState("");
  const [dots, setDots] = useState(".");
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Simulate payment flow
  useEffect(() => {
    // After 4s -> processing
    const t1 = setTimeout(() => {
      setPaymentState("processing");
    }, 4000);

    // After 8s -> success
    const t2 = setTimeout(() => {
      setPaymentState("success");
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setSuccessTime(`${hh}:${mm}:${ss}`);
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Animated dots for processing state
  useEffect(() => {
    dotsRef.current = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);
    return () => {
      if (dotsRef.current) clearInterval(dotsRef.current);
    };
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formatAmount = (n: number) =>
    n.toLocaleString("vi-VN") + "đ";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] max-h-[90vh] overflow-y-auto" style={{ zIndex: 51 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-center flex-1" style={{ fontSize: "17px", fontWeight: 700, color: "#222" }}>
            Mã VietQR thanh toán
          </h2>
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600" style={{ fontSize: "22px", lineHeight: 1 }}>
            ×
          </button>
        </div>

        <div className="mx-6" style={{ borderBottom: "2px dashed #d1d5db", marginBottom: "16px" }} />

        {/* ── VietQR Card (hidden on success) ── */}
        {paymentState !== "success" && (
        <div className="flex justify-center px-6">
          <div style={{
            width: "300px",
            borderRadius: "16px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #1976D2 0%, #43A047 50%, #FDD835 100%)",
            padding: "3px",
          }}>
            <div style={{
              background: "white",
              borderRadius: "14px",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}>
              {/* Store name */}
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.03em", textAlign: "center" }}>
                CỬA HÀNG THUỐC 10 VẠN PHÚC
              </p>

              {/* Account info */}
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#222" }}>
                209235657 <span style={{ color: "#999", fontWeight: 400 }}>|</span> VPB
              </p>

              {/* VietQR logo text */}
              <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "4px" }}>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#005BAA", letterSpacing: "-0.5px" }}>VIET</span>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#E53935", letterSpacing: "-0.5px" }}>QR</span>
              </div>

              {/* QR Code - realistic 33x33 grid */}
              <QRCodeSVG />

              {/* Amount */}
              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <p style={{ fontSize: "11px", color: "#888" }}>Số tiền:</p>
                <p style={{ fontSize: "26px", fontWeight: 800, color: "#222", lineHeight: 1.2 }}>
                  {formatAmount(amount)}
                </p>
              </div>

              {/* Countdown */}
              <p style={{ fontSize: "12px", color: "#888" }}>
                Hiệu lực QR: <span style={{ fontWeight: 700, color: "#E53935" }}>{formatCountdown(countdown)}</span>
              </p>

              {/* Napas 247 | KiotViet footer */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", paddingTop: "8px", borderTop: "1px solid #eee", width: "100%" , justifyContent: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, fontStyle: "italic", color: "#005BAA" }}>napas</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#E53935" }}>247</span>
                <span style={{ color: "#ccc" }}>|</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#1976D2" }}>●●</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#333" }}>KiotViet</span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ── Payment Status ── */}
        <div className="px-6 pt-4 pb-2">
          {paymentState === "waiting" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div style={{ width: "16px", height: "16px", border: "2px solid #d1d5db", borderTop: "2px solid #6b7280", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
                <span style={{ color: "#6b7280", fontSize: "13px" }}>Đang chờ thanh toán...</span>
              </div>
            </div>
          )}
          {paymentState === "processing" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
                <span style={{ color: "#2563eb", fontSize: "13px", fontWeight: 500 }}>Đang xử lý thanh toán{dots}</span>
              </div>
            </div>
          )}
          {paymentState === "success" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p style={{ color: "#15803d", fontSize: "18px", fontWeight: 700, textAlign: "center" }}>THANH TOÁN THÀNH CÔNG</p>
              <p style={{ color: "#222", fontSize: "28px", fontWeight: 800 }}>
                {formatAmount(amount)}
              </p>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>
                Thời gian: {successTime}
              </p>
            </div>
          )}
        </div>

        {/* Print Button */}
        <div className="px-6 pt-3 pb-2">
          <button className="w-full flex items-center justify-center gap-2 rounded-full py-2.5 transition-opacity hover:opacity-90" style={{ backgroundColor: "#3dba6f", color: "white", fontSize: "15px", fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            In mã QR
          </button>
        </div>

        {/* Footer link */}
        <div className="text-center pb-5">
          <a href="#" style={{ color: "#3b82f6", fontSize: "13px", textDecoration: "none" }}>
            Bạn cần kết nối với thiết bị KiotViet QR
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
