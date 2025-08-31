import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;
let universityName;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/" , (req , res) => {
    res.render("index.ejs");
});

app.get("/about" , (req , res) => {
    res.render("about.ejs");
});

app.get("/home" , (req , res) => {
    res.render("index.ejs");
});

app.post("/calculateGPA", (req, res) => {
    universityName = req.body.university;
    console.log("University Name:", universityName);
    const language = req.body.language;
    console.log("Current Language:", language);
    if(universityName === "just") {
        if(language === 'ar') {
            res.render("calc.ejs",{universityName:"لجامعة العلوم والتكنولوجيا الأردنية"});
        }
        else {
            res.render("calc.ejs",{universityName:"for Jordan University of Science and Technology"});
        }
    }
    else if(universityName === "ju") {
        if(language === 'ar') {
            res.render("calc.ejs",{universityName:"للجامعة الأردنية"});
        }
        else {
            res.render("calc.ejs",{universityName:"for University of Jordan"});
        }
    }
    else if(universityName === "yu") {
        if(language === 'ar') {
            res.render("calc.ejs",{universityName:"لجامعة اليرموك"});
        }
        else {
            res.render("calc.ejs",{universityName:"for Yarmouk University"});
        }
    }
    else if(universityName === "bau") {
       if(language === 'ar') {
            res.render("calc.ejs",{universityName:"لجامعة البلقاء التطبيقية"});
        }
        else {
            res.render("calc.ejs",{universityName:"for Al-Balqa' Applied University"});
        }
    }
    else if(universityName === "mu") {
        if(language === 'ar') {
            res.render("calc.ejs",{universityName:"لجامعة مؤتة"});
        }
        else {
            res.render("calc.ejs",{universityName:"for Mutah University"});
        }
    }
});

