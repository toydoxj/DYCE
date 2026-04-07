import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="font-heading text-7xl font-extrabold text-navy">404</h1>
      <p className="mt-4 text-lg text-slate">
        페이지를 찾을 수 없습니다
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-light px-6 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-brand/25"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
