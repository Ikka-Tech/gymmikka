import express from "express";
import assistantRoutes from "./routes/assistant";
import statusRoute from "./routes/status";
import gymRoutes from "./routes/gym";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", assistantRoutes);
app.use("/status", statusRoute);
app.use("/gym", gymRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
