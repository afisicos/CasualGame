@echo off
chcp 65001 >nul
echo ========================================
echo INSTALAR APK EN DISPOSITIVO ANDROID
echo ========================================
echo.

echo Verificando dispositivo conectado...
"C:\Users\afisi\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
echo.

set APK_PATH=C:\tmp\CasualGameBuild\outputs\apk\release\app-release.apk

if not exist "%APK_PATH%" (
    echo ❌ No se encontró el APK en: %APK_PATH%
    echo.
    echo Buscando APK en otras ubicaciones...
    for /r "C:\Users\afisi\Desktop\Proyectos\CasualGame\CasualGameMobile\android" %%f in (*.apk) do (
        set APK_PATH=%%f
        goto :found
    )
    echo ❌ No se encontró ningún APK
    pause
    exit /b 1
)

:found
echo ✅ APK encontrado: %APK_PATH%
echo.
echo Instalando APK en el dispositivo...
echo.

"C:\Users\afisi\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r "%APK_PATH%"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ INSTALACIÓN EXITOSA
    echo ========================================
    echo.
    echo El APK se ha instalado correctamente en tu dispositivo.
    echo Ya puedes abrir la app y probar los anuncios.
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ ERROR EN LA INSTALACIÓN
    echo ========================================
    echo.
    echo Hubo un problema al instalar el APK.
    echo Verifica que:
    echo   1. El dispositivo esté conectado por USB
    echo   2. La depuración USB esté activada
    echo   3. Hayas aceptado el diálogo de autorización
    echo.
)

pause
