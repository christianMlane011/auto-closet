const { Router } = require("express");
const clothingController = require("../controllers/clothingController"); 

const router = Router();

router.get('/', clothingController.clothing_get);

router.delete('/:id', clothingController.clothing_delete);




module.exports = router; 