# Workflow Manager Command

Infinite Agent Loop의 진행 상황을 추적하고 관리하는 마스터 워크플로우 매니저입니다.

## Usage

```
/project:workflow-manager <action> [options]
```

### Actions
- `status` - 현재 진행 상황 확인
- `review` - 코드 품질 검토
- `commit` - 안전한 Git 커밋
- `deploy` - 배포 준비 및 실행
- `rollback` - 이전 상태로 롤백
- `report` - 상세 진행 리포트 생성

### Options
- `--detailed` - 상세 정보 포함
- `--auto` - 자동 실행 모드
- `--safe` - 안전 모드 (확인 후 실행)

### Examples

```bash
# 현재 상황 확인
/project:workflow-manager status --detailed

# 자동 코드 리뷰 및 커밋
/project:workflow-manager review --auto

# 안전 모드로 배포
/project:workflow-manager deploy --safe

# 상세 진행 리포트 생성
/project:workflow-manager report --detailed
```

## Workflow Manager Protocol

당신은 **Master Workflow Orchestrator**로서 다음 프로토콜을 관리합니다:

### Phase 1: Status Monitoring

#### 프로젝트 상태 확인
```bash
# 현재 브랜치 및 변경사항 확인
git status --porcelain
git branch --show-current
git log --oneline -5

# 진행 중인 작업 파악
ls -la app/ components/ specs/
find . -name "*.tsx" -newer .claude/last_check
```

#### 품질 지표 수집
```bash
# TypeScript 컴파일 확인
npx tsc --noEmit

# ESLint 검사
npx eslint . --ext .ts,.tsx --format json

# 테스트 실행 상태
npm test -- --coverage --json

# 번들 크기 분석
npx next build --debug
```

### Phase 2: Code Quality Review

#### 자동 코드 리뷰 체크리스트
1. **TypeScript 호환성**
   - 타입 오류 없음
   - strict 모드 준수
   - 인터페이스 및 타입 정의

2. **React 모범 사례**
   - hooks 규칙 준수
   - 컴포넌트 최적화
   - 메모이제이션 적절성

3. **Next.js 최적화**
   - App Router 구조
   - 메타데이터 정의
   - 성능 최적화

