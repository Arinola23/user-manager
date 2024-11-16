const express = require("express");
const router = express.Router();
const userController = require('../controllers/userControllers')
// const {userController} = require('../controllers/userControllers')

// router.get('/', userController)
router.get('/', userController.view)
router.post('/', userController.find)
router.get("/adduser", userController.form)
router.post("/adduser", userController.createUserForm)

router.get('/edituser/:id', userController.editUser)
router.post('/edituser/:id', userController.updateUser)
router.get("/viewOneUser/:id", userController.viewOneUser)
router.get('/deleteuser/:id', userController.getdeleteUser)
router.post('/deleteuser/:id', userController.deleteUser)
// router.get('/deleteuser/:id', userController.deleteUser)

module.exports = router