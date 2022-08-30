#!/bin/bash
until node server/index.js; do
    echo "Server 'oispaeliitti' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
