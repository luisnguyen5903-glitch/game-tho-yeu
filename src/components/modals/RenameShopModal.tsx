import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import { Sparkles, X, Check } from 'lucide-react';

interface RenameShopModalProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSaveName: (newName: string) => void;
}

export const RenameShopModal: React.FC<RenameShopModalProps> = ({
  isOpen,
  currentName,
  onClose,
  onSaveName,
}) => {
  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSaveName(name.trim());
      soundManager.playTap();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="w-full max-w-xs rounded-2xl bg-[#FFFBF8] p-5 shadow-2xl border-2 border-rose-200 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-bold text-rose-950 font-display flex items-center gap-1.5 pb-2 border-b border-rose-100">
          <Sparkles className="w-4 h-4 text-rose-500" /> Đổi Tên Tiệm Nail
        </h3>

        <form onSubmit={handleSave} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-rose-900 block mb-1">
              Tên tiệm của bạn:
            </label>
            <input
              type="text"
              value={name}
              maxLength={25}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-rose-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white text-rose-950 shadow-inner"
              placeholder="VD: Tiệm Nail Sài Gòn"
              autoFocus
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition"
            >
              Lưu Tên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
