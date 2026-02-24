# yongviewbot-client

yongviewbot 봇 서버를 **설정만으로 실행/종료**할 수 있는 데스크톱 앱입니다.  
서버 지식 없이 키값(GitLab URL, 토큰, Ollama 주소·모델 등)만 입력하면 됩니다.

- **기술 스택**: Electron + React + Vite
- **봇 실행**: 프로젝트 내장 JAR(`resources/yongviewbot.jar`)를 `java -jar`로 실행
- **Ollama**: 사용자가 별도로 실행 (앱에서 띄우지 않음)

## 요구 사항

- **Node.js** 18+
- **Java 17** 이상 (봇 JAR 실행용, 사용자 PC에 설치 필요)
- **Ollama** (별도 실행)

## 개발 실행 방법

1. **의존성 설치**
   ```bash
   cd yongviewbot-client
   npm install
   ```

2. **봇 JAR 내장**  
   빌드된 봇 JAR를 **`resources/yongviewbot.jar`** 에 넣어 두세요. 개발·배포 모두 이 경로만 사용합니다.

3. **Electron 앱 실행 (개발 모드)**
   ```bash
   npm run electron:dev
   ```
   - Vite가 먼저 떠서 React 앱을 제공하고, 이어서 Electron 창이 열립니다.
   - 개발·패키징 모두 `resources/yongviewbot.jar` 를 사용합니다.

4. **설정**  
   앱에서 "설정" 탭에서 GitLab URL, Private Token, Webhook Secret, Ollama URL·모델, 리뷰 모드, 포트를 입력 후 저장합니다.

5. **실행**  
   "메인" 탭에서 "시작" 버튼으로 봇을 띄우고, 표시된 Webhook URL을 GitLab Webhooks에 등록합니다.

## 마스코트 이미지

메인·설정 화면의 마스코트는 **`public/mascot.png`** 에 두면 자동으로 표시됩니다.  
이미지가 없거나 로드 실패 시 "마스코트" placeholder가 보입니다. 투명 배경 PNG를 권장합니다.

## JAR 내장 및 배포

봇은 **앱 안에 내장**합니다. `resources/yongviewbot.jar` 에 JAR 파일을 두면 개발·패키징 모두 이 파일을 사용합니다.

1. **JAR 넣기**  
   빌드된 `yongviewbot-*.jar` 를 **`resources/yongviewbot.jar`** 로 복사해 두세요.  
   (봇 소스가 형제 폴더에 있으면 `npm run copy-jar` 로 복사할 수 있습니다.)

2. **Electron 앱 빌드**
   ```bash
   npm run electron:build
   ```
   결과물은 `release/` 폴더에 생성됩니다.

3. **사용자 요구 사항**  
   설치한 PC에는 **Java 17 이상**이 설치되어 있어야 봇이 실행됩니다.  
   Ollama는 사용자가 별도로 설치·실행해 두어야 합니다.

## 폴더 구조

```
yongviewbot-client/
├── electron/          # main process, preload
├── src/               # React (메인, 설정)
├── resources/         # yongviewbot.jar 내장 (이 폴더에 JAR 넣기)
├── scripts/           # 유틸 스크립트
├── package.json
└── README.md
```
