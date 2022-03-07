const fs = require("fs");

// you can pass in encoding option as second arg
const readStream = fs.createReadStream("./docs/blog3.txt", {
  encoding: "utf8",
});
const writeStream = fs.createWriteStream("./docs/blog4.txt");

// on method is an event listener; listenting to a data event on this readstream = every time we receive a buffer of data from the stream
// buffer = small package of data we can use straight away
// wevery time new chunk of data, fire calback function and get access to new chunk of data
// readStream.on("data", (chunk) => {
//   console.log("----- NEW CHUNK ------");
//   console.log(chunk);
//   writeStream.write("\nNEW CHUNK\n");
//   writeStream.write(chunk);
// });

// piping: easier way to go from read stream to writestream
readStream.pipe(writeStream);
