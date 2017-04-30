
var expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

//App configuration
//mongoose.connect("mongodb://localhost/kaffibloggen");
mongoose.connect(process.env.MONGOLAB_URI);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Passport configuration
app.use(require("express-session")({
  secret: "The secret is secret for all but one",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//Mongoose configuration
var blogSchema = new mongoose.Schema({
  title: String,
  image: {type: String, default: "https://cdn.pixabay.com/photo/2013/07/13/09/51/coffee-156158_960_720.png"},
  blogpost: String,
  created: {type: Date, default: Date.now},
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    username: String
  }
});

var Blog = mongoose.model("Blog", blogSchema);


//Init blogs
// Blog.create({
//   title: "Kaffe som dessert er bra",
//   image: "/images/coffee2.jpg",
//   blogpost: "Seasonal et, medium mocha coffee single origin chicory. Cappuccino rich, caffeine that cortado carajillo brewed. French press percolator coffee half and half eu dripper cappuccino iced french press. At body, cream variety spoon, rich bar sweet foam extraction sit instant. Crema pumpkin spice, espresso redeye iced, sweet percolator siphon sugar café au lait ristretto."
// });

// Blog.create({
//   title: "Morgen Kaffen som slår alt",
//   image: "/images/coffee3.jpg",
//   blogpost: "Trifecta, flavour, dripper, decaffeinated con panna flavour et turkish dripper. Saucer rich cream affogato flavour a, and, cortado café au lait pumpkin spice redeye viennese. Qui flavour, saucer redeye, con panna kopi-luwak, half and half sweet caramelization blue mountain sweet flavour. That wings, dripper and cream roast wings. Plunger pot whipped cinnamon black ristretto galão robusta pumpkin spice. Cultivar grinder cup decaffeinated a and aged. Con panna, a cinnamon, macchiato, carajillo, wings et espresso trifecta arabica flavour. Aroma est crema, trifecta cappuccino cortado redeye turkish roast. Carajillo, turkish flavour, cream barista, id, aftertaste ut barista body coffee sugar. Whipped eu medium half and half grounds wings cortado cappuccino and seasonal."
// });

// Blog.create({
//   title: "Jeg trenger en Cappucino",
//   image: "/images/coffee1.jpg",
//   blogpost: "Filter, lungo aroma con panna beans skinny macchiato percolator aromatic barista. Americano viennese frappuccino est coffee organic strong saucer con panna. Whipped fair trade coffee cappuccino crema shop flavour aroma cortado sweet. Fair trade iced aromatic carajillo aromatic cortado et, french press siphon so aftertaste spoon. Cinnamon spoon, sit in mug cappuccino organic."
// });

// Blog.create({
//   title: "Kaffe som dessert",
//   image: "/images/coffee2.jpg",
//   blogpost: "Seasonal et, medium mocha coffee single origin chicory. Cappuccino rich, caffeine that cortado carajillo brewed. French press percolator coffee half and half eu dripper cappuccino iced french press. At body, cream variety spoon, rich bar sweet foam extraction sit instant. Crema pumpkin spice, espresso redeye iced, sweet percolator siphon sugar café au lait ristretto."
// });

// Blog.create({
//   title: "Morgen Kaffen som slår alt",
//   image: "/images/coffee3.jpg",
//   blogpost: "Trifecta, flavour, dripper, decaffeinated con panna flavour et turkish dripper. Saucer rich cream affogato flavour a, and, cortado café au lait pumpkin spice redeye viennese. Qui flavour, saucer redeye, con panna kopi-luwak, half and half sweet caramelization blue mountain sweet flavour. That wings, dripper and cream roast wings. Plunger pot whipped cinnamon black ristretto galão robusta pumpkin spice. Cultivar grinder cup decaffeinated a and aged. Con panna, a cinnamon, macchiato, carajillo, wings et espresso trifecta arabica flavour. Aroma est crema, trifecta cappuccino cortado redeye turkish roast. Carajillo, turkish flavour, cream barista, id, aftertaste ut barista body coffee sugar. Whipped eu medium half and half grounds wings cortado cappuccino and seasonal."
// });

// Blog.create({
//   title: "Jeg trenger en Cappucino",
//   image: "/images/coffee1.jpg",
//   blogpost: "Filter, lungo aroma con panna beans skinny macchiato percolator aromatic barista. Americano viennese frappuccino est coffee organic strong saucer con panna. Whipped fair trade coffee cappuccino crema shop flavour aroma cortado sweet. Fair trade iced aromatic carajillo aromatic cortado et, french press siphon so aftertaste spoon. Cinnamon spoon, sit in mug cappuccino organic."
// });

//Routes
// Index route
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if (err) {
      res.status(500).send("<div style='text-align: center; margin-top: 10%'><h2>Her ble det en feil, gitt</h2><br><a href='/'>Tilbake</a></div>");
    } else {
      res.render("index", {blogs: allBlogs, page: "blogs"});
    }
  }).sort({created: -1});
});

//New route
app.get("/blogs/new", isLoggedIn, (req, res) => {
  res.render("new");
});

//Create route
app.post("/blogs", isLoggedIn, (req, res) => {
  //create blog
  // var blogBody = req.body.blog.body;
  // req.sanitize(blogBody);
  var title = req.body.blog.title;
  var image = req.body.blog.image;
  var blogpost = req.body.blog.blogpost;
  var author = {
    id:req.user._id,
    username: req.user.username
  };
  var newblogpost = {title: title, image: image, blogpost: blogpost, author: author};
  Blog.create(newblogpost, (err, newBlog) => {
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
app.get("/blogs/:id/edit", isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//Update route
app.put("/blogs/:id", isLoggedIn, (req, res) => {
  // var blogBody = req.body.blog.blogpost;
  // req.sanitize(blogBody);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Delete route
app.delete("/blogs/:id", isLoggedIn, (req, res) => {
  //Destroy
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

//Auth routes
//Show register form
app.get("/register", (req, res) => {
  res.render("register");
});

//Sign up logic
app.post("/register", (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/blogs");
    });
  });
});

//Login form
app.get("/login", (req, res) => {
  res.render("login");
});

//Login logic
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/blogs",
    failureRedirect: "/login"
  }), (req, res) => {
});

// Logout route
app.get("/logout",(req, res) => {
  req.logout(),
  res.redirect("/blogs");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// 404
app.get("*", (req, res) => {
  res.render("404");
});


app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server is running");
});
