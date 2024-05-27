# Overview
 This is a guide on how to get started coding in the Web Exploration Repo 

Please ensure you're running the code in a linux terminal

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

