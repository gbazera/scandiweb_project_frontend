import type React from "react";
import { useCart, type Item } from "react-use-cart";
import type { Attribute } from "../types";

interface CartItem extends Item{
    productData: {
        name: string;
        gallery: string[];
        attributes: Attribute[];
    };
    selectedAttributes: {[key: string]: string};
}

const CartOverlay: React.FC = () => {

    const{
        isEmpty,
        items,
        cartTotal,
        updateItemQuantity,
        removeItem
    } = useCart();

    const cartItems = items as CartItem[];

    if(isEmpty) return (
        <div className="absolute top-20 right-5 bg-white p-5 w-100 shadow-lg z-40">
            <h2 className="font-bold mb-4">My Cart</h2>
            <p>Your cart is empty.</p>
        </div>
    )

    return(
        <div className="absolute top-20 right-5 bg-white p-5 w-auto shadow-lg z-40 max-h-[70vh] overflow-y-auto">
            <h2 className="font-bold mb-4">
                My Bag, <span className="font-light">{items.length} items</span>
            </h2>

            <div className="flex flex-col gap-8">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 not-last:border-b not-last:pb-8 border-gray-300">
                        <div className="flex-1">
                            <p className="text-lg">{item.productData.name}</p>
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                            <div>
                                {item.productData.attributes.map((attribute) => (
                                    <div key={attribute.id} className="mt-4">
                                        <span className="text-sm">{attribute.name}:</span>
                                        <div className="flex gap-2 mt-2">
                                            {attribute.items.map((attrItem) => (
                                                <div
                                                key={attrItem.id}
                                                // Conditionally set the styles for 'text' vs 'swatch'
                                                className={`
                                                    text-center cursor-pointer text-sm
                                                    ${attribute.type === 'text'
                                                    ? 'p-2 border font-medium border-black' // Classes for text type
                                                    : 'w-5 h-5' // Classes for swatch type
                                                    }
                                                    ${item.selectedAttributes[attribute.name] === attrItem.value
                                                    ? (attribute.type === 'text' 
                                                        ? 'bg-black text-white' // Selected style for text
                                                        : 'outline-2 outline-green-500 outline-offset-1') // Selected style for swatch
                                                    : ''
                                                    }
                                                `}
                                                // Conditionally apply the background color for swatches
                                                style={attribute.type === 'swatch' ? { backgroundColor: attrItem.value } : {}}
                                                >
                                                {/* Conditionally render the text content */}
                                                {attribute.type === 'text' ? attrItem.display_value : ''}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-between">
                            <button
                                onClick={() => { if(item.quantity) updateItemQuantity(item.id, item.quantity + 1) }}
                                className="w-8 h-8 border border-black text-2xl cursor-pointer"
                            >
                                +
                            </button>
                            <span className="text-lg font-semibold">{item.quantity}</span>
                            <button
                                onClick={() => { if(item.quantity) updateItemQuantity(item.id, item.quantity - 1) }}
                                className="w-8 h-8 border border-black text-2xl cursor-pointer"
                            >
                                -
                            </button>
                        </div>

                        <img src={item.productData.gallery[0]} alt={item.name} className="w-48 min-h-full object-contain object-top" />
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button className="flex-1 p-3 mt-4 bg-green-500 text-white uppercase block w-full">Place Order</button>
            </div>
        </div>
    )
}

export default CartOverlay;