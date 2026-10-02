import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-full transition shadow-sm active:scale-95"
        title="Cài đặt game về màn hình chính"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Cài Game</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-full transition shadow-sm active:scale-95"
          title="Thêm game vào màn hình iPhone"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Thêm iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#FFFBF8] p-5 shadow-2xl border border-rose-200">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <h3 className="text-base font-bold text-rose-950 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-rose-500" />
                  Cài Đặt Lên iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 text-xs text-rose-900/80 space-y-2.5 leading-relaxed">
                <div className="flex items-start gap-2.5 bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Bấm vào nút <strong>Chia sẻ (Share)</strong> ở thanh dưới của trình duyệt Safari.</span>
                </div>
                <div className="flex items-start gap-2.5 bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Cuộn xuống và chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Mở game từ icon màn hình để chơi mượt mà toàn màn hình không có thanh web!</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-105 active:scale-98 transition"
              >
                Đã Hiểu
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
