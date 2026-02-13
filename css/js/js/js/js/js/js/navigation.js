class NavigationManager {
    constructor() {
        this.currentTab = 'deceased';
        this.tabs = ['deceased', 'heirs', 'results'];
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupNavButtons();
        this.setupResultButtons();
        this.updateProgress();
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    setupNavButtons() {
        document.getElementById('btnNext')?.addEventListener('click', () => this.goNext());
        document.getElementById('btnPrev')?.addEventListener('click', () => this.goPrev());
    }

    setupResultButtons() {
        document.getElementById('btnNewCalculation')?.addEventListener('click', () => this.newCalculation());
        document.getElementById('btnPrint')?.addEventListener('click', () => window.print());
        document.getElementById('btnSave')?.addEventListener('click', () => this.saveData());
    }

    switchTab(tabId) {
        if (tabId === 'results' && !this.validateAll()) return;
        if (tabId === 'results') this.calculateResults();
        
        this.currentTab = tabId;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}Tab`);
        });
        
        this.updateNavButtons();
        this.updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    goNext() {
        const idx = this.tabs.indexOf(this.currentTab);
        if (this.currentTab === 'deceased' && !this.validateDeceased()) return;
        if (this.currentTab === 'heirs' && !this.validateHeirs()) return;
        if (idx < this.tabs.length - 1) this.switchTab(this.tabs[idx + 1]);
    }

    goPrev() {
        const idx = this.tabs.indexOf(this.currentTab);
        if (idx > 0) this.switchTab(this.tabs[idx - 1]);
    }

    validateDeceased() {
        const name = document.getElementById('deceasedName').value.trim();
        const amount = parseFloat(document.getElementById('totalAmount').value) || 0;
        
        if (!name) { showToast('الرجاء إدخال اسم المتوفى', 'error'); return false; }
        if (amount <= 0) { showToast('الرجاء إدخال مبلغ التركة', 'error'); return false; }
        return true;
    }

    validateHeirs() {
        const heirs = collectHeirsData();
        if (heirs.length === 0) { showToast('الرجاء إضافة وريث واحد على الأقل', 'error'); return false; }
        return true;
    }

    validateAll() {
        return this.validateDeceased() && this.validateHeirs();
    }

    calculateResults() {
        const calculator = new InheritanceCalculator();
        
        calculator.setEstateData(
            document.getElementById('totalAmount').value,
            document.getElementById('totalArea').value,
            document.getElementById('debts').value,
            document.getElementById('bequest').value
        );
        
        calculator.setDeceasedGender(document.querySelector('input[name="gender"]:checked').value);
        calculator.setHeirs(collectHeirsData());
        calculator.calculate();
        
        displayResults(calculator.getResults());
    }

    updateNavButtons() {
        const idx = this.tabs.indexOf(this.currentTab);
        document.getElementById('btnPrev').disabled = idx === 0;
        
        const nextBtn = document.getElementById('btnNext');
        if (idx === this.tabs.length - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'inline-flex';
            nextBtn.innerHTML = idx === this.tabs.length - 2 
                ? '<span>حساب النتائج</span><i class="fas fa-calculator"></i>'
                : '<span>التالي</span><i class="fas fa-arrow-left"></i>';
        }
    }

    updateProgress() {
        const progress = ((this.tabs.indexOf(this.currentTab) + 1) / this.tabs.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    newCalculation() {
        if (confirm('هل أنت متأكد من مسح جميع البيانات؟')) {
            location.reload();
        }
    }

    saveData() {
        const data = {
            deceased: {
                name: document.getElementById('deceasedName').value,
                gender: document.querySelector('input[name="gender"]:checked').value,
                totalAmount: document.getElementById('totalAmount').value,
                debts: document.getElementById('debts').value,
                bequest: document.getElementById('bequest').value
            },
            heirs: collectHeirsData()
        };
        localStorage.setItem('inheritanceData', JSON.stringify(data));
        showToast('تم حفظ البيانات بنجاح', 'success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});
