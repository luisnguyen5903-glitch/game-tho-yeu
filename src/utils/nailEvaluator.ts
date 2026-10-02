import {
  CustomerRequest,
  CustomerActionLog,
  EvaluationReport,
  CustomerEmotion,
  NailCondition,
} from '../types/game';

export function evaluateNailService(
  request: CustomerRequest,
  actionLog: CustomerActionLog,
  initialCondition: NailCondition,
  trendBonusPercent: number = 0
): EvaluationReport {
  const penalties: { reason: string; points: number }[] = [];
  const praises: string[] = [];
  const criticisms: string[] = [];
  const improvements: string[] = [];
  const milestones: string[] = [];

  // --- 1. CLEANING & PREP (Weight 15%) ---
  let cleanScore = 0;
  const neededCleaning = initialCondition.dirtLevel > 0 || initialCondition.hasOldPolish;

  if (neededCleaning) {
    const dirtDone = actionLog.dirtCleanedPct;
    const polishDone = initialCondition.hasOldPolish ? actionLog.oldPolishRemovedPct : 100;
    const avgClean = Math.round((dirtDone + polishDone) / 2);

    cleanScore = avgClean;

    if (cleanScore >= 95) {
      milestones.push('PERFECT CLEAN');
      praises.push('Vệ sinh móng và khóe da sạch tinh tươm, không còn tì vết.');
    } else if (cleanScore < 40) {
      penalties.push({ reason: 'Bỏ qua bước vệ sinh bụi bẩn / tẩy sơn cũ', points: 15 });
      criticisms.push('Móng còn bám bụi dơ và sơn cũ chưa được vệ sinh sạch sẽ.');
      improvements.push('Hãy dùng miếng bông cồn vuốt kỹ để làm sạch toàn bộ vết dơ trước khi sơn.');
    }
  } else {
    // Already clean
    cleanScore = 100;
  }

  // --- 2. TRIMMING & CUTICLES (Weight 10%) ---
  let trimScore = 0;
  if (actionLog.trimmedLength) {
    if (actionLog.cutTooShort) {
      trimScore = 30;
      penalties.push({ reason: 'Cắt móng quá sát làm đau tay khách', points: 15 });
      criticisms.push('Cắt móng phạm quá sâu vào thịt làm khách bị đau.');
      improvements.push('Căn chỉnh mức cắt móng vừa phải, tránh cắt quá sát làm tổn thương tay.');
    } else {
      trimScore = 90;
      if (actionLog.pushedCuticles) {
        trimScore = 100;
        praises.push('Khóe móng được đẩy gọn gàng, độ dài móng rất chuẩn tỉ lệ.');
      }
    }
  } else {
    // Didn't trim
    if (initialCondition.excessLength > 50) {
      trimScore = 20;
      penalties.push({ reason: 'Móng dài không đều nhưng chưa cắt tỉa', points: 10 });
      criticisms.push('Móng tay khách dài không đều nhưng bạn không cắt chỉnh.');
      improvements.push('Kiểm tra độ dài móng của khách và cắt bớt phần thừa trước khi dũa.');
    } else {
      trimScore = 80;
    }
  }

  // --- 3. FORM & FILING (Weight 20%) ---
  let fileScore = 0;
  const isShapeMatched = actionLog.actualShape === request.targetShape;

  if (actionLog.filed && actionLog.filingProgress > 0) {
    if (isShapeMatched) {
      fileScore = Math.min(100, Math.round(actionLog.filingProgress * 1.05));
      if (fileScore >= 90) {
        milestones.push('PERFECT SHAPE');
        praises.push(`Dũa form ${request.targetShape.toUpperCase()} hai bên cân đối và sắc nét.`);
      }
    } else {
      // Wrong shape created
      fileScore = Math.max(10, Math.round(actionLog.filingProgress * 0.4));
      penalties.push({
        reason: `Dũa sai dáng móng (Yêu cầu: ${request.targetShape.toUpperCase()} · Thực tế: ${actionLog.actualShape.toUpperCase()})`,
        points: 20,
      });
      criticisms.push(
        `Khách yêu cầu form ${request.targetShape.toUpperCase()} nhưng bạn lại dũa ra dáng ${actionLog.actualShape.toUpperCase()}.`
      );
      improvements.push(`Chú ý dũa theo đường viền silhouette của form ${request.targetShape.toUpperCase()}.`);
    }
  } else {
    // Did not file at all!
    fileScore = 0;
    penalties.push({ reason: 'Không thực hiện dũa tạo form móng', points: 20 });
    criticisms.push(`Bạn hoàn toàn bỏ qua bước dũa form ${request.targetShape.toUpperCase()} cho khách.`);
    improvements.push('Cầm dũa mài đều hai bên mép móng để tạo đúng dáng khách yêu cầu.');
  }

  // --- 4. PAINT COVERAGE & FINISH (Weight 25%) ---
  let paintScore = 0;
  const isColorMatched = actionLog.actualColorId === request.targetColorId;

  if (actionLog.appliedColor && actionLog.paintedCoveragePct > 0) {
    let baseCoverage = actionLog.paintedCoveragePct;

    if (!isColorMatched) {
      penalties.push({
        reason: `Dùng sai màu sơn (Yêu cầu: ${request.targetColorName} · Thực tế: ${actionLog.actualColorName})`,
        points: 25,
      });
      criticisms.push(
        `Khách dặn sơn màu "${request.targetColorName}" nhưng bạn lại dùng màu "${actionLog.actualColorName}".`
      );
      improvements.push(`Luôn xem lại bảng yêu cầu màu sơn trước khi nhúng cọ.`);
      baseCoverage = Math.round(baseCoverage * 0.4);
    } else {
      praises.push(`Màu sơn ${request.targetColorName} chuẩn tone và độ bóng mướt.`);
    }

    if (actionLog.spillCount > 0 && actionLog.spillCleanedPct < 80) {
      penalties.push({ reason: 'Sơn bị lem ra viền khóe da chưa lau sạch', points: 15 });
      criticisms.push('Nước sơn bị lem ra viền khóe thịt quanh móng chưa được xử lý.');
      improvements.push('Dùng đầu cọ cồn lau khóe sạch sẽ nếu lỡ tay quét sơn lem ra ngoài.');
      baseCoverage = Math.max(20, baseCoverage - 20);
    }

    if (!actionLog.appliedBaseCoat) {
      penalties.push({ reason: 'Bỏ qua lớp sơn lót Base Coat', points: 10 });
      criticisms.push('Chưa quét sơn lót Base Coat bảo vệ móng trước khi sơn màu.');
    }

    if (!actionLog.curedInUV) {
      penalties.push({ reason: 'Chưa sấy khô đèn UV LED', points: 10 });
      criticisms.push('Lớp gel chưa được đưa vào đèn UV LED để sấy khô và khóa màu.');
    }

    paintScore = Math.min(100, baseCoverage);

    if (isColorMatched && paintScore >= 90 && actionLog.spillCleanedPct >= 90) {
      milestones.push('PERFECT COAT');
    }
  } else {
    // Did not paint at all!
    paintScore = 0;
    penalties.push({ reason: 'Không thực hiện sơn màu cho móng', points: 25 });
    criticisms.push('Bạn chưa sơn móng cho khách hàng!');
    improvements.push('Quét cọ đều tay từ chân móng lên đầu móng để phủ kín bề mặt.');
  }

  // --- 5. GEMS & ARTWORK (Weight 15%) ---
  let gemScore = 0;
  const charmCount = actionLog.charmsPlaced.length;

  if (request.requiresGems) {
    if (charmCount === 0) {
      gemScore = 0;
      penalties.push({ reason: `Chưa đính đá theo yêu cầu (${request.requestedCharmCount} viên)`, points: 15 });
      criticisms.push(`Khách yêu cầu đính ${request.requestedCharmCount} viên đá nhưng móng chưa có viên nào.`);
      improvements.push('Dùng nhíp gắp đá đặt lên móng theo đúng số lượng yêu cầu.');
    } else {
      // Check count matching
      const countDiff = Math.abs(charmCount - request.requestedCharmCount);
      if (countDiff === 0) {
        gemScore = 90;
        if (request.requiresSymmetry) {
          if (actionLog.symmetryGemsPct >= 75) {
            gemScore = 100;
            milestones.push('PERFECT PLACEMENT');
            praises.push('Các viên đá được đính đối xứng chuẩn xác và sáng lấp lánh.');
          } else {
            gemScore = 75;
            penalties.push({ reason: 'Vị trí đính đá bị lệch, chưa đối xứng', points: 8 });
            criticisms.push('Khách thích đính đá đối xứng nhưng các viên đá lại đặt bị lệch nhau.');
            improvements.push('Căn chỉnh vị trí các viên đá cân đối giữa trục móng trước khi phủ bóng.');
          }
        } else {
          gemScore = 100;
          milestones.push('PERFECT PLACEMENT');
        }
      } else if (countDiff <= 1) {
        gemScore = 70;
      } else {
        gemScore = 40;
        penalties.push({ reason: 'Số lượng đá đính quá nhiều hoặc quá ít so với yêu cầu', points: 10 });
        criticisms.push(`Khách chỉ muốn ${request.requestedCharmCount} viên đá nhưng bạn đính ${charmCount} viên.`);
      }
    }
  } else {
    // Customer requested minimal / NO gems
    if (charmCount > 3) {
      gemScore = 40;
      penalties.push({ reason: 'Khách thích tối giản nhưng lại đính quá nhiều đá', points: 15 });
      criticisms.push('Khách chuộng phong cách tối giản nhưng bạn lại đính đá quá rườm rà.');
      improvements.push('Tôn trọng phong cách tối giản của khách, tránh đính đá khi không được yêu cầu.');
    } else {
      gemScore = 100;
      praises.push('Móng giữ được nét thanh lịch tối giản đúng gu của khách.');
    }
  }

  // --- 6. STRICT COMPLIANCE & FINISH (Weight 15%) ---
  let complianceScore = 100;
  if (!isShapeMatched) complianceScore -= 30;
  if (!isColorMatched) complianceScore -= 40;
  if (!actionLog.appliedTopCoat) {
    complianceScore -= 20;
    penalties.push({ reason: 'Chưa phủ lớp bóng kim cương Top Coat', points: 10 });
    criticisms.push('Chưa quét Top Coat khiến móng thiếu độ bóng gương và dễ trầy xước.');
    improvements.push('Luôn kết thúc bằng một lớp sơn bóng Top Coat để bảo vệ bề mặt.');
  }
  complianceScore = Math.max(0, complianceScore);

  // --- CALCULATE TOTAL WEIGHTED SCORE (Zero Floor Score) ---
  const rawWeightedScore =
    cleanScore * 0.15 +
    trimScore * 0.10 +
    fileScore * 0.20 +
    paintScore * 0.25 +
    gemScore * 0.15 +
    complianceScore * 0.15;

  let totalScore = Math.max(0, Math.min(100, Math.round(rawWeightedScore)));

  // Apply strict customer tolerance margin penalty
  // If customer is strict/VIP and score has minor deviations, amplify slightly
  if (request.toleranceErrorMargin <= 0.05 && totalScore < 90) {
    totalScore = Math.max(0, totalScore - 5);
  }

  // --- STARS CALCULATION (Strict Rules - Section 7) ---
  let stars = 1;
  if (totalScore >= 90 && isColorMatched && isShapeMatched && penalties.length <= 1) {
    stars = 5;
  } else if (totalScore >= 75) {
    stars = 4;
  } else if (totalScore >= 60) {
    stars = 3;
  } else if (totalScore >= 40) {
    stars = 2;
  } else {
    stars = 1;
  }

  // Check Full Perfect
  const isFullPerfect = totalScore >= 97 && milestones.length >= 3 && penalties.length === 0;

  // --- CUSTOMER REACTION & DIALOGUE ---
  let customerReactionEmotion: CustomerEmotion = 'calm';
  let customerReactionDialogue = '';

  if (isFullPerfect) {
    customerReactionEmotion = 'happy';
    customerReactionDialogue = `Trời ơi kiệt tác xuất sắc! Từ dáng ${request.targetShape.toUpperCase()}, nước sơn ${request.targetColorName} đến độ sáng bóng đều hoàn hảo 100 điểm!`;
  } else if (stars === 5) {
    customerReactionEmotion = 'happy';
    customerReactionDialogue = `Ôi ưng ý quá em ơi! Đúng chuẩn form và màu chị thích, làm kỹ lưỡng không lem tí nào. Chị thưởng thêm tiền tip nha!`;
  } else if (stars === 4) {
    customerReactionEmotion = 'pleased';
    customerReactionDialogue = `Bộ móng nhìn xinh xắn lắm em. Có một vài chi tiết nhỏ chưa chuẩn 100% nhưng tổng thể vẫn rất đẹp, cảm ơn em!`;
  } else if (stars === 3) {
    customerReactionEmotion = 'worried';
    customerReactionDialogue = `Ừm... cũng được em ạ, nhưng chưa đúng gu chị lắm. ${criticisms[0] || 'Lần sau em làm kỹ hơn nhé.'}`;
  } else if (stars === 2) {
    customerReactionEmotion = 'annoyed';
    customerReactionDialogue = `Chị thấy không ổn rồi em ơi. ${criticisms[0] || 'Bộ móng khác xa so với những gì chị đã dặn.'}`;
  } else {
    customerReactionEmotion = 'hurt';
    customerReactionDialogue = `Ủa em ơi sao móng chưa làm xong đã giao cho chị rồi? Thất vọng ghê!`;
  }

  // --- ECONOMY CALCULATION BASED ON REAL QUALITY (Section 21) ---
  // Quality percentage multiplier:
  // 60 pts -> 70% money
  // 80 pts -> 100% money
  // 90 pts -> 120%
  // 95+ pts -> 150%
  // <40 pts -> 30% money
  let payMultiplier = 1.0;
  if (totalScore >= 95) payMultiplier = 1.5;
  else if (totalScore >= 90) payMultiplier = 1.25;
  else if (totalScore >= 80) payMultiplier = 1.0;
  else if (totalScore >= 60) payMultiplier = 0.75;
  else if (totalScore >= 40) payMultiplier = 0.45;
  else payMultiplier = 0.2;

  let earnedBaseMoney = Math.round(request.baseReward * payMultiplier);
  let earnedTipMoney = 0;

  if (stars === 5) {
    earnedTipMoney = Math.round(request.baseReward * 0.25);
  } else if (stars === 4) {
    earnedTipMoney = Math.round(request.baseReward * 0.1);
  }

  if (trendBonusPercent > 0 && isColorMatched) {
    earnedTipMoney += Math.round(request.baseReward * (trendBonusPercent / 100));
  }

  const earnedXp = Math.round(totalScore * 0.8) + (stars >= 4 ? 25 : 5);
  const affinityDelta = stars === 5 ? 12 : stars === 4 ? 6 : stars === 3 ? 1 : stars === 2 ? -5 : -12;

  // Fallback improvement tips if needed
  if (improvements.length === 0) {
    improvements.push('Duy trì tay nghề ổn định và căn chỉnh đá thật đều.');
  }

  return {
    totalScore,
    stars,
    isFullPerfect,
    milestones,
    breakdown: {
      cleanScore,
      trimScore,
      fileScore,
      paintScore,
      gemScore,
      complianceScore,
    },
    penalties,
    praises,
    criticisms,
    improvements: improvements.slice(0, 3),
    customerReactionDialogue,
    customerReactionEmotion,
    earnedBaseMoney,
    earnedTipMoney,
    earnedXp,
    affinityDelta,
  };
}
