# 第7章：裏方の仕事（管理画面と認証）

アーカイブが公開されたら、新しい資料を追加したり、既存の情報を直したりする必要があります。
しかし、誰でも自由に書き換えられては困りますよね？
この章では、管理者だけが入れる **「秘密の入り口（ログイン画面）」** と **「管理画面」** の仕組みを学びます。

---

## 🔐 認証（ログイン）の仕組み

「認証」とは、相手が本当に「管理者（あなた）」であるかを確認するプロセスです。
このプロジェクトでは、もっともシンプルな **「合言葉（パスワード）方式」** を採用しています。

---

## 📝 ログイン画面の全行解説 (src/app/sena-auth/LoginForm.tsx)

ユーザーがパスワードを入力する画面の仕組みです。

```tsx
1: 'use client';                             // 1: このファイルはブラウザで動く「部品」であることを宣言
3: import { useActionState } from 'react';   // 3: フォームの送信状態（送信中か、エラーか等）を管理する道具
4: import { loginContent } from '@/actions/auth'; // 4: パスワードを判定する「中身」のプログラムを読み込む
10: export default function LoginForm() {    // 10: ログインフォームという部品を作る
11:   const [state, formAction, isPending] = useActionState(loginContent, initialState); // 11: フォームの状態をセットアップ
14:   return (
15:     <form action={formAction} className="..."> // 15: 送信ボタンを押すと formAction が実行される
19:         <input
21:           name="password"                    // 21: 入力された文字を「password」という名前でサーバーに送る
22:           type="password"                    // 22: 入力文字が「●●●」と隠れるようにする
24:           className="..."                    // デザイン（枠線や色の設定）
25:           placeholder="••••••••"             // 何も打っていない時のヒント
29:       {state?.error && (                    // 29-31: もし間違っていたら、赤い文字でエラーを出す
30:         <p className="text-red-700 text-sm">{state.error}</p>
33:       <button
34:         type="submit"                        // 34: これが「送信ボタン」であることを示す
35:         disabled={isPending}                 // 35: 送信中はボタンを押せないようにする
38:         {isPending ? '認証中...' : '入室'}  // 38: 送信中なら「認証中...」、そうでなければ「入室」と表示
```

---

## 📝 パスワード判定の全行解説 (src/actions/auth.ts)

入力されたパスワードが正しいかチェックする、サーバー側の「門番」のようなプログラムです。

```tsx
1: 'use server';                             // 1: このファイルはサーバー（裏側）で安全に動くことを宣言
6: export async function loginContent(prevState: any, formData: FormData) { // 6: 判定を行う関数
7:   const password = formData.get('password') as string; // 7: 画面から送られてきたパスワードを読み取る
9:   const adminSecret = process.env.ADMIN_PASSWORD || 'SenaSouSou2266'; // 9: 正解のパスワード（環境変数または初期値）
11:  if (!password) {                        // 11-13: 空っぽだったらエラーを返す
12:    return { error: '合言葉が必要です。' };
13:  }
20:  if (password !== adminSecret) {         // 20-22: もし正解と違っていたらエラーを返す
21:    return { error: '合言葉が違います。' };
22:  }
25:  await createSession('sena-admin');      // 25: 「合格！」の印（セッション）をブラウザに渡す
27:  redirect('/sena-auth/dashboard');       // 27: 合格したので、管理用の特別な部屋（ダッシュボード）へ移動させる
```

---

## 🏗️ 管理画面（ダッシュボード）で行うこと

ログインに成功すると、`dashboard` フォルダ内のページが表示されます。ここでは：
*   **Prisma を使ったデータの追加**: 第2章で作った「引き出し」に新しい資料を入れる。
*   **写真の保存**: サムネイル画像をサーバーにアップロードする。
*   **情報の更新**: 間違っていた文章を書き換える。

といった作業を GUI（マウス操作）で行えるようにしています。

---

## 🚀 自分の力でやってみる（自習ミッション）

1.  `LoginForm.tsx` のボタンの文字を「入室」から「ログイン」に変えてみましょう。
2.  `auth.ts` の `SenaSouSou2266` という初期パスワードを、自分だけの秘密の言葉に変えてみましょう。

---

### [→ 次章：第8章：世界に公開する（Vercel デプロイ）](CHAPTER_08.md)
