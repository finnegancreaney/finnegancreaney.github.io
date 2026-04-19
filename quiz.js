const QUIZ_DATA = {
  history: {
    label: 'History', icon: '📚',
    normal: [
      { q: 'Who was the first President of the United States?', options: ['George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'Benjamin Franklin'], answer: 0 },
      { q: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: 2 },
      { q: 'Which ship sank on its maiden voyage in 1912?', options: ['Lusitania', 'Britannic', 'Titanic', 'Olympic'], answer: 2 },
      { q: 'Who was the first man to walk on the Moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'], answer: 1 },
      { q: 'In which year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1991'], answer: 2 },
      { q: 'Who was the Egyptian queen famous for her relationships with Julius Caesar and Mark Antony?', options: ['Nefertiti', 'Cleopatra', 'Hatshepsut', 'Nefertari'], answer: 1 },
      { q: 'In which year did World War I begin?', options: ['1912', '1913', '1914', '1916'], answer: 2 },
      { q: 'Who was the leader of Nazi Germany during World War II?', options: ['Heinrich Himmler', 'Joseph Goebbels', 'Adolf Hitler', 'Hermann Göring'], answer: 2 },
      { q: 'Which country dropped atomic bombs on Japan in 1945?', options: ['United Kingdom', 'Soviet Union', 'United States', 'France'], answer: 2 },
      { q: 'Who led the British forces at the Battle of Waterloo?', options: ['Lord Nelson', 'Duke of Wellington', 'Winston Churchill', 'Duke of Marlborough'], answer: 1 },
      { q: 'In which city was the Titanic built?', options: ['Liverpool', 'London', 'Glasgow', 'Belfast'], answer: 3 },
      { q: 'In which year did the French Revolution begin?', options: ['1776', '1783', '1789', '1799'], answer: 2 },
      { q: 'What was the name of the Allied D-Day invasion plan?', options: ['Operation Barbarossa', 'Operation Overlord', 'Operation Market Garden', 'Operation Sea Lion'], answer: 1 },
      { q: 'Who was the first person to circumnavigate the globe?', options: ['Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan', 'Francis Drake'], answer: 2 },
      { q: 'Which country did Napoleon Bonaparte originally come from?', options: ['France', 'Italy', 'Corsica', 'Spain'], answer: 2 },
    ],
    hard: [
      { q: 'In which year did the Battle of Hastings take place?', options: ['1042', '1055', '1066', '1077'], answer: 2 },
      { q: 'Who commanded the Carthaginian forces at the Battle of Cannae?', options: ['Scipio Africanus', 'Hannibal Barca', 'Hasdrubal', 'Hamilcar Barca'], answer: 1 },
      { q: 'In which year was the Magna Carta signed?', options: ['1199', '1207', '1215', '1225'], answer: 2 },
      { q: 'Which Persian king led the invasion at the Battle of Thermopylae?', options: ['Darius I', 'Darius II', 'Cyrus II', 'Xerxes I'], answer: 3 },
      { q: 'Who was the last Tsar of Russia?', options: ['Alexander III', 'Nicholas I', 'Nicholas II', 'Alexander II'], answer: 2 },
      { q: 'In which year did the Russian Revolution take place?', options: ['1905', '1914', '1917', '1921'], answer: 2 },
      { q: 'What was the name of Alexander the Great\'s horse?', options: ['Pegasus', 'Bucephalus', 'Incitatus', 'Marengo'], answer: 1 },
      { q: 'In which year did Constantinople fall to the Ottoman Turks?', options: ['1389', '1415', '1453', '1492'], answer: 2 },
      { q: 'Who was the Supreme Allied Commander during the D-Day landings?', options: ['Bernard Montgomery', 'George Patton', 'Douglas MacArthur', 'Dwight D. Eisenhower'], answer: 3 },
      { q: 'How many Spartan warriors fought alongside Leonidas at Thermopylae?', options: ['100', '200', '300', '500'], answer: 2 },
      { q: 'In which year did the Battle of Marathon take place?', options: ['510 BC', '490 BC', '480 BC', '460 BC'], answer: 1 },
      { q: 'Who founded the Mongol Empire?', options: ['Kublai Khan', 'Timur', 'Genghis Khan', 'Ögedei Khan'], answer: 2 },
      { q: 'In what year did the Western Roman Empire fall?', options: ['410 AD', '455 AD', '476 AD', '493 AD'], answer: 2 },
      { q: 'Who defeated Darius III at the Battle of Gaugamela?', options: ['Julius Caesar', 'Alexander the Great', 'Scipio Africanus', 'Pyrrhus of Epirus'], answer: 1 },
      { q: 'Which 1415 battle saw English longbowmen defeat a much larger French army?', options: ['Battle of Crécy', 'Battle of Poitiers', 'Battle of Agincourt', 'Battle of Bosworth'], answer: 2 },
    ],
  },

  geography: {
    label: 'Geography', icon: '🌍',
    normal: [
      { q: 'What is the capital of France?', options: ['Lyon', 'Marseille', 'Paris', 'Bordeaux'], answer: 2 },
      { q: 'What is the largest country in the world by area?', options: ['Canada', 'China', 'USA', 'Russia'], answer: 3 },
      { q: 'What is the longest river in the world?', options: ['Amazon', 'Yangtze', 'Mississippi', 'Nile'], answer: 3 },
      { q: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answer: 2 },
      { q: 'Which is the smallest country in the world?', options: ['Monaco', 'San Marino', 'Liechtenstein', 'Vatican City'], answer: 3 },
      { q: 'What is the highest mountain in the world?', options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Makalu'], answer: 2 },
      { q: 'What is the capital of Japan?', options: ['Osaka', 'Kyoto', 'Hiroshima', 'Tokyo'], answer: 3 },
      { q: 'Which continent is the Sahara Desert located in?', options: ['Asia', 'South America', 'Australia', 'Africa'], answer: 3 },
      { q: 'What is the largest ocean in the world?', options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], answer: 3 },
      { q: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], answer: 2 },
      { q: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'], answer: 3 },
      { q: 'Which river flows through Egypt?', options: ['Congo', 'Niger', 'Nile', 'Zambezi'], answer: 2 },
      { q: 'What is the largest country in South America?', options: ['Argentina', 'Colombia', 'Peru', 'Brazil'], answer: 3 },
      { q: 'Which ocean lies between Europe and America?', options: ['Indian Ocean', 'Pacific Ocean', 'Atlantic Ocean', 'Arctic Ocean'], answer: 2 },
      { q: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: 2 },
    ],
    hard: [
      { q: 'What is the capital of Kazakhstan?', options: ['Almaty', 'Astana', 'Shymkent', 'Karaganda'], answer: 1 },
      { q: 'What is the deepest lake in the world?', options: ['Lake Superior', 'Lake Titicaca', 'Caspian Sea', 'Lake Baikal'], answer: 3 },
      { q: 'Which country has the most time zones?', options: ['Russia', 'USA', 'France', 'China'], answer: 2 },
      { q: 'What is the capital of Bhutan?', options: ['Kathmandu', 'Thimphu', 'Paro', 'Punakha'], answer: 1 },
      { q: 'What mountain range separates Europe from Asia?', options: ['Alps', 'Caucasus Mountains', 'Carpathians', 'Ural Mountains'], answer: 3 },
      { q: 'What is the capital of Mongolia?', options: ['Irkutsk', 'Ulaanbaatar', 'Darkhan', 'Erdenet'], answer: 1 },
      { q: 'What is the longest river in Europe?', options: ['Rhine', 'Danube', 'Volga', 'Dnieper'], answer: 2 },
      { q: 'Which country has the longest coastline in the world?', options: ['Norway', 'Australia', 'Russia', 'Canada'], answer: 3 },
      { q: 'What is the capital of Burkina Faso?', options: ['Bamako', 'Niamey', 'Ouagadougou', 'Lomé'], answer: 2 },
      { q: 'Which is the largest desert in the world (including cold deserts)?', options: ['Sahara Desert', 'Gobi Desert', 'Arabian Desert', 'Antarctic Desert'], answer: 3 },
      { q: 'What is the capital of Kyrgyzstan?', options: ['Tashkent', 'Dushanbe', 'Bishkek', 'Ashgabat'], answer: 2 },
      { q: 'What is the second largest continent by area?', options: ['North America', 'Africa', 'Antarctica', 'Asia'], answer: 1 },
      { q: 'What is the capital of Suriname?', options: ['Georgetown', 'Cayenne', 'Paramaribo', 'Bridgetown'], answer: 2 },
      { q: 'In which country is the Atacama Desert?', options: ['Peru', 'Argentina', 'Bolivia', 'Chile'], answer: 3 },
      { q: 'What is the name of the strait between Spain and Morocco?', options: ['Strait of Messina', 'Strait of Hormuz', 'Strait of Gibraltar', 'Strait of Malacca'], answer: 2 },
    ],
  },

  science: {
    label: 'Science', icon: '🔬',
    normal: [
      { q: 'What is the chemical symbol for water?', options: ['HO', 'H2O', 'H2O2', 'OH'], answer: 1 },
      { q: 'How many bones are in the adult human body?', options: ['186', '196', '206', '216'], answer: 2 },
      { q: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mars', 'Mercury'], answer: 3 },
      { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], answer: 2 },
      { q: 'What is the most abundant gas in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Argon', 'Nitrogen'], answer: 3 },
      { q: 'What element has the chemical symbol Au?', options: ['Silver', 'Aluminium', 'Gold', 'Copper'], answer: 2 },
      { q: 'What force keeps planets in orbit around the Sun?', options: ['Magnetism', 'Friction', 'Nuclear force', 'Gravity'], answer: 3 },
      { q: 'What is the largest planet in our solar system?', options: ['Saturn', 'Uranus', 'Neptune', 'Jupiter'], answer: 3 },
      { q: 'How many chambers does a human heart have?', options: ['2', '3', '4', '5'], answer: 2 },
      { q: 'What is the boiling point of water at sea level?', options: ['90°C', '95°C', '100°C', '105°C'], answer: 2 },
      { q: 'Which organ produces insulin?', options: ['Liver', 'Kidney', 'Pancreas', 'Stomach'], answer: 2 },
      { q: 'What is the nearest star to Earth?', options: ['Proxima Centauri', 'Sirius', 'The Sun', 'Betelgeuse'], answer: 2 },
      { q: 'What is the chemical formula for table salt?', options: ['NaOH', 'KCl', 'NaCl', 'MgCl2'], answer: 2 },
      { q: 'What gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], answer: 2 },
      { q: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], answer: 1 },
    ],
    hard: [
      { q: 'What is the most electronegative element?', options: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'], answer: 2 },
      { q: 'What is the name of Saturn\'s largest moon?', options: ['Io', 'Europa', 'Titan', 'Ganymede'], answer: 2 },
      { q: 'What is absolute zero in Celsius?', options: ['-173.15°C', '-223.15°C', '-273.15°C', '-323.15°C'], answer: 2 },
      { q: 'How many elements are currently on the periodic table?', options: ['108', '112', '118', '124'], answer: 2 },
      { q: 'What is the chemical symbol for iron?', options: ['Ir', 'In', 'Fe', 'Fr'], answer: 2 },
      { q: 'Which particle has no electric charge?', options: ['Proton', 'Electron', 'Positron', 'Neutron'], answer: 3 },
      { q: 'What is the approximate speed of sound in air at room temperature?', options: ['243 m/s', '343 m/s', '443 m/s', '543 m/s'], answer: 1 },
      { q: 'What process does the Sun use to produce energy?', options: ['Nuclear fission', 'Nuclear fusion', 'Combustion', 'Radioactive decay'], answer: 1 },
      { q: 'What is the most abundant element in the universe?', options: ['Helium', 'Carbon', 'Hydrogen', 'Oxygen'], answer: 2 },
      { q: 'What is the hardest natural substance on Earth?', options: ['Corundum', 'Topaz', 'Quartz', 'Diamond'], answer: 3 },
      { q: 'What does DNA stand for?', options: ['Deoxyribonucleic acid', 'Deoxyribonitric acid', 'Deoxyriboneural acid', 'Dinitrogenase acid'], answer: 0 },
      { q: 'What is the pH value of a neutral solution?', options: ['5', '6', '7', '8'], answer: 2 },
      { q: 'What is the atomic number of carbon?', options: ['4', '5', '6', '7'], answer: 2 },
      { q: 'Which force holds protons and neutrons together in a nucleus?', options: ['Electromagnetic force', 'Weak nuclear force', 'Gravitational force', 'Strong nuclear force'], answer: 3 },
      { q: 'What is the half-life of Carbon-14?', options: ['1,430 years', '5,730 years', '11,460 years', '22,920 years'], answer: 1 },
    ],
  },

  football: {
    label: 'Football', icon: '⚽',
    normal: [
      { q: 'How many players are on a football team on the pitch?', options: ['9', '10', '11', '12'], answer: 2 },
      { q: 'How long is a standard football match?', options: ['80 minutes', '85 minutes', '90 minutes', '95 minutes'], answer: 2 },
      { q: 'Which country has won the most FIFA World Cups?', options: ['Germany', 'Argentina', 'Italy', 'Brazil'], answer: 3 },
      { q: 'Who is the all-time top scorer for the England national team?', options: ['Wayne Rooney', 'Gary Lineker', 'Harry Kane', 'Michael Owen'], answer: 2 },
      { q: 'Which club has won the most Premier League titles?', options: ['Arsenal', 'Liverpool', 'Manchester City', 'Manchester United'], answer: 3 },
      { q: 'In which country is the Santiago Bernabéu stadium?', options: ['Portugal', 'Italy', 'France', 'Spain'], answer: 3 },
      { q: 'What colour card results in a player being sent off?', options: ['Yellow', 'Orange', 'Red', 'Black'], answer: 2 },
      { q: 'Who won the 2018 FIFA World Cup?', options: ['Croatia', 'Belgium', 'England', 'France'], answer: 3 },
      { q: 'What does VAR stand for?', options: ['Video Assistant Referee', 'Video Analysis Review', 'Virtual Assistant Referee', 'Video Action Replay'], answer: 0 },
      { q: 'Which team plays at Old Trafford?', options: ['Manchester City', 'Liverpool', 'Leeds United', 'Manchester United'], answer: 3 },
      { q: 'Who scored the famous "Hand of God" goal?', options: ['Pelé', 'Diego Maradona', 'Ronaldo', 'Zinedine Zidane'], answer: 1 },
      { q: 'Which player has won the most Ballon d\'Or awards?', options: ['Cristiano Ronaldo', 'Zinedine Zidane', 'Ronaldinho', 'Lionel Messi'], answer: 3 },
      { q: 'In which year was the Premier League founded?', options: ['1988', '1990', '1992', '1995'], answer: 2 },
      { q: 'Which country hosted the 2022 World Cup?', options: ['Saudi Arabia', 'UAE', 'Bahrain', 'Qatar'], answer: 3 },
      { q: 'What is the name of Liverpool\'s home ground?', options: ['Goodison Park', 'Anfield', 'Elland Road', 'Villa Park'], answer: 1 },
    ],
    hard: [
      { q: 'Which club has won the most UEFA Champions League titles?', options: ['AC Milan', 'Bayern Munich', 'Barcelona', 'Real Madrid'], answer: 3 },
      { q: 'Who scored the winning goal in the 2010 World Cup Final?', options: ['David Villa', 'Fernando Torres', 'Andrés Iniesta', 'Xavi'], answer: 2 },
      { q: 'Who is the all-time top scorer in World Cup history?', options: ['Ronaldo (Brazil)', 'Gerd Müller', 'Just Fontaine', 'Miroslav Klose'], answer: 3 },
      { q: 'Which player has scored the most Premier League goals?', options: ['Wayne Rooney', 'Frank Lampard', 'Thierry Henry', 'Alan Shearer'], answer: 3 },
      { q: 'In which city is the Camp Nou stadium?', options: ['Madrid', 'Seville', 'Valencia', 'Barcelona'], answer: 3 },
      { q: 'Who scored a hat-trick in the 1966 World Cup Final?', options: ['Bobby Charlton', 'Martin Peters', 'Geoff Hurst', 'Roger Hunt'], answer: 2 },
      { q: 'In which year did Leicester City win the Premier League?', options: ['2014', '2015', '2016', '2017'], answer: 2 },
      { q: 'Who was the manager of France when they won the 2018 World Cup?', options: ['Laurent Blanc', 'Raymond Domenech', 'Didier Deschamps', 'Jacques Santini'], answer: 2 },
      { q: 'Which was the first African country to reach a World Cup semi-final?', options: ['Senegal', 'Cameroon', 'Ghana', 'Morocco'], answer: 3 },
      { q: 'In what year did Pelé win his first World Cup?', options: ['1954', '1956', '1958', '1962'], answer: 2 },
      { q: 'Who did Liverpool beat in the 2019 Champions League Final?', options: ['Ajax', 'Barcelona', 'Tottenham Hotspur', 'Manchester City'], answer: 2 },
      { q: 'Who won the Golden Boot at the 2022 World Cup?', options: ['Lionel Messi', 'Olivier Giroud', 'Julián Álvarez', 'Kylian Mbappé'], answer: 3 },
      { q: 'Which country has won the UEFA European Championship the most times?', options: ['France', 'Italy', 'Germany', 'Spain'], answer: 3 },
      { q: 'How many times has Brazil won the FIFA World Cup?', options: ['3', '4', '5', '6'], answer: 2 },
      { q: 'What year was the first FIFA World Cup held?', options: ['1926', '1928', '1930', '1934'], answer: 2 },
    ],
  },
};

