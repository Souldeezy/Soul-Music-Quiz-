export default function QuizRichText({ children }) {
  const parts = String(children ?? "").split(/(~[^~]+~|\*[^*]+\*)/g);

  return parts.map((part, index) =>
    part.startsWith("~") && part.endsWith("~")
      ? <em key={index}>&quot;{part.slice(1, -1)}&quot;</em>
      : part.startsWith("*") && part.endsWith("*")
        ? <em key={index}>{part.slice(1, -1)}</em>
      : part
  );
}
