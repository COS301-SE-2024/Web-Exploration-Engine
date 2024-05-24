
<p align="center">
  <img src="https://github.com/COS301-SE-2024/Web-Exploration-Engine/assets/99127918/7688d67d-ddc7-4ef2-abc4-1b5ebb145d96" width="240" height="auto">

  <h1 align="center"> Coding Standards </h1>

</p>



<div align="center" >

<h2 align="center"> Table of Contents </h2>

   
| Resource                       | Link                                                       |
|--------------------------------|------------------------------------------------------------|
| Coding Standards               | [The first item](#1-coding-standards)                |
| Code Layout and Structure      | [The second item](#2-code-layout-and-structure)      |
| Error Handling                 | [The third title](#3-error-handling)                 |
| Testing and Debugging          | [The third title](#4-testing-and-debugging)          |
| Git Repository and Strategy    | [The third title](#5-git-repository-and-strategy)    |
</div>




<br>

# 1. Coding standards

**Naming conventions:**
Use meaningful names for variables, functions, and files. 

### 1.1. Variables:
  - Camel case will be used for variable names.
  - In camel case, you start a name with a lowercase letter.
  - If the name has multiple words, the later words begin with capital letters. Example:  firstName and lastName.
- Snake Case will be used for constants.
  - In snake case, you start the name with a lowercase letter.
  - If the name has multiple words, the later words also start with lowercase letters, and you use an underscore (_) to separate the words.
  - **Example:** first_name and last_name



 
### 1.2. Functions
- Camel case will be used for Function names.
  - In camel case, you start a name with a lowercase letter.
  - If the name has multiple words, the later words begin with capital letters.
  - Example: firstName and lastName.
  - Functions should be named to clearly describe what they do.



### 1.3. Files
- Snake Case can be used for the naming of files.
  - In snake case, you start the name with a lowercase letter. If the name has multiple words, the later words also start with lowercase letters, and you use an underscore (_) to separate the words. Example: first_name and last_name
- Pascal Case can be used for the naming of files .
  - In Pascal case, names start with a capital letter. For names with multiple words, all words begin with capital letters.Examples: FirstName and LastName








<br>

# 2. Code Layout and Structure

### 2.1. Indentation and Formatting:
Indentation: an indentation of 4 spaces will be used to make the code structure more clear and easier to follow.

### 2.2. Comments
Add comments for function description and to explain complex code. 
Explanations should be kept minimal and descriptive for easy understanding.
Make use of (//) for single line comments and (/* */)  for multi-line comments.
 
### 2.3. Single Statement per Line
Example: 
Correct : <br>
```x: "This is x from state"``` <br>
```y: "This is y from state"```

Incorrect : <br>
```x: "This is x from state", y: "This is y from state"```


<br>

# 3. Error Handling

- Raise errors as early as possible in your code.
- Restore state and resources after handling errors.
- Make use of meaningful error messages.


<br>

# 4. Testing and Debugging
### 4.1 Types of Tests
Our project will have 3 master types of tests:
- **Unit Testing:**
  - Jest individual components, functions, and utilities in isolation to ensure they behave as expected.
  - Using : Jest
  - Each test has to have the same name as the component being tested, with test includeded.
    - Example : a component named ```popup.tsx``` will have a corresponding test called ```popup.test.tsx``` 

- **Integration Testing:**
  - Test the interactions between different components or modules to verify that they work together correctly.
  - Using : Cypress


- **End-to-End Testing:**
  - Test the entire application from the user's perspective to ensure that all components and functionalities work together
  - Using : Cypress
  

### 4.2 Code Coverage
- 80% or higher coverage for critical
- Measured using Jest


For more information on the testing, you may refer to the [Testing Specification](https://github.com/COS301-SE-2024/MiniProject5/blob/documentation/documentation/Testing-Specification.md)


<br>

# 5. Git Repository and Strategy

### 5.1 Git Flow

We will be using the Git Flow branching strategy. One of the primary benefits is that it facilitates parallel development, allowing our production code to remaster stable at all times. 

We will have the following branches:
- Master
- Development
- Feature
- Hotfix
- Documentation
- Config



**Master**
  - The source code within the `master` branch should always reflect a production-ready state.
  - When the source code in the `development` branch is stable, fully-tested and is ready to be deployed in the production environment, all changes should be merged back into `master`.  

**Develop**
- The `development` branch serves as the ‘central hub’ for adding new features, running experiments, and reviewing or refactoring the source code.
- The ultimate goal is to prepare for a new release to be merged onto the `master` branch.

**Feature**
- Feature branches may branch off from `development` and must merge back into `development`. 
- A `feature` branch will exist for as long as a feature is in development.
- Eventually, feature branches are either merged back into `development` or discarded (if the feature was scrapped).

**Hotfix**
- Hotfix branches branch off from master and must merge into `master` and `development`.
- Their purpose is also to prepare for an unexpected new production release, caused by a bug in the production environment.
- They allow a subset of the team to quickly fix the issue while development/testing for future releases continues.

**Documentation**
- This branch will be used to update the documentation pertaining to the project.

**Config**
- This branch will be used to update the configuration pertaining to the project.
- This will include changes to the ci/cd pipeline, changing linter settings, any changes to packages, etc



### 5.2 Git Branch Naming Conventions

All branches will follow the conventions listed below:
- Descriptive
  - The name should be concise and descriptive, clearly reflecting what work will be done in the branch.
  - e.g.) feature/new-login, backend/python, hotfix/cycle-detection-edge-cases
- Lowercase and Hyphen-separated, eg: 
  - ```feature/new-login```
  - ```config/new```
- Alphanumeric Characters
- No Continuous Hyphens




### 5.3 Review Process
- Newly-created features should be based on the `development` branch, and then merged back in when the feature is fully-implemented.
- Automated checks will begin with a Github Action to perform linting, to ensure that developers comply with the above-stated coding standards.
- The next component of the continuous integration (CI) pipeline will be running automated unit tests, using Jest.
- Once the code passes automated checks, it will be manually reviewed by our testers.




### 5.4 CI/CD


#### Linting
- We will be using Eslint to mastertain code quality and consistency, ensuring uniform code across the project.
- The custom rules for our project will correspond to those that were stated in the coding standards.
- Eslint is well-suited for the task of analysing our React project, with it being a dedicated javascript/typescript linter.