// ── State ──────────────────────────────────────────────────────────────────
const state = { topic: null, difficulty: 'normal', questions: [], current: 0, score: 0, answered: false };

// ── Helpers ────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(q) {
  const correct = q.options[q.answer];
  const opts = shuffle(q.options);
  return { ...q, options: opts, answer: opts.indexOf(correct) };
}

// ── UI helpers ─────────────────────────────────────────────────────────────
function show(id) { document.getElementById(id).hidden = false; }
function hide(id) { document.getElementById(id).hidden = true; }

function showMenu() {
  show('quiz-menu'); hide('quiz-active'); hide('quiz-results');
  state.topic = null;
  document.querySelectorAll('.quiz-topic-card').forEach(c => c.classList.remove('selected'));
}

// ── Start ──────────────────────────────────────────────────────────────────
function startQuiz() {
  if (!state.topic) { alert('Please choose a topic first!'); return; }
  const pool = QUIZ_DATA[state.topic][state.difficulty];
  state.questions = shuffle(pool).slice(0, 10).map(shuffleOptions);
  state.current = 0;
  state.score = 0;
  hide('quiz-menu'); show('quiz-active'); hide('quiz-results');
  renderQuestion();
}

// ── Question ───────────────────────────────────────────────────────────────
function renderQuestion() {
  const q = state.questions[state.current];
  state.answered = false;

  document.getElementById('quiz-progress-text').textContent = `Question ${state.current + 1} of 10`;
  document.getElementById('quiz-progress-fill').style.width = `${state.current * 10}%`;
  document.getElementById('quiz-score-live').textContent = `${state.score} ✓`;
  document.getElementById('quiz-q-text').textContent = q.q;
  hide('quiz-next-btn');

  const container = document.getElementById('quiz-options');
  container.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => pickAnswer(i));
    container.appendChild(btn);
  });
}

