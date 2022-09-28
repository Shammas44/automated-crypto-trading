import { OrderWrapper, Order } from "../types/order";
/**
 * @description return the order if it exists
 * @param {number} id
 * @return {OrderWrapper | null}
 */
export default function get_order_by_id(
	orders: Order[],
	id: number
): OrderWrapper | null {
	let position = 0;
	let orderWrapper = null;
	for (const order of orders) {
		if (order.id === id) {
			orderWrapper = { order, position } as OrderWrapper;
			return orderWrapper;
		}
		position++;
	}
	return orderWrapper;
}
