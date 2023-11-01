const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get('/', controller.getLibrary);
router.get('/projects', controller.getProjects);
router.get('/project/:name', controller.getProject);
router.get('/file-content', controller.getFileContent);

router.post('/project', controller.postProject);
router.post('/folder', controller.postFolder);
router.post('/file', controller.postFile);

router.put('/file-content/', controller.putFileContent);
router.put('/file-contentAs/:nameFile', controller.putFileContentAs);


module.exports = router;



