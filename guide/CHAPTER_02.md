# 第2章：設計図を描く（データモデルと Prisma）

ウェブサイトに「資料」を保存するためには、情報を整理して保管する「引き出し（データベース）」が必要です。
この章では、**Prisma（プリズマ）** という道具を使って、資料をどう整理するかを決める「設計図」を作成します。

---

## 📂 データベースを「引き出し」として理解する

想像してみてください。あなたは博物館の倉庫を任されました。
資料をそのまま床に置くと、どこに何があるか分からなくなりますよね？
そこで、「資料ID」「タイトル」「説明文」などの項目を書いたラベルを貼り、決まった場所に保管します。

プログラミングでは、この「引き出しのルール」を **データモデル（Data Model）** と呼びます。

---

## 🛠️ Prisma の準備

ターミナルで以下のコマンドを打って、Prisma をインストールしましょう。

```bash
npm install prisma --save-dev
npx prisma init
```

実行すると、プロジェクトの中に `prisma` というフォルダと `schema.prisma` というファイルが作られます。これが**あなたのアーカイブの設計図（心臓部）**です。

---

## 📝 設計図を書く（schema.prisma の全行解説）

`/prisma/schema.prisma` ファイルを開いて、中身を以下のように書き換えてみましょう。
（※初心者向けに、まずは設定を SQLite という簡単なものにして解説します）

```prisma
// 1行目: Prisma が使うプログラムを生成するための設定
generator client {
  provider = "prisma-client-js"
}

// 5行目: データベースの場所を指定します（今回はファイルとして保存する SQLite）
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// 10行目: 「ジャンル（Genre）」のルールを作ります
model Genre {
  id        String     @id @default(cuid()) // 11: システムが自動で割り振るユニークなID
  code      String     @unique               // 12: "010" 等のジャンル番号（重複なし）
  name      String                           // 13: "絵画" などの名前
  documents Document[]                       // 14: このジャンルに属する「資料」たちのリスト
  createdAt DateTime   @default(now())       // 15: 作成された日時を自動記録
  updatedAt DateTime   @updatedAt             // 16: 更新された日時を自動記録
}

// 19行目: メインとなる「資料（Document）」のルールです
model Document {
  id           String   @id @default(cuid()) // 20: 内部的なID
  displayId    String   @unique               // 21: 表示用のID（例: DOC134-020-3675）
  title        String                         // 22: 資料のタイトル
  content      String                         // 23: 資料の内容（文章）
  thumbnailUrl String?                        // 24: 画像のURL（空でもOKなように "?" が付いています）
  genreId      String                         // 25: どのジャンルに属しているかを示すID
  genre        Genre    @relation(fields: [genreId], references: [id]) // 26: ジャンルと自分を紐付ける
  tags         String                         // 27: 検索用のキーワード
  createdAt    DateTime @default(now())       // 28: 登録日時
  updatedAt    DateTime @updatedAt             // 29: 更新日時
}
```

### 💡 重要なキーワード解説

1.  **`model`**: 「引き出しの一つ」を作るときに使います。
2.  **`String`**: 文字列（名前やID）を入れるという意味です。
3.  **`DateTime`**: 日付と時刻を入れるという意味です。
4.  **`@id`**: これがその行の「主役」であることを示します（重複不可）。
5.  **`@default(cuid())`**: 何も指定しなかった時、システムが「`ckxxxxxx...`」のようなランダムで被らない文字を自動で作ってくれる超便利な機能です。
6.  **`@relation`**: 「この資料は、このジャンルのものですよ」と、異なる引き出し同士を糸で結ぶイメージです。

---

## ⚡ 変更を反映させる（マイグレーション）

設計図（schema.prisma）を書き終わったら、ターミナルで以下のコマンドを打ちます。

```bash
npx prisma migrate dev --name init
```

### この一行の全行解説：
1.  **`npx prisma migrate dev`**: 「書いた設計図を元に、実際のデータベースの形に作り変えろ（引越し作業をせよ）」という命令です。
2.  **`--name init`**: この変更に名前を付けます。最初は「init（初期設定）」とすることが多いです。

これを実行すると、`dev.db` というファイルが作られ、あなたのパソコンの中に**本物のデータベース**が誕生します。

---

### [→ 次章：第3章：枠組みを作る（Next.js の基本構造）](CHAPTER_03.md)
