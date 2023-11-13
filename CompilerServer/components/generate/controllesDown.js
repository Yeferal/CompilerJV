const colors = require('colors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { jsonResponse } = require("../../middleware/json");
const { generate3DTHead, generate3DTInt, generate3DTFloat, generate3DTString, generate3DQuartet } = require('./handler-quartet-3d');

const express = require("express");
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// app.use(bodyParser.text());
// app.use(express.json());


const controller = {}

controller.downTreeDirBin = async (req, res) => {
    try {
        let textHead = generate3DTHead();
        let textInts = generate3DTInt(req.body.listInt);
        let textFloat = generate3DTFloat(req.body.listFloat);
        let textString = generate3DTString(req.body.listString);
        let textVoid = generate3DQuartet(req.body.listVoid);
        let textQuartet = generate3DQuartet(req.body.listQuartet);
        let textTotal = textHead + textInts + textFloat + textString + textVoid + textQuartet;

        const filePath = path.join(process.cwd(), 'public', 'temp');
        fs.writeFileSync('public/temp.c', textTotal);

        // const compileCommand = 'gcc temp.c -o main';
        const compileCommand = 'gcc temp.c -o public/main -lm';

        exec(compileCommand, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).send(stderr);
            }
            
            // Devolver el archivo compilado como respuesta
            const compiledFile = fs.readFileSync('main', 'binary');
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename=main');
            res.send(compiledFile);


        });
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(400).json(response);
    }
}

controller.downTreeDir = async (req, res) => {
    try {
        console.log("HOla");
        let textHead = generate3DTHead();
        let textInts = generate3DTInt(req.body.listInt);
        let textFloat = generate3DTFloat(req.body.listFloat);
        let textString = generate3DTString(req.body.listString);
        let textVoid = generate3DQuartet(req.body.listVoid);
        let textQuartet = generate3DQuartet(req.body.listQuartet);
        let textTotal = textHead + textInts + textFloat + textString + textVoid + textQuartet;

        const filePath = path.join(process.cwd(), 'public', 'temp.c');
        // fs.writeFileSync('temp.c', textTotal);
        fs.writeFileSync("public/temp.c", textTotal);
        
        
        // const compileCommand = 'gcc temp.c -o main';
        // const compileCommand = 'gcc temp.c -o main -lm';
        
        res.setHeader('Content-Disposition', 'attachment; filename=temp.c');
        res.setHeader('Content-Type', 'text/plain');

        // Enviar el contenido del archivo como respuesta
        console.log(filePath);
        res.sendFile(filePath);
        
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(400).json(response);
    }
}

controller.downAssm = async (req, res) => {
    try {
        
        console.log(req.body);
        // const data = 
        const response = jsonResponse(
            'success',
            {},
            'Operacion Existosa',
            null
        );
        return res.json(response);
        
    } catch (error) {
        const response = jsonResponse(
            'error',
            null,
            'Error en la lectura o Parse del Archivo XML',
            {
                code: 500,
                message: 'Error interno del servidor'
            }
        );
        return res.status(400).json(response);
    }
}


module.exports = controller;