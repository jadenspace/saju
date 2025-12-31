import { PrivacyPolicy } from "@/entities/policy/ui/PrivacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 - 오늘의 운세는",
  description: "오늘의 운세는 개인정보처리방침입니다.",
};

export default function Page() {
  return <PrivacyPolicy />;
}
