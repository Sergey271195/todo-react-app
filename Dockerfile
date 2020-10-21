FROM node:14-alpine
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/nodebuild
COPY node/ /usr/nodebuild
RUN npm install && npm run build

FROM python:3.9-alpine

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev bash
WORKDIR /usr/app

COPY requirements.txt /usr/app
RUN pip install -r requirements.txt

COPY . /usr/app
COPY --from=0 usr/nodebuild/build /usr/app/frontend/static
RUN rm -r  node

ENTRYPOINT ["/bin/bash", "/usr/app/entrypoint.sh"]