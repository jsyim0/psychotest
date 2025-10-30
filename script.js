// v4: localStorage save/load, radar+bar charts, multilingual TTS, share link
document.addEventListener('DOMContentLoaded', () => {
  const DATA = {
    ko:{ title:"심리테스트 — E/S/O/C", intro:"질문에 답하면 성향을 분석합니다.", start:"시작", ttsIntro:"테스트를 시작합니다. 질문을 잘 듣고 답해주세요.", ttsFinish:"결과가 준비되었습니다." },
    en:{ title:"Personality Test — E/S/O/C", intro:"Answer questions to analyze traits.", start:"Start", ttsIntro:"Starting the test. Please answer the questions.", ttsFinish:"Your results are ready." },
    ja:{ title:"心理テスト — E/S/O/C", intro:"質問に答えて傾向を分析します。", start:"開始", ttsIntro:"テストを開始します。質問に答えてください。", ttsFinish:"結果が出ました。" },
    fr:{ title:"Test de personnalité — E/S/O/C", intro:"Répondez aux questions pour analyser vos traits.", start:"Commencer", ttsIntro:"Démarrage du test. Veuillez répondre aux questions.", ttsFinish:"Les résultats sont prêts." },
    es:{ title:"Test de personalidad — E/S/O/C", intro:"Responde para analizar rasgos.", start:"Comenzar", ttsIntro:"Iniciando la prueba. Responde las preguntas.", ttsFinish:"Resultados listos." }
  };

  const QUESTIONS = [
    { q:"주말에 친구들이 약속을 잡으면 나는…", c:[["적극적으로 나서서 계획을 짠다","E"],["편하게 쉬는 것을 선호한다","S"],["새로운 활동을 제안한다","O"],["일정을 꼼꼼히 확인한다","C"]] },
    { q:"낯선 상황에서 나는 보통…", c:[["사람들과 먼저 말한다","E"],["조용히 분위기를 살핀다","S"],["여러 시도를 해본다","O"],["사전에 계획을 세운다","C"]] },
    { q:"일을 처리할 때 나는…", c:[["팀워크로 해결한다","E"],["스트레스를 관리한다","S"],["독창적 방법을 시도한다","O"],["체크리스트로 진행한다","C"]] },
    { q:"새로운 취미를 고를 때 나는…", c:[["친구들과 같이할 수 있는 것을 고른다","E"],["안정적이고 꾸준히 할 수 있는 것을 고른다","S"],["색다른 것을 시도한다","O"],["체계적으로 배운다","C"]] },
    { q:"모임에서 의견이 나뉠 때 나는…", c:[["분위기를 이끌며 조율한다","E"],["조용히 판단한다","S"],["창의적 해결책을 제시한다","O"],["근거로 논리적으로 말한다","C"]] }
  ];

  // DOM refs
  const langSelect = document.getElementById('langSelect');
  const startBtn = document.getElementById('startBtn');
  const headerControls = document.querySelector('.controls');
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
  const chartCanvas = document.getElementById('resultChart');
  const chartTypeSelect = document.getElementById('chartType');
  const saveBtn = document.getElementById('saveBtn');
  const shareBtn = document.getElementById('shareBtn');
  const restartBtn = document.getElementById('restartBtn');
  const loadSavedBtn = document.getElementById('loadSaved');
  const clearSavedBtn = document.getElementById('clearSaved');
  const savedBox = document.getElementById('savedBox');

  let lang = 'ko';
  let questions = [];
  let selected = [];
  let qIndex = 0;
  let scores = {E:0,S:0,O:0,C:0};
  let chartInstance = null;

  // init languages
  Object.keys(DATA).forEach(k=>{ const opt = document.createElement('option'); opt.value=k; opt.innerText = {ko:'한국어',en:'English',ja:'日本語',fr:'Français',es:'Español'}[k] || k; langSelect.appendChild(opt); });
  const userLang = (navigator.language||'ko').slice(0,2); if(DATA[userLang]) lang = userLang; langSelect.value = lang;
  applyTexts();

  function applyTexts(){ const d = DATA[lang]; document.getElementById('appTitle').innerText = d.title; introText.innerText = d.intro; startBtn.innerText = d.start; }

  langSelect.addEventListener('change', (e)=>{ lang = e.target.value; applyTexts(); });

  // shuffle helper
  function shuffle(a){ return a.slice().sort(()=>Math.random()-0.5); }

  // TTS
  const ttsMap = {ko:'ko-KR',en:'en-US',ja:'ja-JP',fr:'fr-FR',es:'es-ES'};
  function speak(text){ if(!('speechSynthesis' in window) || !text) return; try{ window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = ttsMap[lang]||'en-US'; u.rate=1; window.speechSynthesis.speak(u);}catch(e){console.warn(e);} }

  // load from query or localStorage
  function parseQuery(){ const params = new URLSearchParams(location.search); const scoresParam = params.get('scores'); if(scoresParam){ // format E:3,S:1,O:0,C:1
      const pairs = scoresParam.split(','); const s = {E:0,S:0,O:0,C:0}; pairs.forEach(p=>{ const [k,v]=p.split(':'); if(k&&v) s[k]=parseInt(v,10); }); return s; } return null; }

  function loadSaved(){ try{ const raw = localStorage.getItem('psychotest_v4'); if(!raw) return null; return JSON.parse(raw); }catch(e){ return null; } }

  // start
  startBtn.addEventListener('click', ()=>{ headerControls.style.display='none'; startBox.style.display='none'; questionCard.style.display='block'; resultCard.style.display='none'; chartWrap.classList.remove('visible'); questions = shuffle(QUESTIONS); selected = questions.slice(0,5); qIndex=0; scores={E:0,S:0,O:0,C:0}; progressFill.style.width='0%'; speak(DATA[lang].ttsIntro); showQuestion(); });

  // show question
  function showQuestion(){ if(qIndex>=selected.length){ return finish(); } const q = selected[qIndex]; questionTitle.innerText = `(${qIndex+1}/${selected.length}) ${q.q}`; choicesDiv.innerHTML=''; const shuffled = shuffle(q.c); shuffled.forEach(([txt,trait])=>{ const d = document.createElement('div'); d.className='choice'; d.tabIndex=0; d.innerText = txt; d.onclick = ()=>{ onChoiceSelected(d,trait); }; d.onkeydown = (e)=>{ if(e.key==='Enter'||e.key===' ') onChoiceSelected(d,trait); }; choicesDiv.appendChild(d); }); progressFill.style.width = `${(qIndex/selected.length)*100}%`; speak(q.q); }

  function onChoiceSelected(elem, trait){ const nodes = choicesDiv.querySelectorAll('.choice'); nodes.forEach(n=>n.classList.remove('selected')); elem.classList.add('selected'); setTimeout(()=>{ scores[trait] = (scores[trait]||0)+1; qIndex++; if(qIndex<selected.length) showQuestion(); else finish(); },220); }

  // finish
  function finish(){ questionCard.style.display='none'; resultCard.style.display='block'; progressFill.style.width='100%'; renderResult(); }

  function renderResult(){ const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]); const top3 = sorted.slice(0,3).map(s=>s[0]).join(''); const topMain = sorted[0][0]; const desc = getTypeDescription(top3); resultTitle.innerText = `${topMain} (${top3})`; resultSummary.innerText = desc; traitDetails.innerHTML = Object.entries(DATA[lang].traits||{E:'',S:'',O:'',C:''}).map(([k,v])=>{ const icon = {E:'💬',S:'⚖️',O:'💡',C:'📘'}[k]; const val = scores[k]||0; return `<div style="margin:6px 0;padding:8px;border-radius:8px;background:rgba(255,255,255,0.02)">${icon} <strong>${k}</strong> — ${v||''}<span style="float:right;font-weight:700">${val}</span></div>` }).join(''); // save to local state
    localStorage.setItem('psychotest_v4', JSON.stringify({scores,type:top3,timestamp:Date.now()}));
    // render chart once
    renderChart(chartTypeSelect.value||'radar');
    chartWrap.classList.add('visible');
    speak(DATA[lang].ttsFinish + ' ' + desc);
  }

  function renderChart(type){ const labels=['E','S','O','C']; const dataValues = labels.map(l=>scores[l]||0); if(chartInstance) chartInstance.destroy(); const cfg = { type:type, data:{ labels: labels, datasets:[{ label: (lang==='ko'?'나':'You'), data: dataValues, backgroundColor: type==='bar'?['#4A90E2','#7ED321','#F5A623','#9013FE']:'rgba(99,102,241,0.18)', borderColor:'#6366f1', borderWidth:2, pointBackgroundColor:'#6366f1' }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display: type==='radar' } }, scales: {} } }; if(type==='radar'){ cfg.options.scales = { r: { beginAtZero:true, suggestedMax:5, ticks:{ stepSize:1, color:'#cbd5e1' }, grid:{ color:'rgba(255,255,255,0.06)' }, pointLabels:{ color:'#e6eef8' } } }; } else { cfg.options.scales = { y:{ beginAtZero:true, suggestedMax:5, ticks:{ stepSize:1, color:'#cbd5e1' }, grid:{ color:'rgba(255,255,255,0.04)' } }, x:{ ticks:{ color:'#e6eef8' } } }; } const ctx = chartCanvas.getContext('2d'); chartInstance = new Chart(ctx, cfg); }

  // share link
  shareBtn.addEventListener('click', async ()=>{ const s = `E:${scores.E},S:${scores.S},O:${scores.O},C:${scores.C}`; const url = new URL(location.href); url.searchParams.set('scores', `E:${scores.E},S:${scores.S},O:${scores.O},C:${scores.C}`); try{ await navigator.clipboard.writeText(url.toString()); alert('공유 링크가 복사되었습니다'); }catch(e){ prompt('공유 링크 (복사):', url.toString()); } });

  // save / load
  saveBtn.addEventListener('click', ()=>{ const payload={scores,type: Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,3).map(s=>s[0]).join(''),ts:Date.now()}; localStorage.setItem('psychotest_v4', JSON.stringify(payload)); alert('결과가 저장되었습니다'); });
  loadSavedBtn.addEventListener('click', ()=>{ const raw = localStorage.getItem('psychotest_v4'); if(!raw) return alert('저장된 결과가 없습니다'); const data = JSON.parse(raw); scores = data.scores || scores; renderResult(); });
  clearSavedBtn.addEventListener('click', ()=>{ localStorage.removeItem('psychotest_v4'); savedBox.style.display='none'; alert('저장된 결과가 삭제되었습니다'); });

  // restart
  restartBtn.addEventListener('click', ()=>{ headerControls.style.display='flex'; startBox.style.display='block'; questionCard.style.display='none'; resultCard.style.display='none'; chartWrap.classList.remove('visible'); if(chartInstance) chartInstance.destroy(); progressFill.style.width='0%'; scores={E:0,S:0,O:0,C:0}; });

  // check existing saved or query
  const queryScores = (function(){ const params = new URLSearchParams(location.search); const s = params.get('scores'); if(!s) return null; const parts = s.split(','); const res={E:0,S:0,O:0,C:0}; parts.forEach(p=>{ const [k,v]=p.split(':'); if(k&&v) res[k]=parseInt(v,10); }); return res; })();
  const saved = loadSaved(); if(queryScores){ scores = queryScores; renderResult(); } else if(saved){ // show saved box
    savedBox.style.display='block';
  }

  // helper: type description (simple)
  function getTypeDescription(type){ const s = new Set(type.split('')); if(s.has('E')&&s.has('O')&&s.has('C')) return '사교적·창의적·체계적인 리더형입니다!'; if(s.has('E')&&s.has('S')&&s.has('C')) return '신뢰받는 현실주의자형입니다.'; if(s.has('O')&&s.has('C')) return '창의적이면서도 계획적인 혁신가형입니다.'; if(s.has('S')&&s.has('C')) return '차분하고 책임감 있는 분석가형입니다.'; if(s.has('E')&&s.has('O')) return '활발하고 아이디어가 풍부한 탐험가형입니다!'; if(s.has('E')&&s.has('S')) return '따뜻하고 협력적인 협력가형입니다.'; return '다양한 성향이 조화를 이루는 복합형 인물입니다!'; }
});