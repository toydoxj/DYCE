import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-navy">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        페이지를 찾을 수 없습니다
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-navy px-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
