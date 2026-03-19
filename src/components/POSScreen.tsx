import { useState } from "react";
import {
  Search,
  ChevronDown,
  X,
  Plus,
  Minus,
  MoreVertical,
  QrCode,
  ArrowLeft,
  Trash2,
  Zap,
  ShoppingBag,
  Truck,
  Phone,
  Printer,
  Star,
  Grid3X3,
  MessageCircle,
  Pencil,
} from "lucide-react";
import { QRPaymentModal } from "./QRPaymentModal";

/* ── Fake product catalog ── */
const products = [
  { id: 1, sku: "NT00038", name: "Anaferon Tăng Sức Đề Kháng Nga Siro", price: 2000 },
  { id: 2, sku: "NT00012", name: "Panadol Extra Đỏ Hộp 12 Viên", price: 35000 },
  { id: 3, sku: "NT00045", name: "Vitamin C DHC 60 Ngày", price: 180000 },
  { id: 4, sku: "NT00023", name: "Dầu Gió Xanh Con Ó 12ml", price: 45000 },
  { id: 5, sku: "NT00067", name: "Bông Tẩy Trang Silcot 82 Miếng", price: 52000 },
];

interface CartItem {
  id: number;
  sku: string;
  name: string;
  price: number;
  qty: number;
}

interface POSScreenProps {
  onBack: () => void;
}

