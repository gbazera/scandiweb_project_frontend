import type React from 'react'
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import '../styles/description.css';

const GET_PRODUCT_DETAILS = gql`
  query GetProduct($id: String!){
		product(id: $id){
			id
			name
			description
			gallery
			prices{
				amount
				currency{
					symbol
				}
			}
		}
  }
`;

const ProductPage: React.FC = () => {

	const { productId } = useParams<{ productId: string }>();

	const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
		variables: { id: productId }
	});

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>
	if (!data?.product) return <p>No product found for this id.</p>

	return(
		<div className='flex px-36'>
			<div className='w-1/2 p-4 bg-white'>
				<img src={data.product.gallery[0]} alt={data.product.name} className='aspect-square w-full object-cover object-top' />
			</div>

			<div className='w-1/2 p-4 flex flex-col gap-8'>
				<h1 className='text-3xl'>{data.product.name}</h1>
				<div className='flex flex-col gap-2'>
					<span className='text-lg font-roboto-condensed font-semibold'>PRICE:</span>
					<p className='text-2xl font-semibold'>{data.product.prices[0].currency.symbol}{data.product.prices[0].amount.toFixed(2)}</p>
				</div>
				<button className='mt-4 px-8 py-4 bg-green-500 text-white font-semibold block w-full'>ADD TO CART</button>
				<div className="font-roboto product-description">
					{parse(data.product.description)}
				</div>
			</div>
		</div>
	)
}

export default ProductPage;