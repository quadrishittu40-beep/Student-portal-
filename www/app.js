import { TRANSCRIPT, SEMESTERS, OUTSTANDING, OUTSTANDING_NOTES, LEVEL_SESSION, LEVEL_LABEL } from "./data.js";

const $ = s => document.querySelector(s);
const POINTS = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
const KEY = "lasu_portal_v2";
const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level"];

function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
const clone = v => JSON.parse(JSON.stringify(v));

const seed = () => ({
  semesters: clone(SEMESTERS),
  extras: [],
  attempts: load("lasu_attempts", []),
});

let state = load(KEY, null);
if (!state || !Array.isArray(state.semesters) || !state.semesters.length) state = seed();
if (!Array.isArray(state.extras)) state.extras = [];
if (!Array.isArray(state.attempts)) state.attempts = [];

const save = () => {
  localStorage.setItem(KEY, JSON.stringify(state));
};

const esc = s =>
  String(s).replace(
    /[&<>"']/g,
    c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- calculations ---------- */

/* Only graded courses carry grade points; pending courses add no GPA weight. */
const totals = courses => {
  const graded = courses.filter(c => c.grade && POINTS[c.grade] !== undefined);
  const units = graded.reduce((n, c) => n + (Number(c.units) || 0), 0);
  const points = graded.reduce((n, c) => n + (Number(c.units) || 0) * POINTS[c.grade], 0);
  return { units, points, gpa: units ? points / units : 0 };
};

const allCourses = () => state.semesters.flatMap(s => s.courses);
const levelCourses = level =>
  state.semesters.filter(s => s.level === level).flatMap(s => s.courses);

/* ---------- navigation ---------- */

function showTab(name) {
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === name));
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "results") renderResults();
}

document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => showTab(b.dataset.tab)));
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.go)));

/* ---------- overview ---------- */

function renderOverview() {
  const overall = totals(allCourses());
  const currentLevel = "300 Level";

  $("#courseCount").textContent = allCourses().length;
  $("#unitCount").textContent = overall.units;
  $("#examCount").textContent = state.attempts.length;
  $("#semCount").textContent = state.semesters.length;
  $("#cgpaRing").textContent = TRANSCRIPT.cgpa.toFixed(2);

  $("#levelTrack").innerHTML = LEVELS.map((level, i) => {
    const done = level === "100 Level" || level === "200 Level";
    const current = level === currentLevel;
    const units = totals(levelCourses(level)).units;
    const cls = current ? "level-box current" : done ? "level-box done" : "level-box";
    const note = units ? `${units} units` : LEVEL_LABEL[level];
    return `<div class="${cls}"><b>${level.replace(" Level", "")}L</b><span>${note}</span></div>`;
  }).join("");

  $("#outstandingList").innerHTML = OUTSTANDING.map(
    c => `<span class="chip chip-warn">${esc(c)}</span>`
  ).join("");
  $("#summaryNotes").innerHTML = OUTSTANDING_NOTES.map(n => `<li>${esc(n)}</li>`).join("");
}

/* ---------- courses ---------- */

function semesterGroups(level) {
  const found = state.semesters.filter(s => s.level === level);
  if (found.length) return found.map(s => ({ ...s, verified: true }));
  return ["First", "Second"].map(sem => ({
    id: `${level}-${sem}`,
    session: LEVEL_SESSION[level],
    level,
    semester: sem,
    verified: false,
    courses: [],
    official: null,
  }));
}

const extrasFor = (level, semester) =>
  state.extras.map((e, i) => ({ ...e, index: i })).filter(e => e.level === level && e.semester === semester);

const courseRow = (c, extraIndex) => {
  const points = c.grade && POINTS[c.grade] !== undefined ? Number(c.units) * POINTS[c.grade] : null;
  const bits = [`${c.units} credit unit${c.units > 1 ? "s" : ""}`];
  if (extraIndex !== undefined) bits.push("added by you");
  if (c.status) bits.push(`status ${c.status}`);
  if (c.grade) bits.push(`grade ${c.grade}`);
  if (points !== null) bits.push(`${points} points`);
  return `<div class="course-item">
    <span class="course-code">${esc(c.code)}</span>
    <div class="course-main">
      ${c.title ? `<strong>${esc(c.title)}</strong>` : `<strong class="course-untitled">${esc(c.code)}</strong>`}
      <small>${esc(bits.join(" • "))}</small>
    </div>
    ${c.grade ? `<span class="grade-pill">${esc(c.grade)}</span>` : `<span class="grade-pill pending">pending</span>`}
    ${extraIndex !== undefined ? `<button class="remove-btn" aria-label="Remove ${esc(c.code)}" data-remove-extra="${extraIndex}">×</button>` : ""}
  </div>`;
};

