import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { useQuery, gql } from '@apollo/client'
import OrderContext from '../../../context/orders/OrderContext';

const LIST_CLIENTS = gql`
  query getClientsSeller {
    getClientsSeller {
      id
      name
      surname
      business
      email
    }
  }
`;

function AddClient() {

    const [ client, setClient ] = useState([])

    const orderContext = useContext(OrderContext);
    const { addClientState } = orderContext;

    const { data, loading, error } = useQuery(LIST_CLIENTS)

    useEffect(() => {
        addClientState(client)
    },[client])


    if(loading) return 'Cargando...';

    const { getClientsSeller } = data;

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">Add client</label>
            <Select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="stock" type="number" placeholder="Select clients"
                options={getClientsSeller}
                getOptionValue={ (options) => options.id }
                getOptionLabel={ (options) => options.name }
                noOptionsMessage={() => "Not found."}
                onChange={ option => setClient(option)}
            // value={formik.values.stock} 
            // onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            />
        </div>
    )
}

export default AddClient