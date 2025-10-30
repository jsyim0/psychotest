const langSelect = document.getElementById('langSelect');
const startBtn = document.getElementById('startBtn');
const headerControls = document.getElementById('headerControls');
const startBox = document.getElementById('startBox');
const questionCard = document.getElementById('questionCard');
const resultCard = document.getElementById('resultCard');
const questionTitle = document.getElementById('questionTitle');
const choices = document.getElementById('choices');
const progressFill = document.getElementById('progressFill');
const resultTitle = document.getElementById('resultTitle');
const resultSummary = document.getElementById('resultSummary');
const traitDetails = document.getElementById('traitDetails');
const chartWrap = document.getElementById('chartWrap');

let lang = 'ko', qIndex = 0, questions = [], selected = [], scores = {E:0, S:0, O:0, C:0};

// --- 데이터는 길어서 분량 절약을 위해 위 HTML 코드의 DATA 객체 그대로 사용 ---
// (원문 그대로 script.js 상단에 붙여 넣으면 완성됩니다)

function speak(txt) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(txt);
  u.lang = {ko:'ko-KR', en:'en-US', ja:'ja-JP', es:'es-ES'}[lang] || 'en-US';
  u.rate = 1;
  window.speechSynthesis.speak(u);
}

function shuffle(a) {
  return a.map(v => [v, Math.random()]).sort((a, b) => a[1] - b[1]).map(v => v[0]);
}

function startQuiz() {
  headerControls.style.display = 'none';
  startBox.style.display = 'none';
  questionCard.style.display = 'block';
  resultCard.style.display = 'none';
  chartWrap.classList.remove('visible');
  progressFill.style.width = '0%';
  questions = DATA[lang].questions.slice();
  selected = shuffle(questions).slice(0, 5);
  qIndex = 0; scores = {E:0, S:0, O:0, C:0};
  speak(DATA[lang].ttsIntro);
  showQuestion();
}

function showQuestion() {
  const q = selected[qIndex];
  questionTitle.innerText = q.q;
  choices.innerHTML = '';
  q.a.forEach(c => {
    const btn = document.createElement('div');
    btn.className = 'choice';
    btn.innerText = c.text;
    btn.addEventListener('click', () => selectAnswer(c.t));
    choices.appendChild(btn);
  });
  progressFill.style.width = (qIndex / selected.length * 100) + '%';
}

function selectAnswer(t) {
  scores[t]++;
  qIndex++;
  if (qIndex < selected.length) showQuestion();
  else finishQuiz();
}

function renderChart() {
  const ctx = document.getElementById('resultChart');
  const chartData = {
    labels: Object.keys(scores),
    datasets: [{
      label: '점수',
      data: Object.values(scores),
      fill: true,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.2)',
      pointBackgroundColor: '#6366f1'
    }]
  };
  new Chart(ctx, { type: 'radar', data: chartData, options: { scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } } } });
}

function finishQuiz() {
  questionCard.style.display = 'none';
  resultCard.style.display = 'block';
  progressFill.style.width = '100%';
  const d = DATA[lang];
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topMain = sorted[0][0];
  const top3 = sorted.slice(0, 3).map(s => s[0]).join('');
  resultTitle.innerText = d.labels[topMain];
  resultSummary.innerText = `${d.traits[topMain]} (${top3})`;
  traitDetails.innerHTML = Object.entries(d.traits)
    .map(([k, v]) => `<div style="margin:6px 0;padding:8px;border-radius:8px;background:#f8fafc">
      <strong>${k}</strong> — ${v} <span style="float:right;font-weight:700">${scores[k]}</span></div>`).join('');
  renderChart();
  chartWrap.classList.add('visible');
  speak(d.ttsFinish + ' ' + d.traits[topMain]);
}

document.getElementById('restartBtn').addEventListener('click', () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  chartWrap.classList.remove('visible');
  location.reload();
});
startBtn.addEventListener('click', startQuiz);