function renderCourses() {
  const level = $("#levelSelect").value;
  const groups = semesterGroups(level);

  $("#courseList").innerHTML = groups
    .map(g => {
      const extras = extrasFor(level, g.semester);
      const stat = totals(g.courses);
      const off = g.official;
      const chips = off
        ? `<span class="chip">TNU <b>${off.tnu}</b></span>
           <span class="chip">TCP <b>${off.tcp}</b></span>
           <span class="chip">GPA <b>${off.gpa.toFixed(2)}</b></span>
           <span class="chip">CGPA <b>${off.cgpa.toFixed(2)}</b></span>`
        : `<span class="chip">No official record yet</span>`;

      const rows = g.courses.map(c => courseRow(c)).join("") || `<p class="muted">No verified courses in this semester.</p>`;
      const extraRows = extras.map(e => courseRow(e, e.index)).join("");

      return `<section class="sem-card">
        <header class="sem-head">
          <div>
            <span class="eyebrow">${esc(g.session)}</span>
            <h3>${esc(level)} · ${esc(g.semester)} semester</h3>
            <small class="muted">${g.courses.length + extras.length} course${g.courses.length + extras.length === 1 ? "" : "s"} • ${stat.units} units • ${stat.gpa ? stat.gpa.toFixed(2) : "—"} GPA</small>
          </div>
          <div class="chip-row">${chips}</div>
        </header>
        <div class="course-list">${rows}${extraRows}</div>
      </section>`;
    })
    .join("");

  document.querySelectorAll("[data-remove-extra]").forEach(b => {
    b.onclick = () => {
      state.extras.splice(Number(b.dataset.removeExtra), 1);
      save();
      renderCourses();
      renderOverview();
      toast("Course removed");
    };
  });
}

$("#levelSelect").onchange = renderCourses;

$("#addCourseBtn").onclick = () => {
  const code = $("#newCourseCode").value.trim().toUpperCase();
  const title = $("#newCourseTitle").value.trim();
  const units = Number($("#newCourseUnits").value);
  const level = $("#newCourseLevel").value;
  const semester = $("#newCourseSemester").value;

  if (!code || !units || units < 1 || units > 12) {
    return toast("Enter a course code and valid units");
  }

  const grade = $("#newCourseGrade").value;
  state.extras.push({ code, title, units, level, semester, grade, status: "—" });
  save();
  $("#newCourseCode").value = $("#newCourseTitle").value = $("#newCourseUnits").value = "";
  $("#newCourseGrade").value = "";
  $("#levelSelect").value = level;
  renderCourses();
  renderOverview();
  toast(`${code} added to ${level}`);
};

$("#resetBtn").onclick = () => {
  if (!confirm("Remove the courses you added and restore the verified LASU record?")) return;
  const attempts = state.attempts;
  state = seed();
  state.attempts = attempts;
  save();
  renderCourses();
  renderOverview();
  renderResults();
  toast("Verified record restored");
};

/* ---------- results ---------- */

function renderResults() {
  const overall = totals(allCourses());
  $("#cgpaLarge").textContent = overall.gpa.toFixed(2);
  $("#gpaCaption").textContent = `${overall.units} credit units • ${overall.points} grade points • recomputed from your LASU record`;

  $("#recordMeta").innerHTML = [
    ["Name", TRANSCRIPT.name],
    ["Matriculation No.", TRANSCRIPT.matric],
    ["Discipline", TRANSCRIPT.discipline],
    ["Faculty", TRANSCRIPT.faculty],
    ["Year of entry", TRANSCRIPT.yearOfEntry],
    ["Mode of entry", TRANSCRIPT.modeOfEntry],
    ["Standing", TRANSCRIPT.status],
    ["Printed", TRANSCRIPT.printed],
  ]
    .map(([k, v]) => `<div><small>${esc(k)}</small><strong>${esc(v)}</strong></div>`)
    .join("");

  $("#semesterResults").innerHTML = state.semesters
    .map(s => {
      const stat = totals(s.courses);
      const off = s.official || {};
      return `<details class="sem-block">
        <summary>
          <div class="sem-title">
            <strong>${esc(s.session)} · ${esc(s.level)}</strong>
            <small class="muted">${esc(s.semester)} semester • ${s.courses.length} courses • ${stat.units} units</small>
          </div>
          <div class="sem-figures">
            <span>GP <b>${stat.points}</b></span>
            <span>GPA <b>${stat.gpa.toFixed(2)}</b></span>
            <span>CGPA <b>${off.cgpa !== undefined ? off.cgpa.toFixed(2) : "—"}</b></span>
          </div>
        </summary>
        <div class="sem-rows">
          ${s.courses
            .map(
              c => `<div class="sem-row">
                <span class="course-code">${esc(c.code)}</span>
                <span class="sem-units">${c.units}u</span>
                <span class="sem-status">${esc(c.status || "—")}</span>
                <span class="grade-pill">${esc(c.grade)}</span>
                <span class="sem-points">${c.units * POINTS[c.grade]}</span>
              </div>`
            )
            .join("")}
        </div>
      </details>`;
    })
    .join("");

  $("#recordFoot").textContent = `Official cumulative record: ${TRANSCRIPT.ctcp} grade points over ${TRANSCRIPT.ctnu} credit units — CGPA ${TRANSCRIPT.cgpa.toFixed(2)}.`;
}

