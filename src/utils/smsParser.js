/**
 * 통합 결제 알림 파싱 엔진 (SMS + 카카오톡 알림톡 + 카드사/금융 앱 푸시)
 * 신한, KB국민, 현대, 삼성, 하나, 롯데, 농협, 카카오뱅크, 카카오페이, 토스, 네이버페이 등
 */

// 키워드 기반 카테고리 자동 추론 규칙
const CATEGORY_RULES = {
  '카페/디저트': ['스타벅스', '투썸', '이디야', '메가커피', '컴포즈', '배스킨', '설빙', '파리바게뜨', '뚜레쥬르', '카페', '커피', '빽다방', '공차', '폴바셋'],
  '식비/외식': ['배달의민족', '요기요', '쿠팡이츠', '식당', '맥도날드', '버거킹', '김밥', '포차', '고기', '한식', '중식', '일식', '갈비', '치킨', '우동', '돈까스', '피자', '역전우동'],
  '쇼핑/마트': ['쿠팡', '네이버페이', '이마트', '홈플러스', '마켓컬리', '올리브영', '다이소', '편의점', 'GS25', 'CU', '세븐일레븐', '무신사', '지그재그', '에이블리'],
  '교통/차량': ['카카오T', '코레일', '지하철', '버스', '주유소', 'GS칼텍스', 'SK에너지', '쏘카', '티머니', '하이패스'],
  '생활/구독': ['KT', 'SKT', 'LGU+', '관리비', '한국전력', '도시가스', '넷플릭스', '유튜브', '쿠팡와우', '티빙', '웨이브', '디즈니', '스포티파이', '멜론'],
  '의료/건강': ['약국', '병원', '의원', '내과', '치과', '이비인후과', '정형외과', '헬스', '필라테스', '한의원']
};

export function inferCategory(merchant) {
  if (!merchant) return '기타/생활';
  const cleanMerchant = merchant.replace(/\s+/g, '').toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    for (const kw of keywords) {
      if (cleanMerchant.includes(kw.toLowerCase())) {
        return category;
      }
    }
  }
  return '기타/생활';
}

/**
 * SMS, 카카오톡 알림톡, 금융 앱 푸시 통합 파서
 */
