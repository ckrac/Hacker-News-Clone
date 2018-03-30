const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

// set the view engine to ejs
app.set('view engine', 'ejs');


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.set("view options", {layout: false});
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.render('index.html');
});
