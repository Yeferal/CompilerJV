const { exec } = require('child_process');
// Comando que deseas ejecutar en la nueva terminal
const comando = 'ls -l';

// Comando para abrir una nueva terminal y ejecutar el comando
const comandoAbrirTerminal = `x-terminal-emulator -e "bash -c '${comando}; bash'"`;

exec(comandoAbrirTerminal, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Comando ejecutado en una nueva terminal: ${comando}`);
});