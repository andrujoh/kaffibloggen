
var expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

//App configuration
//mongoose.connect("mongodb://localhost/kaffibloggen");
mongoose.connect("mongodb://kaffi:asd987fds@ds117931.mlab.com:17931/kaffibloggen");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


//Mongoose configuration
var blogSchema = new mongoose.Schema({
  title: String,
  image: {type: String, default: "https://cdn.pixabay.com/photo/2013/07/13/09/51/coffee-156158_960_720.png"},
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


//Init blogs
// Blog.create({
//   title: "Kaffe som dessert",
//   image: "https://cdn.pixabay.com/photo/2017/03/27/09/04/coffee-2177763__340.jpg",
//   body: "Seasonal et, medium mocha coffee single origin chicory. Cappuccino rich, caffeine that cortado carajillo brewed. French press percolator coffee half and half eu dripper cappuccino iced french press. At body, cream variety spoon, rich bar sweet foam extraction sit instant. Crema pumpkin spice, espresso redeye iced, sweet percolator siphon sugar café au lait ristretto."
// });

// Blog.create({
//   title: "Morgen Kaffen som slår alt",
//   image: "https://cdn.pixabay.com/photo/2015/05/21/18/30/coffee-777612_960_720.jpg",
//   body: "Trifecta, flavour, dripper, decaffeinated con panna flavour et turkish dripper. Saucer rich cream affogato flavour a, and, cortado café au lait pumpkin spice redeye viennese. Qui flavour, saucer redeye, con panna kopi-luwak, half and half sweet caramelization blue mountain sweet flavour. That wings, dripper and cream roast wings. Plunger pot whipped cinnamon black ristretto galão robusta pumpkin spice. Cultivar grinder cup decaffeinated a and aged. Con panna, a cinnamon, macchiato, carajillo, wings et espresso trifecta arabica flavour. Aroma est crema, trifecta cappuccino cortado redeye turkish roast. Carajillo, turkish flavour, cream barista, id, aftertaste ut barista body coffee sugar. Whipped eu medium half and half grounds wings cortado cappuccino and seasonal."
// });

// Blog.create({
//   title: "Jeg trenger en Cappucino",
//   image: "https://cdn.pixabay.com/photo/2015/03/11/11/38/coffee-668550_960_720.jpg",
//   body: "Filter, lungo aroma con panna beans skinny macchiato percolator aromatic barista. Americano viennese frappuccino est coffee organic strong saucer con panna. Whipped fair trade coffee cappuccino crema shop flavour aroma cortado sweet. Fair trade iced aromatic carajillo aromatic cortado et, french press siphon so aftertaste spoon. Cinnamon spoon, sit in mug cappuccino organic."
// });

// Blog.create({
//   title: "Kaffe som dessert",
//   image: "https://cdn.pixabay.com/photo/2017/03/27/09/04/coffee-2177763__340.jpg",
//   body: "Seasonal et, medium mocha coffee single origin chicory. Cappuccino rich, caffeine that cortado carajillo brewed. French press percolator coffee half and half eu dripper cappuccino iced french press. At body, cream variety spoon, rich bar sweet foam extraction sit instant. Crema pumpkin spice, espresso redeye iced, sweet percolator siphon sugar café au lait ristretto."
// });

// Blog.create({
//   title: "Morgen Kaffen som slår alt",
//   image: "https://cdn.pixabay.com/photo/2015/05/21/18/30/coffee-777612_960_720.jpg",
//   body: "Trifecta, flavour, dripper, decaffeinated con panna flavour et turkish dripper. Saucer rich cream affogato flavour a, and, cortado café au lait pumpkin spice redeye viennese. Qui flavour, saucer redeye, con panna kopi-luwak, half and half sweet caramelization blue mountain sweet flavour. That wings, dripper and cream roast wings. Plunger pot whipped cinnamon black ristretto galão robusta pumpkin spice. Cultivar grinder cup decaffeinated a and aged. Con panna, a cinnamon, macchiato, carajillo, wings et espresso trifecta arabica flavour. Aroma est crema, trifecta cappuccino cortado redeye turkish roast. Carajillo, turkish flavour, cream barista, id, aftertaste ut barista body coffee sugar. Whipped eu medium half and half grounds wings cortado cappuccino and seasonal."
// });

// Blog.create({
//   title: "Jeg trenger en Cappucino",
//   image: "https://cdn.pixabay.com/photo/2015/03/11/11/38/coffee-668550_960_720.jpg",
//   body: "Filter, lungo aroma con panna beans skinny macchiato percolator aromatic barista. Americano viennese frappuccino est coffee organic strong saucer con panna. Whipped fair trade coffee cappuccino crema shop flavour aroma cortado sweet. Fair trade iced aromatic carajillo aromatic cortado et, french press siphon so aftertaste spoon. Cinnamon spoon, sit in mug cappuccino organic."
// });

//Routes
// Index route
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      res.status(500).send("<div style='text-align: center; margin-top: 10%'><h2>Her ble det en feil, gitt</h2><br><a href='/'>Tilbake</a></div>");
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

//New route
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

//Create route
app.post("/blogs", (req, res) => {
  //create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//Show route
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

//Edit route
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//Update route
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Delete route
app.delete("/blogs/:id", (req, res) => {
  //Destroy
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

// 404
app.get("*", (req, res) => {
  res.render("404");
});


app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server is running");
});
