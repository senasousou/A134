import { prisma } from './prisma';

/**
 * 新規資料用の自動生成ID（例: DOC134-020-3675）を生成する
 * @param genreCode 選択されたジャンルコード（例: 020）
 * @returns ユニークな displayId
 */
export async function generateDisplayId(genreCode: string): Promise<string> {
  const prefix = `DOC134-${genreCode}-`;

  let isUnique = false;
  let attempt = 0;
  let digits = 4;
  let generatedId = '';

  while (!isUnique) {
    if (attempt > 10) {
      // 万が一重複が10回以上続いたら5桁に拡張する
      digits = 5;
    }

    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

    generatedId = `${prefix}${randomNum}`;

    const existing = await prisma.document.findUnique({
      where: { displayId: generatedId },
    });

    if (!existing) {
      isUnique = true;
    }
    attempt++;
  }

  return generatedId;
}
