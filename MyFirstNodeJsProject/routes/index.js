const router = require("express").Router();


//Index Routing Starts From Here
router.get('/', require('../controllers/home/indexController').index);
router.get('/login', require('../controllers/home/indexController').login);

router.get("/url", (req, res, next) => {
    console.log("You hit the /url hahahaha")
    res.json({
        "1": "Hello1",
        "2": "Hello2"
    });
});


module.exports = router;