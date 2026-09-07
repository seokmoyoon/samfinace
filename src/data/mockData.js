export const INITIAL_USER = {
  name: '소비마스터',
  level: 3,
  title: '은빛 절약 탐험가',
  exp: 280,
  maxExp: 400,
  streakDays: 5,
  coins: 450
};

export const INITIAL_BUDGET = {
  totalIncome: 3200000,       // 월 수입
  fixedExpenses: 850000,      // 고정 지출 (월세, 관리비, 통신, 보험 등)
  monthlyBudget: 1200000,     // 한 달 생활비 목표 예산 (체력 HP)
  targetSavings: 1150000      // 이번 달 목표 저축액
};

// 결제수단 및 자산 계좌 목록
export const INITIAL_ACCOUNTS = [
  { id: 'acc_1', name: '현대카드 M', type: 'credit', balance: -145200, color: '#38BDF8', icon: '💳' },
  { id: 'acc_2', name: 'KB국민카드', type: 'credit', balance: -78500, color: '#FBBF24', icon: '💳' },
  { id: 'acc_3', name: '신한체크카드', type: 'check', balance: -24800, color: '#818CF8', icon: '💳' },
  { id: 'acc_4', name: '카카오뱅크 통장', type: 'bank', balance: 2450000, color: '#FEE500', icon: '🏦' },
  { id: 'acc_5', name: '토스 비상금통장', type: 'bank', balance: 1200000, color: '#0064FF', icon: '🏦' }
];

// SOBIMON(소비몬) 도감 데이터
export const INITIAL_SOBIMONS = [
  {
    id: 'mon_cafe',
    name: '카페몬',
    element: '카페/음료',
    badge: '☕',
    level: 3,
    discovered: true,
    description: '시원한 아이스 아메리카노 향기를 맡으면 깨어나는 몬스터. 지갑을 서서히 비운다.',
    quote: '"출근길 한 잔쯤은 포션이잖아...?"',
    condition: '이번 달 카페 5회 이상 방문 시 출현',
    color: '#8B5CF6',
    threat: '보스급 소비몬',
    evolutions: ['카페몬', '카페중독몬', '카페대왕몬']
  },
  {
    id: 'mon_delivery',
    name: '배달몬',
    element: '식비/외식',
    badge: '🛵',
    level: 2,
    discovered: true,
    description: '밤 9시 이후 배달앱 알림이 울릴 때마다 강해지는 야식 몬스터.',
    quote: '"배달팁 3,000원은 행복의 가치야!"',
    condition: '주 2회 이상 외식/배달 시 출현',
    color: '#EF4444',
    threat: '경계 대상',
    evolutions: ['배달몬', '새벽야식몬', '배달지배몬']
  },
  {
    id: 'mon_shop',
    name: '쇼핑몬',
    element: '쇼핑/마트',
    badge: '🛒',
    level: 2,
    discovered: true,
    description: '장바구니 담기와 무료배송 채우기를 좋아하는 쇼핑 중독 몬스터.',
    quote: '"1+1인데 지금 안 사면 손해 아냐?"',
    condition: '쇼핑/마트 소비 5만원 이상 시 출현',
    color: '#F59E0B',
    threat: '주의 단계',
    evolutions: ['쇼핑몬', '장바구니폭주몬', '지름신대마왕']
  },
  {
    id: 'mon_traffic',
    name: '교통몬',
    element: '교통/차량',
    badge: '🚕',
    level: 1,
    discovered: true,
    description: '비 오는 날과 늦잠 잔 아침, 카카오택시 부르는 손가락을 조종하는 몬스터.',
    quote: '"10분 더 자고 택시 타면 그만!"',
    condition: '택시/차량 이용 2회 이상 시 출현',
    color: '#3B82F6',
    threat: '주의 단계',
    evolutions: ['교통몬', '총알택시몬', '순간이동몬']
  },
  {
    id: 'mon_saver',
    name: '절약몬',
    element: '절약/무지출',
    badge: '🛡️',
    level: 4,
    discovered: true,
    description: '소비를 철통 방어하는 든든한 수호 몬스터. 무지출 데이가 지속될수록 거대해진다.',
    quote: '"오늘은 0원으로 방어 완료! 단 1원도 샐 수 없다."',
    condition: '무지출 데이 달성 시 소환',
    color: '#10B981',
    threat: '아군 수호신',
    evolutions: ['절약몬', '철벽방어몬', '황금수호신']
  },
  {
    id: 'mon_gold',
    name: '저축몬',
    element: '성장/저축',
    badge: '💰',
    level: 2,
    discovered: true,
    description: '목표 저축액을 채울 때마다 금빛으로 진화하는 희귀한 전설의 몬스터.',
    quote: '"티끌 모아 만든 황금산이 눈앞에!"',
    condition: '이번 달 목표 저축 80% 달성 시 소환',
    color: '#FBBF24',
    threat: '아군 수호신',
    evolutions: ['저축몬', '알뜰몬', '자산성장몬']
  },
  {
    id: 'mon_sub',
    name: '구독몬',
    element: '구독/정기결제',
    badge: '📺',
    level: 1,
    discovered: true,
    description: '매달 조용히 계좌에서 빠져나가는 넷플릭스, 유튜브 프리미엄의 망령.',
    quote: '"한 달에 만 원이면 커피 두 잔 값인데 뭐!"',
    condition: '정기 구독 3건 이상 등록 시 출현',
    color: '#0EA5E9',
    threat: '주의 단계',
    evolutions: ['구독몬', '다중구독몬', 'OTT대왕몬']
  },
  {
    id: 'mon_impulse',
    name: '충동몬',
    element: '충동구매',
    badge: '⚡',
    level: 0,
    discovered: false,
    description: '타임세일 카운트다운을 보면 이성을 잃는 미스터리 몬스터.',
    quote: '???',
    condition: '단일 품목 20만원 이상 충동소비 시 출현 (현재 미발견)',
    color: '#EC4899',
    threat: '미발견 실루엣',
    evolutions: ['충동몬', '지름신몬', '파산몬']
  },
  {
    id: 'mon_night',
    name: '야식몬',
    element: '야식/주류',
    badge: '🍺',
    level: 0,
    discovered: false,
    description: '심야 시간 편의점 4캔 맥주와 과자를 탐식하는 야행성 몬스터.',
    quote: '???',
    condition: '밤 11시 이후 편의점/술자리 소비 시 출현 (현재 미발견)',
    color: '#6366F1',
    threat: '미발견 실루엣',
    evolutions: ['야식몬', '치맥폭식몬', '심야대왕몬']
  }
];

