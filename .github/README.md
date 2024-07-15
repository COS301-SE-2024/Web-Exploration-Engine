# Running GitHub Actions Locally Using `act`

`act` is a tool that allows you to run GitHub Actions locally. It's particularly useful for testing and debugging your GitHub Actions workflows before pushing them to GitHub. Here's a step-by-step guide on how to set it up and use it:

# General Shortcuts :)


- **Running Specific Jobs** :

```typescript
  act -j lint-build-test
```

```typescript
  act -j run-cypress-tests
```

```typescript
  act -j lint-build-test
```


# 1. Install `act`

First, you need to install `act`. You can do this via Homebrew, the `act` GitHub releases page, or by using Docker.

- **Using Homebrew** (macOS and Linux):
```bash
  brew install act
```

- **Using Docker** :

```bash
docker run --rm -it -v "$(pwd)":/github/workspace -w /github/workspace nektos/act
```

- **From GitHub Releases (for Windows or other systems)**:
Go to the releases page, download the appropriate binary for your system, and follow the installation instructions.

**If you dont have brew installed**

You can install it in the following ways : 

<details><summary>Windwos/Linux Installation</summary>
<p>

inux/macOS (Bash script):

```curl <https://raw.githubusercontent.com/nektos/act/master/install.sh> | sudo bash```

macOS (Homebrew):

```brew install act```

Windows (Chocolatey):

```choco install act-cli```

Windows (Scoop):

```scoop install act```

</p>
</details> 



<details><summary>Install Scoop or Chocolatey - Windows </summary>
<p>

Install Scoop :
https://github.com/ScoopInstaller/Scoop


Alternatively Install Chocolatey :
https://chocolatey.org/install#install-step2

</p>
</details> 

# 2. Prepare Your GitHub 

Make sure you have your GitHub Actions workflow defined in your repository, typically in the `.github/workflows/` directory.

```bash
 cd .github/workflows/ 
 ```

Make sure you have at least one workflow file here eg

# 3. Set Up Secrets and Environment Variables

If your workflow requires secrets or environment variables, you need to set them up for act. You can do this in two ways:

1. Using .secrets file:
Create a .secrets file in your repository root with the following format:

``` bash
SECRET_NAME=your_secret_value
``` 

2. Using the -s flag:
You can also pass secrets directly using the -s flag:

```bash
act -s SECRET_NAME=your_secret_value
```

**Don't forget to make sure this is added to your gitignore 🫡**

# 4. Run act
Navigate to your repository's root directory and run act. 
By default, act uses the push event. If you need to run a different event, specify it using the -e flag.

Run the default event (usually push):

```bash
act
```
Run a specific event:

```bash
act -e pull_request
```
Run a specific job:

```bash
act -j job_id
act -j lint-build-test
act -j
```
