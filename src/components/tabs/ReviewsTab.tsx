import React, { useState } from 'react';
import { CustomerReview } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { Star, MessageCircle, Check, Heart, Sparkles } from 'lucide-react';

interface ReviewsTabProps {
  reviews: CustomerReview[];
  averageRating: number;
  reputation: number;
  onReplyReview: (reviewId: string, replyText: string, affinityBonus: number, reputationBonus: number) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews,
  averageRating,
  reputation,
  onReplyReview,
}) => {
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<string | null>(null);

  const defaultReplyOptions = [
    {
      text: 'Dạ em cảm ơn chị nhiều ạ ❤️ Lần sau ghé em làm tặng thêm voucher nhé!',
      affinityBonus: 10,
      reputationBonus: 5,
    },
    {
      text: 'Em rất vui vì chị ưng ý bộ móng! Chúc chị có những bức ảnh thật xinh lung linh!',
      affinityBonus: 8,
      reputationBonus: 6,
    },
    {
      text: 'Dạ em cảm ơn góp ý của chị, lần sau em sẽ căn chỉnh kỹ hơn nữa để chị hài lòng tuyệt đối ạ.',
      affinityBonus: 12,
      reputationBonus: 4,
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#FFFBF8] rounded-2xl border border-rose-100 shadow-xs">
      {/* Reputation & Rating Overview */}
      <div className="p-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black font-display">{averageRating.toFixed(1)}</span>
            <div className="flex text-amber-300 text-sm">
              {'★★★★★'.slice(0, Math.round(averageRating))}
            </div>
          </div>
          <p className="text-xs text-rose-100 mt-0.5">Uy tín tiệm: {reputation}/100 điểm</p>
        </div>

        {/* Reputation Progress Bar */}
        <div className="w-32 bg-white/20 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/30">
          <div
            className="h-full bg-amber-300 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, reputation)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pb-1">
        <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
          Đánh Giá Từ Khách Hàng ({reviews.length})
        </h4>
        <span className="text-[11px] text-rose-800/70">Trả lời để tăng thiện cảm & danh tiếng</span>
      </div>

      {/* Review List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {reviews.length === 0 ? (
          <div className="p-6 text-center text-xs text-rose-700/60 bg-white rounded-xl border border-rose-100">
            Chưa có đánh giá nào. Hãy mở cửa phục vụ khách đầu tiên nhé!
          </div>
        ) : (
          reviews.map((rev) => {
            const isReplying = activeReplyReviewId === rev.id;

            return (
              <div
                key={rev.id}
                className="p-3 bg-white rounded-xl border border-rose-100 shadow-xs space-y-2 hover:border-rose-200 transition"
              >
                {/* Header: Customer avatar, name, stars, day */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center font-bold text-xs text-rose-800">
                      {rev.customerName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-rose-950">{rev.customerName}</h5>
                      <span className="text-[10px] text-slate-400">Ngày {rev.dayNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-rose-950/80 leading-relaxed italic bg-rose-50/40 p-2 rounded-lg border border-rose-100/60">
                  "{rev.comment}"
                </p>

                {/* Reply status or buttons */}
                {rev.isReplied ? (
                  <div className="mt-2 p-2 bg-emerald-50/80 rounded-lg border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-800">Chủ tiệm trả lời: </span>
                      <span>{rev.replyText}</span>
                    </div>
                  </div>
                ) : isReplying ? (
                  /* Reply options dropdown */
                  <div className="mt-2 space-y-1.5 bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 animate-in fade-in">
                    <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-500" /> Chọn câu trả lời:
                    </span>
                    {defaultReplyOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onReplyReview(rev.id, opt.text, opt.affinityBonus, opt.reputationBonus);
                          setActiveReplyReviewId(null);
                          soundManager.playCashRegister();
                        }}
                        className="w-full text-left text-xs p-2 bg-white hover:bg-rose-100/70 border border-rose-200/80 rounded-lg text-rose-950 transition active:scale-98 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <span className="line-clamp-2">{opt.text}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex-shrink-0">
                          +{opt.affinityBonus} ❤️
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => setActiveReplyReviewId(null)}
                      className="text-[10px] text-slate-500 hover:text-slate-700 underline pt-1 block"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        setActiveReplyReviewId(rev.id);
                        soundManager.playTap();
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-rose-700 bg-rose-100/80 hover:bg-rose-200 rounded-lg border border-rose-300/60 transition active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Trả Lời</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
