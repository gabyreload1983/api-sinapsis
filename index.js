import express from "express";
import cors from "cors";
import workOrdersRouter from "./routes/workOrders.router.js";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/work-orders", workOrdersRouter);
