document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("language");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const startPage = document.getElementById("start-page");
  const quizPage = document.getElementById("quiz-page");
  const resultPage = document.getElementById("result-page");
  const questionEl = document.getElementById("question");
  const choicesEl = document.getElementById("choices");
  const resultType = document.getElementById("result-type");
  const resultDesc = document.getElementById("result-desc");
  const ctx = document.getElementById("resultChart");

  let currentQuestion = 0;
  let score = { E: 0, S: 0, O: 0, C: 0 };
  let chart = null;
  let currentLang = "ko";

  const questions = [
    {
      text: "주말에 친구들이 약속을 잡으면 나는...",
      choices: [
        { text: "A: 적극적으로 나서서 계획을 짠다.", trait: "E" },
        { text: "B: 편하게 쉬는 것을 선호한다.", trait: "S" },
        { text: "C: 새로운 활동을 제안한다.", trait: "O" },
        { text: "D: 일정이 맞는지 꼼꼼히 확인한다.", trait: "C" },
      ],
    },
    {
      text: "낯선 상황에서 나는 보통...",
      choices: [
        { text: "A: 사람들과 먼저 이야기한다.", trait: "E" },
        { text: "B: 조용히 분위기를 살핀다.", trait: "S" },
        { text: "C: 여러 시도를 해본다.", trait: "O" },
        { text: "D: 사전에 계획을 세운다.", trait: "C" },
      ],
    },
  ];

  const descriptions = {
    E: "외향적이고 활발한 리더형으로, 사람들과 어울릴 때 에너지를 얻습니다.",
    S: "차분하고 신뢰감 있는 현실주의자로, 안정과 조화를 중요하게 생각합니다.",
    O: "새로움과 도전을 즐기는 창의적인 탐험가로, 변화를 두려워하지 않습니다.",
    C: "책임감 있고 체계적인 완벽주의자로, 목표를 향해 꾸준히 나아갑니다.",
  };

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === "ko" ? "ko-KR" : "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function startQuiz() {
    currentLang = langSelect.value;
    startPage.classList.add("hidden");
    quizPage.classList.remove("hidden");
    showQuestion();
    speak("테스트를 시작합니다.");
  }

  function showQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.text;
    choicesEl.innerHTML = "";
    q.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.onclick = () => {
        score[choice.trait]++;
        currentQuestion++;
        if (currentQuestion < questions.length) showQuestion();
        else showResult();
      };
      choicesEl.appendChild(btn);
    });
  }

  function showResult() {
    quizPage.classList.add("hidden");
    resultPage.classList.remove("hidden");

    const result = Object.entries(score).sort((a, b) => b[1] - a[1]);
    const topTrait = result[0][0];
    resultType.textContent = `당신의 주요 성향: ${topTrait}`;
    resultDesc.textContent = descriptions[topTrait];
    speak(descriptions[topTrait]);

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["E", "S", "O", "C"],
        datasets: [
          {
            label: "성향 점수",
            data: [score.E, score.S, score.O, score.C],
            borderColor: "#6c63ff",
            backgroundColor: "rgba(108, 99, 255, 0.3)",
          },
        ],
      },
      options: { scales: { r: { min: 0, max: 5 } } },
    });
  }

  startBtn.addEventListener("click", startQuiz);
  restartBtn.addEventListener("click", () => location.reload());
});
