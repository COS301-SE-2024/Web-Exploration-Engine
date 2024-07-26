<p align="center">
  <img src="https://github.com/COS301-SE-2024/Web-Exploration-Engine/assets/99127918/7688d67d-ddc7-4ef2-abc4-1b5ebb145d96" width="240" height="auto">

  <h1 align="center">Contributing to The Web Exploration Engine </h1>
</p>

<div align="center" >

| Resource                       | Link                                                       |
|--------------------------------|------------------------------------------------------------|
| 1. Installation                | [Setting up the project for the first time](#1-first-time-installation)        |
| 2. Deploy Locally              | [Local deployment](#2-deploy-locally)                                          |
| 3. Coding Standards            | [GitFlow and branch naming strategies to follow](#3-gitflow-and-git-standards) |

</div>


# 1. First Time Installation
Prerequisites : 
1. Docker
2. Nodejs and npm

## Clone the repo

```powershell
git clone https://github.com/COS301-SE-2024/Web-Exploration-Engine.git
```

Go to the root directory 

```powershell
cd Web-Exploration-Engine
```

## Install Nx globally

```powershell
npm add --global nx@latest
``` 


```powershell
cd wee
```

```powershell
npm install
```

## Install the missing packages

```powershell
npm install -g --save-dev jest @types/jest ts-jest
```


# 2. Deploy Locally

## Run docker container 

For local development (you need the redis docker container running BEFORE starting up the webscraper and frontend app - otherwise the backend won't work): 
```powershell
docker pull redis
``` 
```powershell
docker run -d -p 6379:6379 --name myRedisContainer redis redis-server --requirepass your_redis_password
``` 

Redis Notes:
View keys currently in cache:
```powershell
keys *
``` 

Get object stored to the corresponding key:
```powershell
get key_name
``` 

Remove everything in cache:
```powershell
flushall
``` 

Example:
In your cmd prompt:
![image](https://github.com/user-attachments/assets/693767ce-0869-4295-b327-3dd838188089)

Now go to docker - it should look like follows after starting up the redis container:
![image](https://github.com/user-attachments/assets/5e6d6aa4-66cc-4c6f-b7e1-25d23a00f4c5)

Go to the 'Exec' tab in the docker container (this is where all the redis command will be executed so that you can see what is going on in the cache):
![image](https://github.com/user-attachments/assets/b41b56c2-3030-461a-b859-853c7e72146c)
![image](https://github.com/user-attachments/assets/717a4a02-1b7f-460c-94f2-6628fd37d04b)

![image](https://github.com/user-attachments/assets/c17187b0-e08e-4ed6-870d-3837d305e50e)


## Deploy the webscraper 

```powershell
npx nx serve webscraper
```
## Deploy the frontend application

```powershell
npx nx dev frontend
```

# 3. GitFlow and Git Standards
## Branches 

### 1. Master
The source code within the `master` branch should always reflect a production-ready state.

### 2. Development
The `development` branch serves as the ‘central hub’ for adding new features, running experiments, and reviewing or refactoring the source code.

### 3. Feature
Feature branches may branch off from `development` and must merge back into `development`. 

### 4. Hotfix
Hotfix branches branch off from master and must merge into `master` and `development`, used to fix bugs in the production environment.

### 5. Documentation
This branch will be used to update the documentation pertaining to the project.

### 6. Config 
include changes to the ci/cd pipeline, changing linter settings, any changes to packages, etc



## Git Branch Naming Conventions

All branches will follow the conventions listed below:
- Descriptive
  - The name should be concise, written in lowercase and be descriptive, clearly reflecting what work will be done in the branch.
  - e.g.)
    - ```feature/new-login```
    - ```backend/python```
    -  ```hotfix/cycle-detection-edge-cases```
    -  ```feature/new-login```
    -  ```config/prettier```
- Alphanumeric Characters
- No Continuous Hyphens


For a full specificiation on our coding standards, you may look at [Tech Odyssey Coding Standards](https://github.com/COS301-SE-2024/Web-Exploration-Engine/blob/master/documentation/coding-standards.md)