export function POSScreen({ onBack }: POSScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, sku: "NT00038", name: "Anaferon Tăng Sức Đề Kháng Nga Siro", price: 2000, qty: 7 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("Chuyển khoản");
  const [bottomTab, setBottomTab] = useState("Bán nhanh");
  const [orderFollowUp, setOrderFollowUp] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c))
    );
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((c) => c.id !== id));

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const fmt = (n: number) => n.toLocaleString("vi-VN");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const found = products.find(
      (p) =>
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setCart((prev) => {
        const existing = prev.find((c) => c.id === found.id);
        if (existing) return prev.map((c) => (c.id === found.id ? { ...c, qty: c.qty + 1 } : c));
        return [...prev, { id: found.id, sku: found.sku, name: found.name, price: found.price, qty: 1 }];
      });
      setSearchQuery("");
    }
  };

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="h-screen flex flex-col bg-[#F0F2F5] text-[13px]">
      {/* ── Blue header ── */}
      <header className="bg-[#1976D2] flex items-center px-3 h-[44px] flex-shrink-0 gap-2">
        <button onClick={onBack} className="text-white/80 hover:text-white p-1">
          <ArrowLeft size={18} />
        </button>

        {/* Search bar */}
        <div className="flex items-center bg-white/20 rounded px-2 py-1 gap-1.5 w-[260px]">
          <Search size={14} className="text-white/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Tìm hàng hóa (F3)"
            className="flex-1 bg-transparent text-[12px] text-white placeholder-white/60 outline-none"
          />
        </div>

        {/* Invoice tab */}
        <div className="flex items-center ml-2">
          <div className="flex items-center bg-white text-gray-800 px-3 py-1.5 rounded-t text-[12px] font-medium gap-1.5">
            Hóa đơn 1
            <button className="text-gray-400 hover:text-gray-600">
              <X size={12} />
            </button>
          </div>
          <button className="text-white/60 hover:text-white p-1 ml-1">
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1" />

        {/* Action icons */}
        <button className="text-white/80 hover:text-white p-1.5"><Grid3X3 size={16} /></button>
        <button className="text-white/80 hover:text-white p-1.5"><Star size={16} /></button>
        <button className="text-white/80 hover:text-white p-1.5"><Printer size={16} /></button>

        <div className="flex items-center gap-1.5 ml-2 text-white/90 text-[11px]">
          <span>chinh</span>
          <ChevronDown size={12} />
        </div>
        <span className="text-white/50 text-[11px] ml-2">{dateStr}</span>
      </header>

      {/* ── Main body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Product table ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Table header */}
          <div className="flex items-center text-[11px] text-gray-500 font-medium px-4 py-2 border-b border-gray-200 bg-[#FAFBFC]">
            <span className="w-8 text-center">#</span>
            <span className="w-8" />
            <span className="w-[90px]">Mã SKU</span>
            <span className="flex-1">Tên hàng</span>
            <span className="w-[70px] text-center">SL</span>
            <span className="w-[100px] text-right">Đơn giá</span>
            <span className="w-[100px] text-right">Thành tiền</span>
            <span className="w-8" />
            <span className="w-8" />
          </div>

          {/* Table body */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-[12px]">
                Chưa có sản phẩm. Tìm kiếm để thêm hàng hóa.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cart.map((item, i) => (
                  <div key={item.id} className="flex items-center px-4 py-2.5 text-[12px] hover:bg-gray-50">
                    <span className="w-8 text-center text-gray-400">{i + 1}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 flex justify-center text-gray-300 hover:text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                    <span className="w-[90px] text-gray-500">{item.sku}</span>
                    <span className="flex-1 text-gray-800 truncate">{item.name}</span>
                    <div className="w-[70px] flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-400"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-7 text-center font-medium text-[#1976D2]">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-400"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="w-[100px] text-right text-gray-700">{fmt(item.price)}</span>
                    <span className="w-[100px] text-right font-medium text-gray-800">{fmt(item.price * item.qty)}</span>
                    <button className="w-8 flex justify-center text-gray-400 hover:text-gray-600">
                      <Plus size={13} />
                    </button>
                    <button className="w-8 flex justify-center text-gray-400 hover:text-gray-600">
                      <MoreVertical size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Payment panel ── */}
        <div className="w-[310px] flex-shrink-0 bg-[#FAFBFC] border-l border-gray-200 flex flex-col">
          <div className="px-4 py-3 space-y-3 flex-1 overflow-y-auto">
            {/* Customer search */}
            <div className="flex items-center gap-2 border border-gray-300 rounded px-2.5 py-2 bg-white">
              <Search size={13} className="text-gray-400" />
              <input
                type="text"
                placeholder="Tìm khách hàng (F4)"
                className="flex-1 text-[12px] outline-none placeholder-gray-400"
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2 text-[12px] text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={orderFollowUp}
                onChange={(e) => setOrderFollowUp(e.target.checked)}
                className="accent-[#1976D2]"
              />
              Bán thuốc theo đơn
            </label>

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">
                  Tổng tiền hàng{" "}
                  <span className="text-gray-400">({cart.reduce((s, c) => s + c.qty, 0)})</span>
                </span>
                <span className="font-semibold text-gray-800">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Giảm giá</span>
                <span className="text-gray-600">0</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-[13px]">
                <span className="font-semibold text-gray-700">Khách cần trả</span>
                <span className="font-bold text-[#D32F2F] text-[16px]">{fmt(subtotal)}</span>
              </div>
            </div>

            {/* Payment amount */}
            <div className="border-t border-gray-200 pt-2 space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Khách thanh toán</span>
                <span className="font-semibold text-[#1976D2]">{fmt(subtotal)}</span>
              </div>

              {/* Payment methods */}
              <div className="flex gap-2 flex-wrap">
                {["Tiền mặt", "Chuyển khoản", "Thẻ", "Ví"].map((m) => (
                  <label key={m} className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === m ? "border-[#1976D2]" : "border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod(m)}
                    >
                      {paymentMethod === m && (
                        <span className="w-2 h-2 rounded-full bg-[#1976D2]" />
                      )}
                    </span>
                    {m}
                  </label>
                ))}
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>

            {/* QR bank card */}
            {paymentMethod === "Chuyển khoản" && (
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-start gap-2">
                  <div className="w-12 h-12 bg-[#E3F2FD] rounded flex items-center justify-center">
                    <QrCode size={24} className="text-[#1976D2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-gray-700">VPBank - 209235657</p>
                    <p className="text-[10px] text-gray-500">BUI HONG S...</p>
                    <button
                      onClick={() => setShowQR(true)}
                      className="flex items-center gap-1 text-[10px] text-[#1976D2] font-medium mt-1 hover:underline"
                    >
                      <QrCode size={10} /> Hiện mã QR
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tiền thừa */}
            <div className="border-t border-gray-200 pt-2 flex justify-between text-[12px]">
              <span className="text-gray-500">Tiền thừa trả khách</span>
              <span className="text-gray-600">0</span>
            </div>
          </div>

          {/* THANH TOÁN button */}
          <div className="p-3 border-t border-gray-200">
            <button className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold py-3 rounded-lg text-[14px] transition-colors shadow-sm">
              THANH TOÁN
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="h-[40px] flex-shrink-0 bg-white border-t border-gray-200 flex items-center px-4 gap-4">
        {/* Note input */}
        <div className="flex items-center gap-1.5 text-gray-400">
          <Pencil size={13} />
          <input
            type="text"
            placeholder="Ghi chú"
            className="text-[12px] outline-none placeholder-gray-400 w-[120px]"
          />
        </div>

        <div className="flex-1" />

        {/* Bottom tabs */}
        {[
          { label: "Bán nhanh", icon: <Zap size={13} /> },
          { label: "Bán thường", icon: <ShoppingBag size={13} /> },
          { label: "Bán giao hàng", icon: <Truck size={13} /> },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setBottomTab(tab.label)}
            className={`flex items-center gap-1 px-2 py-1 text-[11px] transition-colors relative ${
              bottomTab === tab.label
                ? "text-[#1976D2] font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
            {bottomTab === tab.label && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1976D2] rounded-t" />
            )}
          </button>
        ))}

        {/* Hotline */}
        <div className="flex items-center gap-1 text-[11px] text-gray-500 ml-4">
          <Phone size={12} />
          <span>1900 6522</span>
        </div>

        {/* Chat icon with notification */}
        <div className="relative">
          <MessageCircle size={16} className="text-gray-400" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </div>
      </div>

      {/* QR Payment Modal */}
      {showQR && (
        <QRPaymentModal onClose={() => setShowQR(false)} amount={subtotal} />
      )}
    </div>
  );
}