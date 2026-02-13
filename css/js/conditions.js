const SHARES = {
    HALF: { value: 1/2, arabic: 'النصف', fraction: '1/2' },
    QUARTER: { value: 1/4, arabic: 'الربع', fraction: '1/4' },
    EIGHTH: { value: 1/8, arabic: 'الثمن', fraction: '1/8' },
    TWO_THIRDS: { value: 2/3, arabic: 'الثلثان', fraction: '2/3' },
    ONE_THIRD: { value: 1/3, arabic: 'الثلث', fraction: '1/3' },
    ONE_SIXTH: { value: 1/6, arabic: 'السدس', fraction: '1/6' },
    RESIDUE: { value: 0, arabic: 'الباقي تعصيباً', fraction: 'ع' }
};

const HEIR_TYPES = {
    husband: { arabic: 'زوج', gender: 'male' },
    wife: { arabic: 'زوجة', gender: 'female' },
    father: { arabic: 'أب', gender: 'male' },
    mother: { arabic: 'أم', gender: 'female' },
    grandfather: { arabic: 'جد', gender: 'male' },
    grandmother: { arabic: 'جدة', gender: 'female' },
    son: { arabic: 'ابن', gender: 'male' },
    daughter: { arabic: 'بنت', gender: 'female' },
    grandson: { arabic: 'ابن ابن', gender: 'male' },
    granddaughter: { arabic: 'بنت ابن', gender: 'female' },
    fullBrother: { arabic: 'أخ شقيق', gender: 'male' },
    fullSister: { arabic: 'أخت شقيقة', gender: 'female' },
    paternalBrother: { arabic: 'أخ لأب', gender: 'male' },
    paternalSister: { arabic: 'أخت لأب', gender: 'female' },
    maternalBrother: { arabic: 'أخ لأم', gender: 'male' },
    maternalSister: { arabic: 'أخت لأم', gender: 'female' },
    uncle: { arabic: 'عم', gender: 'male' },
    cousinMale: { arabic: 'ابن عم', gender: 'male' }
};

function hasBranch(heirs) {
    return heirs.some(h => ['son', 'daughter', 'grandson', 'granddaughter'].includes(h.type) && h.isMuslim);
}

function hasMaleBranch(heirs) {
    return heirs.some(h => ['son', 'grandson'].includes(h.type) && h.isMuslim);
}

function hasMultipleSiblings(heirs) {
    const siblings = heirs.filter(h => 
        ['fullBrother', 'fullSister', 'paternalBrother', 'paternalSister', 'maternalBrother', 'maternalSister'].includes(h.type) && h.isMuslim
    );
    return siblings.length >= 2;
}

function getHeirTypeArabic(type) {
    return HEIR_TYPES[type]?.arabic || type;
}
