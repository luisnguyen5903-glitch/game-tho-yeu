import React from 'react';
import { CustomerRequest } from '../../types/game';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Heart } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CustomerBriefModalProps {
  isOpen: boolean;
  request: CustomerRequest | null;
  onStart: () => void;
}

export const CustomerBriefModal: React.FC<CustomerBriefModalProps> = ({
  isOpen,
  request,
  onStart,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#FFFDFB] to-[#FFF5F2] p-5 shadow-2xl border-2 border-rose-300 text-rose-950 relative overflow-hidden">
        {/* Decorative ambient background orb */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Customer Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
          <div className="w-12 h-12 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-lg font-black text-rose-800 shadow-sm flex-shrink-0">
            {request.customerName.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-rose-950 font-display">
                {request.customerName}
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-md">
                {request.customerRole}
              </span>
            </div>
            <p className="text-[11px] text-rose-800/80 italic mt-0.5 line-clamp-1">
              "{request.greetingDialogue}"
            </p>
          </div>
        </div>

        {/* Briefing Title */}
        <div className="mt-3 text-center">
          <span className="text-[10px] font-black tracking-widest text-rose-600 uppercase">
            BẢNG YÊU CẦU DỊCH VỤ
          </span>
          <h4 className="text-base font-black font-display text-rose-950 mt-0.5">
            Bộ Móng Phong Cách {request.requestedStyle}
          </h4>
        </div>

        {/* Specifications Cards Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {/* Form */}
          <div className="p-2.5 bg-white rounded-xl border border-rose-100 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">DÁNG FORM</span>
            <span className="text-sm font-black text-rose-900 font-display capitalize">
              {request.targetShape}
            </span>
          </div>

          {/* Length */}
          <div className="p-2.5 bg-white rounded-xl border border-rose-100 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">ĐỘ DÀI</span>
            <span className="text-sm font-black text-rose-900 font-display capitalize">
              {request.targetLength === 'short'
                ? 'Ngắn tự nhiên'
                : request.targetLength === 'medium'
                ? 'Thon vừa vặn'
                : 'Dài sang chảnh'}
            </span>
          </div>

          {/* Color */}
          <div className="p-2.5 bg-white rounded-xl border border-rose-100 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">MÀU CHÍNH</span>
            <span className="text-xs font-bold text-rose-900 truncate block">
              {request.targetColorName}
            </span>
          </div>

          {/* Gems */}
          <div className="p-2.5 bg-white rounded-xl border border-rose-100 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">ĐÍNH ĐÁ</span>
            <span className="text-xs font-bold text-rose-900 block">
              {request.requiresGems
                ? `${request.requestedCharmCount} viên ${request.requiresSymmetry ? '(Đối xứng)' : ''}`
                : 'Tối giản / Không đá'}
            </span>
          </div>
        </div>

        {/* Technical Constraints */}
        <div className="mt-3 p-3 bg-amber-50/80 rounded-2xl border border-amber-200/90 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 uppercase tracking-wide mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Yêu Cầu Kỹ Thuật Khách Lưu Ý:</span>
          </div>
          <ul className="space-y-1 text-xs text-amber-950 font-medium">
            {request.specialConstraints.map((constraint, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">·</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundManager.playTap();
            onStart();
          }}
          className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white font-black text-sm font-display shadow-lg hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 border-2 border-rose-300"
        >
          <span>TIẾP NHẬN & BẮT ĐẦU LÀM MÓNG</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
