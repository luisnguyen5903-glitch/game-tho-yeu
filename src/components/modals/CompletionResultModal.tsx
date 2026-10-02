import React from 'react';
import { Customer, CustomerRequest, EvaluationReport } from '../../types/game';
import { NAIL_POLISHES } from '../../data/initialData';
import { soundManager } from '../../utils/audio';
import { Star, DollarSign, Award, ArrowRight, Heart, Sparkles, CheckCircle2, AlertCircle, Target, TrendingUp } from 'lucide-react';

interface CompletionResultModalProps {
  isOpen: boolean;
  customer: Customer;
  request: CustomerRequest;
  report: EvaluationReport;
  onClose: () => void;
}

export const CompletionResultModal: React.FC<CompletionResultModalProps> = ({
  isOpen,
  customer,
  request,
  report,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalEarned = report.earnedBaseMoney + report.earnedTipMoney;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const getEmotionEmoji = () => {
    switch (report.customerReactionEmotion) {
      case 'happy': return '😍';
      case 'pleased': return '😊';
      case 'surprised': return '😳';
      case 'worried': return '😟';
      case 'hurt': return '😣';
      case 'annoyed': return '😡';
      default: return '😌';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#FFFDFB] to-[#FFF5F2] p-5 shadow-2xl border-2 border-rose-300 text-rose-950 relative overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Full Perfect Banner if achieved */}
        {report.isFullPerfect && (
          <div className="mb-3 py-1.5 px-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-rose-950 rounded-xl font-black text-xs uppercase tracking-widest text-center shadow-md animate-pulse flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>✨ KIỆT TÁC: FULL PERFECT ✨</span>
          </div>
        )}

        {/* 1. SHOWCASE BỘ NAIL VỪA HOÀN THÀNH (Section 18) */}
        <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-[#FCEAE4] to-[#F5D8D0] rounded-2xl border border-rose-200 shadow-inner flex items-center justify-center overflow-hidden mb-3">
          {/* Subtle glow orb */}
          <div className="w-24 h-24 rounded-full bg-white/40 blur-xl absolute" />

          {/* Rendered Finished Finger & Nail close-up */}
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-28 bg-[#FCD4BC] rounded-t-[40px] border-2 border-[#E1987B] shadow-lg flex flex-col items-center pt-3 relative overflow-hidden">
              <div
                className={`w-14 h-20 shadow-md border border-black/10 overflow-hidden relative ${
                  request.targetShape === 'almond'
                    ? 'rounded-t-[40px]'
                    : request.targetShape === 'square'
                    ? 'rounded-t-[8px]'
                    : 'rounded-t-[24px]'
                }`}
                style={{ backgroundColor: NAIL_POLISHES.find((p) => p.id === request.targetColorId)?.hex || '#F9D5D3' }}
              >
                {/* Gloss reflection */}
                <div className="absolute top-1 left-1.5 w-1.5 h-16 bg-white/50 rounded-full blur-[0.5px]" />
                {/* Sparkling gemstone if placed */}
                {request.requiresGems && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs animate-bounce">
                    ✨
                  </div>
                )}
              </div>
            </div>
          </div>

          <span className="absolute bottom-1.5 right-2 text-[9px] font-bold text-rose-900/60 uppercase">
            Thành Phẩm Móng
          </span>
        </div>

        {/* 2. KHÁCH HÀNG PHẢN HỒI (Avatar + Cảm xúc + Lời nói) */}
        <div className="flex items-start gap-2.5 p-3 bg-white rounded-2xl border border-rose-100 shadow-2xs mb-3">
          <div className="relative w-11 h-11 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-sm font-black text-rose-900 shadow-xs flex-shrink-0">
            {customer.name.slice(0, 2)}
            <span className="absolute -bottom-1 -right-1 text-sm">{getEmotionEmoji()}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-extrabold text-rose-950">{customer.name}</span>
              <span className="text-[10px] font-bold text-slate-400">{customer.role}</span>
            </div>
            <p className="text-xs text-rose-950/90 italic leading-snug">
              "{report.customerReactionDialogue}"
            </p>
          </div>
        </div>

        {/* 3. ĐIỂM SỐ & SAO THỰC TẾ (Không có điểm nền) */}
        <div className="text-center mb-3">
          <div className="flex justify-center items-center gap-1.5 text-amber-400 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < report.stars ? 'fill-amber-400 text-amber-400 animate-bounce' : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="text-2xl font-black font-display text-rose-950">
            {report.totalScore} <span className="text-base font-normal text-slate-400">/ 100</span>
          </div>
          <p className="text-xs font-bold text-rose-800">
            {report.stars === 5
              ? 'Xuất Sắc! Khách Rất Hài Lòng'
              : report.stars === 4
              ? 'Làm Tốt! Có Thể Cải Thiện Thêm'
              : report.stars === 3
              ? 'Đạt Yêu Cầu Trung Bình'
              : report.stars === 2
              ? 'Nhiều Lỗi Kỹ Thuật Chưa Chuẩn'
              : 'Thất Bại! Bỏ Qua Các Bước Quan Trọng'}
          </p>
        </div>

        {/* 4. BẢNG ĐIỂM CHI TIẾT 6 HẠNG MỤC (Section 19) */}
        <div className="p-3 bg-white rounded-2xl border border-rose-100 shadow-2xs space-y-1.5 text-[11px] text-left mb-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">1. Vệ sinh & Khử dầu (15%):</span>
            <span className="font-bold text-rose-950 font-mono">{report.breakdown.cleanScore}/100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">2. Cắt móng & Đẩy khóe (10%):</span>
            <span className="font-bold text-rose-950 font-mono">{report.breakdown.trimScore}/100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">3. Dũa tạo form {request.targetShape} (20%):</span>
            <span className="font-bold text-rose-950 font-mono">{report.breakdown.fileScore}/100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">4. Sơn màu & Sạch khóe (25%):</span>
            <span className="font-bold text-rose-950 font-mono">{report.breakdown.paintScore}/100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">5. Đính đá & Trang trí (15%):</span>
            <span className="font-bold text-rose-950 font-mono">{report.breakdown.gemScore}/100</span>
          </div>
          <div className="flex items-center justify-between border-t border-rose-50 pt-1">
            <span className="text-slate-500 font-medium">6. Tuân thủ yêu cầu & Top coat (15%):</span>
            <span className="font-bold text-rose-950 font-mono">{report.breakdown.complianceScore}/100</span>
          </div>
        </div>

        {/* 5. CỤ THỂ KHEN NGỢI & LỖI VI PHẠM (Causal Feedback - Section 20) */}
        {(report.penalties.length > 0 || report.praises.length > 0) && (
          <div className="space-y-1.5 mb-3 text-left">
            {report.praises.slice(0, 2).map((praise, idx) => (
              <div key={idx} className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{praise}</span>
              </div>
            ))}
            {report.penalties.slice(0, 2).map((pen, idx) => (
              <div key={idx} className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-950 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-700">-{pen.points}đ: </span>
                  <span>{pen.reason}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. 3 ĐIỂM CẦN CẢI THIỆN CHO MÀN TIẾP THEO (Section 21) */}
        {report.improvements.length > 0 && (
          <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-200 text-left mb-3">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1 mb-1">
              <Target className="w-3 h-3 text-amber-600" /> Cần Cải Thiện Màn Sau:
            </span>
            <ul className="space-y-0.5 text-[11px] text-amber-950">
              {report.improvements.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 7. TỔNG KẾT TIỀN THƯỞNG DỰA TRÊN KẾT QUẢ THỰC TẾ (Section 21) */}
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-md mb-3 flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">
              Tổng Thu Về Két:
            </span>
            <span className="text-lg font-black font-display font-mono">
              +{formatMoney(totalEarned)}
            </span>
            <span className="text-[10px] block opacity-85">
              (Công: {formatMoney(report.earnedBaseMoney)} · Tip: +{formatMoney(report.earnedTipMoney)})
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold font-mono block">+{report.earnedXp} XP</span>
            <span className="text-[11px] font-bold flex items-center gap-1 justify-end">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>{report.affinityDelta >= 0 ? `+${report.affinityDelta}` : report.affinityDelta}</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundManager.playCashRegister();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-sm shadow-lg hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <span>Thu Tiền & Về Tiệm</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
