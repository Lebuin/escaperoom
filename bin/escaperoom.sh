#/bin/bash

cd /opt/escaperoom
docker-compose up -d

until curl http://localhost:8081 > /dev/null; do
    sleep 1
done

chromium-browser --start-fullscreen 'http://localhost:8081' &
disown
echo
