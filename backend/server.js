const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");  // Importa cors
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
const app = express();

const allowedOrigins = ['https://pruebafrontdeploy--guacari.netlify.app'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

/* Routes import */
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const clientRoutes = require("./routes/client");
const tableRoutes = require("./routes/table");
const orderRoutes = require("./routes/order");
const uploadRoutes = require("./routes/upload");
const ingredientRoutes = require("./routes/ingredient");
const ingredientMovementRoutes = require('./routes/ingredientmovements');

const roomRoutes = require("./routes/room");
const reservationRoutes = require("./routes/reservation");
const agreementRoutes = require("./routes/agreement");
const roleRoutes = require("./routes/role");
const serviceRoutes = require('./routes/service');
const paymentRoutes = require('./routes/payment');
const invoiceRoutes = require('./routes/invoice');
const laundryRoutes = require('./routes/laundry');
const orderInvoiceRoutes = require('./routes/orderinvoice');
const paidOrderInvoiceRoutes = require('./routes/paidorder');
const tableAuditRoutes = require('./routes/tableaudit');


/* Routes */
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use('/api/ingredientmovements', ingredientMovementRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/agreements", agreementRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/laundries", laundryRoutes);
app.use("/api/orderinvoices", orderInvoiceRoutes);
app.use("/api/paidorders", paidOrderInvoiceRoutes);
app.use("/api/tableaudits", tableAuditRoutes);

const rootPath = path.resolve();

/* File folder */
app.use("/uploads", express.static(path.join(rootPath, "/uploads")));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(rootPath, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(rootPath, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        console.log("Root route accessed");
        res.send("API is running...");
    });
}

/* Error Handlers */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
