import React from 'react';
import { useShopContext } from '../Context/ShopContextProvider';

export default function Product({ product }) {
    const { cartItems, addToCart, removeFromCart } = useShopContext();

    const productAmount = cartItems[product.id] || 0;

    return (
        <div className="product">
            <img src={product.img} alt={product.name} />
            <div className="product-info">
                <p>{product.name}</p>
                <p>₺{product.price}</p>
            </div>
            <div className="product-controls">
                <button onClick={() => addToCart(product.id)}>+</button>
                <span>{productAmount}</span>
                <button onClick={() => removeFromCart(product.id)} disabled={productAmount === 0}>-</button>
            </div>
        </div>
    );
}
