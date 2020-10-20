#!/bin/bash

echo "Collecting static files"
python manage.py collectstatic

echo "Migrate database"
ptyhon manage.py migrate

echo "Good luck"