4. **브랜드 가이드라인**
   - 색상 코드 일치 (#56007C)
   - Shadcn/ui 컴포넌트 사용
   - 반응형 디자인

5. **접근성 (A11y)**
   - ARIA 라벨
   - 키보드 네비게이션
   - 색상 대비

#### 품질 점검 스크립트
```typescript
// 자동 품질 검사 함수
async function qualityCheck() {
  const checks = {
    typescript: await checkTypeScript(),
    eslint: await checkESLint(),
    accessibility: await checkA11y(),
    performance: await checkPerformance(),
    branding: await checkBranding()
  }

  return {
    passed: Object.values(checks).every(check => check.passed),
    details: checks,
    score: calculateQualityScore(checks)
  }
}
```

### Phase 3: Git Workflow Management

#### 브랜치 전략
```bash
# Feature 브랜치 생성
git checkout -b feature/[feature-name]

# 작업 완료 후 스테이징
git add .
git commit -m "feat: [feature description]

Implements [feature details]
- Added [component/page/api]
- Updated [related files]
- Tests: [test coverage]

Closes #[issue-number]"

# 메인 브랜치 병합 준비
git checkout main
git pull origin main
git checkout feature/[feature-name]
git rebase main
```

#### 커밋 메시지 표준
```
<type>(<scope>): <description>

<body>

<footer>
```

**Types**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 시스템, 의존성 업데이트

### Phase 4: Automated Testing

#### 테스트 실행 순서
```bash
# 1. 단위 테스트
npm run test:unit

# 2. 통합 테스트
npm run test:integration

# 3. E2E 테스트
npm run test:e2e

# 4. 성능 테스트
npm run test:performance

# 5. 접근성 테스트
npm run test:a11y
```

#### 테스트 커버리지 요구사항
- **Unit Tests**: 80% 이상
- **Integration Tests**: 70% 이상
- **E2E Tests**: 주요 사용자 플로우 100%

### Phase 5: Deployment Management

#### 배포 전 체크리스트
1. **코드 품질**
   - [ ] 모든 테스트 통과
   - [ ] TypeScript 오류 없음
   - [ ] ESLint 경고 해결
   - [ ] 성능 기준 충족

2. **보안 검사**
   - [ ] 환경변수 설정 확인
   - [ ] API 키 보안 상태
   - [ ] HTTPS 설정
   - [ ] CORS 정책

3. **데이터베이스**
   - [ ] 마이그레이션 확인
   - [ ] RLS 정책 적용
   - [ ] 백업 상태

4. **외부 서비스**
   - [ ] Supabase 연결
   - [ ] TossPayments 설정
   - [ ] Notion API 연결
   - [ ] 이메일 서비스

#### 배포 스크립트
```bash
#!/bin/bash
# 배포 자동화 스크립트

# 1. 빌드 테스트
npm run build

# 2. 환경변수 확인
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ Supabase URL not found"
  exit 1
fi

# 3. 데이터베이스 마이그레이션
supabase db push

# 4. Vercel 배포
vercel --prod

# 5. 배포 후 헬스체크
curl -f $PRODUCTION_URL/api/health

echo "✅ 배포 완료"
```

### Phase 6: Progress Tracking

#### 진행 상황 메트릭
```typescript
interface ProgressMetrics {
  // 개발 진행률
  development: {
    completedFeatures: number
    totalFeatures: number
    codeQuality: number // 0-100
    testCoverage: number // 0-100
  }

  // 성능 지표
  performance: {
    buildTime: number // ms
    bundleSize: number // bytes
    lighthouseScore: number // 0-100
    pageLoadTime: number // ms
  }

  // 프로젝트 건강도
  health: {
    activeIssues: number
    technicalDebt: number
    securityVulnerabilities: number
    outdatedDependencies: number
  }
}
```

#### 리포트 생성
```markdown
# 🚀 몬스터 협동조합 프로젝트 진행 리포트

## 📊 전체 진행률: 75%

### ✅ 완료된 기능
- [x] 랜딩 페이지 (100%)
- [x] 사용자 인증 (100%)
- [x] 프로그램 소개 (90%)
- [x] 예약 시스템 (80%)

### 🔄 진행 중인 기능
- [ ] 결제 시스템 (60%)
- [ ] 사용자 대시보드 (40%)
- [ ] 관리자 패널 (30%)

### 📈 품질 지표
- 코드 품질: 85/100
- 테스트 커버리지: 78%
- 성능 점수: 92/100
- 접근성 점수: 88/100

### 🔧 기술적 개선사항
- TypeScript strict 모드 100% 적용
- 모든 컴포넌트 Storybook 등록
- E2E 테스트 추가 필요

### 📋 다음 단계
1. 결제 시스템 TossPayments 연동 완료
2. 사용자 대시보드 UI/UX 개선
3. 성능 최적화 및 SEO 강화
```

### Phase 7: Error Handling & Recovery

#### 자동 복구 프로토콜
```bash
# 빌드 실패 시 자동 복구
if ! npm run build; then
  echo "❌ Build failed. Attempting recovery..."
  
  # 1. 노드 모듈 재설치
  rm -rf node_modules package-lock.json
  npm install
  
  # 2. 캐시 클리어
  npm run clean
  
  # 3. 재빌드 시도
  npm run build
fi
```

#### 롤백 전략
```bash
# 안전한 롤백 실행
function safe_rollback() {
  local last_good_commit=$(git log --oneline -10 | grep "✅" | head -1 | cut -d' ' -f1)
  
  if [ -n "$last_good_commit" ]; then
    git reset --hard $last_good_commit
    echo "✅ Rolled back to $last_good_commit"
  else
    echo "❌ No safe rollback point found"
  fi
}
```

### Phase 8: Continuous Integration

#### GitHub Actions 워크플로우
```yaml
name: Infinite Agent Loop CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npx tsc --noEmit
        
      - name: Lint
        run: npm run lint
        
      - name: Test
        run: npm run test:coverage
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        run: vercel --prod
```

## 실행 프로토콜

### Status Action
```bash
# 현재 상태 종합 확인
echo "🔍 워크플로우 상태 확인 중..."

# Git 상태
git status --short
git log --oneline -5

# 품질 지표
npm run lint -- --format=compact
npm run test -- --silent --coverage

# 빌드 상태
npm run build > /dev/null 2>&1 && echo "✅ Build OK" || echo "❌ Build Failed"

# 진행률 계산
calculate_progress_percentage
```

### Review Action
```bash
# 자동 코드 리뷰 실행
echo "🔍 코드 품질 검토 중..."

# 모든 품질 검사 실행
run_quality_checks

# 결과 리포트 생성
generate_review_report

# 개선 제안 생성
suggest_improvements
```

### Commit Action
```bash
# 안전한 커밋 실행
echo "💾 안전한 커밋 실행 중..."

# 사전 검사
pre_commit_checks

# 커밋 메시지 생성
generate_commit_message

# 커밋 실행
git add .
git commit -m "$commit_message"

echo "✅ 커밋 완료"
```

워크플로우 관리를 시작합니다!

Action: $ARGUMENTS
Mode: safe (기본값)

프로젝트의 현재 상태를 확인하고 적절한 관리 작업을 수행하겠습니다. 