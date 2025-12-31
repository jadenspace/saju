module.exports = {
  tabWidth: 2, // 들여쓰기 간격 2칸
  singleQuote: false, // 쌍따옴표 사용
  plugins: ["prettier-plugin-tailwindcss"], // Tailwind CSS 자동 정렬 플러그인
  // plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"], // Tailwind CSS 자동 정렬 플러그인
  trailingComma: "all", // 모든 곳에 후행 쉼표 사용
  semi: true, // 세미콜론 사용
  bracketSpacing: true, // 객체 리터럴의 중괄호 내부 공백 사용
  arrowParens: "always", // 화살표 함수 매개변수 항상 괄호 사용
};
