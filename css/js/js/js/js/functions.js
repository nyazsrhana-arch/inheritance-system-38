function formatNumber(num) {
    if (isNaN(num)) return '0.00';
    return parseFloat(num).toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercentage(num) {
    if (isNaN(num)) return '0.000%';
    return parseFloat(num).toLocaleString('ar-SA', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + '%';
}

function updateNetAmount() {
    const total = parseFloat(document.getElementById('totalAmount').value) || 0;
    const debts = parseFloat(document.getElementById('debts').value) || 0;
    const bequest = parseFloat(document.getElementById('bequest').value) || 0;
    
    const maxBequest = (total - debts) / 3;
    let actualBequest = bequest;
    
    if (bequest > maxBequest && maxBequest > 0) {
        actualBequest = maxBequest;
        document.getElementById('bequest').value = maxBequest.toFixed(2);
        showToast('تم تعديل الوصية للحد الأقصى (الثلث)', 'warning');
    }
    
    const net = total - debts - actualBequest;
    document.getElementById('netAmount').textContent = formatNumber(Math.max(0, net)) + ' ر.س';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function collectHeirsData() {
    const heirs = [];
    
    // الأب والأم
    if (document.getElementById('hasFather')?.checked) {
        heirs.push({
            type: 'father',
            name: document.getElementById('fatherName')?.value || 'الأب',
            isMuslim: document.querySelector('input[name="fatherReligion"]:checked')?.value === 'muslim'
        });
    }
    
    if (document.getElementById('hasMother')?.checked) {
        heirs.push({
            type: 'mother',
            name: document.getElementById('motherName')?.value || 'الأم',
            isMuslim: document.querySelector('input[name="motherReligion"]:checked')?.value === 'muslim'
        });
    }
    
    // الورثة الديناميكيين
    document.querySelectorAll('.heirs-list .heir-item').forEach(item => {
        heirs.push({
            type: item.dataset.type,
            name: item.querySelector('.heir-name-input')?.value || getHeirTypeArabic(item.dataset.type),
            isMuslim: item.classList.contains('muslim')
        });
    });
    
    return heirs;
}

function displayResults(data) {
    // تحديث الملخص
    document.getElementById('summaryTotal').textContent = formatNumber(data.summary.totalAmount) + ' ر.س';
    document.getElementById('summaryDeductions').textContent = formatNumber(data.summary.debts + data.summary.bequest) + ' ر.س';
    document.getElementById('summaryNet').textContent = formatNumber(data.summary.netAmount) + ' ر.س';
    document.getElementById('summaryArea').textContent = formatNumber(data.summary.totalArea) + ' م²';
    
    // ملء الجدول
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';
    
    let totalPercentage = 0, totalAmount = 0, totalArea = 0;
    
    data.results.forEach((result, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${result.heir.name}</td>
            <td>${getHeirTypeArabic(result.heir.type)}</td>
            <td>${result.share?.arabic || '-'}</td>
            <td>${formatPercentage(result.percentage)}</td>
            <td>${formatNumber(result.amount)}</td>
            <td>${formatNumber(result.area)}</td>
            <td>${result.note || ''}</td>
        `;
        tbody.appendChild(row);
        
        totalPercentage += result.percentage;
        totalAmount += result.amount;
        totalArea += result.area;
    });
    
    document.getElementById('totalPercentage').textContent = formatPercentage(totalPercentage);
    document.getElementById('totalAmountResult').textContent = formatNumber(totalAmount);
    document.getElementById('totalAreaResult').textContent = formatNumber(totalArea);
}
