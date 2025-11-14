# 🛍️ EMI Store — Finance-Integrated Product Platform

A MERN stack application where users can browse products, explore EMI plans, and view mutual-fund–backed financing options. Each product displays multiple EMI choices, associated cashback, and investment-linked benefits.

---

## 🚀 Features

- Product Listing with images
- EMI Plan Display (3/6/12/24/36 months)
- Mutual Fund Integration inside EMI plans
- Cashback-based EMI options
- RESTful APIs
- Tailwind + Framer Motion UI animations
- Fully populated product → EMI → Mutual Fund structure

---

## 🏗️ Tech Stack

| Layer         | Technology                |
| ------------- | ------------------------- |
| Frontend      | React (Vite + TypeScript) |
| Backend       | Node.js + Express         |
| Database      | MongoDB (Mongoose)        |
| Styling       | Tailwind CSS              |
| Animations    | Framer Motion             |
| Client-Server | Axios                     |

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/nexora-commerce.git
cd nexora-commerce
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

#### Create .env

```bash
PORT=8000
MONGO_URI=mongodb+srv://<your-mongo-uri>
```

#### Run Server

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

#### Run Frontend

```bash
npm run dev
```

---

## FOLDER STRUCTURE

MERN-EMI-Store/
├── Backend/
│ ├── models/
│ │ ├── productModel.js
│ │ ├── emiModel.js
│ │ └── mutualFundModel.js
│ ├── routes/
| | ├── productRoute.js
│ │ ├── emiRoute.js
│ │ └── mutualFundRoute.js
│ ├── controllers/
| | ├── productController.js
│ │ ├── emiController.js
│ │ └── mutualFundController.js
│ └── server.js
└── Frontend/
├── src/
│ ├── pages/
| | ├── AllProducts.tsx
│ │ | ├── ProductDetails.tsx
│ └── App.tsx
└── index.css

## API ENDPOINTS

| Method | Endpoint                                 | Description                        |
| ------ | ---------------------------------------- | ---------------------------------- |
| GET    | /api/products                            | Get all products                   |
| GET    | /api/products/singleProduct/:productName | Get single product by Product Name |
| POST   | /api/products/newProduct                 | Add a new product                  |
| POST   | /api/emi/insertMultipleEmi               | Insert Multiple EMIs               |
| POST   | /api/emi/createEmi                       | Create Single EMI                  |
| POST   | /api/mutualFund/createMutualFund         | Delete a product                   |

## Example Product Response

{
"_id": "691588ef7d312eb0a3dfcdee",
"name": "iPhone 17 Pro",
"variant": "256 GB Deep Blue",
"MRP": 134900,
"price": 128999,
"features": [
"UNIBODY DESIGN. FOR EXCEPTIONAL POWER — Heat-forged aluminium unibody enclosure for the most powerful iPhone ever made.",
"DURABLE CERAMIC SHIELD. FRONT AND BACK — Ceramic Shield protects the back of iPhone 17 Pro Max, making it 4x more resistant to cracks. And the new Ceramic Shield 2 on the front has 3x better scratch resistance.",
"THE ULTIMATE PRO CAMERA SYSTEM — With all 48MP rear cameras and 8x optical-quality zoom — the longest zoom ever on an iPhone. It’s the equivalent of 8 pro lenses in your pocket.",
"18MP CENTER STAGE FRONT CAMERA — Flexible ways to frame your shot. Smarter group selfies, Dual Capture video for simultaneous front and rear recording, and more.",
"BREAKTHROUGH BATTERY LIFE — The unibody design creates massive additional battery capacity, for up to 31 hours of video playback. Charge up to 50% in 20 minutes."
],
"imageUrl": [
"https://m.media-amazon.com/images/I/618vU2qKXQL._SX679_.jpg",
"https://m.media-amazon.com/images/I/91JZmCrB9aL._SX679_.jpg",
"https://m.media-amazon.com/images/I/71FKiQAdCKL._SX679_.jpg",
"https://m.media-amazon.com/images/I/61GINuBf3JL._SX679_.jpg"
],
"emiPlans": [
{
"_id": "6915d197708c7a4799aa1e00",
"productId": "691588ef7d312eb0a3dfcdee",
"monthlyAmount": 42999.67,
"tenureMonths": 3,
"interestRate": 0,
"Cashback": "₹500 Cashback",
"mutualFund": {
"_id": "6915c183642f2cb687fe211c",
"name": "HDFC Balanced Advantage Fund",
"annualReturnRate": 12,
"riskLevel": "Moderate",
"description": "A hybrid equity-debt fund offering stable growth with controlled volatility."
}
}
]
}

# Schemas

## Product Schema

{
name: String,
variant: String,
MRP: Number,
price: Number,
features: [String],
imageUrl: [String],
emiPlans: [
{ type: mongoose.Schema.Types.ObjectId, ref: "EmiPlan" }
]
}

## EMI Schema

{
productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
monthlyAmount: Number,
tenureMonths: Number,
interestRate: Number,
Cashback: String,
mutualFund: { type: mongoose.Schema.Types.ObjectId, ref: "MutualFund" }
}

## Mutual Fund Schema

{
name: String,
annualReturnRate: Number,
riskLevel: String,
description: String
}

## 🧠 How It Works

1. Products are fetched from backend.
2. Product → EMI Plans are populated (virtual or stored refs).
3. EMI Plans → Mutual Fund are nested populated.
4. Frontend displays a smooth animated UI with Tailwind + Framer Motion.

---
