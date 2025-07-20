import type React from 'react'
import { useCart, type Item } from 'react-use-cart'
import type { Attribute } from '../types'
import { gql, useMutation } from '@apollo/client'
import toast from 'react-hot-toast'

const CREATE_ORDER = gql`
	mutation CreateNewOrder($input: OrderInput!) {
		createOrder(input: $input) {
			success
			message
		}
	}
`

interface CartItem extends Item {
	productData: {
		id: string
		name: string
		gallery: string[]
		attributes: Attribute[]
	}
	selectedAttributes: { [key: string]: string }
}

const CartOverlay: React.FC = () => {
	const { isEmpty, items, cartTotal, updateItemQuantity, emptyCart } = useCart()

	const cartItems = items as CartItem[]

	const [createOrder, { loading }] = useMutation(CREATE_ORDER)

	const handlePlaceOrder = async () => {
		const formattedItems = cartItems.map((item) => ({
			product_id: item.productData.id,
			quantity: item.quantity,
			price: item.price,
			attributes: JSON.stringify(item.selectedAttributes),
		}))

		try {
			const { data } = await createOrder({
				variables: {
					input: {
						total: cartTotal,
						items: formattedItems,
					},
				},
			})

			if (data.createOrder.success) {
				emptyCart()
				toast.success('Order placed successfully!')
			} else {
				toast.error(`Order failed: ${data.createOrder.message}`)
			}
		} catch (error) {
			console.error('Error creating order:', error)
			toast.error('An error occurred while placing the order.')
		}
	}

	if (isEmpty)
		return (
			<div
				className='absolute top-20 right-5 bg-white p-5 w-100 shadow-lg z-40'
				data-testid='cart-overlay'
			>
				<h2 className='font-bold mb-4'>My Cart</h2>
				<p>Your cart is empty.</p>
			</div>
		)

	return (
		<div
			className='absolute top-20 right-5 bg-white p-5 w-auto shadow-lg z-40 max-h-[70vh] overflow-y-auto'
			data-testid='cart-overlay'
		>
			<h2 className='font-bold mb-4'>
				My Bag,{' '}
				<span className='font-light'>
					{items.length} {items.length === 1 ? 'item' : 'items'}
				</span>
			</h2>

			<div className='flex flex-col gap-8'>
				{cartItems.map((item) => (
					<div
						key={item.id}
						className='flex gap-4 not-last:border-b not-last:pb-8 border-gray-300'
					>
						<div className='flex-1'>
							<p className='text-lg'>{item.productData.name}</p>
							<p className='font-semibold'>${item.price.toFixed(2)}</p>
							<div>
								{item.productData.attributes.map((attribute) => (
									<div
										key={attribute.id}
										className='mt-4'
										data-testid={`cart-item-attribute-${attribute.name
											.replace(/\s+/g, '-')
											.toLowerCase()}`}
									>
										<span className='text-sm'>{attribute.name}:</span>
										<div className='flex gap-2 mt-2'>
											{attribute.items.map((attrItem) => (
												<div
													key={attrItem.id}
													className={`
                                                        text-center text-sm
                                                        ${
																													attribute.type ===
																													'text'
																														? 'p-2 border font-medium border-black'
																														: 'w-5 h-5'
																												}
                                                        ${
																													item
																														.selectedAttributes[
																														attribute.name
																													] === attrItem.value
																														? attribute.type ===
																														  'text'
																															? 'bg-black text-white'
																															: 'outline-2 outline-green-500 outline-offset-1'
																														: ''
																												}
                                                    `}
													style={
														attribute.type === 'swatch'
															? { backgroundColor: attrItem.value }
															: undefined
													}
													data-testid={
														item.selectedAttributes[attribute.name] ===
														attrItem.value
															? `cart-item-attribute-${attribute.name
																	.replace(/\s+/g, '-')
																	.toLowerCase()}-${attribute.name
																	.replace(/\s+/g, '-')
																	.toLowerCase()}-selected`
															: `cart-item-attribute-${attribute.name
																	.replace(/\s+/g, '-')
																	.toLowerCase()}-${attribute.name
																	.replace(/\s+/g, '-')
																	.toLowerCase()}`
													}
												>
													{attribute.type === 'text'
														? attrItem.display_value
														: ''}
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>

						<div className='flex flex-col items-center justify-between'>
							<button
								onClick={() => {
									if (item.quantity)
										updateItemQuantity(item.id, item.quantity + 1)
								}}
								className='w-8 h-8 border border-black text-2xl cursor-pointer'
								data-testid='cart-item-amount-increase'
							>
								+
							</button>
							<span
								className='text-lg font-semibold'
								data-testid='cart-item-amount'
							>
								{item.quantity}
							</span>
							<button
								onClick={() => {
									if (item.quantity)
										updateItemQuantity(item.id, item.quantity - 1)
								}}
								className='w-8 h-8 border border-black text-2xl cursor-pointer'
								data-testid='cart-item-amount-decrease'
							>
								-
							</button>
						</div>

						<img
							src={item.productData.gallery[0]}
							alt={item.name}
							className='w-48 min-h-full object-contain object-top'
						/>
					</div>
				))}
			</div>

			<div className='mt-6'>
				<div className='flex justify-between font-bold'>
					<span>Total</span>
					<span data-testid='cart-total'>${cartTotal.toFixed(2)}</span>
				</div>
				<button
					onClick={handlePlaceOrder}
					disabled={loading}
					className={`mt-4 ${
						loading ? 'opacity-50 cursor-not-allowed' : ''
					} cursor-pointer bg-green-500 text-white uppercase block w-full p-3 disabled:opacity-50 hover:brightness-95 transition-all duration-300`}
				>
					Place Order
				</button>
			</div>
		</div>
	)
}

export default CartOverlay
