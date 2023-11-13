const colors = require('colors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const { jsonResponse } = require("../../middleware/json");
const { generate3DTHead, generate3DTInt, generate3DTFloat, generate3DTString, generate3DQuartet } = require('./handler-quartet-3d');


const controller = {}


controller.genTreeDir = async (req, res) => {
    try {
        
        // console.log(req.body);
        let textHead = generate3DTHead();
        let textInts = generate3DTInt(req.body.listInt);
        let textFloat = generate3DTFloat(req.body.listFloat);
        let textString = generate3DTString(req.body.listString);
        let textVoid = generate3DQuartet(req.body.listVoid);
        let textQuartet = generate3DQuartet(req.body.listQuartet);
        let textTotal = textHead + textInts + textFloat + textString + textVoid + textQuartet;
        
        const response = jsonResponse(
            'success',
            {text: textTotal},
            'Operacion Existosa',
            null
        );
        return res.json(response);
        
    } catch (error) {
        console.log(error);
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

controller.genAssm = async (req, res) => {
    try {
        
        
        
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