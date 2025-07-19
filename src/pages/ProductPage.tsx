import type React from 'react'
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import '../styles/description.css';
import { useState } from 'react';
import { useCart } from 'react-use-cart';
import type { Product } from '../types';

const GET_PRODUCT_DETAILS = gql`
  query GetProduct($id: String!){
		product(id: $id){
			id
			name
			description
			gallery
			in_stock
			attributes{
				id
				name
				type
				items{
					id
					value
					display_value
				}
			}
			prices{
				amount
				currency{
					symbol
				}
			}
		}
  }
`;

interface ProductData{
	product: Product;
}

interface ProductVars{
	id: string;
}

const ProductPage: React.FC = () => {

	const { addItem } = useCart();

	const { productId } = useParams<{ productId: string }>();
	const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});

	if(!productId) return <p>Product ID is missing.</p>;

	const { loading, error, data } = useQuery<ProductData, ProductVars>(GET_PRODUCT_DETAILS, {
		variables: { id: productId }
	});

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>
	if (!data?.product) return <p>No product found for this id.</p>

	const handleAttributeChange = (attributeName: string, itemValue: string) => {

		setSelectedAttributes(prev => ({
			...prev,
			[attributeName]: itemValue
		}))
	};

	const handleAddToCart = () =>{
		const product = data!.product;
		const uniqueItemId = product.id + JSON.stringify(Object.entries(selectedAttributes).sort());

		const itemToAdd = {
			id: uniqueItemId,
			price: product.prices[0].amount,
			productData: product,
			selectedAttributes: selectedAttributes,
		}

		addItem(itemToAdd as any);
		alert(`${product.name} has been added to cart!`);
		setSelectedAttributes({});
	}

	const isAddToCartDisabled = data.product.attributes.length !== Object.keys(selectedAttributes).length;

	return(
		<div className='flex px-36'>
			<div className='w-1/2 p-4 bg-white'>
				<img src={data.product.gallery[0]} alt={data.product.name} className='aspect-square w-full object-cover object-top' />
			</div>

			<div className='w-1/2 p-4 flex flex-col gap-8'>
				<h1 className='text-3xl'>{data.product.name}</h1>

				{!data.product.in_stock && (
					<div className="font-roboto text-sm uppercase text-red-500 -mt-6">
						Out of stock
					</div>
				)}

				{data.product.attributes.map((attribute) => (
					<div key={attribute.id} className='flex flex-col gap-2'>
						<span className='text-lg font-roboto-condensed font-semibold'>{attribute.name.toUpperCase()}:</span>
						<div className="flex gap-2">
							{attribute.items.map((item) => (
								<button
								key={item.id}
								onClick={() => handleAttributeChange(attribute.name, item.value)}
								// Conditionally set the styles for 'text' vs 'swatch'
								className={`
									text-center cursor-pointer
									${attribute.type === 'text'
									? 'px-4 h-12 border font-medium border-black' // Classes for text type
									: 'w-8 h-8' // Classes for swatch type
									}
									${selectedAttributes[attribute.name] === item.value
									? (attribute.type === 'text' 
										? 'bg-black text-white' // Selected style for text
										: 'outline-2 outline-green-500 outline-offset-1') // Selected style for swatch
									: ''
									}
								`}
								// Conditionally apply the background color for swatches
								style={attribute.type === 'swatch' ? { backgroundColor: item.value } : {}}
								>
								{/* Conditionally render the text content */}
								{attribute.type === 'text' ? item.display_value : ''}
								</button>
							))}
						</div>
					</div>
				))}

				<div className='flex flex-col gap-2'>
					<span className='text-lg font-roboto-condensed font-semibold'>PRICE:</span>
					<p className='text-2xl font-semibold'>{data.product.prices[0].currency.symbol}{data.product.prices[0].amount.toFixed(2)}</p>
				</div>
				<button
					onClick={handleAddToCart}
					disabled={isAddToCartDisabled || !data.product.in_stock}
					className={`mt-4 px-8 py-4 ${!data.product.in_stock ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} font-semibold block w-full not-disabled:cursor-pointer disabled:opacity-50 hover:brightness-95`}
				>
					{data.product.in_stock ? 'ADD TO CART' : 'OUT OF STOCK'}
				</button>
				<div className="font-roboto product-description">
					{parse(data.product.description)}
				</div>
			</div>
		</div>
	)
}

export default ProductPage;