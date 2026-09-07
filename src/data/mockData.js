export const INITIAL_USER = {
  name: '지갑지킴이',
  level: 3,
  title: '은빛 절약 기사',
  exp: 280,
  maxExp: 400,
  streakDays: 5
};

export const INITIAL_BUDGET = {
  totalIncome: 3200000,       // 월 수입
  fixedExpenses: 850000,      // 고정 지출 (월세, 관리비, 통신, 보험 등)
  monthlyBudget: 1200000,     // 한 달 생활비 목표 예산 (체력 HP)
  targetSavings: 1150000      // 이번 달 목표 저축액
};

// 결제수단 및 자산 계좌 목록 (편한가계부 스타일)
export const INITIAL_ACCOUNTS = [
  { id: 'acc_1', name: '현대카드 M', type: 'credit', balance: -145200, color: '#38BDF8', icon: '💳' },
  { id: 'acc_2', name: 'KB국민카드', type: 'credit', balance: -78500, color: '#FBBF24', icon: '💳' },
  { id: 'acc_3', name: '신한체크카드', type: 'check', balance: -24800, color: '#818CF8', icon: '💳' },
  { id: 'acc_4', name: '카카오뱅크 통장', type: 'bank', balance: 2450000, color: '#FEE500', icon: '🏦' },
  { id: 'acc_5', name: '토스 비상금통장', type: 'bank', balance: 1200000, color: '#0064FF', icon: '🏦' }
];

export const INITIAL_QUESTS = [
  {
    id: 'q1',
    title: '☕ 커피값 세이브 챌린지',
    description: '이번 주 카페/디저트 지출 15,000원 이하 방어',
    current: 10800,
    target: 15000,
    rewardExp: 80,
    status: 'progress',
    icon: '☕',
    category: '카페/디저트'
  },
  {
    id: 'q2',
    title: '🍱 주말 배달음식 방어전',
    description: '주말 동안 배달 주문 1회 이하로 방어하기',
    current: 1,
    target: 1,
    rewardExp: 120,
    status: 'progress',
    icon: '🛵',
    category: '식비/외식'
  },
  {
    id: 'q3',
    title: '🛡️ 오늘의 무지출 챌린지',
    description: '오늘 필수 지출 외 0원 쓰기',
    current: 0,
    target: 0,
    rewardExp: 50,
    status: 'success',
    icon: '✨',
    category: '전체'
  }
];

export const INITIAL_BADGES = [
  { id: 'b1', name: '첫 걸음 모험가', desc: '첫 지출 내역 기록', icon: '🌱', unlocked: true },
  { id: 'b2', name: '예산의 수호자', desc: '한 달 예산 80% 이하 방어 성공', icon: '🛡️', unlocked: true },
  { id: 'b3', name: '무지출 마스터', desc: '무지출 데이 3일 달성', icon: '💎', unlocked: true },
  { id: 'b4', name: '영수증 정복자', desc: '카드 명세서 1회 첨부 분석', icon: '📜', unlocked: true },
  { id: 'b5', name: '황금 보물상자', desc: '누적 100만원 이상 저축 성공', icon: '👑', unlocked: false }
];

// 2026년 9월 1일 ~ 7일까지의 풍성한 거래 데이터 (달력 뷰 연동)
export const INITIAL_TRANSACTIONS = [
  // 9월 7일
  {
    id: 't_7_1',
    type: 'expense',
    amount: 5200,
    merchant: '스타벅스 역삼점',
    cardCompany: '현대카드 M',
    category: '카페/디저트',
    date: '2026-09-07',
    time: '08:40',
    source: 'SMS 자동',
    memo: '아이스 아메리카노 테이크아웃'
  },
  {
    id: 't_7_2',
    type: 'expense',
    amount: 11000,
    merchant: '맥도날드 점심',
    cardCompany: 'KB국민카드',
    category: '식비/외식',
    date: '2026-09-07',
    time: '12:15',
    source: 'SMS 자동',
    memo: '빅맥 세트'
  },
  // 9월 6일
  {
    id: 't_6_1',
    type: 'expense',
    amount: 24500,
    merchant: '쿠팡 로켓프레시',
    cardCompany: '현대카드 M',
    category: '쇼핑/마트',
    date: '2026-09-06',
    time: '21:30',
    source: '명세서 파일',
    memo: '주말 샐러드 및 과일'
  },
  {
    id: 't_6_2',
    type: 'expense',
    amount: 1450,
    merchant: '서울교통공사(지하철)',
    cardCompany: '신한체크카드',
    category: '교통/차량',
    date: '2026-09-06',
    time: '18:50',
    source: 'SMS 자동',
    memo: '퇴근길 교통'
  },
  // 9월 5일
  {
    id: 't_5_1',
    type: 'expense',
    amount: 32000,
    merchant: '하남돼지집 저녁회식',
    cardCompany: 'KB국민카드',
    category: '식비/외식',
    date: '2026-09-05',
    time: '19:40',
    source: '명세서 파일',
    memo: '팀 저녁식사 분담'
  },
  // 9월 4일 - 무지출 데이 (지출 없음!)
  // 9월 3일
  {
    id: 't_3_1',
    type: 'expense',
    amount: 12800,
    merchant: '카카오택시 자동결제',
    cardCompany: '카카오뱅크 통장',
    category: '교통/차량',
    date: '2026-09-03',
    time: '23:10',
    source: '카카오톡 알림톡',
    memo: '야근 후 택시 귀가'
  },
  // 9월 2일
  {
    id: 't_2_1',
    type: 'expense',
    amount: 26000,
    merchant: '배달의민족 처갓집양념치킨',
    cardCompany: '현대카드 M',
    category: '식비/외식',
    date: '2026-09-02',
    time: '19:15',
    source: '카카오톡 알림톡',
    memo: '치팅데이 야식'
  },
  // 9월 1일 - 월급일 (수입) 및 마트 장보기
  {
    id: 't_1_income',
    type: 'income',
    amount: 3200000,
    merchant: '(주)삼전 급여입금',
    cardCompany: '카카오뱅크 통장',
    category: '급여/월급',
    date: '2026-09-01',
    time: '09:00',
    source: '급여 입금',
    memo: '9월 기본급 및 식대'
  },
  {
    id: 't_1_1',
    type: 'expense',
    amount: 48500,
    merchant: '이마트 역삼점',
    cardCompany: '현대카드 M',
    category: '쇼핑/마트',
    date: '2026-09-01',
    time: '18:30',
    source: '명세서 파일',
    memo: '생필품 장보기'
  }
];
