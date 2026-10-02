import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import { Sparkles, MessageCircle, X, Check, TrendingDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HagglingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessDiscount: (discountPercent: number) => void;
}

export const HagglingModal: React.FC<HagglingModalProps> = ({
  isOpen,
  onClose,
  onSuccessDiscount,
}) => {
  const [step, setStep] = useState<'intro' | 'negotiating' | 'result'>('intro');
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [resultDiscount, setResultDiscount] = useState<number>(0);

  if (!isOpen) return null;

  const hagglingQuotes = [
    {
      text: '"Cô Ba ơi, cháu lấy mối sỉ lâu năm ở tiệm cháu, cô bớt cháu chút đỉnh lấy may đầu ngày nha!"',
      chance: 0.85,
      discount: 15,
      reply: '"Thấy cưng dẻo miệng mà mở tiệm chăm chỉ, cô bớt hẳn 15% cho ngày hôm nay luôn đó nha!"',
    },
    {
      text: '"Hôm nay cháu định nhập thêm 10 chai sơn thạch với khay đá Swarovski, cô chiết khấu sâu cháu gom luôn!"',
      chance: 0.6,
      discount: 25,
      reply: '"Trời ơi cao thủ trả giá! Thôi được rồi, bớt luôn 25% giá vốn sỉ cho tiệm phát tài nhé!"',
    },
    {
      text: '"Cô Ba nay da dẻ hồng hào trẻ đẹp quá! Cháu xin chút vía may mắn giảm nhẹ 10% nha cô."',
      chance: 0.95,
      discount: 10,
      reply: '"Khéo nịnh ghê chưa kìa! Bớt ngay 10% cho cô chủ nhỏ vui vẻ làm móng cả ngày!"',
    },
  ];

  const handleNegotiate = (index: number) => {
    setSelectedQuote(index);
    setStep('negotiating');
    soundManager.playTap();

    setTimeout(() => {
      const q = hagglingQuotes[index];
      const isSuccess = Math.random() <= q.chance;
      const finalDiscount = isSuccess ? q.discount : 10;
      setResultDiscount(finalDiscount);
      setStep('result');

      if (isSuccess && finalDiscount >= 15) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
        soundManager.playSuccessFanfare();
      } else {
        soundManager.playCashRegister();
      }
    }, 1200);
  };

  const handleFinish = () => {
    onSuccessDiscount(resultDiscount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-[#FFFBF8] p-5 shadow-2xl border-2 border-rose-200 relative select-none">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
          <div className="w-12 h-12 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-xl flex-shrink-0">
            👩‍💼
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950 font-display">
              Cô Ba Bán Phụ Kiện Nail
            </h3>
            <p className="text-[11px] text-rose-700/80">Chợ Đầu Mối Kim Biên Sài Gòn</p>
          </div>
        </div>

        {/* Body Content */}
        {step === 'intro' && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-100 text-xs text-rose-900 leading-relaxed italic">
              "Chào cô chủ nhỏ! Nay tiệm lấy thêm sơn thạch hay đá pha lê gì hông? Lấy nhiều cô bớt cho nha!"
            </div>

            <p className="text-xs font-bold text-rose-950">Chọn cách trả giá khéo léo:</p>

            <div className="space-y-2">
              {hagglingQuotes.map((quote, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNegotiate(idx)}
                  className="w-full text-left p-2.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50/80 text-xs text-rose-950 font-medium transition active:scale-98 shadow-2xs flex items-center justify-between gap-2"
                >
                  <span className="line-clamp-2">{quote.text}</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex-shrink-0">
                    Bớt tới {quote.discount}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'negotiating' && (
          <div className="mt-8 mb-6 text-center space-y-3">
            <div className="inline-block animate-bounce text-3xl">🤝</div>
            <h4 className="text-sm font-bold text-rose-950">Đang bàn bạc với Cô Ba...</h4>
            <p className="text-xs text-rose-800/70">Cô Ba đang cân nhắc mức chiết khấu...</p>
          </div>
        )}

        {step === 'result' && selectedQuote !== null && (
          <div className="mt-4 space-y-4 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed italic">
              {hagglingQuotes[selectedQuote].reply}
            </div>

            <div className="p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border border-amber-300 text-amber-950">
              <span className="text-xs font-bold uppercase tracking-wider block text-amber-800">
                Ưu Đãi Hôm Nay
              </span>
              <span className="text-2xl font-black font-display text-rose-600 block mt-0.5">
                GIẢM {resultDiscount}% GIÁ VỐN
              </span>
              <span className="text-[11px] text-amber-900/80 block mt-0.5">
                Áp dụng cho toàn bộ sơn gel & đá mua trong ngày
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-xs font-bold text-white shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Chốt Giá & Về Tiệm Chuẩn Bị</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
