#!/bin/bash
# Manual end-to-end test for Durga's modules: Learning Spaces, Timetable,
# Topic Quiz, Quiz History, Dashboard.
#
# Requirements: server running (`npm run dev`), a test user already in the
# Users table (see README/earlier setup — uses Prisma Studio to add one).
#
# Usage: bash test-backend.sh
# (run from inside the backend/ folder)

BASE="http://localhost:5000"
USER="1"   # change this to whatever id your test user actually has

pp() {
  node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0,'utf8')), null, 2))"
}

step() {
  echo ""
  echo "=== $1 ==="
}

# ---- Health check --------------------------------------------------------
step "Health check"
curl -s "$BASE/api/health" | pp

# ---- Learning Spaces ------------------------------------------------------
step "Create a Learning Space"
SPACE=$(curl -s -X POST -H "x-user-id: $USER" -H "Content-Type: application/json" \
  -d '{"name":"Test Space"}' "$BASE/api/learning-spaces")
echo "$SPACE" | pp
SPACE_ID=$(echo "$SPACE" | node -e "console.log(JSON.parse(require('fs').readFileSync(0,'utf8')).id)")

step "List Learning Spaces"
curl -s -H "x-user-id: $USER" "$BASE/api/learning-spaces" | pp

# ---- Timetable -------------------------------------------------------------
step "Create a Timetable entry"
ENTRY=$(curl -s -X POST -H "x-user-id: $USER" -H "Content-Type: application/json" \
  -d '{"day":"Wednesday","subject":"Test Subject","startTime":"09:00","endTime":"10:00"}' \
  "$BASE/api/timetable")
echo "$ENTRY" | pp
ENTRY_ID=$(echo "$ENTRY" | node -e "console.log(JSON.parse(require('fs').readFileSync(0,'utf8')).id)")

step "List Timetable"
curl -s -H "x-user-id: $USER" "$BASE/api/timetable" | pp

step "Delete the test Timetable entry (cleanup)"
curl -s -o /dev/null -w "Status: %{http_code}\n" -X DELETE -H "x-user-id: $USER" \
  "$BASE/api/timetable/$ENTRY_ID"

# ---- Quiz -------------------------------------------------------------------
step "Create a Quiz under the new Learning Space"
QUIZ=$(curl -s -X POST -H "x-user-id: $USER" -H "Content-Type: application/json" \
  -d "{\"learningSpaceId\":$SPACE_ID,\"topic\":\"Test Topic\",\"difficulty\":\"Easy\",\"questions\":[{\"questionText\":\"2+2?\",\"correctAnswer\":\"4\"},{\"questionText\":\"Capital of France?\",\"correctAnswer\":\"Paris\"}]}" \
  "$BASE/api/quizzes")
echo "$QUIZ" | pp
QUIZ_ID=$(echo "$QUIZ" | node -e "console.log(JSON.parse(require('fs').readFileSync(0,'utf8')).id)")
Q1_ID=$(echo "$QUIZ" | node -e "console.log(JSON.parse(require('fs').readFileSync(0,'utf8')).questions[0].questionId)")
Q2_ID=$(echo "$QUIZ" | node -e "console.log(JSON.parse(require('fs').readFileSync(0,'utf8')).questions[1].questionId)")

step "Fetch quiz for attempt (correct answers should be hidden)"
curl -s -H "x-user-id: $USER" "$BASE/api/quizzes/$QUIZ_ID" | pp

step "Submit an attempt (one right, one wrong)"
ATTEMPT=$(curl -s -X POST -H "x-user-id: $USER" -H "Content-Type: application/json" \
  -d "{\"answers\":[{\"questionId\":$Q1_ID,\"selectedAnswer\":\"4\"},{\"questionId\":$Q2_ID,\"selectedAnswer\":\"London\"}]}" \
  "$BASE/api/quizzes/$QUIZ_ID/attempts")
echo "$ATTEMPT" | pp
ATTEMPT_ID=$(echo "$ATTEMPT" | node -e "console.log(JSON.parse(require('fs').readFileSync(0,'utf8')).quizAttemptId)")

step "Quiz history"
curl -s -H "x-user-id: $USER" "$BASE/api/quizzes/history" | pp

step "Attempt review"
curl -s -H "x-user-id: $USER" "$BASE/api/quizzes/attempts/$ATTEMPT_ID" | pp

# ---- Dashboard ---------------------------------------------------------------
step "Dashboard summary"
curl -s -H "x-user-id: $USER" "$BASE/api/dashboard" | pp

echo ""
echo "=== Done. Check above for any {\"error\":...} responses or unexpected values. ==="
