let btn = document.querySelector('.btn');
let addField = document.querySelector('.addField');
let count = 3;// Initial number of fields
let maxFields = 18;// Maximum number of fields allowed

const translations = {
    ar: {
        title: "حساب المعدل الفصلي و التراكمي",
        gradePlaceholder: "العلامة",
        hoursPlaceholder: "عدد الساعات",
        addSubject: "إضافة مادة",
        semesterAVG: "المعدل الفصلي",
        cumulativeHours: "عدد الساعات التراكمية السابقة",
        cumulativeGPA: "المعدل التراكمي السابق",
        finalCumulativeGPA: "المعدل التراكمي النهائي",
        calculateGPA: "حساب المعدل",
    },
    en: {
        title: "Semester & Cumulative GPA Calculator",
        gradePlaceholder: "Grade",
        hoursPlaceholder: "Course Hours",
        addSubject: "Add Subject",
        semesterAVG: "Semester GPA",
        cumulativeHours: "Previous Cumulative Hours",
        cumulativeGPA: "Previous Cumulative GPA",
        finalCumulativeGPA: "Final Cumulative GPA",
        calculateGPA: "Calculate GPA",
    }
};

function updateContent(lang) {
    const text = translations[lang];
    const universityNameElement = document.querySelector('.title h1');
    const universityName = universityNameElement.innerHTML.split('<br>')[1];

    universityNameElement.innerHTML = `${text.title} <br> ${universityName}`; 
    const gradeInputs = document.querySelectorAll('input[name="Grade"]');

    gradeInputs.forEach(input => input.placeholder = text.gradePlaceholder);
    const courseHoursSelects = document.querySelectorAll('select[name="courseHours"]');

    courseHoursSelects.forEach(select => select.options[0].textContent = text.hoursPlaceholder);
    document.querySelector('input[type="button"].btn').value = text.addSubject;
    document.querySelector('input[name="semesterAVG"]').placeholder = text.semesterAVG;
    document.querySelector('input[name="cumulativeHours"]').placeholder = text.cumulativeHours;
    document.querySelector('input[name="cumulativeGPA"]').placeholder = text.cumulativeGPA;
    document.querySelector('input[name="finalCumulativeGPA"]').placeholder = text.finalCumulativeGPA;
    document.querySelector('input[type="button"].submit').value = text.calculateGPA;
    document.body.style.direction = (lang === 'ar') ? 'rtl' : 'ltr';
}

// Check for saved language preference on page load
const currentLang = localStorage.getItem('lang') || 'ar';
updateContent(currentLang);

btn.addEventListener('click', () => {
    const currentLang = localStorage.getItem('lang') || 'ar';
    const text = translations[currentLang];

    if (count < maxFields) {
        count++;
        let newField = document.createElement('div');
        newField.innerHTML = `
            <input type="text" name="Grade" placeholder="${text.gradePlaceholder}" required>
            <select name="courseHours">
                <option value="">${text.hoursPlaceholder}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>`;
        addField.appendChild(newField);
    } else {
        if(currentLang === 'en') {
            alert("You have reached the maximum number of subjects");
            return;
        }
        else {
            alert("لقد وصلت للحد الأقصى لعدد المواد");
        }
    }
});
const submitBtn = document.querySelector('.submit');

submitBtn.addEventListener('click', () => {
    const grades = Array.from(document.querySelectorAll('input[name="Grade"]')).map(i => i.value);
    const hours = Array.from(document.querySelectorAll('select[name="courseHours"]')).map(i => i.value);
    let hasEmtyField = false;
    const currentLang = localStorage.getItem('lang') || 'ar';

    for(let i=0 ; i<grades.length ; i++) {
        if(grades[i] === '' || hours[i] === '') {
            hasEmtyField = true;
            break;
        }
    }

    if(hasEmtyField === true) {
        if(currentLang === 'en') {
            alert("Please fill in all grade and course hours fields");
            hasEmtyField = false;
            return;
        }
        else {
            alert("يرجى ملئ جميع الحقول الخاصة بالعلامات و عدد الساعات");
            hasEmtyField = false;
            return;
        }
    }

    const prevHours = document.querySelector('input[name="cumulativeHours"]').value || '';
    const prevGPA = document.querySelector('input[name="cumulativeGPA"]').value || '';

    if(prevHours === '' || prevGPA === ''){
        if(currentLang === 'en') {
            alert("Please fill in all previous cumulative GPA and previous cumulative hours fields");
            return;
        }
        else {
            alert("يرجى ملئ جميع الحقول الخاصة بالمعدل التراكمي السابق و عدد الساعات التراكمية السابقة");
            return;
        }
    }

    axios.post('/calculateGPAData', { grades, hours, prevHours, prevGPA, currentLang })
    .then(res => {
        document.querySelector('input[name="semesterAVG"]').value = res.data.semesterGPA;
        document.querySelector('input[name="finalCumulativeGPA"]').value = res.data.finalCumulativeGPA;
    })
    .catch(
        err => alert(err.response.data.error || "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.")
    );
});