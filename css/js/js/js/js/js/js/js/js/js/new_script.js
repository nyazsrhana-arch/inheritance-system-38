document.addEventListener('DOMContentLoaded', function() {
    console.log('حاسبة المواريث الشرعية - تم التحميل بنجاح');
    
    // تهيئة المظهر
    initTheme();
    
    // تحديث صافي التركة
    updateNetAmount();
});

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle?.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? '' : 'dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
}

// تحميل البيانات المحفوظة
function loadSavedData() {
    const saved = localStorage.getItem('inheritanceData');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('deceasedName').value = data.deceased?.name || '';
        document.getElementById('totalAmount').value = data.deceased?.totalAmount || '';
        updateNetAmount();
        showToast('تم استعادة البيانات المحفوظة', 'info');
    }
}

// تصدير النتائج
function exportResults() {
    showToast('جاري تصدير النتائج...', 'info');
}