export const INITIAL_QUESTS = [
  {
    id: 'q1',
    type: 'daily',
    title: '☕ 카페몬 봉인 작전',
    description: '오늘 카페/음료 소비 10,000원 이하로 방어',
    current: 5200,
    target: 10000,
    rewardExp: 50,
    rewardCoin: 20,
    status: 'progress',
    icon: '☕',
    category: '카페/디저트'
  },
  {
    id: 'q2',
    type: 'weekly',
    title: '🛵 주말 배달몬 격퇴전',
    description: '주말 동안 배달 주문 1회 이하로 지키기',
    current: 1,
    target: 1,
    rewardExp: 100,
    rewardCoin: 50,
    status: 'progress',
    icon: '🛵',
    category: '식비/외식'
  },
  {
    id: 'q3',
    type: 'daily',
    title: '🛡️ 오늘의 무지출 챌린지',
    description: '오늘 필수 지출 외 0원으로 절약몬 소환',
    current: 0,
    target: 0,
    rewardExp: 80,
    rewardCoin: 30,
    status: 'success',
    icon: '✨',
    category: '전체'
  },
  {
    id: 'q4',
    type: 'monthly',
    title: '🏆 소비 게이지 방어 수호전',
    description: '이번 달 생활비 예산 80% 이하로 수호하기',
    current: 128450,
    target: 960000,
    rewardExp: 200,
    rewardCoin: 100,
    status: 'progress',
    icon: '🏰',
    category: '전체'
  }
];

export const INITIAL_BADGES = [
  { id: 'b1', name: '첫 걸음 모험가', desc: '첫 소비 내역 기록', icon: '🌱', unlocked: true },
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
