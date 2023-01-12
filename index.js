const express = require("express");
const urbanoRoutes = require("./routes/urbanoRoutes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Environment
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`EXPRESS: ${app.get("env")}`);

const port = process.env.PORT || 4444;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// routes
app.use("/api", urbanoRoutes);
