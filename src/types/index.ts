export interface AttributeItem {
	id: string
	value: string
	display_value: string
}

export interface Attribute {
	id: string
	name: string
	type: string
	items: AttributeItem[]
}

export interface Product {
	id: string
	name: string
	description: string
	gallery: string[]
	in_stock: boolean
	prices: {
		amount: number
		currency: {
			symbol: string
		}
	}[]
	attributes: Attribute[]
}
