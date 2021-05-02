#!/bin/bash
git pull origin docker
docker-compose down
docker-compose up -d --build