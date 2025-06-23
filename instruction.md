다음은 Claude Code의 사용법, 폴더 라우팅 및 활용을 위한 주요 정보를 요약한 내용입니다.

---

### Claude Code 개요

Claude Code는 Anthropic의 AI 기반 코딩 지원 도구로, 개발자가 코드베이스를 더 효율적으로 탐색, 수정 및 관리할 수 있도록 설계되었습니다. GitHub Actions와 연동하여 AI 기반 자동화를 GitHub 워크플로우에 통합할 수 있습니다. 간단한 `@claude` 멘션만으로 코드 분석, Pull Request 생성, 기능 구현 및 버그 수정이 가능하며, 프로젝트 표준을 준수합니다. Claude Code는 Claude Code SDK 위에 구축되어 애플리케이션에 프로그래밍 방식으로 통합할 수 있습니다.

---

### 1. 설치 및 설정

Claude Code를 사용하려면 다음 단계를 따르세요:

*   **시스템 요구 사항**: macOS 10.15+, Ubuntu 20.04+/Debian 10+, 또는 WSL을 통한 Windows를 지원합니다. Node.js 18+가 필요하며, 선택적으로 Git 2.23+ 및 GitHub 또는 GitLab CLI가 필요합니다.
*   **설치**: Node.js 18+를 설치한 후 터미널에서 다음 명령어를 실행합니다:
    ```bash
    npm install -g @anthropic-ai/claude-code
    ```
    **`sudo npm install -g`는 권한 문제 및 보안 위험을 초래할 수 있으므로 사용하지 마십시오**.
*   **인증**: Claude Code를 시작(`claude` 명령어)하면 Anthropic Console을 통한 OAuth, Claude App Pro/Max 플랜 또는 Amazon Bedrock, Google Vertex AI와 같은 엔터프라이즈 플랫폼을 통해 인증할 수 있습니다.
*   **프로젝트 초기화**: 처음 사용하는 경우, 프로젝트 디렉토리로 이동하여 `claude`를 실행한 다음 `/init` 명령어를 사용하여 `CLAUDE.md` 프로젝트 가이드를 생성하고 이를 커밋하는 것을 권장합니다.

---

### 2. 기본 사용법 및 상호작용

*   **세션 시작**: 프로젝트 루트 디렉토리에서 `claude` 명령어를 입력하여 대화형 세션을 시작합니다.
*   **코드 이해**: "이 프로젝트는 무엇을 하나요?", "이 코드베이스의 개요를 알려주세요" 와 같은 질문으로 코드베이스를 파악할 수 있습니다. Claude Code는 필요한 파일을 자동으로 읽어 컨텍스트를 제공합니다.
*   **코드 변경**: "메인 파일에 헬로월드 함수를 추가해줘"와 같은 간단한 작업을 요청할 수 있습니다. Claude Code는 파일을 찾아 변경 사항을 제안하고, 승인을 받은 후 수정합니다. **파일 수정 전에 항상 승인을 요청합니다**.
*   **Git 통합**: Git 작업도 대화형으로 수행할 수 있습니다. "변경된 파일 보여줘", "변경 사항을 설명과 함께 커밋해줘"와 같은 명령을 사용할 수 있습니다.
*   **일반적인 워크플로우**:
    *   **버그 수정**: 오류 메시지를 공유하고 해결책을 요청하여 버그를 신속하게 수정할 수 있습니다.
    *   **코드 리팩토링**: 레거시 코드를 현대적인 패턴으로 업데이트하고, 변경 사항을 적용하고, 리팩토링된 코드를 검증할 수 있습니다.
    *   **테스트 작업**: 테스트되지 않은 코드를 식별하고, 테스트 스캐폴딩을 생성하며, 의미 있는 테스트 케이스를 추가하고 실행할 수 있습니다.
    *   **Pull Request 생성**: 변경 사항을 요약하고 Claude에게 PR 생성을 요청할 수 있습니다.
    *   **문서 처리**: 문서화되지 않은 코드를 식별하고, 문서를 생성, 검토 및 개선할 수 있습니다.
    *   **이미지 작업**: 스크린샷, 다이어그램, 디자인 목업과 같은 이미지를 대화에 추가하여 컨텍스트를 제공하고, 이미지 분석 및 시각적 콘텐츠 기반 코드 제안을 받을 수 있습니다.
    *   **확장된 사고 (Extended Thinking)**: 복잡한 아키텍처 결정, 까다로운 버그 디버깅, 다단계 구현 계획 등 심층적인 추론이 필요한 작업에 유용합니다. "think deeply"와 같은 프롬프트를 사용하여 Claude가 코드베이스에서 관련 정보를 수집하고 더 깊이 사고하도록 유도할 수 있습니다.
*   **필수 명령어**:
    *   `claude`: 대화형 모드 시작.
    *   `claude "task"`: 일회성 작업 실행.
    *   `claude -p "query"`: 한 번만 쿼리를 실행한 후 종료 (비대화형 모드).
    *   `claude -c`: 가장 최근 대화 계속.
    *   `claude -r`: 이전 대화 선택하여 재개.
    *   `/clear`: 대화 기록 지우기.
    *   `/help`: 사용 가능한 명령어 표시.

