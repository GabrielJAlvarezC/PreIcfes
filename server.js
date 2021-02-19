const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = require("./app");

const DB = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

run().catch(console.dir);

async function run() {
  try {
    const connection = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to db...");
  } catch (e) {
    console.error(e.message);
  }
}

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...\nhttp://127.0.0.1:3000/`);
});
