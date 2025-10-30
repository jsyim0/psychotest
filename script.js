document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang");
  const startBtn = document.getElementById("startBtn");
  const startBox = document.getElementById("startBox");
  const questionBox = document.getElementById("questionBox");
  const resultBox = document.getElementById("resultBox");
  const questionText = document.getElementById("questionText");
  const choicesDiv = document.getElementById("choices");
  const nextBtn = document.getElementById("nextBtn");
  const resultType = document.getElementById("resultType");
  const resultDesc = document.getElementById("resultDesc");
  const chartWrap = document.getElementById("chartWrap");
  const ctx = document.getElementById("resultChart");

  let currentLang = "ko";
  const languages = ["ko", "en", "ja", "fr", "es", "zh"];
  const userLang = (navigator.language || "ko").slice(0, 2);
  if (languages.includes(userLang)) currentLang = userLang;
  langSelect.value = currentLang;

  const quizData = {
    ko: {
      questions: [
        "주말에 친구들이 약속을 잡으면 나는?",
        "낯선 상황에서 나는 보통?",
        "일을 처리할 때 나는?",
        "새로운 취미를 고를 때 나는?",
        "회의에서 의견을 말할 때 나는?",
      ],
      choices: [
        ["적극적으로 계획을 짠다 (E)", "편하게 쉰다 (S)", "새로운 활동을 제안한다 (O)", "일정을 꼼꼼히 확인한다 (C)"],
        ["먼저 이야기한다 (E)", "조용히 분위기를 살핀다 (S)", "여러 시도를 해본다 (O)", "사전 계획을 세운다 (C)"],
        ["팀워크로 해결한다 (E)", "스트레스 관리를 중시한다 (S)", "독창적 방법을 쓴다 (O)", "체크리스트로 진행한다 (C)"],
        ["함께할 수 있는 걸 고른다 (E)", "꾸준히 할 수 있는 걸 고른다 (S)", "창의적 걸 시도한다 (O)", "체계적으로 배운다 (C)"],
        ["먼저 말한다 (E)", "차분히 말한다 (S)", "창의적 아이디어를 낸다 (O)", "근거로 논리를 펼친다 (C)"],
      ],
      traits: ["E", "S", "O", "C"],
      desc: {
        E: "사교적이고 활발하며 리더십이 있는 외향형",
        S: "차분하고 신뢰감 있는 안정형",
        O: "호기심 많고 창의적인 개방형",
        C: "체계적이고 성실한 완벽주의자형",
      },
      ttsStart: "심리테스트를 시작합니다.",
      ttsFinish: "결과를 확인해보세요.",
    },
    en: {
      questions: [
        "When friends make weekend plans, I usually…",
        "In unfamiliar situations, I tend to…",
        "When handling tasks, I…",
        "When choosing a new hobby, I…",
        "During meetings, I usually…",
      ],
      choices: [
        ["Take the lead in planning (E)", "Prefer to relax (S)", "Propose new ideas (O)", "Double-check schedules (C)"],
        ["Talk to people first (E)", "Observe quietly (S)", "Experiment with curiosity (O)", "Plan ahead carefully (C)"],
        ["Work as a team (E)", "Manage stress carefully (S)", "Find creative methods (O)", "Follow a checklist (C)"],
        ["Choose activities with friends (E)", "Prefer steady habits (S)", "Try something creative (O)", "Learn systematically (C)"],
        ["Speak up first (E)", "Speak calmly (S)", "Share creative ideas (O)", "Present data-backed logic (C)"],
      ],
      traits: ["E", "S", "O", "C"],
      desc: {
        E: "Outgoing and energetic leader type.",
        S: "Calm and reliable stabilizer.",
        O: "Curious and creative explorer.",
        C: "Organized and diligent perfectionist.",
      },
      ttsStart: "Starting the personality test.",
      ttsFinish: "Check your results.",
    },
  };

  let currentQuestion = 0;
  let scores = { E: 0, S: 0, O: 0, C: 0 };

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentLang === "zh" ? "zh-CN" : currentLang;
    window.speechSynthesis.speak(utter);
  }

  function startQuiz() {
    startBox.style.display = "none";
    questionBox.style.display = "block";
    startBtn.style.display = "none";
    langSelect.disabled = true;
    chartWrap.classList.remove("visible");
    speak(quizData[currentLang].ttsStart);
    showQuestion();
  }

  function showQuestion() {
    const q = quizData[currentLang].questions[currentQuestion];
    const c = quizData[currentLang].choices[currentQuestion];
    questionText.textContent = q;
    choicesDiv.innerHTML = "";
    c.forEach((text, i) => {
      const div = document.createElement("div");
      div.className = "choice";
      div.textContent = text;
      div.onclick = () => selectAnswer(i);
      choicesDiv.appendChild(div);
    });
  }

  function selectAnswer(index) {
    const trait = quizData[currentLang].traits[index];
    scores[trait]++;
    nextBtn.style.display = "inline-block";
  }

  nextBtn.addEventListener("click", () => {
    nextBtn.style.display = "none";
    currentQuestion++;
    if (currentQuestion < quizData[currentLang].questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });

  function showResult() {
    questionBox.style.display = "none";
    resultBox.style.display = "block";
    chartWrap.classList.add("visible");

    const resultTypeText = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k)
      .join("");

    resultType.textContent = `당신의 유형: ${resultTypeText}`;
    resultDesc.textContent = quizData[currentLang].desc[resultTypeText[0]] || "";

    new Chart(ctx, {
      type: "radar",
      data: {
        labels: Object.keys(scores),
        datasets: [
          {
            label: "점수",
            data: Object.values(scores),
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.3)",
          },
        ],
      },
      options: {
        scales: { r: { beginAtZero: true, max: 5 } },
      },
    });

    speak(quizData[currentLang].ttsFinish);
  }

  startBtn.addEventListener("click", startQuiz);
});
