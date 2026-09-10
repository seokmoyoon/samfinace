# SOBIMON Supabase 연결

## 1. DB 생성
새 프로젝트면 `supabase/schema.sql`을 Supabase SQL Editor에서 실행합니다.
기존 SOBIMON DB가 이미 있다면 `supabase/migrations/20260910_mobile_refresh_sync.sql`도 실행해 `transactions.client_id`와 인덱스를 보강합니다.

## 2. Auth
Supabase Dashboard > Authentication > Providers에서 Email을 활성화합니다.
Google OAuth를 사용할 경우 Google provider와 Redirect URL도 프로젝트 도메인에 맞게 등록합니다.

## 3. 환경변수
로컬 `.env.local` 또는 Vercel Project Environment Variables에 아래 값을 넣습니다.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_ANON_KEY
```

`service_role` 키는 브라우저/Vite 환경변수에 절대 넣지 않습니다.

## 4. 동기화 구조
앱은 Local-First입니다. 비로그인 상태에서는 localStorage를 그대로 사용합니다. 로그인 후 MY 화면의 클라우드 동기화를 실행하면 `profiles`, `budgets`, `transactions`, `user_sobimons`, `user_quests`에 사용자 데이터가 저장됩니다.

거래내역은 `(user_id, client_id)` unique key로 upsert하여 같은 로컬 거래를 반복 동기화해도 중복 행이 생성되지 않도록 했습니다. 모든 사용자 테이블은 RLS가 활성화되며 `auth.uid()`가 자신의 데이터에만 CRUD할 수 있습니다.

## 5. 배포 체크
Vercel Production/Preview 환경에 두 VITE 환경변수를 모두 추가한 뒤 재배포합니다. 로그인 → 거래 추가 → 클라우드 동기화 → Supabase Table Editor에서 해당 사용자 행 생성 여부를 확인합니다.
