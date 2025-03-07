#!/usr/bin/env node
import enquirer from 'enquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import getRation from '../index.js';

const showLogo = (text) => console.log(
  chalk.green.bold(
    figlet.textSync(text, {
      font: 'Roman',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    }),
  ),
);

const getUserGender = () => enquirer.prompt({
  name: 'gender',
  type: 'select',
  message: 'What is your gender?',
  choices: ['male', 'female'],
});

const getUserAge = () => enquirer.prompt({
  name: 'age',
  type: 'input',
  message: 'What is your age?',
  initial: 25,
});

const getUserHeight = (gender) => enquirer.prompt({
  name: 'height',
  type: 'input',
  message: 'What is your height?',
  initial: gender === 'male' ? 175 : 165,
});

const getUserWeight = (height) => enquirer.prompt({
  name: 'weight',
  type: 'input',
  message: 'What is your weight?',
  initial: height - 100,
});

const getUserPhysicalActivity = () => enquirer.prompt({
  name: 'physicalActivity',
  type: 'select',
  message: 'What is your physical activity level?',
  choices: [
    { message: 'no activity' },
    { message: '1-3 light activities per week' },
    { message: '3-5 moderate activities per week' },
    { message: '5-6 moderate activities per week' },
    { message: '7 vigorous activities per week' },
  ],
});

const outputQuestion = () => enquirer.prompt({
  name: 'answer',
  type: 'select',
  prefix: String.fromCharCode(0x2B8A),
  message: 'What information do you want to see?',
  choices: ['calories', 'meal plan', 'calories and meal plan', 'exit'],
});

const showMessage = (userInfo, message) => {
  console.log(`${chalk.green(userInfo)}\n`);
  console.log(chalk.white.bold(message));
};

const output = async (userInfo, userData) => {
  const { answer } = await outputQuestion();
  switch (answer) {
    case 'calories':
      showMessage(userInfo, userData.formattedCalories);
      output(userInfo, userData);
      break;
    case 'meal plan':
      showMessage(userInfo, userData.formattedRation);
      output(userInfo, userData);
      break;
    case 'calories and meal plan':
      showMessage(userInfo, `${userData.formattedCalories}\n\n${userData.formattedRation}`);
      output(userInfo, userData);
      break;
    case 'exit':
    default:
      break;
  }
};

const run = async () => {
  showLogo('Split my eat');

  const { gender } = await getUserGender();
  const { age } = await getUserAge();
  const { height } = await getUserHeight(gender);
  const { weight } = await getUserWeight(height);
  const { physicalActivity } = await getUserPhysicalActivity();

  const userInfo = `Gender: ${gender}, age: ${age}, height: ${height}, weight: ${weight}\nPhysical activity: ${physicalActivity}`;
  const userData = getRation(gender, age, height, weight, physicalActivity);
  output(userInfo, userData);
};

run();
