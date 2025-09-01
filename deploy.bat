@echo off
REM Script de deploy para Windows
REM Uso: deploy.bat [dev|prod]

setlocal enabledelayedexpansion

REM Definir cores para output (Windows 10+)
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

REM Função para log colorido
:log
echo %GREEN%[%date% %time%]%NC% %~1
goto :eof

:warn
echo %YELLOW%[%date% %time%] WARNING:%NC% %~1
goto :eof

:error
echo %RED%[%date% %time%] ERROR:%NC% %~1
goto :eof

REM Verificar argumentos
set "ENV=%~1"
if "%ENV%"=="" set "ENV=prod"
if not "%ENV%"=="dev" if not "%ENV%"=="prod" (
    call :error "Uso: %~nx0 [dev^|prod]"
    call :error "  dev  - Ambiente de desenvolvimento"
    call :error "  prod - Ambiente de produção (padrão^)"
    exit /b 1
)

call :log "🚀 Iniciando deploy do WebSocket Server"
call :log "Ambiente: %ENV%"

REM Verificar se o Docker está a correr
docker info >nul 2>&1
if errorlevel 1 (
    call :error "Docker não está a correr. Inicie o Docker e tente novamente."
    exit /b 1
)
call :log "Docker está a correr"

REM Verificar se o docker-compose está disponível
docker-compose --version >nul 2>&1
if errorlevel 1 (
    call :error "docker-compose não está instalado. Instale o docker-compose e tente novamente."
    exit /b 1
)
call :log "docker-compose está disponível"

REM Build da imagem
call :log "A construir imagem para ambiente: %ENV%"
if "%ENV%"=="dev" (
    docker-compose -f docker-compose.dev.yml build
) else (
    docker-compose -f docker-compose.prod.yml build
)
if errorlevel 1 (
    call :error "Erro ao construir imagem"
    exit /b 1
)
call :log "Imagem construída com sucesso"

REM Deploy da aplicação
call :log "A fazer deploy da aplicação para ambiente: %ENV%"
if "%ENV%"=="dev" (
    docker-compose -f docker-compose.dev.yml up -d
) else (
    docker-compose -f docker-compose.prod.yml up -d
)
if errorlevel 1 (
    call :error "Erro ao fazer deploy"
    exit /b 1
)
call :log "Aplicação deployada com sucesso"

REM Verificar status da aplicação
call :log "A verificar status da aplicação..."
timeout /t 5 /nobreak >nul

REM Verificar se o container está a correr
docker ps | findstr websocket-server >nul
if errorlevel 1 (
    call :error "Container não está a correr"
    exit /b 1
)
call :log "Container está a correr"

REM Testar endpoint de health
curl -f http://localhost:3000/health >nul 2>&1
if errorlevel 1 (
    call :warn "Aplicação pode não estar completamente inicializada"
) else (
    call :log "✅ Aplicação está a funcionar corretamente"
    call :log "🌐 Acessível em: http://localhost:3000"
    call :log "📡 Endpoint de teste: http://localhost:3000/test"
)

call :log "🎉 Deploy concluído com sucesso!"

echo.
call :log "Comandos úteis:"
echo   - Ver logs: docker-compose -f docker-compose.%ENV%.yml logs -f
echo   - Parar: docker-compose -f docker-compose.%ENV%.yml down
echo   - Reiniciar: docker-compose -f docker-compose.%ENV%.yml restart
echo   - Status: docker-compose -f docker-compose.%ENV%.yml ps

pause