function pickAnswer(index) {
  if (state.answered) return;
  state.answered = true;
  const correct = state.questions[state.current].answer;
  if (index === correct) state.score++;

  document.querySelectorAll('.quiz-option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    else if (i === index) btn.classList.add('wrong');
  });

  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.textContent = state.current === 9 ? 'See Results' : 'Next Question';
  show('quiz-next-btn');
}

function nextQuestion() {
  state.current++;
  if (state.current >= 10) showResults();
  else renderQuestion();
}

// ── Results ────────────────────────────────────────────────────────────────
function showResults() {
  hide('quiz-active'); show('quiz-results');
  const s = state.score;
  const emoji = s >= 9 ? '🏆' : s >= 7 ? '🌟' : s >= 5 ? '👍' : s >= 3 ? '📚' : '😅';
  const msg   = s >= 9 ? 'Outstanding!' : s >= 7 ? 'Great job!' : s >= 5 ? 'Not bad!' : s >= 3 ? 'Keep practising!' : 'Better luck next time!';
  document.getElementById('quiz-result-emoji').textContent = emoji;
  document.getElementById('quiz-result-score').textContent = `${s} / 10`;
  document.getElementById('quiz-result-msg').textContent = msg;
  document.getElementById('quiz-result-meta').textContent =
    `${QUIZ_DATA[state.topic].label} — ${state.difficulty === 'normal' ? 'Normal' : 'Difficult'}`;
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.quiz-topic-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.quiz-topic-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.topic = card.dataset.topic;
    });
  });

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.difficulty = btn.dataset.diff;
    });
  });

  document.getElementById('quiz-start-btn').addEventListener('click', startQuiz);
  document.getElementById('quiz-next-btn').addEventListener('click', nextQuestion);
  document.getElementById('quiz-again-btn').addEventListener('click', startQuiz);
  document.getElementById('quiz-topics-btn').addEventListener('click', showMenu);
});