---

### 3. 구성 및 사용자 정의 (폴더 라우팅 / 설정)

Claude Code는 `settings.json` 파일, 환경 변수 및 `CLAUDE.md` 파일을 통해 유연하게 구성할 수 있습니다.

*   **설정 파일 (`settings.json`)**:
    *   **사용자 설정**: `~/.claude/settings.json`에 저장되며 모든 프로젝트에 적용됩니다.
    *   **프로젝트 설정**: `.claude/settings.json`에 저장되며 소스 제어에 체크인되어 팀과 공유됩니다.
    *   **로컬 프로젝트 설정**: `.claude/settings.local.json`에 저장되며 체크인되지 않고 개인적인 용도로 사용됩니다 (Git에 의해 무시됨).
    *   **엔터프라이즈 정책 설정**: 시스템 관리자가 배포할 수 있으며 사용자 및 프로젝트 설정보다 우선순위가 높습니다.
    *   **권한 설정**: `settings.json` 내의 `permissions` 키를 사용하여 특정 도구 사용(예: `Bash(npm run lint)`)을 허용하거나 거부할 수 있습니다.
*   **환경 변수**: `ANTHROPIC_API_KEY`, `CLAUDE_CODE_USE_BEDROCK` 등 다양한 환경 변수를 통해 Claude Code의 동작을 제어할 수 있으며, 이들은 `settings.json`에도 구성할 수 있습니다.
*   **메모리 관리 (`CLAUDE.md`)**:
    *   Claude Code는 사용자의 선호도와 스타일 가이드라인을 기억할 수 있습니다.
    *   **프로젝트 메모리**: `./CLAUDE.md`에 저장되며 팀원들과 공유되는 프로젝트 아키텍처, 코딩 표준 등을 포함합니다.
    *   **사용자 메모리**: `~/.claude/CLAUDE.md`에 저장되며 개인적인 코드 스타일 선호도나 도구 단축키 등 모든 프로젝트에 적용되는 설정을 포함합니다.
    *   **`CLAUDE.md` Imports (폴더 라우팅)**: `CLAUDE.md` 파일은 `@path/to/import` 구문을 사용하여 다른 파일을 가져올 수 있습니다. 이를 통해 **`CLAUDE.local.md`를 대체하며, 다중 Git 워크트리에서도 잘 작동합니다**. `~/.claude/my-project-instructions.md`와 같이 사용자 홈 디렉토리의 파일도 가져올 수 있어 개인별 지침 제공에 편리합니다. Claude는 현재 작업 디렉토리에서 `/`까지 상위 디렉토리를 재귀적으로 탐색하여 `CLAUDE.md` 파일을 읽어들입니다.
*   **사용자 정의 슬래시 명령어 (Custom Slash Commands) (폴더 라우팅)**:
    *   자주 사용하는 프롬프트를 Markdown 파일로 정의하여 `/<prefix>:<command-name> [arguments]` 형식으로 실행할 수 있습니다.
    *   **프로젝트 명령어**: `.claude/commands/` 디렉토리에 저장되며 `/project:` 접두사가 붙습니다. 팀과 공유됩니다.
    *   **개인 명령어**: `~/.claude/commands/` 디렉토리에 저장되며 `/user:` 접두사가 붙습니다. 모든 프로젝트에서 사용 가능하지만 개인 전용입니다.
    *   **네임스페이스**: 하위 디렉토리에 명령어를 구성하여 `/project:frontend:component`와 같이 네임스페이스를 만들 수 있습니다.
    *   **인수**: `$ARGUMENTS` 플레이스홀더를 사용하여 동적 값을 명령어에 전달할 수 있습니다.
    *   **Bash 명령어 실행 및 파일 참조**: `!` 접두사를 사용하여 Bash 명령어 출력을 포함하거나, `@` 접두사를 사용하여 파일 내용을 명령어 컨텍스트에 포함할 수 있습니다.

---

### 4. 고급 사용법: 모델 컨텍스트 프로토콜 (MCP)

MCP는 LLM이 외부 도구 및 데이터 소스에 접근할 수 있도록 하는 개방형 프로토콜입니다.

*   **MCP 서버 구성**:
    *   `claude mcp add <name> <command> [args...]` 명령어를 사용하여 `stdio`, `SSE`, `HTTP` 서버를 추가할 수 있습니다.
    *   **스코프 (Scope)**: 서버 구성은 `local` (기본값, 현재 프로젝트의 사용자 설정에 저장), `project` (`.mcp.json` 파일로 팀과 공유), `user` (모든 프로젝트에서 사용 가능하며 개인 계정에 비공개) 세 가지 스코프 수준에서 설정할 수 있습니다. 스코프는 `local > project > user` 순으로 우선순위가 적용됩니다.
