const startBtn = document.getElementById('startBtn');
const chartWrap = document.getElementById('chartWrap');
const langSelect = document.getElementById('lang');

const languages = ['ko','en','ja','fr','es','zh'];
let currentLang = 'ko';

const data = {
  ko: {
    start: '시작', next: '다음', restart: '다시 시작',
    ttsStart: '테스트를 시작합니다.',
    ttsFinish: '결과가 나왔습니다.',
    traits: {
      E: '외향성 — 활발하고 사교적인 성향',
      S: '안정성 — 차분하고 신뢰감 있는 성향',
      O: '개방성 — 새로운 아이디어를 즐김',
      C: '성실성 — 체계적이고 책임감 있는 성향',
    },
  },
  en: {
    start: 'Start', next: 'Next', restart: 'Restart',
    ttsStart: 'Starting the test.',
    ttsFinish: 'Here are your results.',
    traits: {
      E: 'Extraversion — Outgoing and sociable',
      S: 'Stability — Calm and reliable',
      O: 'Openness — Curious and creative',
      C: 'Conscientiousness — Organized and responsible',
    },
  },
  ja: {
    start: 'スタート', next: '次へ', restart: 'もう一度',
    ttsStart: 'テストを開始します。',
    ttsFinish: '結果が出ました。',
    traits: {
      E: '外向性 — 社交的で活発',
      S: '安定性 — 落ち着きがあり信頼できる',
      O: '開放性 — 新しい発想を楽しむ',
      C: '誠実性 — 計画的で責任感が強い',
    },
  },
  fr: {
    start: 'Commencer', next: 'Suivant', restart: 'Recommencer',
    ttsStart: 'Le test commence.',
    ttsFinish: 'Voici vos résultats.',
    traits: {
      E: 'Extraversion — Sociable et énergique',
      S: 'Stabilité — Calme et fiable',
      O: 'Ouverture — Curieux et créatif',
      C: 'Conscience — Organisé et responsable',
    },
  },
  es: {
    start: 'Comenzar', next: 'Siguiente', restart: 'Reiniciar',
    ttsStart: 'Comienza la prueba.',
    ttsFinish: 'Aquí están tus resultados.',
    traits: {
      E: 'Extraversión — Sociable y activo',
      S: 'Estabilidad — Tranquilo y confiable',
      O: 'Apertura — Curioso y creativo',
      C: 'Responsabilidad — Organizado y confiable',
    },
  },
  zh: {
    start: '开始', next: '下一步', restart: '重新开始',
    ttsStart: '测试开始。',
    ttsFinish: '结果出来了。',
    traits: {
      E: '外向性 — 热情开朗',
      S: '稳定性 — 冷静可靠',
      O: '开放性 — 富有好奇心和创造力',
      C: '尽责性 — 有条理且负责',
    },
  },
};

// 자동 언어 감지
const userLang = (navigator.language || 'ko').slice(0, 2);
if (languages.includes(userLang)) currentLang = userLang;
langSelect.value = currentLang;

// TTS 기능
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;
  window.speechSynthesis.speak(utter);
}

// 시작
function startQuiz() {
  speak(data[currentLang].ttsStart);
  document.getElementById('startBox').style.display = 'none';
  document.getElementById('questionBox').style.display = 'block';
  startBtn.style.display = 'none';
  langSelect.disabled = true;
  // 차트 숨김
  chartWrap.classList.remove('visible');
}

// 결과 표시 (예시)
function showResult() {
  chartWrap.classList.add('visible');
  speak(data[currentLang].ttsFinish);
}

// 이벤트
startBtn.addEventListener('click', startQuiz);
langSelect.addEventListener('change', e => {
  currentLang = e.target.value;
});
