#!/bin/bash
export $(cat .env_not_docker | xargs) && python -Wd manage.py runserver