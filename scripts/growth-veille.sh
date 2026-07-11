#!/usr/bin/env bash
# Veille growth hebdomadaire autonome (axe 3).
# SÉCURITÉ : l'agent Claude n'a QUE la recherche web + l'écriture de fichiers
# (aucun Bash) — il ne peut ni pousser sur master, ni envoyer de comm publique.
# Le script gère le git (branche dédiée growth/veille-auto) et la notif email.
# Ne touche JAMAIS master. Ne publie rien. Se contente d'enrichir la KB + notifier.
set -uo pipefail

REPO="/root/instant-rent"
CLAUDE="/root/.local/bin/claude"
BRANCH="growth/veille-auto"
DATE="$(date +%Y-%m-%d)"
REPORT="data/knowledge/growth/veille/${DATE}.md"
LOG="/root/growth-veille.log"

cd "$REPO" || exit 1
mkdir -p data/knowledge/growth/veille

echo "=== [$(date)] Veille growth ===" >> "$LOG"

# Branche dédiée à partir de master (jamais on ne commit la veille sur master)
git fetch origin master -q 2>>"$LOG"
git checkout -B "$BRANCH" origin/master -q 2>>"$LOG"

PROMPT="Tu es l'agent growth-strategist d'Instant Rent (lis ta définition dans .claude/agents/growth-strategist.md et ta KB dans data/knowledge/growth/). Mission : VEILLE HEBDOMADAIRE du ${DATE}.

Fais une recherche web ciblée (WebSearch/WebFetch) sur CE QUI A CHANGÉ récemment et écris un rapport dans le fichier ${REPORT} (via Write) :
1. Concurrents (Spotahome, Wunderflats, Lodgis) : changements de tarifs/commissions/offres depuis notre dernière intel.
2. Voix client : nouvelles plaintes/frustrations de propriétaires (Reddit, Trustpilot, forums) — 3 à 6 verbatims récents avec source.
3. Réglementation Paris (location courte durée / meublé / bail) : toute évolution récente exploitable comme angle (persona A).
4. Opportunités : nouveaux groupes FB actifs, tendances, événements.

Format du rapport : titre + date, puis pour chaque section : ce qui est NOUVEAU/change vs la KB, la source, et l'angle d'outreach exploitable. Termine par 'Mises à jour KB recommandées' (liste courte). Reste factuel et sourcé, cite les frameworks quand pertinent. Sois concis (1 page). N'édite PAS d'autres fichiers que ${REPORT}. Ne fais AUCUNE autre action."

# Agent limité à la recherche + écriture de fichiers (pas de Bash → pas de git/prod/comms)
timeout 900 "$CLAUDE" -p "$PROMPT" \
  --allowedTools "Read" "Write" "Edit" "Glob" "Grep" "WebSearch" "WebFetch" \
  --permission-mode acceptEdits \
  --model sonnet >> "$LOG" 2>&1

if [ ! -f "$REPORT" ]; then
  echo "[$(date)] ÉCHEC : rapport non généré" >> "$LOG"
  git checkout master -q 2>>"$LOG"
  exit 1
fi

# Commit sur la branche dédiée (jamais master) + push de la branche pour review
git add data/knowledge/growth/veille/ 2>>"$LOG"
git commit -q -m "chore(veille): veille growth hebdo ${DATE} (auto)" 2>>"$LOG"
git push -f origin "$BRANCH" -q 2>>"$LOG"
git checkout master -q 2>>"$LOG"

# Notification email au fondateur (Resend) — extrait du rapport
RESEND_KEY="$(grep -oE 'RESEND_API_KEY=.*' "$REPO/.env.local" | head -1 | cut -d= -f2- | tr -d '"'\'' ')"
SUMMARY="$(head -40 "$REPO/$REPORT" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')"
if [ -n "$RESEND_KEY" ]; then
  curl -s -X POST "https://api.resend.com/emails" \
    -H "Authorization: Bearer $RESEND_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"from\":\"Instant Rent <noreply@instant-rent.fr>\",\"to\":\"hakangdz91@gmail.com\",\"subject\":\"Veille growth hebdo — ${DATE}\",\"text\":\"Nouvelle veille prête (branche ${BRANCH}).\\n\\n${SUMMARY}\\n\\n— growth-strategist (auto)\"}" \
    >> "$LOG" 2>&1
  echo "[$(date)] Notif email envoyée" >> "$LOG"
fi

echo "[$(date)] Veille OK → $REPORT (branche $BRANCH)" >> "$LOG"
