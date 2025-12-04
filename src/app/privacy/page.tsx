import { PrivacyPolicy } from "@/entities/policy/ui/PrivacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 - 운명의 나침반",
  description: "운명의 나침반 개인정보처리방침입니다.",
};

export default function Page() {
  return <PrivacyPolicy />;
}
