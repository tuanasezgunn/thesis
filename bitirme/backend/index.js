const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://academicresale.com:3000',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

mongoose
  .connect("mongodb+srv://tuanasezgun:tuana330079@cluster0.w95rz.mongodb.net/ecommerce")
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Connection Error:", error));


app.use("/images", express.static(path.join(__dirname, "upload/images")));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "upload/images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  class: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});
const Product = mongoose.model("Product", ProductSchema, "Product");

const BookSchema = new mongoose.Schema({
  id: { type: Number, required: true, },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  class: { type: String, required: true },
  price: { type: Number, required: true },
  username: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const Book = mongoose.model("Book", BookSchema);

const Users = mongoose.model("User", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  city: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

const ReviewSchema = new mongoose.Schema({
  productID: Number,
  username: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});




const Review = mongoose.model("Review", ReviewSchema);

const newBookSchema = new mongoose.Schema({
  id: { type: Number, unique: true  },
  name: { type: String, required: true },
  category: String,
  price: String,
  image: { type: String, required: true },
  city: String,
  class: String,
  sellerUsername: { type: String, required: true },
  ratings: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });

const NewBook = mongoose.model("NewBook", newBookSchema);
const favoriteSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  rating: String,
  price: Number,
  image: String,
  link: String,
  city: String,
  class: String,
  username: String, 
});
favoriteSchema.index({ id: 1, username: 1 }, { unique: true });
const Favorite = mongoose.model('Favorite', favoriteSchema);



const orderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
  items: [
    {
      bookId: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: String, required: true }
});

const Order = mongoose.model("Order", orderSchema);



app.get("/", (req, res) => {
  res.send("Express App is Running");
});

app.get("/upload", (req, res) => {
  const directoryPath = path.join(__dirname, "upload/images");
  const serverUrl = `http://localhost:${port}/images/`;

  fs.readdir(directoryPath, async (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Failed to list uploads." });
    }

    const fileUrls = files.map((file) => serverUrl + file);

    try {
      const products = await Product.find({});
      res.json({ success: true, products, files: fileUrls });
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
      res.status(500).json({ success: false, error: "Error fetching products." });
    }
  });
});


app.get("/allusers", async (req, res) => {
  try {
    const users = await Users.find({}, "name email"); // sadece name ve email alanlarını al
    const formattedUsers = users.map(user => ({
      username: user.name,
      email: user.email,
    }));
    res.json({ success: true, users: formattedUsers });
  } catch (error) {
    console.error("Kullanıcılar alınırken hata:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
});

// Eğer kitaplar MongoDB’de ise burayı DB'den oku
app.get('/allbooks', (req, res) => {
  // Örnek: tüm kitapları MongoDB'den çekiyorsan:
  Book.find()
    .then(books => res.json(books))
    .catch(err => res.status(500).json({ error: 'Kitaplar alınamadı' }));
});


app.post("/addproduct", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ id: 1 });
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      price: req.body.price,
      class: req.body.class,
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/allproducts", async (req, res) => {
  try {
    const books = req.body;

    if (!books || books.length === 0) {
      return res.status(400).json({ success: false, message: "No books provided." });
    }

    const existingProducts = await Product.find({}).sort({ id: 1 });
    let id = existingProducts.length > 0 ? existingProducts[existingProducts.length - 1].id + 1 : 1;

    for (const book of books) {
      const product = new Product({
        id: book.id || id++,
        name: book.name,
        image: book.image,
        category: book.category,
        class: book.class,
        price: book.price,
        available: book.available !== undefined ? book.available : true,
        date: book.date || new Date(),
      });
      await product.save();
    }

    return res.status(200).json({ success: true, message: "Books successfully saved to Product model." });
  } catch (error) {
    console.error("Error saving books:", error);
    res.status(500).json({ success: false, message: "Server error while saving books." });
  }
});


app.post("/allbooks", async (req, res) => {
  try {
    let books = req.body;

    if (!Array.isArray(books)) {
      if (books && typeof books === "object") {
        books = [books];
      } else {
        return res.status(400).json({ success: false, message: "No books provided." });
      }
    }

    if (books.length === 0) {
      return res.status(400).json({ success: false, message: "No books provided." });
    }

    let addedCount = 0;

    for (const book of books) {

      const existing = await Book.findOne({ id: book.id });
      if (existing) {
        console.log(`Book with id ${book.id} already exists. Skipping...`);
        continue; 
      }

      const newBook = new Book({
        id: book.id,
        name: book.name,
        image: book.image,
        category: book.category,
        class: book.class,
        price: book.price && !isNaN(book.price) && book.price !== "" ? Number(book.price) : 0,
        username: book.username || "unknown",
        date: book.date || new Date(),
      });

      await newBook.save();
      addedCount++;
    }

    res.status(200).json({
      success: true,
      message: `${addedCount} new book(s) added.`,
    });
  } catch (error) {
    console.error("Error saving books:", error);
    res.status(500).json({ success: false, message: "Server error while saving books." });
  }
});




