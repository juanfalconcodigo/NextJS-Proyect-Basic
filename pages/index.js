import React from 'react';
import Layout from '../components/layout/Layout'
import DetailsProduct from '../components/layout/DetailsProduct';
import useProducts from '../hooks/useProducts';

export default function Home() {
  const {products}=useProducts('createdAt');
  return (
    <>
    <Layout>
      <div className="listado-productos">
        <div className="contenedor">
          <ul className="bg-white">
            {products.map((product)=>(
              <DetailsProduct key={product.id} product={product}/>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
    </>
    
  )
}
