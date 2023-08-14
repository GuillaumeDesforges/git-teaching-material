# Git collaboration - a practical session

## Before we start

### Requirements

These exercises are designed to be done in pairs.

Each will need

- a laptop with git installed
  - ["Installing Git"](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- a GitHub account with SSH keys installed
  - ["Getting started with your GitHub account"](https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account)
  - ["Adding a new SSH key to your GitHub account"](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

You will be asked to open a terminal (also called a "shell") to use git commands.
- On Windows, you can use the "Windows Console" (`cmd.exe`), or on more recent version versions of Windows either "PowerShell" or the built-in "Terminal" application.
- On MacOS, you can use the built-in "Terminal" application.
- On Linux, use the terminal emulator of your choice.

#### Configure git

If you've never used git before, you will need to configure it on your laptop.
Use the following commands (replace with your own information).

```
git config --global user.name "First name Last name"
git config --global user.email firstname.lastname@example.com
```

You should also make sure that the default name for the main branch is "main".

```
git config --global init.defaultBranch main
```

By default, the editor used in the terminal could be "vim", which can be a bit rough for beginners.

**On Windows**, change it to "notepad.exe"

```
git config core.editor notepad
```

**On Linux and MacOS**, change it to "nano" (read about [nano](https://help.ubuntu.com/community/Nano)).

```
git config --global core.editor "nano"
```

### Agenda

The goal of this practical session is to demonstrate how git enables collaborative work by allowing you to share your contributions and to manage conflicts.

You will learn

- how to make commits
- how to fetch commits made by others
- how to create a branch and switch between branches
- how to merge your changes with others
- how to share your commits

## Collaboration using git

### Setting things up

Collaboration requires a remote repository.
We'll be using GitHub to get one for free.

[https://github.com/](https://github.com/)

#### Create a GitHub project

This has to be done by only one of the two partners, as it will be shared.

> Check that you are logged in to GitHub!

1. Create a repository

  - click on "+" in the top right corner

    ![](./imgs/new-repo/Capture1.PNG)

  - click on "New repository"

    ![](./imgs/new-repo/Capture2.PNG)

  - you can name your repository however you want
    > Usually, we use lowercase characters (`a`, `b`, `c`, ...) spearated by hyphens `-` instead of spaces.
    > Example: if your project is name "My awesome Git project", name your repository `my-awesome-git-project`.
  - write a description
    > Usually a single sentence.
  - select "Private"

    ![](./imgs/new-repo/Capture3.PNG)

  - click on the "New repository" button at the end

    ![](./imgs/new-repo/Capture4.PNG)

2. Give access to you partner

  - go to the web page of your new repository (if you just created it, you should be on it already)
  - go to the repository settings ("Settings" tab)

    ![](./imgs/new-repo/Capture5.PNG)

  - go to the "Collaborators" tab (under "Access" group in the left panel)

    ![](./imgs/new-repo/Capture6-1.PNG)

    you might be required to authenticate via MFA (if not, skip this)

    ![](./imgs/new-repo/Capture6-2.PNG)

  - click on "Add people"

    ![](./imgs/new-repo/Capture7.PNG)

  - find and add your partner

    - type their GitHub "handle" in the text input
    - suggestions should be shown, click on the right one

      ![](./imgs/new-repo/Capture8.PNG)

    - when found, click on the button below "Add XXX to this repository"

      ![](./imgs/new-repo/Capture9.PNG)

#### Download the repository to your laptop

On the repository web page in GitHub, as the project is empty for now, you'll find a "Quick setup" banner.
Click on the "SSH" button in there, you should see something in the form of:

```
git@github.com:yourHandle/your-repo-name.git
```

Copy this url, and clone it to your laptop, for example:

```
git clone git@github.com:yourHandle/your-repo-name.git
```

where `your-repo-name` is replaced by the name of your own repository.

A folder must have been created with this name (e.g. `your-repo-name`).

Change your working directory to it:

```
cd your-repo-name
```

where `your-repo-name` is replaced by the name of your own repository.

Congratulations!
You just "cloned" the repository from the remote (GitHub).
Right now this folder is empty, but soon enough we'll fill it with some files.

> If you have enabled "See hidden files" option, notice the `.git` folder.
>
> git stores all the data it needs to manage the repository in this `.git` folder.
> If you delete it, everything you haven't pushed will be lost forever!

### Hands-on

Now, it's time to start for real!

We'll go through several scenarios which you will often encounter.

One person will play the role of "computer 1" and the other the role of "computer 2".

> Though the examples might seem trivial, pay special attention to understand what is happening.

#### First scenario: collaboration without conflict

We'll start with the simplest.

- On computer 1
  - Create a new file in the folder of the repository, with the following Python script
    ```python
    print("Hello world")
    ```
  - Commit this new file to your local history
  - Push this commit to the remote repository

You can check that the remote repository was properly updated by refreshing the web page of your repository on GitHub.

- On computer 2
  - Fetch these changes, check you have the proper `script.py` file locally
  - Edit `script.py`:
    ```python
    print("Hello world")
    print("This is me")
    ```
  - Commit these changes
  - Push this commit to the remote repository
- On computer 1
  - Fetch these changes, check that you have the updated `script.py` file locally

#### Second scenario: collaboration with conflict

On the same repository

- On computer 1
  - Edit `script.py`:
    ```python
    print("Hello world")
    print("This is me")
    print("Life should be")
    ```
  - Commit this change
  - Push this commit to the remote repository
- On computer 2
  - Edit `script.py`
    ```python
    print("Hello world")
    print("This is me")
    print("Fun for everyone")
    ```
  - Commit these changes
  - Try to push this commit to the remote repository... it should fail!
  - Fetch the changes from the remote repository and resolve conflicts in order to have both lines added
    - See complete instructions on GitHub:
      ["Resolving a merge conflict using the command line"](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line)
  - Push this commit to the remote repository
- On computer 1
  - Fetch these changes, check that you have the updated `script.py` file locally

#### Third scenario: use a Pull Request

On the same repository

- On computer 1
  - Create a new branch
  - Edit `script.py`
    ```python
    print("Hello world")
    print("This is me")
    print("Life should be")
    print("Fun for everyone")
    print("Hello world")
    print("Come and see")
    ```
  - Commit these changes
  - Push this commit to the remote repository
  - Go to GitHub web page, create a "Pull Request" from this new branch to the main branch
    - See complete instructions on GitHub:
      ["Creating a pull request"](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
  - Assign your partner as a "Reviewer"
- On computer 2
  - Check out your notifications on GitHub
    ([https://github.com/notifications](https://github.com/notifications))
  - Go to the Pull Request
  - Add a comment to the requested changes
    - Go to the "File changed" tab
    - Select multiple lines from the newly added lines
      - Click on liner number "5"
      - Hold "Shift" (or "Maj") and click on line number "6"
    - Move your mouse cursor to code of the last selected line, a blue "+" button should appear on its left
    - Click on the blue button, a new text box should appear
    - Write your comment in the text box about the changes you would like the other to make
    - Once done, click on "Start review"
    - For now, the comment has not been posted. You can make multiple comments before posting them.
    - Once you have made all your comments, click on "Review changes" on the top right, then "Submit review"
- On computer 1
  - Check out your notifications on GitHub
  - Check out the review, reply or apply requested changes
- You can repeat this process as much as you'd like, until both parties are satisfied
- On computer 1
  - Click on "Merge Pull Request"
  - Pull the changes of the main branch
  - Delete the branch of the Pull Request
    - on the remote repository
    - locally
