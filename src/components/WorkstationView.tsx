import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Customer,
  CustomerRequest,
  CustomerActionLog,
  EvaluationReport,
  NailPolish,
  NailCharm,
  PlacedCharm,
  NailShape,
  CustomerEmotion,
} from '../types/game';
import { NAIL_POLISHES, NAIL_CHARMS } from '../data/initialData';
import { evaluateNailService } from '../utils/nailEvaluator';
import { soundManager } from '../utils/audio';
import { GemstoneGraphic } from './GemstoneGraphic';
import {
  Sparkles,
  Sun,
  Check,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  Wand2,
  Scissors,
  ShieldAlert,
  Heart,
  FileText,
  X,
  Eraser,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkstationViewProps {
  customer: Customer;
  request: CustomerRequest;
  inventory: Record<string, number>;
  trendBonus?: number;
  onFinishService: (report: EvaluationReport) => void;
  onExit: () => void;
}

type StepType = 'clean' | 'trim' | 'file' | 'base' | 'paint' | 'cure' | 'gems' | 'topcoat';

export const WorkstationView: React.FC<WorkstationViewProps> = ({
  customer,
  request,
  inventory,
  trendBonus = 0,
  onFinishService,
  onExit,
}) => {
  const [currentStep, setCurrentStep] = useState<StepType>('clean');
  const [showBriefCard, setShowBriefCard] = useState(false);

  // Customer Emotion & Live Dialog
  const [emotion, setEmotion] = useState<CustomerEmotion>('calm');
  const [liveSpeech, setLiveSpeech] = useState<string>(request.greetingDialogue);

  // Fallback initial condition
  const nailCond = customer?.nailCondition || {
    dirtLevel: 30,
    excessLength: 50,
    hasOldPolish: false,
    hasOvergrownCuticles: true,
    isFragile: false,
  };

  // Step 1: Cleaning State
  const [dirtRemaining, setDirtRemaining] = useState(nailCond.dirtLevel);
  const [oldPolishRemaining, setOldPolishRemaining] = useState(nailCond.hasOldPolish ? 80 : 0);
  const [hasCleanedEver, setHasCleanedEver] = useState(false);

  // Step 2: Trimming & Cuticles
  const [nailLength, setNailLength] = useState(nailCond.excessLength > 0 ? 100 : 70); // 100 = overgrown, 65 = perfect
  const [hasTrimmedEver, setHasTrimmedEver] = useState(false);
  const [wasCutTooShort, setWasCutTooShort] = useState(false);
  const [cuticlePushed, setCuticlePushed] = useState(!nailCond.hasOvergrownCuticles);

  // Step 3: Filing & Shaping
  const [filingProgress, setFilingProgress] = useState(0);
  const [actualShape, setActualShape] = useState<NailShape>('round');
  const [filingDust, setFilingDust] = useState<{ x: number; y: number; id: number }[]>([]);
  const isDraggingFiler = useRef(false);
  const lastFilerX = useRef(0);

  // Step 4 & 5: Painting
  const [hasBaseCoat, setHasBaseCoat] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPainting = useRef(false);
  const [selectedColor, setSelectedColor] = useState<NailPolish>(
    NAIL_POLISHES.find((p) => p.id === request.targetColorId) || NAIL_POLISHES[0]
  );
  const [actualColorUsed, setActualColorUsed] = useState<NailPolish | null>(null);
  const [paintedCoverage, setPaintedCoverage] = useState(0); // 0 to 100%
  const [spillCount, setSpillCount] = useState(0);
  const [spillCleanedPct, setSpillCleanedPct] = useState(100);
  const [isWipeToolActive, setIsWipeToolActive] = useState(false);

  // Step 6: UV Lamp
  const [isCuring, setIsCuring] = useState(false);
  const [curingProgress, setCuringProgress] = useState(0);
  const [isCured, setIsCured] = useState(false);

  // Step 7: Gems & Placement
  const [selectedCharm, setSelectedCharm] = useState<NailCharm>(NAIL_CHARMS[0]);
  const [placedCharms, setPlacedCharms] = useState<PlacedCharm[]>([]);
  const nailContainerRef = useRef<HTMLDivElement | null>(null);

  // Step 8: Top Coat
  const [hasTopCoat, setHasTopCoat] = useState(false);

  // Countdown timer
  const [remainingTime, setRemainingTime] = useState(request.deadlineSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEmotion('worried');
          setLiveSpeech('Chị ơi hơi lâu rồi đó, em sắp có hẹn mất rồi...');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [request.deadlineSeconds]);

  // Init canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Base natural healthy nail bed color
    ctx.fillStyle = '#FCE5D8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Handle wiping dirt or old polish
  const handleWipeMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    setHasCleanedEver(true);
    soundManager.playBrushSound();

    if (oldPolishRemaining > 0) {
      setOldPolishRemaining((prev) => {
        const next = Math.max(0, prev - 5);
        if (next === 0) {
          setEmotion('pleased');
          setLiveSpeech('Sơn cũ đã được tẩy sạch bong rồi, móng nhẹ nhõm hẳn!');
        }
        return next;
      });
    } else if (dirtRemaining > 0) {
      setDirtRemaining((prev) => {
        const next = Math.max(0, prev - 6);
        if (next === 0) {
          setEmotion('pleased');
          setLiveSpeech('Khóe móng sạch tinh tươm rồi chị ơi!');
        }
        return next;
      });
    }
  };

  // Handle trimming length
  const handleTrim = (targetLength: number) => {
    setHasTrimmedEver(true);
    soundManager.playTap();
    setNailLength(targetLength);

    if (targetLength < 50) {
      setWasCutTooShort(true);
      setEmotion('hurt');
      setLiveSpeech(customer.dialoguePain || 'Á... cắt sát quá rồi em ơi, thốn thịt của chị!');
    } else {
      setWasCutTooShort(false);
      setEmotion('happy');
      setLiveSpeech('Độ dài móng này cắt vừa vặn rất xinh chị ạ!');
    }
  };

  // Push cuticles
  const handlePushCuticle = () => {
    setCuticlePushed(true);
    soundManager.playBrushSound();
    setEmotion('happy');
    setLiveSpeech('Khóe móng được đẩy gọn gàng trông ngón tay thon dài hẳn!');
  };

  // Filing stroke
  const handleFilingMove = (e: React.PointerEvent) => {
    if (!isDraggingFiler.current) return;
    const deltaX = Math.abs(e.clientX - lastFilerX.current);
    if (deltaX > 8) {
      soundManager.playFilingSound();
      lastFilerX.current = e.clientX;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setFilingDust((prev) => [
        ...prev.slice(-6),
        { x, y, id: Date.now() + Math.random() },
      ]);

      setFilingProgress((prev) => {
        const next = Math.min(100, prev + 3.5);
        if (next >= 100) {
          setActualShape(request.targetShape);
          setEmotion('happy');
          setLiveSpeech(`Form ${request.targetShape.toUpperCase()} lên dáng chuẩn chỉ rồi nè!`);
        }
        return next;
      });
    }
  };

  // Painting stroke
  const handlePaintMove = (e: React.PointerEvent) => {
    if (!isPainting.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!actualColorUsed) {
      setActualColorUsed(selectedColor);
      // Check if player is using wrong color immediately (Section 14 & 15)
      if (selectedColor.id !== request.targetColorId) {
        setEmotion('worried');
        setLiveSpeech(`Ủa em ơi, chị nhớ mình dặn màu ${request.targetColorName} mà nhỉ?`);
      }
    }

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (isWipeToolActive) {
      // Clean up spill
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      soundManager.playBrushSound();
      setSpillCleanedPct(100);
      setEmotion('pleased');
      setLiveSpeech('Chị lau khóe sạch sẽ rồi, đường sơn gọn gàng hẳn!');
      return;
    }

    // Apply color
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fillStyle = selectedColor.hex;
    ctx.globalAlpha = 0.88;
    ctx.fill();

    soundManager.playBrushSound();

    // Check spill outside nail plate boundary
    if (x < 15 || x > canvas.width - 15 || y < 15) {
      setSpillCount((prev) => prev + 1);
      setSpillCleanedPct(40);
      setEmotion('annoyed');
      setLiveSpeech('Chỗ viền này hình như lem ra da rồi em, nhớ lau khóe nhé!');
    }

    setPaintedCoverage((prev) => {
      const next = Math.min(100, prev + 2.5);
      if (next >= 90 && selectedColor.id === request.targetColorId) {
        setEmotion('happy');
        setLiveSpeech(`Màu sơn ${request.targetColorName} lên đều mướt đẹp xỉu!`);
      }
      return next;
    });
  };

  // UV Curing
  const handleStartCuring = () => {
    if (isCuring) return;
    setIsCuring(true);
    setCuringProgress(0);
    soundManager.playTap();

    const interval = setInterval(() => {
      setCuringProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCuring(false);
          setIsCured(true);
          soundManager.playUvCured();
          setEmotion('pleased');
          setLiveSpeech('Gel đã sấy khô cứng và bóng loáng rồi, rất chuyên nghiệp!');
          return 100;
        }
        return prev + 25;
      });
    }, 280);
  };

  // Gem placing
  const handleNailContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentStep !== 'gems') return;
    const container = nailContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (x < 15 || x > 85 || y < 10 || y > 85) return;

    const newCharm: PlacedCharm = {
      id: `pc_${Date.now()}_${Math.random()}`,
      charmId: selectedCharm.id,
      x,
      y,
      rotation: Math.floor(Math.random() * 20 - 10),
      scale: selectedCharm.scale || 1,
    };

    const nextCharms = [...placedCharms, newCharm];
    setPlacedCharms(nextCharms);
    soundManager.playGemClink();

    // Check count and customer reaction
    if (request.requiresGems && nextCharms.length === request.requestedCharmCount) {
      setEmotion('happy');
      setLiveSpeech(`Đúng số lượng ${request.requestedCharmCount} viên đá chị yêu cầu rồi!`);
    } else if (!request.requiresGems && nextCharms.length > 2) {
      setEmotion('worried');
      setLiveSpeech('Chị thích tối giản mà, đính nhiều đá quá trông hơi rườm rà...');
    }
  };

  const removeCharm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlacedCharms((prev) => prev.filter((c) => c.id !== id));
    soundManager.playTap();
  };

  // Complete and Deliver Service -> Calls nailEvaluator!
  const handleCompleteAndDeliver = () => {
    // Calculate gem symmetry if >= 2 charms
    let symmetryGemsPct = 100;
    if (placedCharms.length >= 2) {
      const avgX = placedCharms.reduce((acc, c) => acc + c.x, 0) / placedCharms.length;
      symmetryGemsPct = Math.max(0, Math.min(100, Math.round(100 - Math.abs(avgX - 50) * 3)));
    }

    const actionLog: CustomerActionLog = {
      cleanedDirt: hasCleanedEver && dirtRemaining === 0,
      dirtCleanedPct: nailCond.dirtLevel > 0 ? Math.round(((nailCond.dirtLevel - dirtRemaining) / nailCond.dirtLevel) * 100) : 100,
      removedOldPolish: nailCond.hasOldPolish ? oldPolishRemaining === 0 : true,
      oldPolishRemovedPct: nailCond.hasOldPolish ? Math.round(((80 - oldPolishRemaining) / 80) * 100) : 100,
      pushedCuticles: cuticlePushed,

      trimmedLength: hasTrimmedEver,
      actualLengthPct: nailLength,
      cutTooShort: wasCutTooShort,

      filed: filingProgress > 0,
      filingProgress,
      actualShape,
      symmetryFilingPct: filingProgress >= 80 ? 95 : Math.round(filingProgress * 1.1),

      appliedBaseCoat: hasBaseCoat,
      appliedColor: paintedCoverage > 0,
      actualColorId: actualColorUsed ? actualColorUsed.id : 'none',
      actualColorName: actualColorUsed ? actualColorUsed.name : 'Chưa sơn',
      paintedCoveragePct: paintedCoverage,
      spillCount,
      spillCleanedPct,

      hasFrenchTip: false,
      curedInUV: isCured,

      charmsPlaced: placedCharms,
      symmetryGemsPct,

      appliedTopCoat: hasTopCoat,
      timeSpentSeconds: request.deadlineSeconds - remainingTime,
    };

    // Calculate real report via evaluator engine
    const report = evaluateNailService(request, actionLog, nailCond, trendBonus);

    if (report.isFullPerfect) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      soundManager.playSuccessFanfare();
    } else if (report.stars >= 4) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      soundManager.playSuccessFanfare();
    } else {
      soundManager.playCashRegister();
    }

    onFinishService(report);
  };

  const getNailShapeStyle = () => {
    if (actualShape === 'almond') return 'rounded-t-[60px] rounded-b-[20px]';
    if (actualShape === 'square') return 'rounded-t-[12px] rounded-b-[16px]';
    if (actualShape === 'coffin') return 'rounded-t-[20px] rounded-b-[24px]';
    if (actualShape === 'stiletto') return 'rounded-t-[75px] rounded-b-[16px]';
    if (actualShape === 'oval') return 'rounded-t-[48px] rounded-b-[24px]';
    return 'rounded-t-[36px] rounded-b-[20px]';
  };

  const stepsList: { key: StepType; label: string; icon: string }[] = [
    { key: 'clean', label: '1. Vệ Sinh', icon: '🧼' },
    { key: 'trim', label: '2. Cắt Khóe', icon: '✂️' },
    { key: 'file', label: '3. Dũa Form', icon: '📐' },
    { key: 'base', label: '4. Sơn Lót', icon: '🧴' },
    { key: 'paint', label: '5. Sơn Màu', icon: '💅' },
    { key: 'cure', label: '6. Sấy UV', icon: '💡' },
    { key: 'gems', label: '7. Đính Đá', icon: '💎' },
    { key: 'topcoat', label: '8. Top Coat', icon: '✨' },
  ];

  const getEmotionEmoji = (em: CustomerEmotion) => {
    switch (em) {
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
    <div className="relative w-full flex flex-col flex-1 bg-[#FFF9F6] overflow-hidden select-none">
      {/* Top Customer Queue & Order Bar */}
      <div className="bg-[#652132] text-white p-3 shadow-md border-b border-rose-950/40">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-900/60">
          <button
            onClick={onExit}
            className="flex items-center gap-1 text-xs text-rose-200 hover:text-white px-2 py-0.5 rounded-lg bg-rose-950/60 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tạm dừng</span>
          </button>

          {/* Customer patience progress */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-rose-200">Kiên nhẫn:</span>
            <div className="w-24 h-2 bg-rose-950 rounded-full overflow-hidden border border-rose-800">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  remainingTime > 30 ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, (remainingTime / request.deadlineSeconds) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-amber-200">{remainingTime}s</span>
          </div>
        </div>

        {/* Dynamic Avatar with Live Emotion & Speech */}
        <div className="flex items-start gap-2.5 mt-2.5">
          <div className="relative w-11 h-11 rounded-full bg-rose-100 border-2 border-amber-300 flex items-center justify-center text-sm font-black text-rose-900 shadow-xs flex-shrink-0">
            {customer.name.slice(0, 2)}
            <span className="absolute -bottom-1 -right-1 text-sm">{getEmotionEmoji(emotion)}</span>
          </div>

          <div className="flex-1 bg-white text-rose-950 p-2.5 rounded-2xl rounded-tl-xs shadow-md border border-rose-200 text-xs">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-rose-900">{customer.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded">
                  {customer.role}
                </span>
              </div>
              <button
                onClick={() => setShowBriefCard(!showBriefCard)}
                className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 transition"
              >
                <FileText className="w-3 h-3 text-rose-500" />
                <span>Xem Yêu Cầu</span>
              </button>
            </div>
            <p className="leading-snug text-slate-800 font-medium italic">"{liveSpeech}"</p>
          </div>
        </div>

        {/* Quick Brief Dropdown Card */}
        {showBriefCard && (
          <div className="mt-2.5 p-3 bg-white rounded-2xl border-2 border-rose-300 text-xs text-rose-950 shadow-xl animate-in fade-in space-y-1.5">
            <div className="flex items-center justify-between font-bold text-rose-900 pb-1 border-b border-rose-100">
              <span className="uppercase tracking-wider text-[10px]">Tóm Tắt Yêu Cầu Của {request.customerName}</span>
              <button onClick={() => setShowBriefCard(false)}>
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><strong>Form móng:</strong> <span className="text-rose-700 uppercase">{request.targetShape}</span></div>
              <div><strong>Màu sơn:</strong> <span className="text-rose-700">{request.targetColorName}</span></div>
              <div><strong>Độ dài:</strong> <span className="capitalize">{request.targetLength}</span></div>
              <div><strong>Đá yêu cầu:</strong> {request.requiresGems ? `${request.requestedCharmCount} viên` : 'Tối giản / Không đá'}</div>
            </div>
            <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
              ⚠️ Lưu ý: {request.specialConstraints.join(' · ')}
            </div>
          </div>
        )}
      </div>

      {/* Step Selector Horizontal Bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-rose-100/50 border-b border-rose-200/80 overflow-x-auto">
        {stepsList.map((step) => (
          <button
            key={step.key}
            onClick={() => {
              setCurrentStep(step.key);
              soundManager.playTap();
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 shadow-2xs ${
              currentStep === step.key
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-950 hover:bg-rose-50 border border-rose-200/70'
            }`}
          >
            <span>{step.icon}</span>
            <span>{step.label}</span>
          </button>
        ))}
      </div>

      {/* Main Workstation Interaction Area (Hand & Nail) */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* Luxury Manicure Workstation Desk Background */}
        <img
          src="/src/assets/images/nail_workstation_bg_1790917954887.jpg"
          alt="Bàn làm móng sang trọng"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F1]/80 via-[#FCEAE4]/70 to-[#F7DBD3]/80 pointer-events-none" />

        {/* UV Lamp Glow Overlay when curing */}
        {isCuring && (
          <div className="absolute inset-0 bg-indigo-900/50 z-30 pointer-events-none flex flex-col items-center justify-center backdrop-blur-2xs animate-pulse">
            <div className="w-48 h-48 rounded-full bg-purple-500/30 blur-2xl" />
            <span className="text-white text-sm font-bold mt-4 tracking-wider flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-300 animate-spin" /> ĐANG SẤY ĐÈN UV LED... {curingProgress}%
            </span>
          </div>
        )}

        {/* Hand & Finger Representation */}
        <div className="relative z-10 flex flex-col items-center select-none">
          <div
            className="bg-gradient-to-b from-[#FCD4BC] via-[#F5BFA2] to-[#E9A98C] rounded-t-[60px] shadow-2xl border-2 border-[#E1987B] relative flex flex-col items-center pt-5 transition-all duration-300"
            style={{ width: '136px', height: `${240 + (nailLength - 65) * 0.4}px` }}
          >
            {/* Cuticle crescent highlight */}
            <div className={`w-24 h-6 rounded-t-full mb-1 transition-colors ${cuticlePushed ? 'bg-[#EFA487] opacity-60' : 'bg-[#C27357] opacity-90'}`} />

            {/* Interactive Nail Canvas Container */}
            <div
              ref={nailContainerRef}
              onClick={handleNailContainerClick}
              className={`relative w-24 bg-[#FBECE1] shadow-inner border-2 border-[#D98A6F] overflow-hidden cursor-crosshair transition-all duration-300 ${getNailShapeStyle()}`}
              style={{ height: `${120 + (nailLength - 65) * 0.6}px` }}
            >
              {/* Base Coat Layer */}
              {hasBaseCoat && (
                <div className="absolute inset-0 bg-white/20 pointer-events-none z-10" />
              )}

              {/* Painting Canvas */}
              <canvas
                ref={canvasRef}
                width={200}
                height={300}
                onPointerDown={(e) => {
                  if (currentStep === 'paint') {
                    isPainting.current = true;
                    handlePaintMove(e);
                  }
                }}
                onPointerMove={(e) => {
                  if (currentStep === 'paint') {
                    handlePaintMove(e);
                  }
                }}
                onPointerUp={() => {
                  isPainting.current = false;
                }}
                className="w-full h-full object-cover touch-none"
              />

              {/* Old Chipped Polish Overlay if not cleaned yet */}
              {oldPolishRemaining > 0 && (
                <div
                  onPointerMove={handleWipeMove}
                  className="absolute inset-0 bg-[#A2384A]/60 flex items-center justify-center p-2 text-[10px] text-white font-bold text-center touch-none z-20"
                  style={{ opacity: oldPolishRemaining / 100 }}
                >
                  Sơn cũ ({oldPolishRemaining}%)
                </div>
              )}

              {/* Dust / Dirt Overlay if not cleaned yet */}
              {dirtRemaining > 0 && (
                <div
                  onPointerMove={handleWipeMove}
                  className="absolute inset-0 bg-[#59372B]/40 flex items-center justify-center p-2 text-[10px] text-amber-200 font-bold text-center touch-none z-20"
                  style={{ opacity: dirtRemaining / 100 }}
                >
                  Bụi bẩn ({dirtRemaining}%)
                </div>
              )}

              {/* Placed Gems and Charms with Faceted Rendering */}
              {placedCharms.map((pc) => {
                const charmDef = NAIL_CHARMS.find((c) => c.id === pc.charmId) || NAIL_CHARMS[0];

                return (
                  <div
                    key={pc.id}
                    onClick={(e) => removeCharm(pc.id, e)}
                    style={{
                      left: `${pc.x}%`,
                      top: `${pc.y}%`,
                      transform: `translate(-50%, -50%) rotate(${pc.rotation}deg) scale(${pc.scale})`,
                    }}
                    className="absolute cursor-pointer hover:scale-125 transition-transform drop-shadow-md z-30 group"
                    title="Bấm để gỡ bỏ viên đá này"
                  >
                    <GemstoneGraphic category={charmDef.category} color={charmDef.color} size={28} sparkle />
                  </div>
                );
              })}

              {/* Top Coat Glass Reflection */}
              {(hasTopCoat || isCured) && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-white/10 pointer-events-none rounded-t-full z-40">
                  <div className="absolute top-2 left-2 w-3 h-24 bg-white/50 rounded-full blur-[1px] transform -rotate-6" />
                </div>
              )}
            </div>

            {/* Finger joint lines */}
            <div className="w-20 h-1 bg-[#D98A6F] rounded-full mt-8 opacity-40" />
            <div className="w-16 h-1 bg-[#D98A6F] rounded-full mt-6 opacity-30" />
          </div>

          {/* Flying Filing Dust */}
          {filingDust.map((dust) => (
            <div
              key={dust.id}
              className="absolute w-1.5 h-1.5 bg-white/80 rounded-full pointer-events-none animate-ping"
              style={{ left: dust.x, top: dust.y }}
            />
          ))}
        </div>

        {/* Step-Specific Controls Bar */}
        <div className="relative z-20 w-full max-w-sm mt-3 p-3 bg-white/95 backdrop-blur-xs rounded-2xl border border-rose-200 shadow-lg">
          {/* Step 1: Clean & Prep */}
          {currentStep === 'clean' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-950">
                  🧼 Tẩy sơn cũ & Lau sạch bụi bẩn khóe móng
                </span>
                <span className="font-mono text-rose-600 font-bold">
                  {dirtRemaining === 0 && oldPolishRemaining === 0 ? '✓ Sạch 100%' : 'Chưa sạch'}
                </span>
              </div>
              <div
                onPointerMove={handleWipeMove}
                className="w-full h-12 bg-amber-50/80 rounded-xl border-2 border-dashed border-rose-300 flex items-center justify-center cursor-pointer shadow-inner touch-none text-xs text-rose-900 font-semibold"
              >
                👉 Vuốt ngón tay qua lại trên móng để lau sạch vết dơ
              </div>
            </div>
          )}

          {/* Step 2: Trim & Cuticles */}
          {currentStep === 'trim' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-950">✂️ Cắt ngắn móng & Đẩy da khóe</span>
                <span className="text-[11px] text-rose-700">Độ dài: {nailLength}%</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTrim(65)}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold active:scale-95 transition"
                >
                  Cắt Chuẩn Form (65%)
                </button>
                <button
                  onClick={() => handleTrim(40)}
                  className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold active:scale-95 transition"
                >
                  Cắt Rất Sát
                </button>
                <button
                  onClick={handlePushCuticle}
                  className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold active:scale-95 transition"
                >
                  Đẩy Khóe
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Filing */}
          {currentStep === 'file' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-950">
                  📐 Dũa tạo form {request.targetShape.toUpperCase()}
                </span>
                <span className="font-mono text-rose-600 font-bold">{Math.round(filingProgress)}%</span>
              </div>
              <div
                onPointerDown={(e) => {
                  isDraggingFiler.current = true;
                  lastFilerX.current = e.clientX;
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={handleFilingMove}
                onPointerUp={() => {
                  isDraggingFiler.current = false;
                }}
                className="w-full h-12 bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 rounded-xl border-2 border-dashed border-rose-300 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner touch-none relative overflow-hidden"
              >
                <div className="h-full bg-rose-400/20 absolute left-0 top-0 transition-all" style={{ width: `${filingProgress}%` }} />
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 relative z-10">
                  👉 Vuốt qua lại ở đây để mài dũa form móng
                </span>
              </div>
            </div>
          )}

          {/* Step 4: Base Coat */}
          {currentStep === 'base' && (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-950">Sơn Lót Base Coat Bảo Vệ</h4>
                <p className="text-[11px] text-rose-800/70">Giúp màu bám chắc và ngăn ố vàng móng</p>
              </div>
              <button
                onClick={() => {
                  setHasBaseCoat(true);
                  soundManager.playBrushSound();
                  setEmotion('pleased');
                  setLiveSpeech('Lớp base lót trong suốt bóng mượt rồi nè!');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                  hasBaseCoat ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                {hasBaseCoat ? '✓ Đã Quét Base Coat' : '🧴 Quét Base Coat'}
              </button>
            </div>
          )}

          {/* Step 5: Paint */}
          {currentStep === 'paint' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-950">
                  Phủ sơn: {Math.round(paintedCoverage)}% · Yêu cầu: <span className="text-rose-600">{request.targetColorName}</span>
                </span>
                <button
                  onClick={() => setIsWipeToolActive(!isWipeToolActive)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                    isWipeToolActive ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {isWipeToolActive ? '✓ Đang dùng cồn lau' : '🧹 Lau khóe lem'}
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {NAIL_POLISHES.slice(0, 8).map((polish) => (
                  <button
                    key={polish.id}
                    onClick={() => {
                      setSelectedColor(polish);
                      setIsWipeToolActive(false);
                      soundManager.playTap();
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform shadow-xs flex-shrink-0 relative ${
                      selectedColor.id === polish.id ? 'scale-115 border-rose-600 ring-2 ring-rose-300' : 'border-black/10'
                    }`}
                    style={{ backgroundColor: polish.hex }}
                    title={polish.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 6: UV Cure */}
          {currentStep === 'cure' && (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-950">Sấy Khô Gel Đèn UV LED</h4>
                <p className="text-[11px] text-rose-800/70">
                  {isCured ? '✓ Móng đã khô cứng bóng gương' : 'Bấm nút để đưa tay vào đèn sấy'}
                </p>
              </div>
              <button
                disabled={isCuring || isCured}
                onClick={handleStartCuring}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md hover:brightness-105 active:scale-95 disabled:opacity-50"
              >
                {isCuring ? 'Đang Sấy...' : isCured ? '✓ Đã Sấy Khô' : '⚡ Bật Đèn Sấy'}
              </button>
            </div>
          )}

          {/* Step 7: Gems */}
          {currentStep === 'gems' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-950">
                  Đã đính: {placedCharms.length} viên · Yêu cầu: {request.requiresGems ? `${request.requestedCharmCount} viên` : 'Tối giản'}
                </span>
                <span className="text-[10px] text-slate-500">Chạm lên móng để đính</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {NAIL_CHARMS.slice(0, 8).map((charm) => (
                  <button
                    key={charm.id}
                    onClick={() => {
                      setSelectedCharm(charm);
                      soundManager.playTap();
                    }}
                    className={`px-2 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 flex-shrink-0 ${
                      selectedCharm.id === charm.id
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-rose-950 border-rose-200'
                    }`}
                  >
                    <GemstoneGraphic category={charm.category} color={charm.color} size={18} />
                    <span className="text-[11px] truncate max-w-[80px]">{charm.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Top Coat */}
          {currentStep === 'topcoat' && (
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-950">Phủ Lớp Bóng Kim Cương</h4>
                <p className="text-[11px] text-rose-800/70">Khóa lớp đá và tạo độ bóng gương</p>
              </div>
              <button
                onClick={() => {
                  setHasTopCoat(true);
                  soundManager.playBrushSound();
                  soundManager.playGemClink();
                  setEmotion('happy');
                  setLiveSpeech('Móng sáng loáng như gương luôn chị ơi, 10 điểm!');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                  hasTopCoat ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                {hasTopCoat ? '✓ Đã Phủ Top Coat' : '✨ Phủ Top Coat'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Deliver Button */}
      <div className="p-3 bg-white border-t border-rose-200/80 shadow-lg">
        <button
          onClick={handleCompleteAndDeliver}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:brightness-105 active:scale-98 text-white font-black text-sm font-display shadow-lg flex items-center justify-center gap-2 transition"
        >
          <Check className="w-5 h-5" />
          <span>Hoàn Thành & Giao Móng Cho Khách</span>
        </button>
      </div>
    </div>
  );
};
