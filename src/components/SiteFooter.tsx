import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-32 pt-24 border-t-2 border-[#2e2a24] mb-32 flex flex-col items-center">
      <h2 className="mb-12">
        <Link href="/" aria-label="トップページへ戻る">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logotype.png"
            alt="記録資料一三四号"
            className="h-[22px] md:h-[36px] lg:h-[45px] w-auto object-contain brightness-0 hover:opacity-60 transition-opacity"
          />
        </Link>
      </h2>

      <div className="font-mono text-[10px] tracking-widest flex flex-wrap justify-center gap-x-12 gap-y-6">
        <Link href="/about" className="hover:opacity-50">WORLD</Link>
        <Link href="/#section-02" className="hover:opacity-50">ARCHIVES</Link>
        <Link href="/timeline" className="hover:opacity-50">TIMELINE</Link>
        <Link href="/administrator" className="hover:opacity-50">SENA SOUSOU</Link>
      </div>
    </footer>
  );
}
