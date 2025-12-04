import dotenv from "dotenv"
import chalk from "chalk";
import app from "./app.js";

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 3000

app.listen(port, (()=>{
    console.log(chalk.green(`Tero listening at port http://localhost:${port}`));
    
}));
