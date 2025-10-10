'use client'
import React from 'react'
import Link from 'next/link'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="h-14 bg-white shadow flex items-center justify-between px-6">
        <div className="font-bold text-blue-600 text-lg">🧬 Genome-OS</div>
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 mr-4">Home</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">법적 고지 / Legal</h1>

        {/* Privacy */}
        <section id="privacy" className="mb-8">
          <h2 className="text-xl font-semibold mb-2">개인정보처리방침 (Privacy Policy)</h2>
          <p className="text-sm text-gray-600 mb-4">
            본 문서는 서비스 운영에 필요한 개인정보 수집·이용·보관·파기 절차 및 이용자 권리 등을 명시합니다.
            (예시) 수집항목: 이메일, 결제정보(입금자명/거래기록), 서비스 이용 기록. 보유기간: 관련 법령 또는 서비스 정책에 따름.
          </p>
          <details className="bg-white p-4 rounded border">
            <summary className="font-medium cursor-pointer">자세히 보기 (한국어)</summary>
            <div className="mt-3 text-sm text-gray-700 space-y-2">
              <p>1. 수집하는 개인정보 항목 및 목적</p>
              <p>2. 보유 및 이용기간</p>
              <p>3. 파기 절차 및 방법</p>
              <p>4. 이용자의 권리 및 행사 방법</p>
              <p>5. 연락처: 589second@gmail.com</p>
            </div>
          </details>

          <div className="mt-3 text-sm text-gray-500">
            <strong>Summary (EN):</strong> We collect basic contact and transaction information for order processing and support. Data retention and rights follow local law; contact: 589second@gmail.com
          </div>
        </section>

        {/* Terms */}
        <section id="terms" className="mb-8">
          <h2 className="text-xl font-semibold mb-2">이용약관 (Terms of Service)</h2>
          <p className="text-sm text-gray-600 mb-4">
            본 서비스는 다운로드형 소프트웨어로 제공되며, 구매 시 라이선스 정책이 적용됩니다. 아래는 주요 이용조건의 요약입니다.
          </p>
          <details className="bg-white p-4 rounded border">
            <summary className="font-medium cursor-pointer">주요 조건 보기</summary>
            <div className="mt-3 text-sm text-gray-700 space-y-2">
              <p>- 구매: 단일 라이선스(예: Lifetime) 또는 기업 계약</p>
              <p>- 배포: 구매자 외 재배포 금지</p>
              <p>- 책임 제한: 데이터 제공·분석 결과에 대한 책임 한정</p>
              <p>- 업데이트/지원: 구매조건에 따름</p>
            </div>
          </details>

          <div className="mt-3 text-sm text-gray-500">
            <strong>Summary (EN):</strong> The product is a downloadable dataset + software. License is non-transferable; liability limited to the extent permitted by law.
          </div>
        </section>

        {/* Refund */}
        <section id="refund" className="mb-8">
          <h2 className="text-xl font-semibold mb-2">환불정책 (Refund Policy)</h2>
          <p className="text-sm text-gray-600 mb-4">
            다운로드형 제품의 특성상, 원칙적으로 구매 후 환불은 제한됩니다. 단, 파일 손상·전달 오류 등 당사 귀책 사유가 확인될 경우 환불 또는 재전달을 제공합니다.
          </p>
          <details className="bg-white p-4 rounded border">
            <summary className="font-medium cursor-pointer">상세 규정 보기</summary>
            <div className="mt-3 text-sm text-gray-700 space-y-2">
              <p>- 환불 요청은 구매 후 7일 이내 접수</p>
              <p>- 구매자의 단순 변심은 환불 불가</p>
              <p>- 시스템 오류로 인한 미전달 시 전액 환불 또는 대체 제공</p>
            </div>
          </details>

          <div className="mt-3 text-sm text-gray-500">
            <strong>Summary (EN):</strong> Due to the nature of downloadable goods, refunds are limited. Refunds may be made for provider errors or failed delivery.
          </div>
        </section>

        <div className="mt-8 text-sm text-gray-600">
          <p>추가 문의: <a href="mailto:589second@gmail.com" className="text-blue-600 hover:underline">589second@gmail.com</a></p>
        </div>
      </main>

      {/* Footer (simple copy) */}
      <footer className="h-20 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
        © {new Date().getFullYear()} CoreAxisLab — Contact: 589second@gmail.com
      </footer>
    </div>
  )
}
