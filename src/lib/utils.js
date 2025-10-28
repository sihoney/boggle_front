import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function fmtComma(value) {
  if (value == null) return "0";

  // 숫자만 입력된 경우 → 그대로 변환
  if (!isNaN(value)) {
    const num = parseFloat(value);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // 문자열 안 숫자만 찾아서 변환 (예: "₩123456원" → "₩123,456원")
  return value.replace(/(\d+)(?=(\d{3})+(?!\d))/g, (match) =>
    match.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}
