import React, {useContext} from 'react'
import OrderContext from '../../../context/orders/OrderContext';
import SummaryProduct from './SummaryProduct';

function SummaryOrder() {

  const orderContext = useContext(OrderContext);
  const { products } = orderContext;

  console.log(products)

  return (
    <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">Quantity products</label>
          { products.length > 0 ?  (
            <>
              { products.map( product => (
                  <SummaryProduct product={product} key={product.id} />
                ))
              }
            </>
          ) : (
            <p className="mt-5 text-sm">Not products</p>
          )}
    </div>
  )
}

export default SummaryOrder