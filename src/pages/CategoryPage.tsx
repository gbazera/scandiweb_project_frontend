import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ProductCard from '../components/ProductCard';
import { useOutletContext } from 'react-router-dom';

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

interface CategoryData{
	category:{
		name: string,
		products: Product[]
	}
}

interface CategoryVariables{
	name: string
}

const GET_CATEGORY_PRODUCTS = gql`
  query GetCategory($name: String!){
    category(input: {name: $name}){
			name
			products{
				id
				name
				gallery
				prices{
					amount
					currency{
						symbol
					}
				}
			}
    }
  }
`;

interface OutletContext{
	selectedCategory: string
}

const CategoryPage: React.FC = () => {

	const { selectedCategory } = useOutletContext<OutletContext>();

	const { loading, error, data } = useQuery<CategoryData, CategoryVariables>(GET_CATEGORY_PRODUCTS, {
		variables: { name: selectedCategory }
	});

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error.message}</p>
	if (!data?.category) return <p>No products found for this category.</p> 

	return(
		<div className='px-36'>
			<h1 className='text-4xl mb-20'>{data?.category.name.charAt(0).toUpperCase() + data?.category.name.slice(1)}</h1>

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-20'>
				{data?.category.products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	)
}

export default CategoryPage;