export function parseCardSMS(text) {
  if (!text || typeof text !== 'string') return null;

  const raw = text.trim();

  // 1. 금액 추출 (예: 15,000원, 15000원, 1,200,000원, 결제금액: 32,000원 등)
  const amountMatch = raw.match(/([0-9]{1,3}(?:,[0-9]{3})*|[0-9]+)\s*원/);
  if (!amountMatch) return null;
  const amount = parseInt(amountMatch[1].replace(/,/g, ''), 10);

  // 2. 출처 채널 & 발송 금융사 판별
  let channel = 'SMS';
  let cardCompany = '신용/체크카드';
  let badgeColor = '#4F46E5';

  if (raw.includes('카카오톡') || raw.includes('알림톡') || raw.includes('카카오페이') || raw.includes('[카카오]')) {
    channel = '카카오톡 알림톡';
    badgeColor = '#FEE500';
    cardCompany = raw.includes('카카오페이') ? '카카오페이' : '카카오뱅크';
  } else if (raw.includes('토스') || raw.includes('toss')) {
    channel = '토스 앱 푸시';
    badgeColor = '#0064FF';
    cardCompany = '토스뱅크';
  } else if (raw.includes('네이버페이')) {
    channel = '네이버페이 알림';
    badgeColor = '#03C75A';
    cardCompany = '네이버페이';
  } else {
    // 일반 SMS 또는 카드사 앱 푸시
    const cardNames = ['신한', '국민', 'KB', '현대', '삼성', '하나', '롯데', '농협', 'NH', '우리', 'BC', '기업'];
    for (const name of cardNames) {
      if (raw.includes(name)) {
        cardCompany = name.includes('KB') ? 'KB국민카드' : `${name}카드`;
        break;
      }
    }
    if (raw.includes('앱푸시') || raw.includes('PUSH')) {
      channel = '카드사 앱 푸시';
    }
  }

  // 3. 결제 일시 추출
  let dateTimeStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const dateMatch = raw.match(/(\d{1,2}\/\d{1,2}|\d{1,2}월\s*\d{1,2}일)\s*(\d{1,2}:\d{2})?/);
  if (dateMatch) {
    const today = new Date();
    dateTimeStr = `${today.getFullYear()}-${dateMatch[0].replace('월', '-').replace('일', '').trim()}`;
  }

  // 4. 가맹점 추출
  let merchant = '가맹점 미확인';

  // 카카오톡 알림톡 포맷: "사용처: 넷플릭스" 또는 "가맹점: 메가MGC커피" 형태 우선 체크
  const explicitMerchantMatch = raw.match(/(?:사용처|가맹점|이용처|상호명|결제처)\s*[:：]\s*([가-힣A-Za-z0-9_\(\)\s]+)/);
  if (explicitMerchantMatch && explicitMerchantMatch[1]) {
    merchant = explicitMerchantMatch[1].split('\n')[0].trim();
  } else {
    // 라인 또는 정규식 파싱
    const merchantPattern = /(?:승인|일시불|결제)?\s*([0-9,]+원)\s*([가-힣A-Za-z0-9_\(\)\s]+)/;
    const match = raw.match(merchantPattern);

    if (match && match[2]) {
      let candidate = match[2]
        .replace(/일시불|누적.*|잔여.*|승인.*|\d{1,2}\/\d{1,2}.*|\d{1,2}:\d{2}.*|잔액.*/g, '')
        .trim();
      if (candidate.length > 0) {
        merchant = candidate.split(' ')[0];
      }
    }

    if (merchant === '가맹점 미확인' || merchant.length === 0) {
      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        if (!line.includes('원') && !line.includes('승인') && !line.includes('web') && !line.includes('알림') && line.length < 25) {
          merchant = line;
          break;
        }
      }
    }
  }

  const category = inferCategory(merchant);

  return {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    type: 'expense',
    amount,
    merchant: merchant || '기타 결제',
    cardCompany,
    category,
    channel,
    badgeColor,
    date: new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }),
    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    source: `${channel}`
  };
}

// 테스트용 샘플 메시지 (SMS, 카카오톡 알림톡, 토스 푸시, 네이버페이 등)
export const SAMPLE_MULTI_CHANNEL_MESSAGES = [
  {
    type: 'kakao',
    title: '💬 카카오톡 알림톡 (카카오페이)',
    appIcon: '💬',
    bgColor: '#FEE500',
    textColor: '#191919',
    text: `[카카오페이 결제 알림]
윤*민님, 결제가 정상 완료되었습니다.
- 사용처: 넷플릭스 월간멤버십
- 결제금액: 17,000원
- 결제일시: 09/07 10:15
- 잔여 포인트: 1,200P`
  },
  {
    type: 'toss',
    title: '💙 토스뱅크 앱 푸시 알림',
    appIcon: '💙',
    bgColor: '#0064FF',
    textColor: '#FFFFFF',
    text: `[토스뱅크] 체크카드 결제 승인
메가MGC커피 역삼점 4,000원 결제 완료!
현재 통장 잔액 352,000원`
  },
  {
    type: 'sms',
    title: '✉️ 현대카드 SMS 문자',
    appIcon: '✉️',
    bgColor: '#4F46E5',
    textColor: '#FFFFFF',
    text: `[현대카드] 승인 윤*민님 4,500원 일시불 09/07 08:30 스타벅스강남점 잔여한도 3,420,000원`
  },
  {
    type: 'kakao',
    title: '💬 배달의민족 카카오톡 알림톡',
    appIcon: '💬',
    bgColor: '#FEE500',
    textColor: '#191919',
    text: `[배달의민족] 주문/결제 확인
- 가맹점: 처갓집양념치킨 역삼점
- 결제수단: KB국민카드
- 결제금액: 24,500원
맛있는 음식으로 찾아뵙겠습니다!`
  },
  {
    type: 'naver',
    title: '💚 네이버페이 앱 알림',
    appIcon: '💚',
    bgColor: '#03C75A',
    textColor: '#FFFFFF',
    text: `[네이버페이] 현장결제 승인
GS25 편의점 역삼점 5,200원
네이버페이 머니머니 결제 완료`
  }
];
