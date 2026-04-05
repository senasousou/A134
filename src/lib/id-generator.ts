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

  // 高速化プラン：一度に複数の候補を作成し、一回のクエリで空きを確認する
  const generateRandomId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `DOC134-${genreCode}-${randomNum}`;
  };

  // 10個の候補を生成
  const candidates = Array.from({ length: 10 }, generateRandomId);
  
  // 既存のIDを一括検索 (1回のDBアクセスのみ)
  const existingDocs = await prisma.document.findMany({
    where: {
      displayId: { in: candidates }
    },
    select: { displayId: true }
  });

  const existingIds = new Set(existingDocs.map(d => d.displayId));

  // 既存リストにない最初の候補を採用
  const availableId = candidates.find(id => !existingIds.has(id));

  if (availableId) {
    return availableId;
  }

  // 万が一、10個すべて衝突した場合（ほぼ不可能）は単一で再試行（フォールバック）
  const fallbackNum = Math.floor(10000 + Math.random() * 90000); // 5桁に増やす
  return `DOC134-${genreCode}-${fallbackNum}`;
}