*   **원격 MCP 서버 인증**: OAuth 2.0 인증 흐름을 지원하며 `/mcp` 명령어를 사용하여 연결 상태 확인, 인증, 토큰 초기화, 서버 기능 확인이 가능합니다.
*   **MCP 리소스 사용 (폴더 라우팅)**:
    *   MCP 서버는 @ 멘션을 통해 참조할 수 있는 리소스(예: `@server:protocol://resource/path`)를 노출할 수 있습니다.
    *   예를 들어, `@github:issue://123` 또는 `@docs:file://api/authentication`과 같이 특정 리소스를 참조하여 Claude가 이를 분석하도록 요청할 수 있습니다. 리소스는 자동으로 가져와 첨부 파일로 포함됩니다.
*   **MCP 프롬프트를 슬래시 명령어로 사용 (폴더 라우팅)**:
    *   MCP 서버가 노출하는 프롬프트는 `/mcp__servername__promptname` 형식의 슬래시 명령어로 Claude Code에서 사용 가능합니다.
    *   예: `/mcp__github__list_prs`, `/mcp__jira__create_issue "Bug title" high`.

---

### 5. Claude Code SDK

Claude Code SDK는 애플리케이션에 Claude Code를 프로그래밍 방식으로 통합할 수 있게 해줍니다.

*   **지원 언어**: 명령줄, TypeScript, Python을 지원합니다.
*   **인증**: Anthropic API 키를 생성하여 `ANTHROPIC_API_KEY` 환경 변수로 설정하는 것을 권장합니다.
*   **기본 및 고급 사용법**:
    *   단일 프롬프트 실행, 파이프를 통한 입력 제공, JSON/스트리밍 JSON 출력 등.
    *   멀티턴 대화 (`--continue`, `--resume`).
    *   사용자 정의 시스템 프롬프트 (`--system-prompt`, `--append-system-prompt`).
    *   SDK 매개변수를 통한 MCP 구성 (예: `query` 함수의 `options` 객체에 `maxTurns` 설정). `allowedTools`와 같은 CLI 옵션을 SDK에서도 사용할 수 있습니다.

---

### 6. Claude Code GitHub Actions

Claude Code GitHub Actions는 AI 기반 자동화를 GitHub 워크플로우에 통합합니다.

*   **주요 기능**: 즉각적인 PR 생성, 자동화된 코드 구현, 프로젝트 표준 준수, 버그 신속 수정.
*   **설정**:
    *   **빠른 설정**: 터미널에서 `/install-github-app` 명령어를 실행합니다 (Anthropic API 사용자만 해당).
    *   **수동 설정**: Claude GitHub 앱을 저장소에 설치하고, `ANTHROPIC_API_KEY`를 저장소 시크릿으로 추가한 다음, 예시 워크플로우 파일을 `.github/workflows/` 디렉토리에 복사합니다.
*   **AWS Bedrock 및 Google Vertex AI와 연동**: 엔터프라이즈 환경에서 자체 클라우드 인프라와 함께 사용할 수 있습니다. 이를 위해서는 사용자 정의 GitHub 앱 생성, 클라우드 제공업체 인증(AWS OIDC Identity Provider, Google Cloud Workload Identity Federation 등), 필수 시크릿 추가 등의 선행 조건이 필요합니다.
*   **모범 사례**:
    *   **`CLAUDE.md` 설정**: 저장소 루트에 `CLAUDE.md` 파일을 생성하여 코드 스타일 가이드라인, 검토 기준, 프로젝트별 규칙 등을 정의하여 Claude의 이해를 돕습니다.
    *   **보안 고려 사항**: API 키를 저장소에 직접 커밋하지 말고, 항상 GitHub Secrets를 사용하십시오 (`ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}`).
    *   **CI 비용**: Claude Code는 GitHub-hosted runner에서 실행되므로 GitHub Actions 분을 소비하며, 각 Claude 상호작용은 API 토큰을 소비합니다. 비용 최적화를 위해 특정 `@claude` 명령 사용, `max_turns` 및 `timeout_minutes` 설정 등을 고려해야 합니다.

---

### 7. 문제 해결

*   **일반적인 설치 문제**: Linux 권한 문제(npm 접두사를 사용자 쓰기 가능 디렉토리로 구성) 및 WSL 설치 문제(`Node not found` 오류) 등이 있습니다.
*   **권한 및 인증 문제**: 반복적인 권한 프롬프트는 `/permissions` 명령어를 사용하여 특정 도구 실행을 승인하여 해결할 수 있습니다. 인증 문제는 `/logout` 후 재인증하거나, 인증 정보를 저장하는 파일을 수동으로 삭제하여 해결할 수 있습니다.
*   **성능 및 안정성**: 높은 CPU/메모리 사용량, 명령어 멈춤/정지 등의 문제는 `/compact` 사용, Claude Code 재시작, `.gitignore`에 큰 빌드 디렉토리 추가 등으로 완화할 수 있습니다.
*   **도움 받기**: `/bug` 명령어를 사용하여 Anthropic에 직접 문제를 보고하거나, `/doctor` 명령어를 사용하여 Claude Code 설치 상태를 확인할 수 있습니다.

---