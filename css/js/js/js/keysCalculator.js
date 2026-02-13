class InheritanceCalculator {
    constructor() {
        this.totalAmount = 0;
        this.totalArea = 0;
        this.netAmount = 0;
        this.debts = 0;
        this.bequest = 0;
        this.deceasedGender = 'male';
        this.heirs = [];
        this.results = [];
        this.caseType = 'normal';
        this.notes = [];
    }

    setEstateData(totalAmount, totalArea, debts, bequest) {
        this.totalAmount = parseFloat(totalAmount) || 0;
        this.totalArea = parseFloat(totalArea) || 0;
        this.debts = parseFloat(debts) || 0;
        this.bequest = parseFloat(bequest) || 0;
        
        const maxBequest = (this.totalAmount - this.debts) / 3;
        if (this.bequest > maxBequest) {
            this.bequest = maxBequest;
            this.notes.push('تم تعديل الوصية لتكون الثلث كحد أقصى');
        }
        
        this.netAmount = this.totalAmount - this.debts - this.bequest;
    }

    setDeceasedGender(gender) { this.deceasedGender = gender; }
    setHeirs(heirs) { this.heirs = heirs.filter(h => h.isMuslim !== false); }

    calculate() {
        this.results = [];
        if (this.netAmount <= 0) return this.results;
        
        let remaining = this.netAmount;

        // الزوج/الزوجة
        const husband = this.heirs.find(h => h.type === 'husband');
        if (husband) {
            const result = calculateHusbandShare(this.heirs, this.netAmount);
            this.addResult(husband, result.share, result.amount, result.note);
            remaining -= result.amount;
        }

        const wives = this.heirs.filter(h => h.type === 'wife');
        if (wives.length > 0) {
            const result = calculateWifeShare(this.heirs, this.netAmount, wives.length);
            wives.forEach(wife => {
                this.addResult(wife, result.share, result.amountPerWife, result.note);
            });
            remaining -= result.totalAmount;
        }

        // الأب
        const father = this.heirs.find(h => h.type === 'father');
        if (father) {
            const result = calculateFatherShare(this.heirs, this.netAmount);
            if (!result.isAsaba || result.amount > 0) {
                this.addResult(father, result.share, result.amount, result.note);
                remaining -= result.amount;
            }
        }

        // الأم
        const mother = this.heirs.find(h => h.type === 'mother');
        if (mother) {
            const result = calculateMotherShare(this.heirs, this.netAmount);
            this.addResult(mother, result.share, result.amount, result.note);
            remaining -= result.amount;
        }

        // الأبناء والبنات
        const sons = this.heirs.filter(h => h.type === 'son');
        const daughters = this.heirs.filter(h => h.type === 'daughter');

        if (sons.length > 0 || daughters.length > 0) {
            this.distributeAsaba(sons, daughters, remaining);
        } else if (father && calculateFatherShare(this.heirs, this.netAmount).isAsaba) {
            // الأب يأخذ الباقي
            const fatherResult = this.results.find(r => r.heir.type === 'father');
            if (fatherResult) {
                fatherResult.amount += remaining;
                fatherResult.percentage = (fatherResult.amount / this.netAmount) * 100;
                fatherResult.area = (fatherResult.amount / this.netAmount) * this.totalArea;
            }
        }

        return this.results;
    }

    addResult(heir, share, amount, note) {
        this.results.push({
            heir,
            share,
            percentage: (amount / this.netAmount) * 100,
            amount,
            area: (amount / this.netAmount) * this.totalArea,
            note
        });
    }

    distributeAsaba(sons, daughters, remaining) {
        const sonsCount = sons.length;
        const daughtersCount = daughters.length;

        if (sonsCount > 0 && daughtersCount > 0) {
            const totalShares = (sonsCount * 2) + daughtersCount;
            const shareUnit = remaining / totalShares;

            sons.forEach(son => {
                this.addResult(son, SHARES.RESIDUE, shareUnit * 2, 'الباقي تعصيباً (للذكر مثل حظ الأنثيين)');
            });

            daughters.forEach(daughter => {
                this.addResult(daughter, SHARES.RESIDUE, shareUnit, 'الباقي تعصيباً (للذكر مثل حظ الأنثيين)');
            });
        } else if (sonsCount > 0) {
            const sharePerSon = remaining / sonsCount;
            sons.forEach(son => {
                this.addResult(son, SHARES.RESIDUE, sharePerSon, 'الباقي تعصيباً بالتساوي');
            });
        } else if (daughtersCount > 0) {
            const result = calculateDaughterShare(this.heirs, this.netAmount, daughtersCount, false);
            const sharePerDaughter = result.amount / daughtersCount;
            daughters.forEach(daughter => {
                this.addResult(daughter, result.share, sharePerDaughter, result.note);
            });
        }
    }

    getResults() {
        return {
            results: this.results,
            caseType: this.caseType,
            notes: this.notes,
            summary: {
                totalAmount: this.totalAmount,
                debts: this.debts,
                bequest: this.bequest,
                netAmount: this.netAmount,
                totalArea: this.totalArea
            }
        };
    }
}