app.post('/calculateGPAData', (req, res) => {
    const { grades, hours, prevHours, prevGPA ,currentLang } = req.body;
    let currentSemesterTotalHours  = 0;
    let semesterGPA = 0;
    let finalCumulativeGPA = 0;

    if(parseFloat(prevGPA) < 0 || parseInt(prevHours) < 0 || isNaN(parseFloat(prevGPA)) || isNaN(parseInt(prevHours))) {
        if(currentLang === 'en') {
            return res.status(400).json({ error: "Cumulative GPA and Cumulative Hours must be positive numbers." });
        }
        return res.status(400).json({ error: "المعدل التراكمي وعدد الساعات التراكمية يجب أن تكون أرقاماً موجبة." });
    }

    if(universityName === "yu" || universityName === "mu") {
        for(let i=0 ; i<grades.length ; i++) {
                if(isNaN(grades[i]) || grades[i] < 0 || grades[i] > 100) {
                    if(currentLang === 'en') {
                        return res.status(400).json({error: "Please enter valid grades between 0 and 100"});
                    }
                    return res.status(400).json({error: "يرجى إدخال علامات صحيحة بين 0 و 100"});
                }
                if(isNaN(hours[i]) || hours[i] <= 0 || hours[i] > 4) {
                    if(currentLang === 'en') {
                        return res.status(400).json({error: "Please enter valid course hours between 1 and 4"});
                    }
                    return res.status(400).json({error: "يرجى إدخال عدد ساعات صحيح بين 1 و 4"});
                }
        }
    }
    
   if(universityName === "just") {
        currentSemesterTotalHours  = totalHours(hours);
        semesterGPA = calculateJUSTMarks(grades, hours, currentSemesterTotalHours );
        finalCumulativeGPA = ((parseFloat(prevGPA) * parseInt(prevHours)) + (semesterGPA * currentSemesterTotalHours )) / (parseInt(prevHours) + currentSemesterTotalHours );
        res.json({ semesterGPA: semesterGPA.toFixed(2), finalCumulativeGPA: finalCumulativeGPA.toFixed(2) });
   }
   else if(universityName === "ju") {
        currentSemesterTotalHours  = totalHours(hours);
        semesterGPA = calculateJUMarks(grades, hours, currentSemesterTotalHours );
        finalCumulativeGPA = ((parseFloat(prevGPA) * parseInt(prevHours)) + (semesterGPA * currentSemesterTotalHours )) / (parseInt(prevHours) + currentSemesterTotalHours );
        res.json({ semesterGPA: semesterGPA.toFixed(2), finalCumulativeGPA: finalCumulativeGPA.toFixed(2) });
   }
   else if(universityName === "yu") {
        currentSemesterTotalHours  = totalHours(hours);
        semesterGPA = calculateYUMarks(grades, hours, currentSemesterTotalHours );
        finalCumulativeGPA = ((parseFloat(prevGPA) * parseInt(prevHours)) + (semesterGPA * currentSemesterTotalHours )) / (parseInt(prevHours) + currentSemesterTotalHours );
        res.json({ semesterGPA: semesterGPA.toFixed(2), finalCumulativeGPA: finalCumulativeGPA.toFixed(2) });
   }
   else if(universityName === "bau") {
        currentSemesterTotalHours  = totalHours(hours);
        semesterGPA = calculateBAUMarks(grades, hours, currentSemesterTotalHours );
        finalCumulativeGPA = ((parseFloat(prevGPA) * parseInt(prevHours)) + (semesterGPA * currentSemesterTotalHours )) / (parseInt(prevHours) + currentSemesterTotalHours );
        res.json({ semesterGPA: semesterGPA.toFixed(2), finalCumulativeGPA: finalCumulativeGPA.toFixed(2) });
   }
   else if(universityName === "mu") {
        currentSemesterTotalHours  = totalHours(hours);
        semesterGPA = calculateYUMarks(grades, hours, currentSemesterTotalHours );
        finalCumulativeGPA = ((parseFloat(prevGPA) * parseInt(prevHours)) + (semesterGPA * currentSemesterTotalHours )) / (parseInt(prevHours) + currentSemesterTotalHours );
        res.json({ semesterGPA: semesterGPA.toFixed(2), finalCumulativeGPA: finalCumulativeGPA.toFixed(2) });
   }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function calculateJUSTMarks(grades , hours , totalHours) {
    let marks = [];
    let avg = 0;
    let total = 0;
    for(let i=0 ; i<grades.length ; i++) {
        switch (grades[i].toUpperCase()) {
    case 'F':
        marks.push(0.5);
        break;
    case 'D-':
        marks.push(1.5);
        break;
    case 'D':
        marks.push(1.75);
        break;
    case 'D+':
        marks.push(2);
        break;
    case 'C-':
        marks.push(2.25);
        break;
    case 'C':
        marks.push(2.5);
        break;
    case 'C+':
        marks.push(2.75);
        break;
    case 'B-':
        marks.push(3);
        break;
    case 'B':
        marks.push(3.25);
        break;
    case 'B+':
        marks.push(3.5);
        break;
    case 'A-':
        marks.push(3.75);
        break;
    case 'A':
        marks.push(4);
        break;
    case 'A+':
        marks.push(4.2);
        break;
    default:
        marks.push(0);
    }}
    for(let i=0 ; i<marks.length ; i++) {
        total += marks[i] * parseInt(hours[i]);
    }
    avg = total / totalHours;
    return avg;
}

function totalHours(hours) {
    let total = 0;
    for(let i = 0; i < hours.length; i++) {
        total += parseInt(hours[i]);
    }
    return total;
}

function calculateJUMarks(grades , hours , totalHours) {
    let marks = [];
    let avg = 0;
    let total = 0;
    for(let i=0 ; i<grades.length ; i++) {
        switch (grades[i].toUpperCase()) {
    case 'F':
        marks.push(0);
        break;
    case 'D-':
        marks.push(0.75);
        break;
    case 'D':
        marks.push(1);
        break;
    case 'D+':
        marks.push(1.5);
        break;
    case 'C-':
        marks.push(1.75);
        break;
    case 'C':
        marks.push(2);
        break;
    case 'C+':
        marks.push(2.5);
        break;
    case 'B-':
        marks.push(2.75);
        break;
    case 'B':
        marks.push(3);
        break;
    case 'B+':
        marks.push(3.5);
        break;
    case 'A-':
        marks.push(3.75);
        break;
    case 'A':
        marks.push(4);
        break;
    default:
        marks.push(0);
    }}
    for(let i=0 ; i<marks.length ; i++) {
        total += marks[i] * parseInt(hours[i]);
    }
    avg = total / totalHours;
    return avg;
}

function calculateYUMarks(grades , hours , totalHours) {
    let total = 0;
    let avg = 0;
    for(let i=0 ; i<grades.length ; i++) {
        if(!isNaN(parseFloat(grades[i])) && !isNaN(parseInt(hours[i]))) {
            if(parseFloat(grades[i]) > 0 && parseInt(hours[i]) > 0) {
               total += parseFloat(grades[i]) * parseInt(hours[i]);
            }
        }
    }
    avg = total / totalHours;
    return avg; 
}

function calculateBAUMarks(grades , hours , totalHours) {
    let marks = [];
    let avg = 0;
    let total = 0;
    for(let i=0 ; i<grades.length ; i++) {
        switch (grades[i].toUpperCase()) {
    case 'F':
        marks.push(0.5);
        break;
    case 'D-':
        marks.push(0.75);
        break;
    case 'D':
        marks.push(1);
        break;
    case 'D+':
        marks.push(1.5);
        break;
    case 'C-':
        marks.push(1.75);
        break;
    case 'C':
        marks.push(2);
        break;
    case 'C+':
        marks.push(2.5);
        break;
    case 'B-':
        marks.push(2.75);
        break;
    case 'B':
        marks.push(3);
        break;
    case 'B+':
        marks.push(3.5);
        break;
    case 'A-':
        marks.push(3.75);
        break;
    case 'A':
        marks.push(4);
        break;
    default:
        marks.push(0);
    }}
    for(let i=0 ; i<marks.length ; i++) {
        total += marks[i] * parseInt(hours[i]);
    }
    avg = total / totalHours;
    return avg;
}