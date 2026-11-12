const test = document.querySelector('[data-test-key]');
const questions = [...test.querySelectorAll('[data-correct]')];
const progress = test.querySelector('[data-test-progress]');
const result = test.querySelector('[data-test-result]');
const next = test.querySelector('[data-test-next]');
const storageKey = test.dataset.testKey;
let answers = [];

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ??
    localStorage.getItem(test.dataset.previousTestKey) ?? '[]');
  if (Array.isArray(saved) && saved.length <= questions.length &&
      saved.every((answer, index) => Number.isInteger(answer) && answer >= 0 &&
        answer < questions[index].querySelectorAll('[data-choice]').length)) {
    answers = saved;
  }
} catch {}

let current = Math.min(answers.length, questions.length - 1);

function showQuestion() {
  questions.forEach((question, index) => {
    question.hidden = index !== current;
  });
  progress.textContent = 'Вопрос ' + (current + 1) + ' из ' + questions.length;
}

function showAnswer() {
  const question = questions[current];
  const correct = Number(question.dataset.correct);
  const buttons = [...question.querySelectorAll('[data-choice]')];
  const chosen = answers[current];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === chosen) button.dataset.result = index === correct ? 'correct' : 'incorrect';
    if (index === correct) button.dataset.result = 'correct';
  });
  const feedback = chosen === correct
    ? 'Верно.'
    : 'Неверно. Правильный ответ — ' + buttons[correct].textContent + '.';
  question.querySelector('[data-feedback]').textContent = question.dataset.explanation
    ? feedback + ' ' + question.dataset.explanation
    : feedback;
  next.hidden = current + 1 === questions.length;
  if (next.hidden) {
    const score = answers.filter((answer, index) => answer === Number(questions[index].dataset.correct)).length;
    result.textContent = 'Итог — ' + score + ' из ' + questions.length + ' верных ответов.';
  }
}

test.addEventListener('click', event => {
  const choice = event.target.closest('[data-choice]');
  if (!choice || answers.length !== current) return;
  answers.push(Number(choice.dataset.choice));
  try {
    localStorage.setItem(storageKey, JSON.stringify(answers));
  } catch {
    test.querySelector('[data-test-storage]').hidden = false;
  }
  showAnswer();
  (next.hidden ? result : next).focus();
});

next.addEventListener('click', () => {
  current += 1;
  next.hidden = true;
  showQuestion();
  questions[current].querySelector('h2').focus();
});

showQuestion();
if (answers.length === questions.length) showAnswer();
