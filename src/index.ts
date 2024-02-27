import app from './app';
import {errorHandler} from "@/utils/errorHandler";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

