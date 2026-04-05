# 第4章：資料を並べる（一覧ページの作成）

第3章までで、サイトの枠組みができました。
この章では、データベースに保存された「資料」を読み込んで、画面にずらりと並べる **トップページ（一覧画面）** の作り方を学びます。

---

## 📝 サーバーサイドでデータを取ってくる

Next.js の最大の特徴は、**「画面を表示する前に、サーバー側でデータベースからデータを取ってくる」** ことができる点です。これにより、表示が非常に速くなります。

`src/app/page.tsx` というファイルが、あなたのアーカイブの正面玄関（トップページ）になります。

---

## 📝 トップページの全行解説 (src/app/page.tsx)

量が多いので、重要な部分をピックアップして一行ずつ解説します。

### 1-30行目：準備とデータ取得
```tsx
1: import { getDocuments } from '@/actions/document'; // 資料をデータベースから取ってくる関数を読み込む
2: import { getGenres } from '@/actions/genre';       // ジャンル一覧を取ってくる関数を読み込む
7: export const dynamic = 'force-dynamic';            // ページを常に最新の状態にする設定
14: export default async function Home({             // 14: Homeという名前のページを作る（async は「待機」ができる魔法）
15:   searchParams,                                   // 15: 検索ワードなどの情報をURLから受け取る
19:   const params = await searchParams;              // 19: ブラウザからの情報を読み取るまで待つ
27:   const [documents, genres] = await Promise.all([ // 27: 資料とジャンルを同時にデータベースから取ってくる
28:     getDocuments(filters),
29:     getGenres()
30:   ]);
```

### 136-164行目：特別な資料（零号）の表示
ここでは、「DOC134-000」という特別なIDを持つ資料だけを、一番上に大きく表示する仕組みを作っています。
```tsx
137: {!q && !genreId && !tag && (                     // 137: 検索していない時だけ、特別な資料を表示する
139:    <Link href={`/document/DOC134-000`}            // 139: クリックしたら零号資料のページへ飛ぶ
141:       className="group flex flex-col md:flex-row border border-[#2e2a24] ..." // 141: 見た目の設定。枠線や余白を指定
```

### 167-220行目：資料カードの並べ部（グリッド）
取ってきた資料を一個ずつ「カード」の形にして並べます。
```tsx
168: <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> // 168: 画面の横幅に合わせて、1〜4列に自動で並べる
169:   {documents.filter(d => d.displayId !== 'DOC134-000').map((doc) => ( // 169: 零号以外の資料を一つずつ取り出してループ処理
170:     <Link key={doc.id} href={`/document/${doc.displayId}`} ...>     // 170: 各資料の専用ページへのリンク
180:       <div className="relative w-full aspect-[4/3] bg-[#e1ddd1] mb-5"> // 180: 画像エリア。4:3の比率で固定
181:         {doc.thumbnailUrl ? (                                         // 181: 画像があったら表示する
183:           <img src={doc.thumbnailUrl} alt={doc.title} ... />
189:         ) : (                                                         // 189: 画像がなかったら「No Visual Data」と出す
192:           <span>No Visual Data</span>
198:         <h3 className="font-serif text-lg font-bold ...">{doc.title}</h3> // 198: タイトルを表示
```

---

## 🎨 デザインのこだわり：学術的な雰囲気

このプロジェクトでは、ただ並べるだけでなく「管理されているアーカイブ」としての雰囲気作りにこだわっています。

*   **`font-serif`**: 明朝体（セリフ体）を使って、古書や論文のような硬い印象を与えています。
*   **`font-mono`**: 資料番号（DOC134...）には等幅フォント（モノスペース）を使い、コンピュータや機械が管理しているような「無機質さ」を演出しています。
*   **`border-[#bbb4a4]/30`**: 真っ黒ではなく、少しベージュがかったグレーの線を使うことで、目に優しく落ち着いた雰囲気になります。

---

## 🚀 自分の力でやってみる（自習ミッション）

1.  `page.tsx` の中の「資料概要」と書かれた文字を「アーカイブサマリー」に変えてみましょう。
2.  カードの背景色 `bg-[#e1ddd1]` を、自分の好きな色（`bg-red-50` など）に変えて、どう変わるか見てみましょう。

---

### [→ 次章：第5章：細部を語る（詳細ページと動的ルーティング）](CHAPTER_05.md)
