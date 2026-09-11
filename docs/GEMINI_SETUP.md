# SOBIMON Gemini 연결 가이드

SOBIMON은 브라우저에서 Gemini API를 직접 호출하지 않습니다. `api/sobimon-ai.js` Vercel Serverless Function이 Gemini API 키를 서버에서 보관하고, 프론트는 `/api/sobimon-ai`만 호출합니다.

## 1. Gemini API 키 만들기

Google AI Studio에서 Gemini API 키를 발급합니다.

서버 환경변수:

```env
GEMINI_API_KEY=발급받은_API_KEY
GEMINI_MODEL=gemini-3.8-flash
```

클라이언트 환경변수:

```env
VITE_SOBIMON_AI_ENDPOINT=/api/sobimon-ai
```

`GEMINI_API_KEY`에는 절대 `VITE_` 접두사를 붙이지 마세요. Vite의 `VITE_` 환경변수는 브라우저 번들에 노출됩니다.

## 2. Vercel 설정

Vercel 프로젝트 > Settings > Environment Variables에 아래를 추가합니다.

- `GEMINI_API_KEY`
- `GEMINI_MODEL` = `gemini-3.8-flash`
- `VITE_SOBIMON_AI_ENDPOINT` = `/api/sobimon-ai`

이후 재배포합니다.

## 3. 로컬 테스트

일반 `npm run dev`는 Vite 개발 서버라 `/api` Serverless Function을 실행하지 않습니다. 이 경우 앱은 자동으로 로컬 분석 fallback을 사용합니다.

Gemini까지 포함해 로컬에서 테스트하려면 Vercel CLI를 사용합니다.

```bash
npm i -g vercel
vercel dev
```

루트에 `.env.local`을 만들고 아래처럼 설정합니다.

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SOBIMON_AI_ENDPOINT=/api/sobimon-ai
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.8-flash
```

## 4. 비용을 아끼는 구조

프론트는 거래 원문을 Gemini로 보내지 않습니다. 월 합계, 예산, 최대 소비 카테고리, 비중, 거래 건수처럼 익명화된 집계값만 전송합니다.

동일한 소비 집계 결과에 대해서는 최대 6시간 동안 브라우저 캐시를 사용해 불필요한 AI 호출을 줄입니다. Gemini 요청 실패, 무료 quota 초과, 네트워크 오류가 발생하면 기존 로컬 분석 엔진으로 즉시 fallback합니다.

## 5. 현재 AI 응답 형식

서버는 Gemini에 다음 구조의 JSON만 생성하도록 요청합니다.

```json
{
  "headline": "카페몬이 강해졌어!",
  "message": "이번 달 카페 소비가 전체 지출의 38%예요.",
  "missionTitle": "이번 주 카페 1회 줄이기",
  "missionReason": "가장 큰 소비 항목 하나만 줄여도 효과가 커요.",
  "mood": "focus"
}
```

이 값은 홈 화면의 AI 소비몬 캐릭터 대사와 AI 캐릭터 미션에 사용됩니다.
