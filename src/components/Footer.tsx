'use client'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Korean block */}
        <div className="text-sm space-y-1">
          <div className="font-semibold text-gray-800">상호: 코어액시스랩스 (CoreAxis Labs)</div>
          <div>대표자: 장인석</div>
          <div>사업자등록번호: 233-39-01443</div>
          <div className="break-words">주소: 서울특별시 마포구 월드컵로 196, B동 1층 105-C115호 (성산동, 대명비첸시티오피스텔)</div>
          <div>업태: 정보통신업</div>
          <div>종목: 컴퓨터 프로그래밍 서비스업</div>
          <div>연락처: <a href="mailto:589second@gmail.com" className="text-blue-600 hover:underline">589second@gmail.com</a></div>
        </div>

        {/* English block */}
        <div className="text-sm space-y-1">
          <div className="font-semibold text-gray-800">CoreAxis Labs</div>
          <div>CEO: Insuk Jang</div>
          <div>Business Reg. No: 233-39-01443</div>
          <div className="break-words">Address: 105-C115, B1, Daemyung Vicencity Officetel, 196 Worldcup-ro, Mapo-gu, Seoul, Korea</div>
          <div>Business Type: IT Services</div>
          <div>Category: Computer Programming Services</div>
          <div>Contact: <a href="mailto:589second@gmail.com" className="text-blue-600 hover:underline">589second@gmail.com</a></div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <div>© {new Date().getFullYear()} CoreAxisLab</div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="/legal" className="hover:text-gray-700">개인정보처리방침 / Privacy</a>
            <a href="/legal#terms" className="hover:text-gray-700">이용약관 / Terms</a>
            <a href="/legal#refund" className="hover:text-gray-700">환불정책 / Refund</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
