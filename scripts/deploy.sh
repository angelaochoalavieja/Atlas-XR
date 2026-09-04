#!/bin/sh

set -eu

PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

BRANCH="main"
BASE_PATH="/atlas-xr/"

LOCK_DIR="/tmp/$(basename "$REPO_DIR")-deploy.lock"

CRON_INTERVAL="*/5 * * * *"
CRON_MARKER="# auto-deploy-$(basename "$REPO_DIR")"
CRON_LOG="/var/log/$(basename "$REPO_DIR")-deploy.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [deploy] $*"
}

fail() {
    log "ERROR: $*"
    exit 1
}

install_cron() {
    SCRIPT_PATH="$REPO_DIR/scripts/deploy.sh"

    [ -x "$SCRIPT_PATH" ] || fail "El script no es ejecutable: $SCRIPT_PATH"

    CRON_LINE="$CRON_INTERVAL $SCRIPT_PATH >> $CRON_LOG 2>&1 $CRON_MARKER"

    (
        crontab -l 2>/dev/null | grep -vF "$CRON_MARKER" || true
        echo "$CRON_LINE"
    ) | crontab -

    log "Cron instalado correctamente."
    log "$CRON_LINE"
}

remove_cron() {
    (
        crontab -l 2>/dev/null | grep -vF "$CRON_MARKER" || true
    ) | crontab -

    log "Cron eliminado."
}

cron_status() {
    if crontab -l 2>/dev/null | grep -F "$CRON_MARKER" >/dev/null 2>&1; then
        log "Cron instalado:"
        crontab -l | grep -F "$CRON_MARKER"
    else
        log "Cron no instalado."
    fi
}

show_status() {
    cd "$REPO_DIR" || fail "No se puede acceder a $REPO_DIR"

    CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"
    LOCAL="$(git rev-parse HEAD 2>/dev/null || true)"
    REMOTE="$(git rev-parse "origin/$BRANCH" 2>/dev/null || true)"

    echo "Repositorio : $REPO_DIR"
    echo "Rama        : $CURRENT_BRANCH"
    echo "Local       : $LOCAL"
    echo "Remoto      : $REMOTE"
    echo "Base path   : $BASE_PATH"
    echo "Log         : $CRON_LOG"
}

deploy() {
    if ! mkdir "$LOCK_DIR" 2>/dev/null; then
        log "Ya hay un despliegue en ejecución."
        exit 0
    fi

    cleanup() {
        rmdir "$LOCK_DIR" 2>/dev/null || true
    }

    trap cleanup EXIT INT TERM

    cd "$REPO_DIR" || fail "No existe $REPO_DIR"

    command -v git >/dev/null 2>&1 || fail "git no está instalado"
    command -v pnpm >/dev/null 2>&1 || fail "pnpm no está instalado"

    CURRENT_BRANCH="$(git branch --show-current)"

    [ "$CURRENT_BRANCH" = "$BRANCH" ] || \
        fail "La rama actual es '$CURRENT_BRANCH', se esperaba '$BRANCH'"

    log "Consultando origin/$BRANCH..."

    git fetch origin "$BRANCH" || fail "git fetch ha fallado"

    LOCAL="$(git rev-parse HEAD)"
    REMOTE="$(git rev-parse "origin/$BRANCH")"

    if [ "$LOCAL" = "$REMOTE" ]; then
        exit 0
    fi

    log "Nueva versión detectada."
    log "Actual: $LOCAL"
    log "Nueva : $REMOTE"

    OLD_COMMIT="$LOCAL"

    log "Actualizando repositorio..."

    git reset --hard "$REMOTE" || fail "No se pudo actualizar el repositorio"

    log "Instalando dependencias..."

    if ! pnpm install --frozen-lockfile; then
        log "Falló pnpm install."
        log "Restaurando commit anterior: $OLD_COMMIT"

        git reset --hard "$OLD_COMMIT"

        log "Restaurando dependencias anteriores..."
        pnpm install --frozen-lockfile || true

        exit 1
    fi

    log "Ejecutando build con base $BASE_PATH..."

    if ! pnpm run build --base="$BASE_PATH"; then
        log "Falló pnpm run build."
        log "Restaurando commit anterior: $OLD_COMMIT"

        git reset --hard "$OLD_COMMIT"

        log "Restaurando dependencias anteriores..."
        pnpm install --frozen-lockfile || true

        exit 1
    fi

    log "Despliegue completado correctamente."
    log "Commit: $REMOTE"
}

show_help() {
    cat <<EOF
Uso:

  $0
  $0 deploy
      Comprueba si hay cambios y despliega si los hay.

  $0 cron install
      Instala el cron para comprobar cambios cada 5 minutos.

  $0 cron remove
      Elimina el cron.

  $0 cron status
      Muestra si el cron está instalado.

  $0 status
      Muestra información del repositorio.

  $0 help
      Muestra esta ayuda.

Configuración:

  Repositorio : $REPO_DIR
  Rama        : $BRANCH
  Base path   : $BASE_PATH
  Frecuencia  : $CRON_INTERVAL
  Log         : $CRON_LOG
EOF
}

case "${1:-deploy}" in

    deploy)
        deploy
        ;;

    cron)
        case "${2:-}" in
            install)
                install_cron
                ;;
            remove)
                remove_cron
                ;;
            status)
                cron_status
                ;;
            *)
                echo "Uso: $0 cron {install|remove|status}"
                exit 1
                ;;
        esac
        ;;

    status)
        show_status
        ;;

    help|--help|-h)
        show_help
        ;;

    *)
        echo "Comando desconocido: $1"
        echo
        show_help
        exit 1
        ;;
esac
