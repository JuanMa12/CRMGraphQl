import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { useQuery, gql } from '@apollo/client'
import OrderContext from '../../../context/orders/OrderContext';

const LIST_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      stock
      price
    }
  }
`;

function AddProducts() {

    const [ products, setProducts ] = useState([])

    const orderContext = useContext(OrderContext);
    const { addProductsState } = orderContext;

    const { data, loading, error } = useQuery(LIST_PRODUCTS)

    useEffect(() => {
      addProductsState(products)
    },[products])


    if(loading) return 'Cargando...';

    const { getProducts } = data;

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">Add products</label>
            <Select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="stock" type="number" placeholder="Select products"
                isMulti={true}
                options={getProducts}
                getOptionValue={ (options) => options.id }
                getOptionLabel={ (options) => `${options.name} - (${options.stock})`}
                noOptionsMessage={() => "Not found."}
                onChange={ option => setProducts(option)}
            // value={formik.values.stock} 
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            />
        </div>
    )
}

export default AddProducts