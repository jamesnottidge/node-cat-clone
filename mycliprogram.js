const args = process.argv;
const commands = ["read", "write", "copy", "reverse"];
const fs = require("fs");
const readline = require("readline");


const getHelpText = function () {
  const helpText = `
    simplecli is a simple cli program to demonstrate how to handle files using streams.
    usage:
        mycliprogram <command> <path_to_file>

        <command> can be:
        read: Print a file's contents to the terminal
        write: Write a message from the terminal to a file
        copy: Create a copy of a file in the current directory
        reverse: Reverse the content of a file and save its output to another file.

        <path_to_file> is the path to the file you want to work with.
    `;
  console.log(helpText);
};

let command = "";

if (args.length < 3) {
  getHelpText();
  return;
} else if (args.length > 4) {
  console.log("ERR: Too many arguments");
  getHelpText();
  return;
} else {
  command = args[2];
  if (!args[3]) {
    console.log("ERR: This tool requires at least one path to a file");
    getHelpText();
    return;
  }
}

switch (commands.indexOf(command)) {
  case 0:
    console.log("command is read");
    read(args[3]);
    break;
  case 1:
    console.log("command is write");

    break;
  case 2:
    console.log("command is copy");
    break;
  case 3:
    console.log("command is reverse");
    break;
  default:
    console.log(
      "You entered a wrong command. See help text below for supported functions"
    );
    // getHelpText();
    return;
}


function read (filePath) {
    const readableStream = fs.createReadStream(filePath, { encoding: "utf-8" });
    readableStream.on("data", (chunk) => {
      console.log(chunk);
    });

    readableStream.on("error", (error) => {
        console.error(error);
    });
}

