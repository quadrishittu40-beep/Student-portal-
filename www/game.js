const questions = [
  { q: 'What is AbdulAzeez most likely to bring to the group?', choices: ['The jokes', 'The wise advice', 'The good vibes', 'A surprise nobody saw coming'] },
  { q: 'Pick the perfect way to celebrate the groom.', choices: ['A proper feast', 'Stories with the boys', 'A friendly competition', 'All of the above'] },
  { q: 'What is the secret ingredient to a strong friendship?', choices: ['Showing up', 'Honest conversations', 'Laughing together', 'A little bit of everything'] },
  { q: 'If the groom had a superpower, what would it be?', choices: ['Making everyone laugh', 'Keeping the peace', 'Always having a plan', 'Bringing people together'] },
  { q: 'What should every great marriage have plenty of?', choices: ['Patience', 'Laughter', 'Kindness', 'All of the above'] },
  { q: 'Your message to the happy couple?', choices: ['A lifetime of happiness', 'Love that keeps growing', 'Joy in every new chapter', 'All of these and more'] }
];
const modal = document.querySelector('#modal');
const content = document.querySelector('#gameContent');
let name = '', answers = [], index = 0;
const escapeHtml = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function openGame() { modal.hidden = false; document.body.classList.add('modal-open'); showWelcome(); }
function closeGame() { modal.hidden = true; document.body.classList.remove('modal-open'); }
function showWelcome() {
  content.innerHTML = `<div class="eyebrow"><span></span> YOUR SEAT IN THE CIRCLE</div><h2 id="dialogTitle">Come on in, <em>brother.</em></h2><p>Six fun questions, no wrong answers. Play on your phone, then share your picks with the group and the groom.</p><form id="nameForm"><label for="playerName">WHAT SHOULD WE CALL YOU?</label><input id="playerName" maxlength="30" required placeholder="Enter your name" autocomplete="name"><button class="primary" type="submit">Start the game <span>↗</span></button></form>`;
  document.querySelector('#nameForm').onsubmit = e => { e.preventDefault(); name = document.querySelector('#playerName').value.trim(); if (!name) return; answers = []; index = 0; showQuestion(); };
}
function showQuestion() {
 const item = questions[index];
 content.innerHTML = `<div class="quiz-meta"><span>THE GROOM’S CIRCLE</span><span>${String(index + 1).padStart(2,'0')} / ${String(questions.length).padStart(2,'0')}</span></div><div class="progress"><span style="width:${(index / questions.length)*100}%"></span></div><div class="eyebrow"><span></span> YOUR TURN, ${escapeHtml(name.toUpperCase())}</div><h2 id="dialogTitle">${item.q}</h2><p>Choose the answer that feels right to you.</p><div class="choices">${item.choices.map((choice,i) => `<button data-choice="${i}"><span>${String.fromCharCode(65+i)}</span>${choice}<b>↗</b></button>`).join('')}</div>`;
 content.querySelectorAll('[data-choice]').forEach(btn => btn.onclick = () => { answers.push(item.choices[Number(btn.dataset.choice)]); index++; index < questions.length ? showQuestion() : showResults(); });
}
function showResults() {
 content.innerHTML = `<div class="eyebrow"><span></span> THAT’S A WRAP</div><h2 id="dialogTitle">Well played, <em>${escapeHtml(name)}.</em></h2><p>Now for the best part: compare your answers with the boys and let AbdulAzeez pick his favourites!</p><div class="answers">${questions.map((q,i) => `<div><small>${i+1}. ${q.q}</small><strong>${answers[i]}</strong></div>`).join('')}</div><button class="primary" id="shareAnswers">Share my answers <span>↗</span></button><button class="text-button" id="playAgain">Play again</button><p class="share-status" aria-live="polite"></p>`;
 document.querySelector('#playAgain').onclick = showWelcome;
 document.querySelector('#shareAnswers').onclick = async () => { const text = `The Groom's Circle — ${name}'s answers\n` + questions.map((q,i) => `${i+1}. ${q.q}\n${answers[i]}`).join('\n\n') + '\n\nCelebrating Nafisa & AbdulAzeez!'; try { if (navigator.share) await navigator.share({title:"The Groom's Circle", text}); else if (navigator.clipboard) { await navigator.clipboard.writeText(text); document.querySelector('.share-status').textContent = 'Answers copied! Paste them into your group chat.'; } else { document.querySelector('.share-status').textContent = 'Sharing is unavailable here. Show your answers to the group!'; } } catch (e) { if (e.name !== 'AbortError') document.querySelector('.share-status').textContent = 'Could not share. Show your answers to the group!'; } };
}
document.querySelector('#startBtn').onclick = openGame; document.querySelector('#joinBtn').onclick = openGame; document.querySelector('#closeBtn').onclick = closeGame; modal.onclick = e => { if (e.target === modal) closeGame(); }; document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeGame(); });