app.post('/orders', async (req, res) => {
  try {
    const { id, username, items, totalAmount, status, date } = req.body;


    const existingOrder = await Order.findOne({ id });
    if (existingOrder) {
      return res.status(400).json({ message: 'Order with this id already exists' });
    }

    const newOrder = new Order({
      id,
      username,
      items,
      totalAmount,
      status,
      date,
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order saved successfully', order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.patch('/orders/cancel/:orderId', async (req, res) => {
 const orderId = req.params.orderId;


  try {
  
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = "cancellations";
    await order.save();

    res.status(200).json({ message: 'Order cancelled', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post("/signup", async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "User with this email already exists." });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      city: req.body.city,
      password: req.body.password,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ id: user.id }, "secret_ecom");
    res.json({
      success: true,
      token,
      user: { username: user.name, email: user.email, city: user.city }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.post("/newbooks", async (req, res) => {
  try {
    const {
      id,
      name,
      category,
      price,
      image,
      city,
      class: bookClass,
      sellerUsername,
      ratings
    } = req.body;

    if (!id || !name || !image || !sellerUsername) {
      return res.status(400).json({ success: false, message: "Eksik alanlar var." });
    }

    const existingBook = await NewBook.findOne({ id, sellerUsername });
    if (existingBook) {
      return res.status(200).json({ success: false, message: "Bu kitap zaten eklenmiş." });
    }

    const newBook = new NewBook({
      id,
      name,
      category,
      price,
      image,
      city,
      class: bookClass,
      sellerUsername,
      ratings: ratings || [],
    });

    await newBook.save();
    res.status(201).json({ success: true, message: "Kitap başarıyla kaydedildi." });

  } catch (error) {
    console.error("Kitap kaydedilirken hata:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
});
app.post("/login", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      const passCompare = req.body.password === user.password;
      if (passCompare) {
        const token = jwt.sign({ id: user.id }, "secret_ecom");
        res.json({
          success: true,
          token,
          user: { username: user.name, email: user.email, city: user.city }
        });
      } else {
        res.json({ success: false, errors: "Wrong Password" });
      }
    } else {
      res.json({ success: false, errors: "Invalid email" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/favorites", async (req, res) => {
  try {
    const { id, name, category, rating, price, image, link, city, class: bookClass, username } = req.body;

    if (!id || !username || !name || !image) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Aynı favori zaten var mı kontrol et
    const existingFavorite = await Favorite.findOne({ id, username });
    if (existingFavorite) {
      return res.status(200).json({ success: false, message: "Already in favorites." });
    }

    const favorite = new Favorite({
      id,
      name,
      category,
      rating,
      price,
      image,
      link,
      city,
      class: bookClass,
      username,
    });

    await favorite.save();
    res.status(201).json({ success: true, message: "Favorite saved successfully." });
  } catch (error) {
    console.error("Error saving favorite:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});
app.get("/favorites", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ success: false, message: "Username required" });
  }

  try {
    const favorites = await Favorite.find({ username });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post("/removefavorite", async (req, res) => {
  try {
    const { username, productId } = req.body;
    if (!username || !productId) {
      return res.status(400).json({ success: false, message: "Username and productId required." });
    }

    const favorite = await Favorite.findOne({ username, id: productId });
    if (!favorite) {
      return res.status(400).json({ success: false, message: "Favorite not found" });
    }

    await Favorite.deleteOne({ username, id: productId });
    res.json({ success: true, message: "Product removed from favorites." });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});


app.post("/reviews", async (req, res) => {
  try {
    const { productID, username, text, createdAt } = req.body;

    if (!productID || !text) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const review = new Review({
      productID,
      username: username || 'Anonymous',
      text,
      createdAt: createdAt || new Date()
    });

    await review.save();
    res.status(201).json({ success: true, message: "Review saved successfully." });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});


app.get("/reviews/:productID", async (req, res) => {
  try {
    const productID = req.params.productID;
    const reviews = await Review.find({ productID: Number(productID) }).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});



app.get("/reviews/:productID", async (req, res) => {
  try {
    const { productID } = req.params;
    const reviews = await Review.findOne({ productID });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }
  const imageUrl = `/images/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

app.listen(port, '0.0.0.0',() => {
  console.log(`Server started on port ${port}`);
});
