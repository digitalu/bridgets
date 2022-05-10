import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import util from 'util';

/*
 *  If ! bridgets.config.json
 *
 *  1. Ask for tsConfig location (enter for default: "./tsconfig.json")
 *
 *  SI crash après, faut déjà avoir créer le bridgets.config.json
 *
    2. Where do u want to output your SDK code folder (default: "./sdk")
    --> If folder already exists, ask for confirmation (because it will overwrite current folder)

    3. Give the location where you have exported your SDKTypes type (see more infos on the documentation (hyperlink))
    --> Tu check si tu retrouves \export type SDKTypes\ dans ce file
    --> Si pas, tu dis "SDKTypes not find in {{location}}", see how to export your SDKTypes --> documentation

*/

const rl = readline.createInterface({ input, output });
const question = util.promisify(rl.question).bind(rl);

async function questionExample() {
  try {
    const answer = await question('What is you favorite food? ');
    console.log(`Oh, so your favorite food is ${answer}`);
  } catch (err) {
    console.error('Question rejected', err);
  }
}
export const askForConfig = async () => {
  const answer = await question('Salut');
  console.log('Thanks for your answer');
  console.log(answer);
};
