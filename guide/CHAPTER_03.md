# 第3章：枠組みを作る（Next.js の基本構造）

第1章・第2章で、道具と設計図が揃いました。
この章では、実際のウェブサイトの「骨組み」となる **Next.js のフォルダ構成と、共通レイアウト** について学びます。

---

## 📂 Next.js のフォルダは「住所」

Next.js（App Router）では、フォルダの名前がそのままウェブサイトのURLになります。

*   `app/page.tsx` → トップページ（`https://example.com/`）
*   `app/about/page.tsx` → 紹介ページ（`https://example.com/about`）
*   `app/layout.tsx` → 全てのページで共通して表示される枠組み

このように、フォルダを作ってその中に `page.tsx` を置くだけで新しいページが作れる。これが Next.js の直感的で便利なところです。

---

## 📝 全ページ共通の枠組み（src/app/layout.tsx）

「ヘッダー（上のメニュー）」や「フッター（一番下のコピーライト）」など、どのページを開いても常に表示しておきたいものは、`layout.tsx` に書きます。

### 全行解説

```tsx
1: import type { Metadata } from "next";          // Next.jsの検索エンジン向け設定(Metadata)を使うための準備
2: import { Geist, Geist_Mono } from "next/font/google"; // Google Fontsからお洒落なフォントを読み込む
3: import "./globals.css";                       // 全体に適用するCSS（見た目の設定）を読み込む
4: import Header from "@/components/Header";    // 自分で作った「ヘッダー」部品を読み込む
5:
16: export const metadata: Metadata = {          // 16-19: サイトのタイトルや説明文を設定
17:   title: "記録資料一三四号 - TENGEN ARCHIVE",
18:   description: "創作叙事詩「てんげん」に関連する記録資料の保管庫",
19: };
20:
21: export default function RootLayout({        // 21-25: サイト全体の枠組みを作る関数
22:   children,                                 // 各ページの「中身」を children という名前で受け取る
23: }: Readonly<{
24:   children: React.ReactNode;
25: }>) {
26:   return (
27:     <html lang="ja">                        // 27: 言語を日本語(ja)に設定
29:       <body className="min-h-full flex flex-col bg-[#f4efe4]"> // 31: 全体の背景色をベージュ(Cosmic Latte)に
32:         <Header />                             // 32: 画面の一番上にヘッダーを表示
33:         <main className="flex-1">{children}</main> // 33: 各ページの中身(children)を中央に表示。flex-1で余った場所を埋める
34:         <footer className="py-12 text-center"> // 34-38: 画面の一番下にフッターを表示
35:           <p className="font-mono text-[10px]">©️2026 SENA SOUSOU</p>
38:         </footer>
39:       </body>
40:     </html>
41:   );
42: }
```

---

## 📝 ヘッダーの仕組み（src/components/Header.tsx）

ヘッダーは少し複雑ですが、初心者が知っておくべき重要なポイントは **「リンク」** と **「状態（useState）」** です。

### 重要なポイント解説

*   **`Link` (3行目)**: 他のページへジャンプするための道具です。これを使うと、ページを読み直さずに一瞬で切り替わります。
*   **`useState` (5行目)**: 「メニューが開いているか、閉じているか」といった**今の状態**をプログラムに覚えさせておくための仕組みです。
*   **`pathname` (90行目)**: 「今どのページを見ているか」を知ることができます。これを使って、今いるページのメニューを強調したりします。

---

## 🎨 デザインの指定（Tailwind CSS）

コードの中によく出てくる `className="flex flex-col bg-[#f4efe4]"` などの記述。これが **Tailwind CSS（テイルウィンド）** です。

*   **`flex`**: 要素を横や縦に並べる。
*   **`bg-[#f4efe4]`**: 背景色を指定した色にする。
*   **`text-center`**: 文字を真ん中に寄せる。

このように、短いキーワードを書くだけでデザインができるのが特徴です。

---

### [→ 次章：第4章：資料を並べる（一覧ページの作成）](CHAPTER_04.md)
