document.addEventListener("DOMContentLoaded", () => {
  const startPage = document.getElementById("startPage");
  const quizPage = document.getElementById("quizPage");
  const resultPage = document.getElementById("resultPage");
  const startBtn = document.getElementById("startBtn");
  const questionText = document.getElementById("questionText");
  const choicesDiv = document.getElementById("choices");
  const resultText = document.getElementById("resultText");
  const chartCanvas = document.getElementById("resultChart");

  let questions = [];
  let currentQuestionIndex = 0;
  let scores = { E: 0, S: 0, O: 0, C: 0 };
  let chartInstance = null;

  function buildQuestions() {
    return [
      { q: "주말에 친구들이 약속을 잡으면 나는?", a: [
        { text: "적극적으로 나서서 계획을 짠다.", t: "E" },
        { text: "편하게 쉬는 것을 선호한다.", t: "S" },
        { text: "새로운 활동을 제안한다.", t: "O" },
        { text: "일정을 꼼꼼히 확인한다.", t: "C" },
      ]},
      { q: "낯선 상황에서 나는 보통?", a: [
        { text: "사람들과 먼저 이야기한다.", t: "E" },
        { text: "조용히 분위기를 살핀다.", t: "S" },
        { text: "호기심을 갖고 시도한다.", t: "O" },
        { text: "사전에 계획을 세운다.", t: "C" },
      ]},
      { q: "일을 처리할 때 나는?", a: [
        { text: "팀워크로 빠르게 해결한다.", t: "E" },
        { text: "스트레스 관리를 중요시한다.", t: "S" },
        { text: "독창적인 방법을 찾아 시도한다.", t: "O" },
        { text: "체크리스트로 철저히 진행한다.", t: "C" },
      ]},
      { q: "새로운 취미를 고를 때 나는?", a: [
        { text: "친구들과 같이할 수 있는 것을 고른다.", t: "E" },
        { text: "꾸준히 할 수 있는 것을 고른다.", t: "S" },
        { text: "창의적인 것을 시도한다.", t: "O" },
        { text: "체계적으로 배운다.", t: "C" },
      ]},
      { q: "회의에서 의견을 말할 때 나는?", a: [
        { text: "먼저 말하고 토론을 이끈다.", t: "E" },
        { text: "차분히 의견을 낸다.", t: "S" },
        { text: "창의적인 아이디어를 낸다.", t: "O" },
        { text: "근거와 데이터로 논리적으로 말한다.", t: "C" },
      ]}
    ];
  }

  function startQuiz() {
    startPage.style.display = "none";
    quizPage.style.display = "block";
    resultPage.style.display = "none";
    scores = { E: 0, S: 0, O: 0, C: 0 };
    questions = buildQuestions().sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    showQuestion();
  }

  function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
      showResult();
      return;
    }
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.q;
    choicesDiv.innerHTML = "";
    q.a.sort(() => Math.random() - 0.5).forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.onclick = () => {
        scores[choice.t]++;
        currentQuestionIndex++;
        showQuestion();
      };
      choicesDiv.appendChild(btn);
    });
  }

  function showResult() {
    quizPage.style.display = "none";
    resultPage.style.display = "block";
    const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    const type = sorted.map(([k])=>k).slice(0,3).join("");
    resultText.textContent = getTypeDescription(type);

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chartCanvas, {
      type: "radar",
      data: {
        labels: ["E","S","O","C"],
        datasets: [{
          label: "당신의 성향",
          data: [scores.E, scores.S, scores.O, scores.C],
          backgroundColor: "rgba(30,136,229,0.3)",
          borderColor: "rgba(30,136,229,1)",
          borderWidth: 2,
          pointBackgroundColor: "#fff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 5,
            ticks: { stepSize: 1, color: "#ccc" },
            grid: { color: "rgba(255,255,255,0.2)" },
            pointLabels: { color: "#fff", font: { size: 14 } }
          }
        },
        plugins: { legend: { labels: { color: "#fff" } } }
      }
    });
  }

  function getTypeDescription(type) {
    const s = new Set(type.split(""));
    if (s.has("E") && s.has("O") && s.has("C"))
      return "사교적이면서도 창의적이고 체계적인 리더형입니다!";
    if (s.has("E") && s.has("S") && s.has("C"))
      return "신뢰받는 현실주의자형으로, 사람들과의 관계를 중요하게 생각합니다.";
    if (s.has("E") && s.has("O"))
      return "활발하고 아이디어가 풍부한 탐험가형입니다!";
    if (s.has("S") && s.has("C"))
      return "차분하고 책임감 있는 분석가형입니다.";
    if (s.has("O") && s.has("C"))
      return "창의적이면서도 계획적인 혁신가형입니다.";
    if (s.has("E") && s.has("S"))
      return "따뜻하고 인간적인 협력가형으로, 주변에 긍정 에너지를 전파합니다.";
    if (s.has("S") && s.has("O"))
      return "안정 속에서도 새로운 가능성을 찾는 균형 잡힌 실용가형입니다.";
    if (s.has("E") && s.has("C"))
      return "조직적이면서 추진력 있는 실행가형입니다.";
    return "다양한 성향이 조화를 이루는 복합형 인물입니다!";
  }

  startBtn.addEventListener("click", startQuiz);
});