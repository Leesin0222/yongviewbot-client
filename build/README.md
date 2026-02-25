# 설치 프로그램 리소스 (build)

이 폴더에 다음 파일을 넣으면 `npm run electron:build` 시 설치 프로그램에 반영됩니다.  
**전부 선택 사항**이며, 없으면 electron-builder 기본값이 사용됩니다.

| 파일 | 용도 |
|------|------|
| `installerIcon.ico` | Windows 설치 파일(.exe) 아이콘 |
| `installerHeader.bmp` | Windows 단계별 설치 상단 배너 (164×314 권장) |
| `installerSidebar.bmp` | Windows 단계별 설치 옆 패널 (164×314) |
| `license.txt` 또는 `eula.txt` | Windows 설치 시 표시할 라이선스/EULA |
| `icon.icns` | macOS 앱 아이콘 |
| `background.png` | macOS DMG 배경 (540×380, Retina용 `background@2x.png` 1080×760) |
| `installer.nsh` | Windows NSIS 고급 커스텀 스크립트 |

자세한 옵션과 `package.json` 설정은 **[docs/INSTALLER_CUSTOMIZATION.md](../docs/INSTALLER_CUSTOMIZATION.md)** 를 보세요.
