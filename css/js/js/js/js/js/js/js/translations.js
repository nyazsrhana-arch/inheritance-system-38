const translations = {
    ar: {
        appTitle: 'حاسبة المواريث الشرعية',
        deceasedData: 'بيانات المتوفى',
        heirsData: 'بيانات الورثة',
        results: 'النتائج',
        next: 'التالي',
        previous: 'السابق',
        calculate: 'حساب',
        print: 'طباعة',
        save: 'حفظ',
        newCalculation: 'حساب جديد'
    },
    en: {
        appTitle: 'Islamic Inheritance Calculator',
        deceasedData: 'Deceased Data',
        heirsData: 'Heirs Data',
        results: 'Results',
        next: 'Next',
        previous: 'Previous',
        calculate: 'Calculate',
        print: 'Print',
        save: 'Save',
        newCalculation: 'New Calculation'
    }
};

let currentLang = 'ar';

function changeLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

document.getElementById('languageSelect')?.addEventListener('change', function() {
    changeLanguage(this.value);
});
