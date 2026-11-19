
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProductItem = ({ id, image, name, price }) => {

  const { currency } = useContext(ShopContext)

  return (
    <Link
      onClick={() => window.scrollTo(0, 0)}
      className="text-gray-700 cursor-pointer flex flex-col h-full"
      to={`/product/${id}`}
    >

      {/* Zone image de hauteur uniforme */}
      <div className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden bg-gray-50">

        <img
          src={image[0]}
          alt={name}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
        />

      </div>

      {/* Nom et prix alignés */}
      <div className="pt-3">

        <p className="pb-1 text-sm">
          {name}
        </p>

        <p className="text-sm font-medium">
          {currency}{price}
        </p>

      </div>

    </Link>
  )
}

export default ProductItem