/* ---------- CBT practice ---------- */

const questions = [
  { q: "How many chapters (Surahs) are in the Holy Qur'an?", o: ["110", "114", "120", "124"], a: 1, e: "The Holy Qur'an contains 114 Surahs." },
  { q: "Which Surah contains the first revealed verses?", o: ["Al-Fatihah", "Al-Alaq", "Al-Ikhlas", "An-Nas"], a: 1, e: "The opening verses of Surah Al-Alaq were the first revelation." },
  { q: "What is the first pillar of Islam?", o: ["Zakat", "Salah", "Shahadah", "Sawm"], a: 2, e: "The Shahadah (declaration of faith) is the first pillar of Islam." },
  { q: "In which month do Muslims observe obligatory fasting?", o: ["Muharram", "Rajab", "Ramadan", "Shawwal"], a: 2, e: "Obligatory fasting is observed during Ramadan." },
  { q: "What is the direction Muslims face during Salah called?", o: ["Mihrab", "Qiblah", "Minbar", "Mimbar"], a: 1, e: "The Qiblah is the direction of the Ka'bah in Makkah." },
];

let qi = 0;
let answers = [];

function renderQuestion() {
  const q = questions[qi];
  $("#questionNumber").textContent = `QUESTION ${qi + 1} OF ${questions.length}`;
  $("#quizProgress").textContent = `${Math.round(((qi + 1) / questions.length) * 100)}%`;
  $("#progressBar").style.width = `${((qi + 1) / questions.length) * 100}%`;
  $("#questionText").textContent = q.q;
  $("#answerOptions").innerHTML = q.o
    .map(
      (v, i) =>
        `<button class="option ${answers[qi] === i ? "selected" : ""}" data-answer="${i}">${String.fromCharCode(65 + i)}. ${v}</button>`
    )
    .join("");
  document.querySelectorAll("[data-answer]").forEach(b => {
    b.onclick = () => {
      answers[qi] = +b.dataset.answer;
      renderQuestion();
      $("#nextQuestion").disabled = false;
    };
  });
  $("#nextQuestion").textContent = qi === questions.length - 1 ? "Finish test" : "Next question →";
  $("#nextQuestion").disabled = answers[qi] === undefined;
}

$("#nextQuestion").onclick = () => {
  if (answers[qi] === undefined) return;
  if (qi < questions.length - 1) {
    qi++;
    renderQuestion();
  } else {
    finishQuiz();
  }
};

function finishQuiz() {
  const score = questions.reduce((n, q, i) => n + (answers[i] === q.a ? 1 : 0), 0);
  state.attempts.unshift({
    date: new Date().toLocaleDateString(),
    score,
    total: questions.length,
  });
  save();
  $("#quizArea").hidden = true;
  $("#quizResult").hidden = false;
  $("#quizResult").innerHTML = `<span class="eyebrow">PRACTICE TEST COMPLETED</span>
    <h2 class="quiz-score">${score}/${questions.length}</h2>
    <p>You scored ${Math.round((score / questions.length) * 100)}%.</p>
    ${questions
      .map(
        (q, i) =>
          `<p class="quiz-answer"><b>${i + 1}. ${esc(q.o[q.a])}</b><br><span class="muted">${esc(q.e)}</span></p>`
      )
      .join("")}`;
  $("#restartQuiz").hidden = false;
  $("#examCount").textContent = state.attempts.length;
}

$("#restartQuiz").onclick = () => {
  qi = 0;
  answers = [];
  $("#quizArea").hidden = false;
  $("#quizResult").hidden = true;
  $("#restartQuiz").hidden = true;
  renderQuestion();
};

/* ---------- install prompt ---------- */

let installPrompt;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  installPrompt = e;
  $("#installBtn").hidden = false;
});
$("#installBtn").onclick = async () => {
  if (installPrompt) {
    installPrompt.prompt();
    installPrompt = null;
  } else {
    toast("Use your browser menu and choose Install app");
  }
};

/* Relative registration so it also works when the app is served from a sub-path.
   Inside the Android WebView the service worker is unnecessary (assets are local). */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register(new URL("sw.js", import.meta.url)).catch(() => {});
}

/* ---------- boot ---------- */

renderOverview();
renderCourses();
renderResults();
renderQuestion();
$("#examCount").textContent = state.attempts.length;
