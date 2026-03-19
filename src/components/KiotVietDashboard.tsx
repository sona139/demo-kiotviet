import { useState, useRef, useEffect } from "react";
import {
  Bell,
  HelpCircle,
  Settings,
  User,
  ChevronDown,
  ShoppingCart,
  CreditCard,
  Users,
  Package,
  CheckCircle2,
  Info,
  TrendingUp,
  Zap,
  CheckCheck,
  QrCode,
  Landmark,
} from "lucide-react";
import { OnboardingPanel } from "./OnboardingPanel";
import { SimpleLineChart, SimpleBarChart, SimplePieChart, SimpleDonutChart } from "./SimpleCharts";
import { KiotVietLogo, KiotVietLogoIcon } from "./KiotVietLogo";
import { POSScreen } from "./POSScreen";

const lineData = [
  { label: "08:00", value: 3 },
  { label: "09:00", value: 5 },
  { label: "10:00", value: 8 },
  { label: "11:00", value: 12 },
  { label: "12:00", value: 7 },
  { label: "13:00", value: 4 },
  { label: "14:00", value: 9 },
  { label: "15:00", value: 11 },
  { label: "16:00", value: 14 },
  { label: "17:00", value: 10 },
  { label: "18:00", value: 15 },
  { label: "19:00", value: 13 },
  { label: "20:00", value: 8 },
  { label: "21:00", value: 5 },
  { label: "22:00", value: 2 },
];

const barData = [
  { label: "08:00", value: 4200 },
  { label: "09:00", value: 6800 },
  { label: "10:00", value: 12500 },
  { label: "11:00", value: 18300 },
  { label: "12:00", value: 9100 },
  { label: "13:00", value: 5400 },
  { label: "14:00", value: 11200 },
  { label: "15:00", value: 15600 },
  { label: "16:00", value: 19800 },
  { label: "17:00", value: 14200 },
  { label: "18:00", value: 21500 },
  { label: "19:00", value: 17800 },
  { label: "20:00", value: 10300 },
  { label: "21:00", value: 6100 },
  { label: "22:00", value: 3200 },
];

/* ── Payment method pie data by period ── */
const paymentPieWeekly: Record<string, { label: string; value: number; color: string }[]> = {
  "Tuần này": [
    { label: "Tiền mặt", value: 38, color: "#1E5EAF" },
    { label: "QR Code", value: 45, color: "#22C55E" },
    { label: "Thẻ", value: 17, color: "#F59E0B" },
  ],
  "Tuần trước": [
    { label: "Tiền mặt", value: 44, color: "#1E5EAF" },
    { label: "QR Code", value: 40, color: "#22C55E" },
    { label: "Thẻ", value: 16, color: "#F59E0B" },
  ],
  "2 tuần trước": [
    { label: "Tiền mặt", value: 50, color: "#1E5EAF" },
    { label: "QR Code", value: 34, color: "#22C55E" },
    { label: "Thẻ", value: 16, color: "#F59E0B" },
  ],
};

const paymentPieMonthly: Record<string, { label: string; value: number; color: string }[]> = {
  "Tháng 1": [
    { label: "Tiền mặt", value: 55, color: "#1E5EAF" },
    { label: "QR Code", value: 30, color: "#22C55E" },
    { label: "Thẻ", value: 15, color: "#F59E0B" },
  ],
  "Tháng 2": [
    { label: "Tiền mặt", value: 48, color: "#1E5EAF" },
    { label: "QR Code", value: 35, color: "#22C55E" },
    { label: "Thẻ", value: 17, color: "#F59E0B" },
  ],
  "Tháng 3": [
    { label: "Tiền mặt", value: 38, color: "#1E5EAF" },
    { label: "QR Code", value: 45, color: "#22C55E" },
    { label: "Thẻ", value: 17, color: "#F59E0B" },
  ],
};

const topEmployees = [
  { name: "Nguyễn Văn A", revenue: "32.500.000", orders: 48, commission: "1.625.000" },
  { name: "Trần Thị B", revenue: "28.200.000", orders: 41, commission: "1.410.000" },
  { name: "Lê Hoàng C", revenue: "21.800.000", orders: 35, commission: "1.090.000" },
  { name: "Phạm Minh D", revenue: "18.600.000", orders: 28, commission: "930.000" },
  { name: "Hoàng Thu E", revenue: "15.100.000", orders: 22, commission: "755.000" },
];

