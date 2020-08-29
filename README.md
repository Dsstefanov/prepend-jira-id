# README #

This project is to help teams using jira to prepend the task number to
the commit message automatically in order to improve traceability when using git
blame or annotate to find a reason why the code has been changed.

How to run it:
* Copy the file setupGitHooks.ts
* Paste it in the root directory of your project
* Run "node setupGitHooks.ts"

To further automate the process you can simply execute the script every time when the project
is being build to ensure that a developer cannot forget it.

In case of existing scripts that modify the git hooks such as husky,
remember to prepend the script before the other shell scripts.

The script allows for a further extension of hooks. You can simply create a new object in hookSetup array
with properties:
* hookId - Ensures that once the script has been executed won't prepend the script again to the git hook
* hookName - Must match the hook name that will be modified
* hookData - The actual shell script to be executed
* defineShell - The shell definition. If this defines a python script then hookData shall also be a python script

If you are using a language different from JS, then you can simply copy the content of
hookSetup[0].hookData and paste it into the file <ProjectDir>/.git/hooks/prepare-commit-msg
(remember to define shell before that)
