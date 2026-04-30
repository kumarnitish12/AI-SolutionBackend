import dotenv from "dotenv";
import { app } from "./app";

dotenv.config({ override: true });

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
