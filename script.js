// 전체 동작은 DOM이 준비된 뒤 실행 (script 태그에 defer 적용)
(function(){
  /* =========================
     데이터: 다국어 질문/설명
     ========================= */
  const DATA = {
    ko: {
      title: "심리테스트 — E/S/O/C",
      intro: "질문에 답하면 E/S/O/C 성향을 분석해 드립니다. 언어를 선택한 뒤 시작하세요.",
      start: "시작", retry: "다시하기",
      ttsIntro: "테스트를 시작합니다. 질문을 잘 듣고 답해주세요.",
      ttsFinish: "결과가 준비되었습니다.",
      questions: [
        { q: "주말에 친구들이 약속을 잡으면 나는…", c: [["적극적으로 나서서 계획을 짠다","E"],["편하게 쉬는 것을 선호한다","S"],["새로운 활동을 제안한다","O"],["일정을 꼼꼼히 확인한다","C"]] },
        { q: "낯선 상황에서 나는 보통…", c: [["사람들과 먼저 이야기하는 편이다","E"],["조용히 분위기를 살핀다","S"],["호기심을 갖고 여러 시도를 해본다","O"],["사전에 계획을 세우려 한다","C"]] },
        { q: "일을 처리할 때 나는…", c: [["팀워크로 빠르게 해결한다","E"],["스트레스 관리를 중요시한다","S"],["독창적인 방법을 찾아 시도한다","O"],["체크리스트로 철저히 진행한다","C"]] },
        { q: "새로운 취미를 고를 때 나는…", c: [["친구들과 같이할 수 있는 것을 고른다","E"],["안정적이고 꾸준히 할 수 있는 것을 고른다","S"],["색다르고 창의적인 것을 시도해본다","O"],["체계적으로 배울 수 있는 것을 고른다","C"]] },
        { q: "회의에서 의견을 말할 때 나는…", c: [["먼저 말하고 토론을 이끈다","E"],["반응을 보면서 차분히 말한다","S"],["창의적이고 예상 밖의 아이디어를 낸다","O"],["근거와 데이터로 논리를 펼친다","C"]] }
      ],
      traits: {
        E: "사교적이며 활발하게 사람들과 어울리며 에너지를 얻는 유형입니다.",
        S: "차분하고 안정감을 중요시하며 균형을 선호하는 유형입니다.",
        O: "새로운 경험과 아이디어를 즐기며 창의적인 성향이 강합니다.",
        C: "체계적이고 성실하며 계획적으로 일하는 성향입니다."
      }
    },
    en: {
      title: "Personality Test — E/S/O/C",
      intro: "Answer questions to analyze E/S/O/C traits. Choose a language and start.",
      start: "Start", retry: "Retry",
      ttsIntro: "Starting the test. Please listen and answer the questions.",
      ttsFinish: "Your results are ready.",
      questions: [
        { q: "When friends plan a weekend activity, how do you usually react?", c: [["I volunteer to take the lead","E"],["I prefer to relax","S"],["I suggest something new and fun","O"],["I check the schedule carefully","C"]] },
        { q: "When you are with strangers, how do you behave?", c: [["I start conversations and lead the mood","E"],["I speak only when necessary","S"],["I bring up new topics to talk about","O"],["I observe reactions first","C"]] },
        { q: "When handling tasks, I typically…", c: [["Collaborate with others","E"],["Manage stress and stay calm","S"],["Try creative methods","O"],["Use checklists and plans","C"]] },
        { q: "When choosing a new hobby, you…", c: [["Pick group activities","E"],["Prefer steady routines","S"],["Try creative experiences","O"],["Choose systematic learning","C"]] },
        { q: "In meetings, you tend to…", c: [["Speak first and lead","E"],["Speak calmly after listening","S"],["Offer creative ideas","O"],["Present data-backed logic","C"]] }
      ],
      traits: {
        E: "Sociable and energetic — gains energy from people.",
        S: "Calm and stable — values balance and steadiness.",
        O: "Curious and creative — enjoys new ideas and experiences.",
        C: "Organized and responsible — works systematically and reliably."
      }
    },
    ja: {
      title: "心理テスト — E/S/O/C",
      intro: "質問に答えて E/S/O/C の傾向を分析します。言語を選んで開始してください。",
      start: "開始", retry: "もう一度",
      ttsIntro: "テストを開始します。質問に耳を傾けて回答してください。",
      ttsFinish: "結果が出ました。",
      questions: [
        { q: "週末に友達が予定を立てるとき、あなたはどう反応しますか？", c: [["率先して計画する","E"],["静かに様子を見る","S"],["新しい案を提案する","O"],["日程を確認してから決める","C"]] },
        { q: "知らない人と一緒にいるとき、あなたはどう振る舞いますか？", c: [["自分から話す","E"],["必要なときだけ話す","S"],["新しい話題を出す","O"],["相手の反応を観察する","C"]] },
        { q: "仕事を処理するとき、あなたはどうする？", c: [["協力して進める","E"],["落ち着いて対応する","S"],["創造的に試す","O"],["チェックリストで進める","C"]] },
        { q: "新しい趣味を選ぶとき、あなたは？", c: [["みんなでできるものを選ぶ","E"],["安定して続けられるものを選ぶ","S"],["新しいことを試す","O"],["体系的に学ぶものを選ぶ","C"]] },
        { q: "会議で意見を述べるとき、あなたは？", c: [["先に話してリードする","E"],["落ち着いて話す","S"],["創造的なアイデアを出す","O"],["論理的に説明する","C"]] }
      ],
      traits: {
        E: "社交的で人との交流からエネルギーを得ます。",
        S: "落ち着きがあり安定を重視します。",
        O: "好奇心が強く創造的です。",
        C: "計画的で責任感があります。"
      }
    },
    fr: {
      title: "Test de personnalité — E/S/O/C",
      intro: "Répondez aux questions pour analyser vos traits E/S/O/C. Choisissez la langue et démarrez.",
      start: "Commencer", retry: "Recommencer",
      ttsIntro: "Démarrage du test. Veuillez écouter et répondre aux questions.",
      ttsFinish: "Les résultats sont prêts.",
      questions: [
        { q: "Quand des amis planifient un week-end, comment réagissez-vous ?", c: [["Je prends l'initiative","E"],["J'observe tranquillement","S"],["Je propose quelque chose de nouveau","O"],["Je vérifie l'emploi du temps","C"]] },
        { q: "Avec des inconnus, comment vous comportez-vous ?", c: [["J'engage la conversation","E"],["Je parle seulement si nécessaire","S"],["Je propose de nouveaux sujets","O"],["J'observe les réactions","C"]] },
        { q: "Comment gérez-vous les tâches ?", c: [["Je collabore","E"],["Je reste calme","S"],["J'essaie de manière créative","O"],["J'utilise des checklists","C"]] },
        { q: "Quand vous choisissez un nouveau passe-temps, vous…", c: [["Choisissez une activité sociale","E"],["Privilégiez la régularité","S"],["Essayez quelque chose de créatif","O"],["Apprenez de façon structurée","C"]] },
        { q: "En réunion, vous…", c: [["Prenez la parole et guidez","E"],["Parlez calmement","S"],["Proposez des idées créatives","O"],["Présentez des arguments logiques","C"]] }
      ],
      traits: {
        E: "Sociable et énergique — vous gagnez en énergie avec les autres.",
        S: "Calme et stable — vous valorisez l'équilibre.",
        O: "Curieux et créatif — vous aimez la nouveauté.",
        C: "Organisé et responsable — vous travaillez de façon structurée."
      }
    },
    es: {
      title: "Test de personalidad — E/S/O/C",
      intro: "Responde preguntas para analizar tus rasgos E/S/O/C. Elige el idioma y comienza.",
      start: "Comenzar", retry: "Reiniciar",
      ttsIntro: "Iniciando la prueba. Escucha y responde las preguntas.",
      ttsFinish: "Tus resultados están listos.",
      questions: [
        { q: "Cuando amigos planean el fin de semana, ¿cómo reaccionas?", c: [["Me ofrezco para liderar","E"],["Observo en silencio","S"],["Propongo algo nuevo","O"],["Reviso el horario","C"]] },
        { q: "Con desconocidos, ¿cómo te comportas?", c: [["Inicia la conversación","E"],["Hablo solo si es necesario","S"],["Propongo temas nuevos","O"],["Observo las reacciones","C"]] },
        { q: "Al manejar tareas, tú…", c: [["Colaboras con otros","E"],["Mantienes la calma","S"],["Pruebas métodos creativos","O"],["Usas listas de verificación","C"]] },
        { q: "Al elegir un pasatiempo, tú…", c: [["Eliges actividades grupales","E"],["Prefieres estabilidad","S"],["Intentas algo creativo","O"],["Aprendes de forma estructurada","C"]] },
        { q: "En reuniones, normalmente…", c: [["Hablas primero y lideras","E"],["Hablas con calma","S"],["Propones ideas creativas","O"],["Presentas argumentos lógicos","C"]] }
      ],
      traits: {
        E: "Te energizas con la interacción social.",
        S: "Prefieres la calma y la estabilidad.",
        O: "Disfrutas la novedad y la creatividad.",
        C: "Eres organizado y responsable."
      }
    }
  };

  /* =========================
     DOM 참조 & 상태 초기화
     ========================= */
  const langSelect = document.getElementById('langSelect');
  const startBtn = document.getElementById('startBtn');
  const headerControls = document.getElementById('headerControls');
  const introText = document.getElementById('introText');
  const startBox = document.getElementById('startBox');
  const questionCard = document.getElementById('questionCard');
  const questionTitle = document.getElementById('questionTitle');
  const choicesDiv = document.getElementById('choices');
  const progressFill = document.getElementById('progressFill');
  const resultCard = document.getElementById('resultCard');
  const resultTitle = document.getElementById('resultTitle');
  const resultSummary = document.getElementById('resultSummary');
  const traitDetails = document.getElementById('traitDetails');
  const chartWrap = document.getElementById('chartWrap');
  const downloadBtn = document.getElementById('downloadBtn');
  const shareBtn = document.getElementById('shareBtn');
  const restartBtn = document.getElementById('restartBtn');
  const resultCanvas = document.getElementById('resultChart');

  let lang = 'ko';
  let questions = [];
  let selectedQuestions = [];
  let qIndex = 0;
  let scores = {E:0,S:0,O:0,C:0};
  let chartInstance = null;

  /* =========================
     언어 옵션 초기화 (select 채우기 + 자동감지)
     ========================= */
  function initLangOptions(){
    langSelect.innerHTML = '';
    Object.keys(DATA).forEach(k=>{
      const opt = document.createElement('option');
      opt.value = k;
      const label = {ko:'한국어',en:'English',ja:'日本語',fr:'Français',es:'Español'}[k] || k;
      opt.innerText = `${label}`;
      langSelect.appendChild(opt);
    });
    const userLang = navigator.language ? navigator.language.slice(0,2) : 'ko';
    if(DATA[userLang]) lang = userLang;
    langSelect.value = lang;
    applyTexts();
  }

  function applyTexts(){
    const d = DATA[lang];
    document.getElementById('appTitle').innerText = d.title;
    introText.innerText = d.intro;
    startBtn.innerText = d.start;
    // some initial result labels
    resultTitle.innerText = Object.values(d.traits)[0] || 'Result';
  }

  langSelect.addEventListener('change', e=>{
    lang = e.target.value;
    applyTexts();
  });

  /* =========================
     유틸: shuffle
     ========================= */
  function shuffle(arr){ return arr.slice().sort(()=>Math.random()-0.5); }

  /* =========================
     TTS 유틸
     ========================= */
  const ttsMap = { ko:'ko-KR', en:'en-US', ja:'ja-JP', fr:'fr-FR', es:'es-ES' };
  function speak(text){
    if(!('speechSynthesis' in window) || !text) return;
    try{
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = ttsMap[lang] || 'en-US';
      u.rate = 1;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    }catch(e){ console.warn('TTS error', e); }
  }

  /* =========================
     퀴즈 시작
     ========================= */
  startBtn.addEventListener('click', startQuiz);
  function startQuiz(){
    // 숨김: 선택/시작 버튼
    headerControls.style.display = 'none';
    startBox.style.display = 'none';
    questionCard.style.display = 'block';
    resultCard.style.display = 'none';
    chartWrap.classList.remove('visible');

    // 초기화
    questions = DATA[lang].questions.slice();
    selectedQuestions = shuffle(questions).slice(0,5); // 5개 랜덤
    qIndex = 0;
    scores = {E:0,S:0,O:0,C:0};
    progressFill.style.width = '0%';

    // TTS
    speak(DATA[lang].ttsIntro);

    // show first question
    showQuestion();
  }

  /* =========================
     질문 렌더링
     ========================= */
  function showQuestion(){
    const q = selectedQuestions[qIndex];
    questionTitle.innerText = `(${qIndex+1}/${selectedQuestions.length}) ${q.q}`;
    choicesDiv.innerHTML = '';
    const shuffled = shuffle(q.c);
    shuffled.forEach(([txt, trait], i)=>{
      const div = document.createElement('div');
      div.className = 'choice';
      div.tabIndex = 0;
      div.innerText = txt;
      div.onclick = () => onChoiceSelected(div, trait);
      div.onkeydown = (e)=> { if(e.key === 'Enter' || e.key === ' ') onChoiceSelected(div, trait); };
      choicesDiv.appendChild(div);
    });
    progressFill.style.width = `${(qIndex / selectedQuestions.length) * 100}%`;
    speak(q.q);
  }

  function onChoiceSelected(div, trait){
    // 선택 UI
    const nodes = choicesDiv.querySelectorAll('.choice');
    nodes.forEach(n=>n.classList.remove('selected'));
    div.classList.add('selected');

    // 다음 문항으로
    setTimeout(()=>{
      scores[trait] = (scores[trait] || 0) + 1;
      qIndex++;
      if(qIndex < selectedQuestions.length) showQuestion();
      else finishQuiz();
    }, 240);
  }

  /* =========================
     결과 처리 및 차트
     ========================= */
  function finishQuiz(){
    questionCard.style.display = 'none';
    resultCard.style.display = 'block';
    progressFill.style.width = '100%';
    const d = DATA[lang];

    // 정렬, 상위 3개 추출 (MBTI 스타일)
    const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    const top3 = sorted.slice(0,3).map(s=>s[0]).join('');
    const topMain = sorted[0][0];

    resultTitle.innerText = `${d.labels ? d.labels[topMain] : topMain} (${top3})`;
    resultSummary.innerText = d.traits[topMain] || '';

    // traitDetails: 모든 성향 스코어 + 설명
    traitDetails.innerHTML = Object.entries(d.traits).map(([k,v])=>{
      const icon = {E:'💬',S:'⚖️',O:'💡',C:'📘'}[k];
      const val = scores[k] || 0;
      return `<div style="margin:6px 0;padding:8px;border-radius:8px;background:rgba(255,255,255,0.02)">
        ${icon} <strong>${k}</strong> — ${v}<span style="float:right;font-weight:700">${val}</span></div>`;
    }).join('');

    // 차트 렌더링 (결과 시점에만)
    renderResultChart();

    // 차트 페이드 인
    chartWrap.classList.add('visible');

    // TTS
    speak((d.ttsFinish || '') + ' ' + (d.traits[topMain] || ''));
  }

  function getChartColors(){
    return ['#4A90E2','#7ED321','#F5A623','#9013FE'];
  }

  function renderResultChart(){
    const labels = ['E','S','O','C'];
    const dataValues = labels.map(l => scores[l] || 0);
    const colors = getChartColors();

    // destroy previous
    if(chartInstance) chartInstance.destroy();

    const ctx = resultCanvas.getContext('2d');
    const cfg = {
      type: 'radar',
      data: {
        labels: labels.map(l => l),
        datasets: [{
          label: (lang==='ko'?'나':'You'),
          data: dataValues,
          backgroundColor: 'rgba(99,102,241,0.18)',
          borderColor: '#6366f1',
          pointBackgroundColor: colors,
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius:7
        }]
      },
      options: {
        responsive:true,
        maintainAspectRatio:false,
        scales:{ r:{ suggestedMin:0, suggestedMax:5, ticks:{ stepSize:1 } } },
        plugins: {
          legend:{ display: true, position:'top' },
          tooltip:{ mode:'nearest' }
        },
        animation:{ duration:1000, easing:'easeOutQuart' }
      }
    };
    chartInstance = new Chart(ctx, cfg);
  }

  /* =========================
     설명 자동 생성 (MBTI 스타일)
     ========================= */
  function getTypeDescription(type){
    const s = new Set(type.split(''));
    if(s.has('E') && s.has('O') && s.has('C')) return {ko:"사교적·창의적·체계적인 리더형입니다!", en:"Sociable, creative and organized — a leader type."}[lang] || "Balanced type";
    if(s.has('E') && s.has('S') && s.has('C')) return {ko:"신뢰받는 현실주의자형입니다.", en:"Practical and reliable collaborator."}[lang] || "Balanced type";
    if(s.has('O') && s.has('C')) return {ko:"창의적이면서 계획적인 혁신가형입니다.", en:"Creative and methodical — an innovator."}[lang] || "Balanced type";
    if(s.has('S') && s.has('C')) return {ko:"차분하고 책임감 있는 분석가형입니다.", en:"Calm and responsible — an analytical type."}[lang] || "Balanced type";
    if(s.has('E') && s.has('O')) return {ko:"활발하고 탐구적인 탐험가형입니다.", en:"Energetic and idea-rich — an explorer."}[lang] || "Balanced type";
    if(s.has('E') && s.has('S')) return {ko:"따뜻하고 협력적인 협력가형입니다.", en:"Warm and cooperative collaborator."}[lang] || "Balanced type";
    return {ko:"다양한 성향의 조합형입니다.", en:"A balanced multi-trait type."}[lang] || "Balanced type";
  }

  /* =========================
     공유 / 저장 / 재시작
     ========================= */
  downloadBtn.addEventListener('click', ()=>{
    if(!chartInstance) return alert({ko:'차트 없음',en:'No chart'}[lang]);
    const url = chartInstance.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = `psychotest_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.png`;
    document.body.appendChild(a); a.click(); a.remove();
  });

  shareBtn.addEventListener('click', async ()=>{
    const text = resultSummary.innerText;
    const url = window.location.href;
    if(navigator.share){
      try{ await navigator.share({ title:'심리테스트 결과', text, url }); }
      catch(e){ console.log('share canceled'); }
    } else {
      try{ await navigator.clipboard.writeText(`${text}\n${url}`); alert({ko:'결과 복사됨',en:'Result copied'}[lang]); }
      catch(e){ alert('Share not supported'); }
    }
  });

  restartBtn.addEventListener('click', ()=>{
    if('speechSynthesis' in window) window.speechSynthesis.cancel();
    // 안전하게 초기화: DOM 상태 복원
    headerControls.style.display = 'flex';
    startBox.style.display = 'block';
    questionCard.style.display = 'none';
    resultCard.style.display = 'none';
    chartWrap.classList.remove('visible');
    if(chartInstance) chartInstance.destroy();
    progressFill.style.width = '0%';
    // reset scores
    scores = {E:0,S:0,O:0,C:0};
  });

  /* =========================
     초기화 실행
     ========================= */
  initLangOptions();

})();
