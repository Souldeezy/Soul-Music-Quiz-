/**
 * Quiz engine extracted from the vanilla California Soul script.
 *
 * It deliberately contains no DOM manipulation: React owns the markup and
 * this module owns the same question selection, shuffling and answer rules
 * as the original page.
 */

export const QUESTIONS_PER_GAME = 10;

export function shuffleArray(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export function prepareQuiz(questionDatabase, levelKey) {
  return shuffleArray(questionDatabase[levelKey]).slice(0, QUESTIONS_PER_GAME);
}

export function prepareOptions(question) {
  return shuffleArray(question.options);
}

export function evaluateAnswer(question, selectedAnswer) {
  const isCorrect = selectedAnswer === question.answer;

  return {
    isCorrect,
    scoreDelta: isCorrect ? 1 : 0,
    correctAnswer: question.answer,
    explanation: question.explanation || "",
  };
}

export function getEndMessage(levelKey, score) {
  if (levelKey === "soulLegend" && score === QUESTIONS_PER_GAME) {
    return "Wow... Vous êtes une légende !";
  }

  if (score > 8) return "Excellent, vous êtes un vrai connaisseur !";
  if (score > 5) return "Pas mal du tout !";
  return "Vous pouvez faire mieux !";
}
