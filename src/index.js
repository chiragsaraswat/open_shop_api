const express = require('express');
require('./db/mongoose');
const app = express();
const userRouter = require('./routers/user');
const businessesRouter = require('./routers/businessesRoutes');
const productRouter = require('./routers/productsRoutes');
const orderRouter = require('./routers/orderRoutes');

app.use(express.json());
app.use(userRouter);
app.use(businessesRouter);
app.use(productRouter);
app.use(orderRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started at Port ${PORT}`);
});
