import { prisma } from './prisma';

/**
 * 新規資料用の自動生成ID（例: DOC134-020-3675）を生成する
 * 10個の候補を一括でDBに問い合わせ、1回のクエリで空きを確認する高速版
 * @param genreCode 選択されたジャンルコード（例: 020）
 * @returns ユニークな displayId
 */
export async function generateDisplayId(genreCode: string): Promise<string> {
  const generateRandomId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `DOC134-${genreCode}-${randomNum}`;
  };

  // 10個の候補を生成し、一回のDBアクセスで空きを確認
  const candidates = Array.from({ length: 10 }, generateRandomId);

  const existingDocs = await prisma.document.findMany({
    where: { displayId: { in: candidates } },
    select: { displayId: true },
  });

  const existingIds = new Set(existingDocs.map((d) => d.displayId));
  const availableId = candidates.find((id) => !existingIds.has(id));

  if (availableId) return availableId;

  // 万が一10個すべて衝突した場合（確率0.01%未満）は5桁でフォールバック
  return `DOC134-${genreCode}-${Math.floor(10000 + Math.random() * 90000)}`;
}
