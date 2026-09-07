/**
 * 카드 명세서 CSV 파서
 * 금융사별 다양한 헤더 컬럼명을 유연하게 자동 감지하여 거래 내역으로 변환
 */
import { inferCategory } from './smsParser';

export function parseStatementCSV(csvContent) {
  if (!csvContent) return [];

  const lines = csvContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // 헤더 라인 찾기
  let headerIndex = -1;
  let headers = [];

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const row = lines[i].split(',').map(s => s.replace(/["']/g, '').trim());
    if (row.some(c => c.includes('금액') || c.includes('가맹점') || c.includes('사용처') || c.includes('내역'))) {
      headerIndex = i;
      headers = row;
      break;
    }
  }

  if (headerIndex === -1) {
    // 헤더를 못 찾았을 경우 기본 0번째를 헤더로 가정
    headerIndex = 0;
    headers = lines[0].split(',').map(s => s.replace(/["']/g, '').trim());
  }

  // 컬럼 인덱스 매핑
  const dateIdx = headers.findIndex(h => /일자|날짜|거래일|승인일/.test(h));
  const merchantIdx = headers.findIndex(h => /가맹점|사용처|상호|내역|내용/.test(h));
  const amountIdx = headers.findIndex(h => /금액|승인금액|이용금액|청구금액/.test(h));
  const categoryIdx = headers.findIndex(h => /업종|분류|구분/.test(h));

  const results = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(s => s.replace(/["']/g, '').trim());
    if (cols.length < 2) continue;

    const rawAmount = amountIdx !== -1 ? cols[amountIdx] : cols[2] || '0';
    const amount = parseInt(rawAmount.replace(/[^0-9-]/g, ''), 10);
    if (isNaN(amount) || amount <= 0) continue;

    const merchant = merchantIdx !== -1 ? cols[merchantIdx] : cols[1] || '가맹점';
    const date = dateIdx !== -1 ? cols[dateIdx] : '최근';
    const autoCat = categoryIdx !== -1 && cols[categoryIdx] ? cols[categoryIdx] : inferCategory(merchant);

    results.push({
      id: 'csv_' + Date.now() + '_' + i,
      type: 'expense',
      amount,
      merchant,
      cardCompany: '카드 명세서',
      category: autoCat,
      date,
      time: '00:00',
      source: '명세서 파일'
    });
  }

  return results;
}

// 시연용 샘플 카드 명세서 CSV 텍스트
export const SAMPLE_STATEMENT_CSV = `이용일자,이용가맹점,이용금액,업종
2026-09-01,쿠팡(주) 결제,48500,쇼핑/마트
2026-09-02,스타벅스 강남대로점,6300,카페/디저트
2026-09-02,배달의민족 처갓집양념치킨,26000,식비/외식
2026-09-03,카카오택시 자동결제,12800,교통/차량
2026-09-04,이마트 역삼점 장보기,65400,쇼핑/마트
2026-09-05,투썸플레이스 테헤란점,5800,카페/디저트
2026-09-06,김밥천국 점심식사,8500,식비/외식
2026-09-06,올리브영 명동본점,21500,쇼핑/마트`;
