const heirNotes = {
    husband: {
        withBranch: 'الربع فرضاً لوجود الفرع الوارث',
        withoutBranch: 'النصف فرضاً لعدم وجود الفرع الوارث'
    },
    wife: {
        withBranch: 'الثمن فرضاً لوجود الفرع الوارث',
        withoutBranch: 'الربع فرضاً لعدم وجود الفرع الوارث'
    },
    father: {
        withMaleBranch: 'السدس فرضاً لوجود الفرع الوارث الذكر',
        withFemaleBranch: 'السدس فرضاً والباقي تعصيباً',
        withoutBranch: 'الباقي تعصيباً'
    },
    mother: {
        withBranch: 'السدس فرضاً لوجود الفرع الوارث',
        withoutBranch: 'الثلث فرضاً'
    }
};

function generateLegalNotes(results) {
    const notes = [];
    
    if (results.some(r => r.note?.includes('للذكر مثل حظ الأنثيين'))) {
        notes.push('تم تطبيق قاعدة "للذكر مثل حظ الأنثيين" في التعصيب');
    }
    
    const notesList = document.getElementById('notesList');
    if (notesList) {
        notesList.innerHTML = notes.map(n => `<li>${n}</li>`).join('');
    }
}
