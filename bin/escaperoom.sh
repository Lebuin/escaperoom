#/bin/bash

cd /opt/escaperoom
docker-compose up -d

until curl http://localhost:8081 > /dev/null 2>&1; do
    sleep 1
done

chromium-browser --start-fullscreen 'http://localhost:8081'
