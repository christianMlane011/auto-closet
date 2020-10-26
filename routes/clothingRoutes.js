const { Router } = require("express");
const clothingController = require("../controllers/clothingController"); 

const router = Router();

router.get('/', clothingController.clothing_get);

router.delete('/:id', clothingController.clothing_delete);

router.post('/outfits', clothingController.clothing_outfit);

router.get('/outfits', clothingController.clothing_outfit_get);

router.delete('/outfits/:id', clothingController.clothing_outfit_delete);




module.exports = router; 