import { Command } from "commander";

const program = new Command();

program
    .option("-p <port>", "Puerto de servidor", 8080)
    .option("--mode <mode>", "Modo de trabajo", "produccion")
program.parse();

export default program;