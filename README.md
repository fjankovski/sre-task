# SRE Technical task

This project implements simple NodeJS with health and metrics endpoints, dockerized with Dockerfile and automatized CI/CD process through Github Actions for build and push of Docker image in Github Container Registry.

## Starting the app locally

### Installation of dependencies
cd app
npm install

### Starting the application
npm start

Expected output should be:

> sre-health-app@1.0,0 start
> node app.js

Server listening on port 3000


### Endpoint testing
# health
curl http://localhost:3000/health
# {"status":"ok","timestamp":"2025-11-27T12:14:36.972Z"}

# Metrics
curl http://localhost:3000/metrics
# {"total_requests":2,"uptime_seconds":61}
----

### Starting the app through Docker

## Docker image build

docker build -t sre-app:latest ./app

## Starting the container (maping port 80 -> 3000)

docker run -d -p 80:3000 --name sre-app sre-app:latest

## Testing 
# Health check (port 80)
curl http://localhost/health
# Metrics (port 80)
curl http://localhost/metrics
----

## Checking health status through Docker

## Quick check
docker ps
# Status of the container

### Detailed health status
docker inspect --format='{{.State.Health.Status}}' sre-app
---

## Cleanup
docker stop sre-app
docker rm sre-app

----

