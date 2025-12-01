# SRE Technical Task - Node.js App + ECS Fargate Module

Simple Node.js application with health/metrics endpoints, dockerized and ready for deployment on AWS ECS Fargate.


# Node.js app , dockerized. CI/CD with Github actions TASK I 

## Short description 
- I picked NodeJS because it's lightweigt, has a simple setup and the Alpine Docker image is very small.For simple health/metrics API it's easy to develop.
- Within the app, port was set to 3000 with a variable. Even though it's requested in the task, I chose for it not to be hardcoded because it's easier to maintain and troubleshoot if any issues occure.
- The app is written in a way that will count everytime a endpoint is run (health and metrics).
- When health metric is run, it will give the satus of the application (to check if it's working) and     date & time when the /health metric was run
- When metric is run, it will provide the total amount of requests since the app is started and it's uptime.
- Dockerfile is written in a way to use Alpine due to it being lightweigh and saves space.
- It sets a working dir in "/app" , copies files from package*.json. Install all required depdencecies with npm ci (npm ci is more faster and reliable then npm install). 
- The next step is copying the application and exposes port 3000. For running a healtcheck I was using node because it already exists in the image. If i wanted to use curl, I would have to install it which increases space usage. 


## 1. Running Locally

***Go to application dir***

`cd app`

***Install dependencies***

`npm install`

***Start application***

`npm start`

***You should see the app running with the following:***

Expected output:
``` 
    > sre-health-app@1.0,0 start
    > node app.js

    Server running on port 3000
```

### Testing endpoints:

***Health check***

`curl http://localhost:3000/health`

` {"status":"ok","timestamp":"2025-11-27T12:00:00.000Z"}`

***Metrics***

`curl http://localhost:3000/metrics`

`{"total_requests":2,"uptime_seconds":60}`

## 2. Running with Docker


***Build image***

`docker build -t sre-app:latest ./app`

***Run container (port mapping 80 -> 3000)***

`docker run -d -p 80:3000 --name sre-app sre-app:latest`

#### Testing
***health endpoint***

`curl http://localhost/health`

***metrics endpoint***

`curl http://localhost/metrics`

***Check container health status***

`docker inspect --format='{{.State.Health.Status}}' sre-app`

***Cleanup***

`docker stop sre-app && docker rm sre-app`


## 3. CI/CD Pipeline

GitHub Actions automatically builds and pushes Docker image to GitHub Container Registry (GHCR) when code is pushed to `master` branch.

### Repository Setup

1. Create GitHub repository and push code:

**You might have to setup ssh keys and add them to github before you're able to push your changes**
```
git init
git add .
git commit -m "Initial commit"
git branch -M master
git remote add origin https://github.com/YOUR_USERNAME/sre-task.git
git push -u origin master
```

2. Configure permissions:
   - GitHub → Settings → Actions → General
   - Workflow permissions: **"Read and write permissions"**

### Using GHCR Image


#### Pull
`docker pull ghcr.io/YOUR_USERNAME/sre-task:latest`

#### Run
`docker run -d -p 80:3000 ghcr.io/YOUR_USERNAME/sre-task:latest`

# Terraform TASK II

## 4. Terraform - ECS Module

### Short Description what was done
- I created a terraform module for deploying a containerized app on ECS Fargate.
- Root module (terraform/) which calls the ECS module and passes configuration via set variables
- Child module (terraform/ecs_module) that has all ECS resource definitions. 
- This module creates 7 AWS resources: ECS Cluster, ECS Service, Task definition, IAM Executon role, IAM Task role, IAM policy attachment and CloudWatch Log group.

### Design Decisions

**Terraform hardcoded values:**

- launch_type = "FARGATE" - explicitly required by the task
- network_mode = "awsvpc" - mandatory for Fargate
- Log retention = 7 days - reasonable default for dev/test environment

**Other decisions:**
- Mock AWS provider - enables "terraform plan" without real credentials
- All resources tagged with "SRE_TASK" # task requirement

### Production Notes

For real AWS deployment you need to:
1. Remove mock provider configuration
2. Configure real AWS credentials
3. Create VPC, subnets, and security groups
4. Update `terraform.tfvars` with real resource IDs
5. Run `terraform apply`

### Running Terraform

***Go to terraform dir***

`cd terraform`

***Initialize and download providers***

`terraform init`    

***Validate configuration***

`terraform validate`  

***Preview what will be created***

`terraform plan`

```
 Expected output: "Plan: 7 to add, 0 to change, 0 to destroy."
```
### Configuration (terraform.tfvars)

```
cluster_name    = "sre-app-cluster"
service_name    = "sre-app-service"
task_cpu        = "256"
task_memory     = "512"
container_name  = "sre-health-app"
container_image = "ghcr.io/Kakogod/sre-task:latest"
container_port  = 3000
desired_count   = 2
sre_task_owner  = "Filip_Jankovski"

environment_variables = [
  { name = "APP_ENV", value = "dev" },
  { name = "LOG_LEVEL", value = "info" }
]
```
***Mock values for terraform plan***
```
subnets         = ["subnet-mock123456", "subnet-mock654321"]
security_groups = ["sg-mock123456"]
```
***Module Outputs***
```
cluster_name # Name of the ECS cluster
service_name # Name of the ECS service
task_definition_arn # ARN of the task definition
cloudwatch_log_group # Name of the log group
```
### Author

**Filip Jankovski** - SRE Technical Task