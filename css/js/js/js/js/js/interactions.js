class InteractionManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSpouseToggle();
        this.setupParentCheckboxes();
        this.setupAddHeirButtons();
        this.setupCollapsibleHeaders();
    }

    setupEventListeners() {
        document.getElementById('totalAmount')?.addEventListener('input', updateNetAmount);
        document.getElementById('debts')?.addEventListener('input', updateNetAmount);
        document.getElementById('bequest')?.addEventListener('input', updateNetAmount);
        
        document.querySelectorAll('input[name="gender"]').forEach(input => {
            input.addEventListener('change', () => this.updateSpouseType());
        });
    }

    setupSpouseToggle() {
        const toggle = document.getElementById('hasSpouse');
        const content = document.getElementById('spouseContent');
        
        toggle?.addEventListener('change', () => {
            content.classList.toggle('expanded', toggle.checked);
            if (toggle.checked) this.updateSpouseType();
            this.updateHeirsCount();
        });
    }

    updateSpouseType() {
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        const selector = document.getElementById('spouseSelector');
        const list = document.getElementById('spouseList');
        
        if (gender === 'male') {
            selector.innerHTML = `
                <div class="add-buttons">
                    <button type="button" class="btn-add-heir" onclick="interactionManager.addWife()">
                        <i class="fas fa-plus"></i> إضافة زوجة
                    </button>
                </div>
                <small style="color: var(--text-muted);">يمكن إضافة حتى 4 زوجات</small>
            `;
        } else {
            selector.innerHTML = '';
            list.innerHTML = '';
            this.addHeir('husband', list, 'الزوج');
        }
    }

    addWife() {
        const list = document.getElementById('spouseList');
        const count = list.querySelectorAll('.heir-item').length;
        if (count >= 4) {
            showToast('لا يمكن إضافة أكثر من 4 زوجات', 'warning');
            return;
        }
        this.addHeir('wife', list, `الزوجة ${count + 1}`);
    }

    setupParentCheckboxes() {
        const checkboxes = [
            { id: 'hasFather', details: 'fatherDetails' },
            { id: 'hasMother', details: 'motherDetails' },
            { id: 'hasGrandfather', details: 'grandfatherDetails' },
            { id: 'hasGrandmother', details: 'grandmotherDetails' }
        ];

        checkboxes.forEach(({ id, details }) => {
            document.getElementById(id)?.addEventListener('change', function() {
                document.getElementById(details)?.classList.toggle('visible', this.checked);
                interactionManager.updateHeirsCount();
            });
        });
    }

    setupAddHeirButtons() {
        document.querySelectorAll('.btn-add-heir').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                if (type) this.addHeirByType(type);
            });
        });
    }

    addHeirByType(type) {
        const listMap = {
            son: 'childrenList',
            daughter: 'childrenList',
            fullBrother: 'siblingsList',
            fullSister: 'siblingsList',
            paternalBrother: 'siblingsList',
            paternalSister: 'siblingsList',
            maternalBrother: 'siblingsList',
            maternalSister: 'siblingsList',
            uncle: 'unclesList',
            cousinMale: 'unclesList'
        };
        
        const list = document.getElementById(listMap[type]);
        if (list) {
            const count = list.querySelectorAll(`[data-type="${type}"]`).length + 1;
            this.addHeir(type, list, `${getHeirTypeArabic(type)} ${count}`);
        }
    }

    addHeir(type, list, defaultName) {
        const item = document.createElement('div');
        item.className = 'heir-item muslim';
        item.dataset.type = type;
        
        const icon = ['wife', 'daughter', 'fullSister', 'paternalSister', 'maternalSister', 'mother', 'grandmother'].includes(type) ? 'fa-female' : 'fa-male';
        
        item.innerHTML = `
            <div class="heir-icon"><i class="fas ${icon}"></i></div>
            <div class="heir-info">
                <input type="text" class="heir-name-input" placeholder="${defaultName}">
                <div class="heir-type">${getHeirTypeArabic(type)}</div>
            </div>
            <div class="heir-religion">
                <button type="button" class="active" onclick="this.classList.add('active'); this.nextElementSibling.classList.remove('active'); this.closest('.heir-item').classList.add('muslim'); this.closest('.heir-item').classList.remove('non-muslim');">مسلم</button>
                <button type="button" onclick="this.classList.add('active'); this.previousElementSibling.classList.remove('active'); this.closest('.heir-item').classList.remove('muslim'); this.closest('.heir-item').classList.add('non-muslim');">غير مسلم</button>
            </div>
            <button type="button" class="btn-remove-heir" onclick="this.closest('.heir-item').remove(); interactionManager.updateHeirsCount();"><i class="fas fa-times"></i></button>
        `;
        
        list.appendChild(item);
        this.updateHeirsCount();
    }

    setupCollapsibleHeaders() {
        document.querySelectorAll('.category-header.collapsible').forEach(header => {
            header.addEventListener('click', () => {
                header.classList.toggle('collapsed');
                header.nextElementSibling?.classList.toggle('expanded');
            });
        });
    }

    updateHeirsCount() {
        let total = 0;
        
        if (document.getElementById('hasFather')?.checked) total++;
        if (document.getElementById('hasMother')?.checked) total++;
        if (document.getElementById('hasGrandfather')?.checked) total++;
        if (document.getElementById('hasGrandmother')?.checked) total++;
        
        total += document.querySelectorAll('.heirs-list .heir-item').length;
        
        document.getElementById('totalHeirsCount').textContent = total;
        document.getElementById('eligibleHeirsCount').textContent = document.querySelectorAll('.heirs-list .heir-item.muslim').length + 
            (document.getElementById('hasFather')?.checked ? 1 : 0) +
            (document.getElementById('hasMother')?.checked ? 1 : 0);
        
        // تحديث العدادات
        document.getElementById('childrenCount').textContent = document.querySelectorAll('#childrenList .heir-item').length;
        document.getElementById('siblingsCount').textContent = document.querySelectorAll('#siblingsList .heir-item').length;
        document.getElementById('unclesCount').textContent = document.querySelectorAll('#unclesList .heir-item').length;
    }
}

let interactionManager;
document.addEventListener('DOMContentLoaded', () => {
    interactionManager = new InteractionManager();
});
