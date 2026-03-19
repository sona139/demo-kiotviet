import { useState, useEffect, useRef } from "react";
import { ChevronDown, HelpCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const banks = [
  "Techcombank",
  "Vietcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "MB Bank",
  "ACB",
  "VPBank",
  "TPBank",
  "Sacombank",
];

export function OnboardingPanel({ isOpen, onClose }: OnboardingPanelProps) {
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [branch, setBranch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [errors, setErrors] = useState<{ bank?: boolean; accountNumber?: boolean; accountHolder?: boolean }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showBankDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(e.target as Node)) {
        setShowBankDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBankDropdown]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = () => {
    const newErrors = {
      bank: !selectedBank,
      accountNumber: !accountNumber.trim(),
      accountHolder: !accountHolder.trim(),
    };
    setErrors(newErrors);

    if (newErrors.bank || newErrors.accountNumber || newErrors.accountHolder) {
      return;
    }

    console.log({ selectedBank, accountNumber, accountHolder, branch });
    setShowSuccess(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#F8F9FA] px-5 py-4 flex items-center gap-3 border-b border-gray-200">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-gray-900 text-[16px] font-semibold">
                  Kết nối tài khoản ngân hàng nhận QR
                </h2>
                <p className="text-gray-500 text-[13px] mt-0.5">
                  Liên kết tài khoản để nhận thanh toán QR và tự động thông báo khi tiền về.
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-5">
                {/* Section Title */}
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                    Tài khoản nhận tiền
                  </h3>
                  <p className="text-[13px] text-gray-600">
                    Kết nối tài khoản ngân hàng để nhận thanh toán QR và tự động xác nhận giao dịch.
                  </p>
                </div>

                {/* Bank Selection */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">
                    Ngân hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={bankDropdownRef}>
                    <button
                      onClick={() => setShowBankDropdown(!showBankDropdown)}
                      className={`w-full px-4 py-2.5 bg-white border rounded-lg text-left text-[13px] hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center justify-between ${errors.bank ? "border-red-500" : "border-gray-300"} ${selectedBank ? "text-gray-900" : "text-gray-400"}`}
                    >
                      <span>{selectedBank || "Chọn ngân hàng"}</span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {showBankDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {banks.map((bank) => (
                          <button
                            key={bank}
                            onClick={() => {
                              setSelectedBank(bank);
                              setShowBankDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-[13px] hover:bg-blue-50 transition-colors"
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.bank && (
                    <p className="text-red-500 text-[12px] mt-1">Vui lòng chọn ngân hàng</p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">
                    Số tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => { setAccountNumber(e.target.value); setErrors((prev) => ({ ...prev, accountNumber: false })); }}
                    placeholder="Nhập số tài khoản"
                    className={`w-full px-4 py-2.5 bg-white border rounded-lg text-[13px] text-gray-900 placeholder-gray-400 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.accountNumber ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-[12px] mt-1">Vui lòng nhập số tài khoản</p>
                  )}
                </div>

                {/* Account Holder */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">
                    Chủ tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => { setAccountHolder(e.target.value); setErrors((prev) => ({ ...prev, accountHolder: false })); }}
                    placeholder="Nhập tên chủ tài khoản"
                    className={`w-full px-4 py-2.5 bg-white border rounded-lg text-[13px] text-gray-900 placeholder-gray-400 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.accountHolder ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.accountHolder && (
                    <p className="text-red-500 text-[12px] mt-1">Vui lòng nhập tên chủ tài khoản</p>
                  )}
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-2">
                    Chi nhánh
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Nhập chi nhánh (không bắt buộc)"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[13px] text-gray-900 placeholder-gray-400 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#0070F4] hover:bg-[#0066E0] active:bg-[#005CD1] text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
              >
                Kết nối tài khoản
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-[#0070F4] hover:text-[#0066E0] px-3 py-2.5 text-[13px] font-medium transition-colors"
              >
                <HelpCircle size={16} />
                Tôi cần hỗ trợ kết nối
              </button>
            </div>
          </motion.div>

          {/* Success Toast */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                key="success-toast"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#22C55E] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2.5"
              >
                <CheckCircle2 size={20} />
                <span className="text-[14px] font-medium">Đã kết nối thành công</span>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
