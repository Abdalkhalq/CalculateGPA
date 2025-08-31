const switchLangBtn = document.querySelector('input[name="switchLanguage"]');
const universitySelect = document.querySelector('select[name="university"]');
const startButton = document.querySelector('input[type="submit"]');
const translations = {
    ar: {
        title: "Calculate GPA.JO <br>لحساب المعدل الفصلي و التراكمي",
        switchLanguage: "Switch language",
        startText: "للبدء اختر الجامعة",
        selectUniversity: "اختر الجامعة",
        startBtn: "إبدأ",
        ju: "الجامعة الأردنية",
        mu: "جامعة مؤتة",
        yu: "جامعة اليرموك",
        bau: "جامعة البلقاء التطبيقية",
        just: "جامعة العلوم والتكنولوجيا",
    },
    en: {
        title: "Calculate GPA.JO <br>Semester & Cumulative GPA Calculator",
        switchLanguage: "تغيير اللغة",
        startText: "To start, choose a university",
        selectUniversity: "Select a university",
        startBtn: "Start",
        ju: "University of Jordan",
        mu: "Mutah University",
        yu: "Yarmouk University",
        bau: "Al-Balqa' Applied University",
        just: "Jordan University of Science and Technology",
    }
};

function updateContent(lang) {
    const text = translations[lang];
    document.querySelector('.title h1').innerHTML = text.title;
    switchLangBtn.value = text.switchLanguage;
    document.querySelector('.container > div p').textContent = text.startText;
    universitySelect.options[0].textContent = text.selectUniversity;
    startButton.value = text.startBtn; 
    document.querySelector('option[value="ju"]').textContent = text.ju;
    document.querySelector('option[value="mu"]').textContent = text.mu;
    document.querySelector('option[value="yu"]').textContent = text.yu;
    document.querySelector('option[value="bau"]').textContent = text.bau;
    document.querySelector('option[value="just"]').textContent = text.just;
    document.body.style.direction = (lang === 'ar') ? 'rtl' : 'ltr';
}

// Check for saved language preference or default to Arabic
const currentLang = localStorage.getItem('lang') || 'ar';
updateContent(currentLang);

switchLangBtn.addEventListener('click', () => {
    const newLang = (localStorage.getItem('lang') === 'ar') ? 'en' : 'ar';
    localStorage.setItem('lang', newLang);
    updateContent(newLang);
});

const form = document.querySelector("form");

form.addEventListener("submit", () => {
  document.getElementById("languageInput").value = localStorage.getItem("lang") || "ar";
});