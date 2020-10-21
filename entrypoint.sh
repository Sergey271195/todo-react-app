#!/bin/bash

#if ["$DATABASE" = "postgres"]
#then
#    echo "Waiting for postgres..."
#
#    while ! nc -z $DB_HOST $DB_PORT; do
#      sleep 0.1
#    done
#
#    echo "PostgreSQL started"
#fi

while ! nc -z db:5432 </dev/null; do sleep 5; done

python /usr/app/manage.py migrate --noinput;
python /usr/app/manage.py collectstatic --noinput;
python /usr/app/manage.py populate;

exec "$@"