import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from 'react-use-cart'
import type { Product } from '../types'

interface Props {
	product: Product
}

const ProductCard: React.FC<Props> = ({ product }) => {
	const { addItem } = useCart()
	const price = product.prices[0]

	const handleQuickShop = (event: React.MouseEvent) => {
		event.preventDefault()

		const defaultAttributes: { [key: string]: string } = {}
		product.attributes.forEach((attribute) => {
			if (attribute.items.length > 0) {
				defaultAttributes[attribute.name] = attribute.items[0].value
			}
		})

		const uniqueId = product.id + JSON.stringify(Object.entries(defaultAttributes).sort())
		const itemToAdd = {
			id: uniqueId,
			price: price.amount,
			productData: product,
			selectedAttributes: defaultAttributes,
		}

		addItem(itemToAdd as any)
	}

	return (
		<Link
			to={`/product/${product.id}`}
			className="p-4 rounded-xs hover:shadow-lg transition-shadow duration-200 relative group"
			data-testid={`product-${product.name.replace(/\s+/g, '-').toLowerCase()}`}
		>
			<div className="relative">
				{!product.in_stock && (
					// text in the center of the image
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-xl font-medium uppercase">
						Out of stock
					</div>
				)}
				<img
					src={product.gallery[0]}
					alt={product.name}
					className={`aspect-square w-full object-cover object-top ${
						!product.in_stock ? 'opacity-25' : ''
					}`}
				/>
			</div>
			<h3 className={`text-lg mt-6 ${!product.in_stock ? 'text-gray-400' : ''}`}>
				{product.name}
			</h3>
			<p className={`text-lg font-semibold ${!product.in_stock ? 'text-gray-400' : ''}`}>
				{price.currency.symbol}
				{price.amount.toFixed(2)}
			</p>
			{product.in_stock && (
				<button
					onClick={handleQuickShop}
					className="absolute right-8 bottom-20 p-2 bg-green-400 text-white rounded-full w-[52px] h-[52px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.39 2.78A.66.66 0 004.22 17H18.8a.66.66 0 00.61-.22L21 13M9 21a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"
							stroke="#fff"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			)}
		</Link>
	)
}

export default ProductCard
