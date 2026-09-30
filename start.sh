#!/bin/bash
echo "🐱 Iniciando Cat Meme Evolution 3D..."
echo "🌐 Abrindo no navegador em http://localhost:8080"
python3 -m http.server 8080 &
SERVER_PID=$!
sleep 1
open "http://localhost:8080"
wait $SERVER_PID
