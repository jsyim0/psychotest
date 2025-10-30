const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const resultPage = document.getElementById('result-page');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionContainer = document.getElementById('question-container');
const resultText = document.getElementById('result-text');
const languageSelect = document.getElementById('language');

const questions = [
  {
    text: "주말에 친구들이 약속을 잡으면 나는…",
    choices: [
      { text: "적극적으로 나서서 계획을 짠다.", trait: "E" },
      { text: "편하게 쉬는 것을 선호한다.", trait: "S" },
      { text: "새로운 활동을 제안한다.", trait: "O" },
      { text: "일정을 꼼꼼히 확인한다.", trait: "C" }
    ]
  },
  {
    text: "일을 처리할 때 나는…",
    choices: [
      { text: "팀워크로 빠르게 해결한다.", trait: "E" },
      { text: "스트레스를 관리하며 진행한다.", trait: "S" },
      { text: "독창적인 방법을 시도한다.", trait: "O" },
      { text: "체크리스트로 진행한다.", trait: "C" }
    ]
  },
  {
    text: "새로운 취미를 고를 때 나는…",
    choices: [
      { text: "친구들과 같이할 수 있는 것을 고른다.", trait: "E" },
      { text: "꾸준히 할 수 있는 것을 고른다.", trait: "S" },
      { text: "색다르고 창의적인 것을 시도한다.", trait: "O" },
      { text: "체계적으로 배울 수 있는 것을 고른다.", trait: "C" }
    ]
  },
  {
    text: "회의에서 의견을 말할 때 나는…",
    choices: [
      { text: "먼저 말하고 토론을 이끈다.", trait: "E" },
      { text: "반응을 보며 차분히 말한다.", trait: "S" },
      { text: "창의적인 아이디어를 낸다.", trait: "O" },
      { text: "근거와 데이터로 논리를 펼친다.", trait: "C" }
    ]
  }
];

let currentQuestion = 0;
let scores = { E: 0, S: 0, O: 0, C: 0 };

function startQuiz() {
  startPage.classList.remove('active');
  quizPage.classList.add('active');
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];
  questionContainer.innerHTML = `
    <h3>${q.text}</h3>
    ${q.choices.map((c, i) =>
      `<button class="choice-btn" onclick="selectAnswer('${c.trait}')">${c.text}</button>`
    ).join('')}
  `;
}

function selectAnswer(trait) {
  scores[trait]++;
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizPage.classList.remove('active');
  resultPage.classList.add('active');
  const ctx = document.getElementById('resultChart');
  const chartData = {
    labels: ['E', 'S', 'O', 'C'],
    datasets: [{
      label: '성향 점수',
      data: [scores.E, scores.S, scores.O, scores.C],
      backgroundColor: 'rgba(99, 102, 241, 0.4)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      pointBackgroundColor: '#818cf8'
    }]
  };

  new Chart(ctx, {
    type: 'radar',
    data: chartData,
    options: {
      scales: {
        r: {
          angleLines: { color: '#333' },
          grid: { color: '#333' },
          pointLabels: { color: '#ccc' },
          ticks: {
            color: '#ccc',
            stepSize: 1,
            backdropColor: 'transparent'
          },
          min: 0,
          max: 5
        }
      },
      plugins: {
        legend: { labels: { color: '#eee' } }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  const topTrait = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const descriptions = {
    E: "외향적이고 활발한 리더형으로, 사람들과 어울릴 때 에너지를 얻습니다.",
    S: "차분하고 안정적인 성향으로, 주변에 신뢰감을 줍니다.",
    O: "창의적이고 호기심이 많은 탐험가형입니다.",
    C: "책임감 있고 철저한 완벽주의자형입니다."
  };

  resultText.innerHTML = `
    <h3>당신의 주요 성향: ${topTrait}</h3>
    <p>${descriptions[topTrait]}</p>
  `;
}

function restartQuiz() {
  currentQuestion = 0;
  scores = { E: 0, S: 0, O: 0, C: 0 };
  resultPage.classList.remove('active');
  startPage.classList.add('active');
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', showQuestion);
restartBtn.addEventListener('click', restartQuiz);
