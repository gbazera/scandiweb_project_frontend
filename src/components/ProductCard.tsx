import React from 'react'
import { Link } from 'react-router-dom'

interface Product{
    id: string,
    name: string,
    gallery: string[],
    prices: {
        amount: number,
        currency: {
            symbol: string
        }
    }[]
}

interface Props{
    product: Product
}

const ProductCard: React.FC<Props> = ({product}) => {

    const price = product.prices[0];

    return (
        <Link to={`/product/${product.id}`} className='p-4 rounded-xs hover:shadow-lg transition-shadow duration-200'>
            <img src={product.gallery[0]} alt={product.name} className='aspect-square w-full object-cover object-top' />
            <h3 className='text-lg mt-6'>{product.name}</h3>
            <p className='text-lg font-semibold'>{price.currency.symbol}{price.amount.toFixed(2)}</p>
        </Link>
    )
}

export default ProductCard;