import React from 'react';
import { soundManager } from '../../utils/audio';
import { Tag, DollarSign, TrendingUp } from 'lucide-react';

interface ServicePricingTabProps {
  prices: {
    basicCutCare: number;
    gelColor: number;
    frenchNail: number;
    ombreDesign: number;
    stonePerPiece: number;
  };
  onUpdatePrice: (key: string, value: number) => void;
}

export const ServicePricingTab: React.FC<ServicePricingTabProps> = ({ prices, onUpdatePrice }) => {
  const serviceList = [
    {
      key: 'basicCutCare',
      name: 'Cắt Da & Dũa Form Móng',
      desc: 'Tạo form chuẩn Almond, Vuông, Tròn, nhặt da sạch sẽ',
      min: 20000,
      max: 80000,
      step: 5000,
    },
    {
      key: 'gelColor',
      name: 'Sơn Gel Màu Trơn',
      desc: 'Sơn lót, 2 lớp màu chuẩn tone & sấy đèn UV LED',
      min: 50000,
      max: 180000,
      step: 10000,
    },
    {
      key: 'frenchNail',
      name: 'Vẽ Đầu Móng French Cổ Điển',
      desc: 'Đường cong smile line tinh tế chuẩn phong cách Pháp',
      min: 25000,
      max: 90000,
      step: 5000,
    },
    {
      key: 'ombreDesign',
      name: 'Nail Ombre Loang Màu Nghệ Thuật',
      desc: 'Dặm mút chuyển màu mượt mà babyboomer',
      min: 30000,
      max: 120000,
      step: 5000,
    },
    {
      key: 'stonePerPiece',
      name: 'Đính Đá Pha Lê Swarovski (Mỗi viên)',
      desc: 'Đính keo chuyên dụng, phủ top coat chống rơi rớt',
      min: 10000,
      max: 35000,
      step: 2000,
    },
  ];

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#FFFBF8] rounded-2xl border border-rose-100 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-rose-100">
        <div>
          <h3 className="text-sm font-bold text-rose-950 font-display">Bảng Giá Dịch Vụ Móng</h3>
          <p className="text-[11px] text-rose-800/70">
            Cân đối giá hợp lý để giữ chân khách quen và tối đa hóa lợi nhuận.
          </p>
        </div>
        <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 flex items-center gap-1 text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          <span>Biên lợi nhuận: Tốt</span>
        </div>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {serviceList.map((svc) => {
          const currentVal = prices[svc.key as keyof typeof prices] || svc.min;

          return (
            <div
              key={svc.key}
              className="p-3 bg-white rounded-xl border border-rose-100 shadow-xs flex items-center justify-between gap-3 hover:border-rose-200 transition"
            >
              <div>
                <h4 className="text-xs font-bold text-rose-950">{svc.name}</h4>
                <p className="text-[11px] text-rose-800/70 mt-0.5">{svc.desc}</p>
                <span className="text-xs font-extrabold text-rose-700 font-mono mt-1 inline-block">
                  {formatMoney(currentVal)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentVal <= svc.min}
                  onClick={() => {
                    onUpdatePrice(svc.key, currentVal - svc.step);
                    soundManager.playTap();
                  }}
                  className="w-7 h-7 rounded-lg bg-rose-100 text-rose-900 font-bold hover:bg-rose-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                >
                  -
                </button>
                <button
                  disabled={currentVal >= svc.max}
                  onClick={() => {
                    onUpdatePrice(svc.key, currentVal + svc.step);
                    soundManager.playTap();
                  }}
                  className="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-xs"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
