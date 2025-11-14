import { Routes, Route } from "react-router-dom";
import "./App.css";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AllProducts />} />
        <Route path="/product/:productName" element={<ProductDetails />} />
      </Routes>
    </>
  );
}

export default App;
