const fs = require('fs');

const pathXML = './data-projects/project-files/projects.xml';
const pathLibrary = './data-projects/Projects';

const readFile = (path) => {
    try {
        // Intenta leer el contenido del archivo
        const contenido = fs.readFileSync(path, 'utf-8');
        return contenido;
    } catch (error) {
        console.error(`Error al leer el archivo:\n ${error.message}`);
        return null;
    }
}

const readFileXML = () => {
    try {
        const data = fs.readFileSync(pathXML, 'utf-8');
        return data;
    } catch (error) {
        console.error(`Error al leer el archivo: ${error.message}`);
        fs.writeFileSync(pathXML, "<libreria>\n</libreria>");
        return "<libreria>\n</libreria>";
    }
}


const createFile = (path,text) => {

    try {
        await 
    } catch (error) {
        
    }

    return fs.writeFile(path, text, function (err){
        if(err){
            console.log(err);
        }else{
            console.log('Archivo creador en la ruta: '+path);
        }
    });
    
}

const createFolder = (path) =>{
    fs.mkdirSync(path,{recursive:true});
}

module.exports = {
    readFile,
    readFileXML,
    createFile,
    createFolder,
    pathXML,
    pathLibrary
}