const navItems = [
  "Tổng quan",
  "Vị trí",
  "Hàng hóa",
  "Đơn hàng",
  "Khách hàng",
  "Nhân viên",
  "Sổ quỹ",
  "Phân tích",
  "Thuế & Kế toán",
];

export function KiotVietDashboard() {
  const [activeNav, setActiveNav] = useState("Tổng quan");
  const [activeTab1, setActiveTab1] = useState("Theo giờ");
  const [activeTab2, setActiveTab2] = useState("Theo giờ");
  const [activeEmployeeTab, setActiveEmployeeTab] = useState("Doanh thu");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState<"payment" | "qr" | "reconcile" | "cashflow">("payment");
  const [paymentTrend, setPaymentTrend] = useState<"week" | "month">("week");
  const [selectedMonth, setSelectedMonth] = useState("Tháng 3");
  const [selectedWeek, setSelectedWeek] = useState("Tuần này");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);
  const [showPOS, setShowPOS] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const weekDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMonthDropdown && !showWeekDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (showMonthDropdown && monthDropdownRef.current && !monthDropdownRef.current.contains(e.target as Node)) {
        setShowMonthDropdown(false);
      }
      if (showWeekDropdown && weekDropdownRef.current && !weekDropdownRef.current.contains(e.target as Node)) {
        setShowWeekDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMonthDropdown, showWeekDropdown]);

  const currentPieData =
    paymentTrend === "week"
      ? (paymentPieWeekly[selectedWeek] ?? paymentPieWeekly["Tuần này"])
      : (paymentPieMonthly[selectedMonth] ?? paymentPieMonthly["Tháng 3"]);

  if (showPOS) {
    return <POSScreen onBack={() => setShowPOS(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col text-[13px]">
      {/* Top Navigation */}
      <header className="bg-[#0070F4] flex items-center px-4 h-[48px] flex-shrink-0 z-30 relative shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6">
          <KiotVietLogo size={32} showText={true} textColor="white" />
        </div>

        {/* Nav items */}
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`px-3 py-2 text-[13px] transition-colors whitespace-nowrap ${
                activeNav === item
                  ? "text-white font-medium"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-4">
          <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-[13px] transition-colors border border-white/20">
            <ShoppingCart size={15} />
            Bán online
            <ChevronDown size={14} />
          </button>
          <button onClick={() => setShowPOS(true)} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-[13px] transition-colors border border-white/20">
            <CreditCard size={15} />
            Thu ngân
          </button>
          <button className="text-white/90 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
            <Bell size={18} />
          </button>
          <button className="text-white/90 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
            <HelpCircle size={18} />
          </button>
          <button className="text-white/90 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
            <Settings size={18} />
          </button>
          <button className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors">
            <User size={17} className="text-white" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center content */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 min-w-0">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Lịch hẹn */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-gray-600 text-[12px] mb-2">Lịch hẹn hôm nay</h3>
              <div className="text-[28px] font-semibold text-gray-900 mb-3">8</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-green-500 text-[11px]">
                  <TrendingUp size={12} />
                  +33%
                </div>
                <div className="text-gray-400 text-[11px]">So với hôm qua</div>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500">
                <div className="w-12 h-12 relative">
                  <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="18" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                    <circle cx="24" cy="24" r="18" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="85 113" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-500 rotate-0">75%</span>
                </div>
                <span className="text-[11px] text-gray-500">Hoàn thành: 6 lịch</span>
              </div>
            </div>

            {/* Khách hàng */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-gray-600 text-[12px] mb-2">Khách hàng hôm nay</h3>
              <div className="text-[28px] font-semibold text-gray-900 mb-3">47</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="text-gray-600">Khách mới</span>
                  <span className="ml-auto font-medium">12 lượt</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-2 h-2 rounded-full bg-[#93C5FD]" />
                  <span className="text-gray-600">Khách cũ quay lại</span>
                  <span className="ml-auto font-medium">28 lượt</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-2 h-2 rounded-full bg-[#DBEAFE]" />
                  <span className="text-gray-600">Khách lẻ</span>
                  <span className="ml-auto font-medium">7 lượt</span>
                </div>
              </div>
            </div>

            {/* Thu chi */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-[12px] flex items-center gap-1">
                  Thu chi hôm nay <Info size={12} className="text-gray-400" />
                </h3>
                <button className="text-[#1E5EAF] text-[12px] hover:underline">Chi tiết</button>
              </div>
              <div className="text-[26px] font-semibold text-gray-900 mb-2">45.820.000</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="text-gray-600">Tổng thu</span>
                  <span className="ml-auto font-medium">48.350.000</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="text-gray-600">Tổng chi</span>
                  <span className="ml-auto font-medium text-red-500">-2.530.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Lượng khách hàng */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-gray-800 text-[13px] font-medium">Lượng khách hàng</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] rounded-full">
                    126 lượt khách
                  </span>
                </div>
                <button className="flex items-center gap-1 border border-gray-200 rounded-md px-2.5 py-1 text-[12px] text-gray-600 hover:bg-gray-50">
                  Tháng này <ChevronDown size={13} />
                </button>
              </div>
              <div className="flex gap-4 mb-3 border-b border-gray-100 pb-2">
                {["Theo giờ", "Theo ngày", "Theo thứ"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab1(tab)}
                    className={`text-[12px] pb-1 transition-colors ${
                      activeTab1 === tab
                        ? "text-[#1E5EAF] border-b-2 border-[#1E5EAF] font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <SimpleLineChart data={lineData} />
            </div>

            {/* Doanh thu thuần */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-gray-800 text-[13px] font-medium">Doanh thu thuần</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] rounded-full">
                      132.621.000
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[11px] rounded-full">
                      47 hóa đơn
                    </span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[11px] rounded-full">
                      2 trả hàng
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1 border border-gray-200 rounded-md px-2.5 py-1 text-[12px] text-gray-600 hover:bg-gray-50">
                  Tháng này <ChevronDown size={13} />
                </button>
              </div>
              <div className="flex gap-4 mb-3 border-b border-gray-100 pb-2">
                {["Theo giờ", "Theo ngày", "Theo thứ"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab2(tab)}
                    className={`text-[12px] pb-1 transition-colors ${
                      activeTab2 === tab
                        ? "text-[#1E5EAF] border-b-2 border-[#1E5EAF] font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <SimpleBarChart data={barData} />
            </div>
          </div>

          {/* ── Top employees + Analytics side by side ── */}
          <div className="grid grid-cols-2 gap-4">

            {/* LEFT: Top nhân viên xuất sắc */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-800 text-[13px] font-medium">Top nhân viên xuất sắc</h3>
                  <button className="text-[#1E5EAF] text-[12px] hover:underline">Chi tiết</button>
                </div>
                <button className="flex items-center gap-1 border border-gray-200 rounded-md px-2.5 py-1 text-[12px] text-gray-600 hover:bg-gray-50">
                  Hôm nay <ChevronDown size={13} />
                </button>
              </div>
              <div className="flex gap-4 mb-3 border-b border-gray-100 pb-2">
                {["Doanh thu", "Số lượng", "Hoa hồng"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveEmployeeTab(tab)}
                    className={`text-[12px] pb-1 transition-colors ${
                      activeEmployeeTab === tab
                        ? "text-[#1E5EAF] border-b-2 border-[#1E5EAF] font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {topEmployees.map((emp, i) => (
                  <div key={emp.name} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-600" : "bg-gray-300"}`}>
                      {i + 1}
                    </span>
                    <span className="text-[12px] text-gray-800 flex-1">{emp.name}</span>
                    <span className="text-[12px] font-semibold text-gray-700">
                      {activeEmployeeTab === "Doanh thu" ? emp.revenue : activeEmployeeTab === "Số lượng" ? `${emp.orders} đơn` : emp.commission}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Analytics card (3 tabs) */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              {/* Tab header */}
              <div className="flex gap-3 mb-4 border-b border-gray-100 pb-2">
                {([["payment", "Phương thức thanh toán"], ["qr", "Tỉ lệ chuyển khoản"], ["reconcile", "Đối soát ngân hàng"], ["cashflow", "Dòng tiền về tài khoản"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setAnalyticsTab(key)}
                    className={`text-[12px] pb-1 transition-colors whitespace-nowrap ${
                      analyticsTab === key
                        ? "text-[#1E5EAF] border-b-2 border-[#1E5EAF] font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

            {analyticsTab === "payment" ? (
              /* ── Tab 1: Phân tích phương thức thanh toán ── */
              <div>
                {/* Trend toggle + period selector */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {(["week", "month"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPaymentTrend(t)}
                      className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                        paymentTrend === t
                          ? "bg-blue-50 text-[#1E5EAF] border-blue-200"
                          : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <TrendingUp size={10} />
                      {t === "week" ? "Theo tuần" : "Theo tháng"}
                    </button>
                  ))}

                  {paymentTrend === "week" && (
                    <div className="relative ml-auto" ref={weekDropdownRef}>
                      <button
                        onClick={() => setShowWeekDropdown(!showWeekDropdown)}
                        className="flex items-center gap-1 border border-gray-200 rounded-md px-2.5 py-1 text-[11px] text-gray-600 hover:bg-gray-50"
                      >
                        {selectedWeek} <ChevronDown size={12} />
                      </button>
                      {showWeekDropdown && (
                        <div className="absolute right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto w-32">
                          {Object.keys(paymentPieWeekly).map((w) => (
                            <button
                              key={w}
                              onClick={() => { setSelectedWeek(w); setShowWeekDropdown(false); }}
                              className={`w-full px-3 py-1.5 text-left text-[11px] hover:bg-blue-50 transition-colors ${w === selectedWeek ? "bg-blue-50 text-[#1E5EAF] font-medium" : ""}`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {paymentTrend === "month" && (
                    <div className="relative ml-auto" ref={monthDropdownRef}>
                      <button
                        onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                        className="flex items-center gap-1 border border-gray-200 rounded-md px-2.5 py-1 text-[11px] text-gray-600 hover:bg-gray-50"
                      >
                        {selectedMonth} <ChevronDown size={12} />
                      </button>
                      {showMonthDropdown && (
                        <div className="absolute right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto w-28">
                          {Object.keys(paymentPieMonthly).map((m) => (
                            <button
                              key={m}
                              onClick={() => { setSelectedMonth(m); setShowMonthDropdown(false); }}
                              className={`w-full px-3 py-1.5 text-left text-[11px] hover:bg-blue-50 transition-colors ${m === selectedMonth ? "bg-blue-50 text-[#1E5EAF] font-medium" : ""}`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <SimplePieChart data={currentPieData} size={180} />
                </div>
              </div>
            ) : analyticsTab === "qr" ? (
              /* ── Tab 2: Tỉ lệ chuyển khoản (QR tĩnh / QR động) ── */
              <div>
                <div className="flex justify-center items-center gap-6">
                  <SimpleDonutChart staticPct={35} dynamicPct={65} size={140} />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[12px]">
                      <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                      <span className="text-gray-600">QR động</span>
                      <span className="font-semibold text-gray-800 ml-auto">65%</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px]">
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      <span className="text-gray-600">QR tĩnh</span>
                      <span className="font-semibold text-gray-800 ml-auto">35%</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">Tổng: 45 giao dịch · 12.500.000đ</div>
                  </div>
                </div>

                {/* Encouragement message */}
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 flex items-start gap-2">
                  <Zap size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-green-700 font-medium">Chuyển sang QR động để tăng hiệu quả</p>
                    <p className="text-[11px] text-green-600 mt-0.5 leading-snug">
                      QR động giúp tự động xác nhận giao dịch, giảm sai sót và tiết kiệm thời gian đối soát. Khách hàng sử dụng QR động có tỉ lệ thanh toán thành công cao hơn 23%.
                    </p>
                  </div>
                </div>
              </div>
            ) : analyticsTab === "reconcile" ? (
              /* ── Tab 3: Đối soát ngân hàng ── */
              <div>
                <div className="bg-[#F0F7FF] rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-gray-500 mb-0.5">Hôm nay</div>
                    <div className="text-[14px] font-semibold text-gray-800">45 giao dịch QR</div>
                    <div className="text-[13px] text-[#1E5EAF] font-medium">Tổng 12.500.000đ</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center">
                      <CheckCheck size={22} className="text-green-500" />
                    </div>
                    <span className="text-[10px] text-green-600 font-semibold">Khớp 100%</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[12px]">
                    <QrCode size={14} className="text-[#1E5EAF] flex-shrink-0" />
                    <span className="text-gray-600 w-32">Tiền QR trên POS</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1E5EAF] rounded-full" style={{ width: "100%" }} />
                    </div>
                    <span className="font-medium text-gray-700 w-24 text-right">12.500.000đ</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px]">
                    <Landmark size={14} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 w-32">Tiền thực nhận NH</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: "100%" }} />
                    </div>
                    <span className="font-medium text-gray-700 w-24 text-right">12.500.000đ</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[12px] text-green-600 font-semibold">100% giao dịch đã được xác nhận tự động</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Bạn không cần kiểm tra thủ công — mọi khoản thanh toán QR hôm nay đều khớp với tiền thực nhận. Tiết kiệm ~15 phút đối soát cuối ngày.
                  </p>
                </div>
              </div>
            ) : (
              /* ── Tab 4: Dòng tiền về tài khoản ── */
              <div>
                {/* Summary header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[11px] text-gray-500">Tổng nhận 7 ngày qua</div>
                    <div className="text-[18px] font-bold text-gray-800">87.500.000đ</div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} />
                    <span className="font-medium">+12.3%</span>
                  </div>
                </div>

                {/* Bar chart */}
                {(() => {
                  const banks = [
                    { name: "VPBank", amount: 32500000, color: "#1E5EAF" },
                    { name: "Vietcombank", amount: 24000000, color: "#22C55E" },
                    { name: "Techcombank", amount: 18500000, color: "#F59E0B" },
                    { name: "MB Bank", amount: 8200000, color: "#8B5CF6" },
                    { name: "ACB", amount: 4300000, color: "#EC4899" },
                  ];
                  const maxAmt = Math.max(...banks.map(b => b.amount));
                  return (
                    <div className="space-y-3">
                      {banks.map((bank) => (
                        <div key={bank.name}>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-gray-600 font-medium">{bank.name}</span>
                            <span className="text-gray-800 font-semibold">{bank.amount.toLocaleString("vi-VN")}đ</span>
                          </div>
                          <div className="h-5 bg-gray-100 rounded overflow-hidden">
                            <div
                              className="h-full rounded transition-all duration-500"
                              style={{ width: `${(bank.amount / maxAmt) * 100}%`, backgroundColor: bank.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Footer note */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <Landmark size={13} className="text-[#1E5EAF] mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-gray-500 leading-snug">
                      Dữ liệu dòng tiền được cập nhật tự động từ các ngân hàng liên kết. VPBank đang là kênh nhận tiền chính với 37% tổng dòng tiền.
                    </p>
                  </div>
                </div>
              </div>
            )}
            </div>

          </div>
        </main>

        {/* Right sidebar */}
        <aside className="w-[240px] flex-shrink-0 overflow-y-auto bg-[#F0F2F5] p-3 space-y-3">
          {/* Quick services */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <CreditCard size={18} className="text-blue-500" />
                </div>
                <span className="text-[11px] text-gray-700">Vay vốn</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={18} className="text-blue-500" />
                </div>
                <span className="text-[11px] text-gray-700">Thanh toán</span>
              </button>
            </div>
          </div>

          {/* ── REMINDER BUTTON (replaces the old banner) ── */}
          <button
            onClick={() => setIsPanelOpen(true)}
            className="w-full flex items-center gap-2.5 bg-[#0070F4] hover:bg-[#0066E0] active:bg-[#005CD1] text-white px-3 py-2.5 rounded-lg shadow-sm transition-colors text-left"
          >
            <KiotVietLogoIcon size={28} />
            <span className="text-[12px] leading-snug flex-1">
              Kết nối tài khoản ngân hàng nhận QR
            </span>
            <CheckCircle2 size={16} className="text-[#22C55E] flex-shrink-0" />
          </button>

          {/* Zalo mini app promo */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-[11px] text-blue-500 mb-1">Tiện ích mới dành cho Nhân viên</div>
            <div className="text-[13px] font-semibold text-gray-800 leading-snug mb-2">
              Xem hoa hồng<br />
              <span className="text-[#1E5EAF]">trên Zalo Mini App</span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-full mx-auto">
              <span className="text-xl">💰</span>
            </div>
          </div>

          {/* Nhắc việc */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <h4 className="text-gray-800 text-[12px] font-semibold mb-2">Nhắc việc</h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users size={13} className="text-orange-500" />
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Có <span className="text-[#1E5EAF] font-medium">3 khách hàng</span> đang nợ từ <span className="text-[#1E5EAF] font-medium">5 hóa đơn</span>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package size={13} className="text-red-500" />
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Có <span className="text-[#1E5EAF] font-medium">12 hàng hóa</span> vượt định mức tồn
                </p>
              </div>
            </div>
          </div>

          {/* Lịch hẹn chưa tới */}
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <h4 className="text-gray-800 text-[12px] font-semibold mb-3">Lịch hẹn chưa tới</h4>
            <div className="space-y-2">
              {[
                { time: "14:30", name: "Nguyễn Thị Mai", service: "Cắt tóc + Gội" },
                { time: "15:00", name: "Trần Văn Hùng", service: "Nhuộm tóc" },
                { time: "16:30", name: "Lê Thị Hoa", service: "Uốn tóc" },
              ].map((apt) => (
                <div key={apt.time} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-[11px] font-medium text-[#1E5EAF] w-10">{apt.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-800 truncate">{apt.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{apt.service}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Onboarding panel */}
      <OnboardingPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}