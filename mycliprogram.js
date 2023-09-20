const args = process.argv;
const commands = ["read", "write", "copy", "reverse"];
const fs = require("fs");
const readline = require("readline");
const stream = require("stream");
const Transform = stream.Transform || require("readable-stream").Transform;

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
    read(args[3]);
    break;
  case 1:
    write(args[3]);
    break;
  case 2:
    copy(args[3]);
    break;
  case 3:
    reverse(args[3])
    break;
  default:
    console.log(
      "You entered a wrong command. See help text below for supported functions"
    );
    // getHelpText();
    return;
}

function read(filePath) {
  const readableStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  readableStream.on("data", (chunk) => {
    console.log(chunk);
  });

  readableStream.on("error", (error) => {
    console.error(error);
  });
}

function write(filePath) {
  const writableStream = fs.createWriteStream(filePath, { encoding: "utf-8" });
  writableStream.on("error", (error) => {
    console.error(error);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter a sentence: ",
  });

  rl.prompt();

  rl.on("line", (line) => {
    switch (line.trim()) {
      case "exit":
        rl.close();
        break;
      default:
        sentence = line + "\n";
        writableStream.write(sentence);
        rl.prompt();
        return;
    }
  }).on("close", () => {
    writableStream.end();
    writableStream.on("finish", () => {
      console.log(`All your sentences have been written to ${filePath}`);
    });
    setTimeout(() => {
      process.exit(0);
    }, 100);
  });
}

function copy(filePath) {
  const inputStream = fs.createReadStream(filePath);
  const fileCopyPath =
    filePath.split(".")[0] + "copy." + filePath.split(".")[1];
  const outputStream = fs.createWriteStream(fileCopyPath);

  inputStream.pipe(outputStream);

  outputStream.on("finish", () => {
    console.log(`A copy of ${filePath} has been created at ${fileCopyPath}`);
    outputStream.end();
  });

  inputStream.on("error", (error) => {
    console.error(error);
  });

}


function reverse(filePath) {
  const readStream = fs.createReadStream(filePath);
  const reversedDataFilePath =
    filePath.split(".")[0] + "-reversed." + filePath.split(".")[1];
  const writeStream = fs.createWriteStream(reversedDataFilePath);

  const reverseStream = new Transform({
    transform(data, encoding, callback) {
      const reversedData = data.toString().split("").reverse().join("");
      this.push(reversedData);
      callback();
    },
  });

  readStream
    .pipe(reverseStream)
    .pipe(writeStream)
    .on("finish", () => {
      console.log(
        `Finished reversing the contents of ${filePath} and saving the output to ${reversedDataFilePath}.`
      );
    });
}