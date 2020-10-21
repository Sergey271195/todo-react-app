#!/bin/bash

while ! nc -z db:5432 </dev/null; do sleep 5; done

python /usr/app/manage.py migrate --noinput;
python /usr/app/manage.py collectstatic --noinput;
python /usr/app/manage.py populate;

exec "$@"