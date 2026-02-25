# 설치 프로그램(인스톨러) 커스텀

Electron Builder로 만드는 **Windows(NSIS)** / **macOS(DMG)** 설치 경험을 커스텀할 수 있습니다.  
리소스 파일은 프로젝트 루트의 **`build/`** 폴더에 두면 됩니다 (electron-builder 기본 `buildResources`).

---

## Windows (NSIS)

`package.json` → `build.nsis` 에서 설정하고, 이미지는 `build/` 에 넣습니다.

### package.json 에서 넣을 수 있는 옵션

| 옵션 | 설명 | 현재 값 |
|------|------|---------|
| `oneClick` | 한 번에 설치(one-click) vs 단계별(assisted) | `false` (단계별) |
| `allowToChangeInstallationDirectory` | 설치 경로 변경 허용 | `true` |
| `perMachine` | 설치 모드 선택(전체 사용자 / 현재 사용자) 표시 | (미설정, 기본) |
| `installerIcon` | 설치 파일(.exe) 아이콘 | `build/installerIcon.ico` (있으면 사용) |
| `installerHeader` | 단계별 설치 시 상단 배너 이미지 | `build/installerHeader.bmp` (164×314 권장) |
| `installerSidebar` | 단계별 설치 시 옆 패널 이미지 | `build/installerSidebar.bmp` (164×314) |
| `license` | EULA/라이선스 파일 (설치 시 표시) | `build/license.txt` 또는 `eula.txt` |
| `menuCategory` | 시작 메뉴 하위 폴더 이름 | `false` (폴더 없음) |
| `createDesktopShortcut` | 바탕화면 바로가기 생성 | `true` |
| `createStartMenuShortcut` | 시작 메뉴 바로가기 생성 | `true` |

### 고급: NSIS 스크립트 직접 수정

- **`build/installer.nsh`** 파일을 만들면, 설치/제거 시 실행되는 NSIS 매크로를 덮어쓸 수 있습니다.
- 사용 가능한 매크로: `customHeader`, `preInit`, `customInit`, `customInstall`, `customUnInstall`, `customWelcomePage`, `customUnWelcomePage` 등.
- 예: 설치 경로 기본값 변경, 환영 문구 추가, 제거 시 추가 작업 등.

자세한 건 [electron-builder NSIS 문서](https://www.electron.build/nsis) 참고.

---

## macOS (DMG)

`package.json` → `build.mac` / `build.dmg` 에서 설정하고, 이미지는 `build/` 에 넣습니다.

### package.json 에서 넣을 수 있는 옵션

| 옵션 | 설명 |
|------|------|
| `target` | `["dmg", "zip"]` 등 결과물 종류 |
| `category` | 앱 카테고리 (현재 `public.app-category.developer-tools`) |
| `icon` | 앱 아이콘 (`.icns`) 경로, 기본은 `build/icon.icns` |
| `darkModeSupport` | 다크 모드 지원 여부 |

### DMG 창/배경 커스텀

- **`build/background.png`**  
  DMG 마운트 시 보이는 배경 이미지 (권장 크기 540×380, Retina용 `background@2x.png` 1080×760).
- `package.json` 에서 경로 지정도 가능:
  ```json
  "dmg": {
    "background": "build/background.png",
    "window": { "width": 540, "height": 380 }
  }
  ```

---

## 폴더 구조 예시

```
yongviewbot-client/
├── build/                    # 설치 프로그램 리소스 (원하는 것만 추가)
│   ├── installerIcon.ico     # Windows 설치 파일 아이콘
│   ├── installerHeader.bmp   # Windows 단계별 설치 상단 배너 (선택)
│   ├── installerSidebar.bmp  # Windows 단계별 설치 옆 패널 (선택)
│   ├── license.txt           # Windows EULA (선택)
│   ├── icon.icns             # macOS 앱 아이콘 (선택)
│   ├── background.png        # macOS DMG 배경 (선택)
│   └── installer.nsh         # NSIS 커스텀 스크립트 (고급)
├── package.json              # build.nsis, build.mac, build.dmg 옵션 추가
└── ...
```

파일을 넣은 뒤 `npm run electron:build` 로 다시 빌드하면 적용됩니다.
