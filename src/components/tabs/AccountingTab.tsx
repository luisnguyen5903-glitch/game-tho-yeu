import React from 'react';
import { DollarSign, ArrowDownRight, ArrowUpRight, Award } from 'lucide-react';

interface AccountingTabProps {
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  day: number;
  inventoryValue?: number;
}

export const AccountingTab: React.FC<AccountingTabProps> = ({
  totalRevenue,
  totalCustomers,
  day,
}) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const estimatedSupplyCost = Math.round(totalRevenue * 0.22);
  const netProfit = totalRevenue - estimatedSupplyCost;

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#FFFBF8] rounded-2xl border border-rose-100 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-rose-100">
        <div>
          <h3 className="text-sm font-bold text-rose-950 font-display">Sổ Sách Doanh Thu</h3>
          <p className="text-[11px] text-rose-800/70">
            Tổng kết hiệu quả kinh doanh và lợi nhuận qua {day} ngày hoạt động.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold text-rose-900/70">Tổng Doanh Thu</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-rose-950 font-display mt-2">
            {formatMoney(totalRevenue)}
          </span>
        </div>

        <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] font-bold text-emerald-900">Lợi Nhuận Ròng</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-emerald-900 font-display mt-2">
            {formatMoney(netProfit)}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[11px] font-bold text-rose-900/70">Chi Phí Sơn & Đá</span>
            <ArrowDownRight className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-rose-900 font-display mt-2">
            {formatMoney(estimatedSupplyCost)}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-bold text-rose-900/70">Khách Đã Phục Vụ</span>
            <Award className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-rose-950 font-display mt-2">
            {totalCustomers} người
          </span>
        </div>
      </div>

      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center text-xs font-bold flex-shrink-0">
          💡
        </div>
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <strong>Mẹo quản lý:</strong> Sơn không lem và đính đá chuẩn xác sẽ nhận thêm tới 25% tiền tip từ khách. Hãy trả giá với cô bán phụ kiện trước khi bắt đầu ngày để tiết kiệm chi phí nhập sơn!
        </p>
      </div>
    </div>
  );
};
