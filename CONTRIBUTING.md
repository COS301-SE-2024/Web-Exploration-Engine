<p align="center">
  <img src="https://github.com/COS301-SE-2024/Web-Exploration-Engine/assets/99127918/7688d67d-ddc7-4ef2-abc4-1b5ebb145d96" width="240" height="auto">

  <h1 align="center">Contributing to The Web Exploration Engine </h1>
This is a guide on how to get started coding in the Web Exploration Repo 

</p>


<div align="center" >


| Resource                       | Link                                                       |
|--------------------------------|------------------------------------------------------------|
| 1. Installation                | [Setting up the project for the first time](#1-first-time-installation)        |
| 2. Deploy Locally              | [Local deployment](#2-deploy-locally)                                          |
| 3. Coding Standards            | [GitFlow and branch naming strategies to follow](#3-gitflow-and-git-standards) |

</div>


# 1. First Time Installation

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

Deploy the webscraper first

```powershell
npx nx serve webscraper
```
Then deploy the frontend application

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
