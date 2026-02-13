function calculateShare(share, total) {
    return total * (share.value || share);
}

function calculateHusbandShare(heirs, netAmount) {
    const hasBranchHeir = hasBranch(heirs);
    if (hasBranchHeir) {
        return { share: SHARES.QUARTER, amount: netAmount * SHARES.QUARTER.value, note: 'الربع لوجود الفرع الوارث' };
    }
    return { share: SHARES.HALF, amount: netAmount * SHARES.HALF.value, note: 'النصف لعدم وجود الفرع الوارث' };
}

function calculateWifeShare(heirs, netAmount, count = 1) {
    const hasBranchHeir = hasBranch(heirs);
    let share, amount, note;
    
    if (hasBranchHeir) {
        share = SHARES.EIGHTH;
        amount = netAmount * SHARES.EIGHTH.value;
        note = 'الثمن لوجود الفرع الوارث';
    } else {
        share = SHARES.QUARTER;
        amount = netAmount * SHARES.QUARTER.value;
        note = 'الربع لعدم وجود الفرع الوارث';
    }
    
    if (count > 1) note += ` (يقسم بين ${count} زوجات)`;
    return { share, totalAmount: amount, amountPerWife: amount / count, note };
}

function calculateFatherShare(heirs, netAmount) {
    if (hasMaleBranch(heirs)) {
        return { share: SHARES.ONE_SIXTH, amount: netAmount * SHARES.ONE_SIXTH.value, isAsaba: false, note: 'السدس فرضاً لوجود الفرع الوارث الذكر' };
    }
    if (hasBranch(heirs)) {
        return { share: SHARES.ONE_SIXTH, amount: netAmount * SHARES.ONE_SIXTH.value, isAsaba: true, note: 'السدس فرضاً والباقي تعصيباً' };
    }
    return { share: SHARES.RESIDUE, amount: 0, isAsaba: true, note: 'الباقي تعصيباً' };
}

function calculateMotherShare(heirs, netAmount) {
    if (hasBranch(heirs) || hasMultipleSiblings(heirs)) {
        return { share: SHARES.ONE_SIXTH, amount: netAmount * SHARES.ONE_SIXTH.value, note: 'السدس لوجود الفرع الوارث أو جمع من الإخوة' };
    }
    return { share: SHARES.ONE_THIRD, amount: netAmount * SHARES.ONE_THIRD.value, note: 'الثلث لعدم وجود الفرع الوارث' };
}

function calculateDaughterShare(heirs, netAmount, count, hasSons) {
    if (hasSons) {
        return { share: SHARES.RESIDUE, note: 'الباقي تعصيباً مع الأبناء (للذكر مثل حظ الأنثيين)' };
    }
    if (count === 1) {
        return { share: SHARES.HALF, amount: netAmount * SHARES.HALF.value, note: 'النصف للبنت الواحدة' };
    }
    return { share: SHARES.TWO_THIRDS, amount: netAmount * SHARES.TWO_THIRDS.value, note: 'الثلثان للبنات' };
}
