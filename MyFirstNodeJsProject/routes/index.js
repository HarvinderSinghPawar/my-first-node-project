const router = require("express").Router();




router.get('/', (req, res, next) => {
    // res.send('Hello Harvinder! How are you ?')
    data = {
        title: "Educational registration form",
        company_name: "Wegile",
    }
    res.render('index', data);
});




module.exports = router;