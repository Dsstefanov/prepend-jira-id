/**
 * This script fetches a file {currentDirectory}/.git/hooks/{hookSetup.hookName} and replaces its
 * content in the order: {hookSetup.defineShell} -> {hookSetup.hookId} -> {hookSetup.hookData}
 *
 * The hookSetup.hookData must be a shell script
 *
 * The script for prepare-commit-msg hook replaces the content of the file prepare-commit-msg with
 * the following script which prepends the shell definition then the id and then the hookData which
 * prepends the branch taskId to the commit message (notice it will skip branches such as develop,
 * master and test). Also to note it uses the current local branch not the remote origin one.
 */
const fs = require('fs');
const path = require('path');

const hookSetup = [
  {
    hookId: '5badd8fe4a886e1adc326baa',
    hookName: 'prepare-commit-msg',
    hookData: 'if [ -z "$BRANCHES_TO_SKIP" ]; then\n' +
        '  BRANCHES_TO_SKIP=(master develop test)\n' +
        'fi\n' +
        '\n' +
        'BRANCH_NAME=$(git symbolic-ref --short HEAD)\n' +
        'BRANCH_NAME="${BRANCH_NAME##*/}"\n' +
        '\n' +
        'BRANCH_EXCLUDED=$(printf "%s\\n" "${BRANCHES_TO_SKIP[@]}" | grep -c "^$BRANCH_NAME$")\n' +
        'BRANCH_IN_COMMIT=$(grep -c "\\[$BRANCH_NAME\\]" $1)\n' +
        '\n' +
        'if [ -n "$BRANCH_NAME" ] && ! [[ $BRANCH_EXCLUDED -eq 1 ]] && ! [[ $BRANCH_IN_COMMIT -ge 1 ]]; then\n' +
        '  sed -i.bak -e "1s/^/[$BRANCH_NAME] /" $1\n' +
        'fi',
    defineShell: '#!/bin/sh'
  }
];

hookSetup.forEach(hook => {
  fs.readFile(process.cwd() + path.normalize(`/.git/hooks/${hook.hookName}`), 'utf-8', (err, data) => {
    if (err) {
      console.error('An error occured setting up hooks:' + err);
    } else {
      if (!data.includes(hook.hookId)) {
        fs.writeFile(process.cwd() + path.normalize(`/.git/hooks/${hook.hookName}`),
            `${hook.defineShell}\n\n # HOOK_ID: ${hook.hookId} \n\n ${hook.hookData} \n\n ${hook.husky}`, function(err) {
              if (err) {
                return console.warn(err);
              } else {
                console.log(`${hook.hookName} is now set up!!`);
              }
            });
      }
    }
  });
});
