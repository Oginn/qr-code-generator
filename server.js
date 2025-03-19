import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

inquirer
  .prompt([
    {
      type: 'list',
      name: 'type',
      message: 'What do you want to encode?',
      choices: ['URL', 'Text', 'Phone Number'],
    },
    {
      type: 'input',
      name: 'data',
      message: (answers) => {
        switch (answers.type) {
          case 'URL':
            return 'Enter the URL:';
          case 'Text':
            return 'Enter the text:';
          case 'Phone Number':
            return 'Enter the phone number:';
          default:
            return 'Enter the data:';
        }
      },
    },
  ])
  .then((answers) => {
    const { type, data } = answers;

    // Generate QR code
    const qr_svg = qr.image(data, { type: 'png' });
    qr_svg.pipe(fs.createWriteStream('qr_image.png'));

    // Save the data to a file
    fs.writeFile('data.txt', data, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });

    console.log(`QR code generated for ${type}: ${data}`);
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.error('Prompt could not be rendered in the current environment.');
    } else {
      console.error('Something went wrong:', error);
    }
  });