import React from 'react';
import { Customer } from '../../types/game';
import { INITIAL_CUSTOMERS } from '../../data/initialData';
import { X, Heart, Star } from 'lucide-react';

interface CustomerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCustomers: Customer[];
}

export const CustomerBookModal: React.FC<CustomerBookModalProps> = ({
  isOpen,
  onClose,
  activeCustomers,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#FFFBF8] shadow-2xl border-2 border-rose-200 relative flex flex-col max-h-[85vh] overflow-hidden">
        {/* Cozy Lounge Hero Banner */}
        <div className="relative w-full h-24 overflow-hidden border-b border-rose-200">
          <img
            src="/src/assets/images/salon_cozy_lounge_1790917965865.jpg"
            alt="Phòng chờ thư giãn tiệm nail"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
            <div>
              <h3 className="text-sm font-black text-white font-display flex items-center gap-1.5">
                <span>🛋️</span> Sổ Khách Thân Thiết
              </h3>
              <p className="text-[10.5px] text-rose-100 font-medium">Khách quen & sở thích bộ móng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 p-1 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 overflow-y-auto pr-1 flex-1">
          {INITIAL_CUSTOMERS.map((cust) => {
            const activeCust = activeCustomers.find((c) => c.id === cust.id) || cust;

            return (
              <div
                key={cust.id}
                className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between gap-3 hover:border-rose-200 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-200 to-pink-100 border-2 border-rose-300 flex items-center justify-center font-bold text-sm text-rose-800 shadow-xs">
                    {cust.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-rose-950">{cust.name}</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-md">
                        {cust.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-rose-800/80 mt-0.5">
                      <span>Form: <strong className="capitalize">{cust.favoriteShape}</strong></span>
                      <span>·</span>
                      <span>Đã ghé: <strong>{activeCust.visitCount} lần</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-xs font-bold text-rose-600">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{activeCust.affinity}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">Thiện cảm</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
