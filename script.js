const subjects = ["English", "Mathematics", "Computer Science", "Physics", "Chemistry"];
let students = []; // each student: { name, scores: [..5 numbers..], total, average }

// ---------- Build the five score inputs and the table header from the subjects array ----------
const scoreInputs = document.querySelector("#scoreInputs");
subjects.forEach(subject => {
  const label = document.createElement("label");
  label.textContent = subject;
  const input = document.createElement("input");
  input.type = "number";
  input.className = "score";
  label.appendChild(input);
  scoreInputs.appendChild(label);
});

const headerRow = document.createElement("tr");
["Name", ...subjects, "Total", "Average", "Grade"].forEach(title => {
  const th = document.createElement("th");
  th.textContent = title;
  headerRow.appendChild(th);
});
document.querySelector("#head").appendChild(headerRow);

// ---------- The main function: turn an average into a grade ----------
function getGrade(average) {
  if (average >= 70) return "A";
  if (average >= 60) return "B";
  if (average >= 50) return "C";
  if (average >= 45) return "D";
  if (average >= 40) return "E";
  return "F";
}

// ---------- Show results ----------
function render() {
  const rows = document.querySelector("#rows");
  rows.innerHTML = "";

  students.forEach(student => {
    const tr = document.createElement("tr");
    const cells = [
      student.name,
      ...student.scores,
      student.total,
      student.average.toFixed(2),
      getGrade(student.average)
    ];
    cells.forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    rows.appendChild(tr);
  });

  document.querySelector("#count").textContent = students.length;
  const insights = document.querySelector("#insights");

  if (students.length === 0) {
    insights.textContent = "Add results to see class insights.";
    return;
  }

  // Highest-scoring student: keep whichever student has the bigger total
  let topStudent = students[0];
  students.forEach(s => {
    if (s.total > topStudent.total) topStudent = s;
  });

  // Subject with the lowest class average
  let lowestSubject = "";
  let lowestAverage = Infinity;
  subjects.forEach((subject, i) => {
    let sum = 0;
    students.forEach(s => { sum += s.scores[i]; });
    const average = sum / students.length;
    if (average < lowestAverage) {
      lowestAverage = average;
      lowestSubject = subject;
    }
  });

  insights.textContent =
    "Highest-scoring student: " + topStudent.name + " (" + topStudent.total + "/500). " +
    "Lowest subject class average: " + lowestSubject + " (" + lowestAverage.toFixed(2) + ").";
}

// ---------- Handle the form ----------
document.querySelector("#form").addEventListener("submit", function (event) {
  event.preventDefault();
  const nameError = document.querySelector("#nameError");
  const scoreError = document.querySelector("#scoreError");
  nameError.textContent = "";
  scoreError.textContent = "";

  const name = document.querySelector("#name").value.trim();
  const values = [...document.querySelectorAll(".score")].map(input => input.value);

  if (name.length < 2) {
    nameError.textContent = "Enter the student's name.";
    return;
  }

  // Every score must be filled in and between 0 and 100
  const bad = values.some(v => v === "" || Number(v) < 0 || Number(v) > 100);
  if (bad) {
    scoreError.textContent = "Enter all five scores, each between 0 and 100.";
    return;
  }

  const scores = values.map(Number);
  let total = 0;
  scores.forEach(score => { total += score; });

  students.push({ name, scores, total, average: total / scores.length });
  event.target.reset();
  render();
});

document.querySelector("#clear").addEventListener("click", function () {
  students = [];
  render();
});

render();
