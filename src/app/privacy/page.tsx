import { CERT_ORG_NAME, SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: `개인정보처리방침 | ${SITE_NAME}`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">개인정보처리방침</h1>
      <p className="mt-2 text-sm text-slate-500">시행일자: 2026년 9월 21일</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <p>
          {CERT_ORG_NAME}(이하 &ldquo;위원회&rdquo;)는 {SITE_NAME} 서비스(이하
          &ldquo;서비스&rdquo;)를 통해 이용자의 개인정보를 다음과 같이 수집·이용합니다.
        </p>

        <section>
          <h2 className="font-semibold text-slate-900">1. 수집하는 개인정보 항목</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>필수: 이메일 주소, 영문 이름, 비밀번호(암호화 저장)</li>
            <li>선택: 한국어 이름</li>
            <li>서비스 이용 과정에서 생성: 퀴즈 응시 결과, 위원회 신청서(제출 내용), 심사 결과, 자격증 발급 정보</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">2. 개인정보의 수집 및 이용 목적</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>회원 식별 및 로그인 등 회원제 서비스 제공</li>
            <li>1차 관문(퀴즈)·2차 관문(위원회 신청) 진행 및 심사</li>
            <li>자격증 발급, 발급번호 관리 및 진위 확인(공개 검증 페이지) 제공</li>
            <li>부정 가입·이용 방지 및 서비스 관련 공지사항 전달</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">3. 보유 및 이용 기간</h2>
          <p className="mt-2">
            회원 탈퇴 시 지체 없이 파기합니다. 다만 자격증이 발급된 이후 탈퇴하는 경우,
            이미 발급된 자격증의 검증 페이지(발급번호, 발급일)는 자격증 진위 확인 목적으로
            존속될 수 있습니다. 관계 법령에 따라 보존할 의무가 있는 경우 해당 법령에서
            정한 기간 동안 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">4. 개인정보의 제3자 제공 및 위탁</h2>
          <p className="mt-2">
            위원회는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 자격증
            페이지에서 이용자가 직접 &ldquo;LinkedIn 프로필에 추가&rdquo; 버튼을 클릭하는
            경우, 브라우저가 LinkedIn으로 이동하며 자격증명·발급기관·발급번호·발급일 등이
            URL 파라미터로 전달됩니다. 이는 이용자의 직접적인 클릭에 의해서만 발생하며,
            위원회 서버가 LinkedIn 측에 별도로 개인정보를 전송하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">5. 이용자의 권리</h2>
          <p className="mt-2">
            이용자는 언제든지 본인의 개인정보를 조회·수정할 수 있으며(개인정보 수정
            메뉴), 회원 탈퇴를 통해 개인정보 이용 동의를 철회하고 삭제를 요청할 수
            있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">6. 개인정보의 안전성 확보 조치</h2>
          <p className="mt-2">
            비밀번호는 복호화할 수 없는 방식으로 암호화하여 저장하며, 로그인 세션은
            암호화 서명된 쿠키로 관리합니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">7. 문의처</h2>
          <p className="mt-2">
            개인정보 처리에 관한 문의는 서비스 운영자에게 연락해주시기 바랍니다.
          </p>
        </section>
      </div>
    </div>
  );
}
