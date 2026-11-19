
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {

  const { productId } = useParams()

  const {
    products,
    currency,
    addToCart
  } = useContext(ShopContext)

  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  // ================= LOAD PRODUCT =================

  useEffect(() => {

    const selectedProduct = products.find(
      item => item._id === productId
    )

    if (selectedProduct) {

      setProductData(selectedProduct)

      setImage(
        selectedProduct.image?.[0] || ''
      )

      // Les sacs possèdent une taille unique
      if (selectedProduct.subCategory === 'Bags') {
        setSize('One Size')
      } else {
        setSize('')
      }

    } else {

      setProductData(null)
      setImage('')
      setSize('')

    }

  }, [productId, products])

  // ================= ADD TO CART =================

  const handleAddToCart = () => {

    if (!productData) return

    const selectedSize =
      productData.subCategory === 'Bags'
        ? 'One Size'
        : size

    addToCart(productData._id, selectedSize)

  }

  // ================= LOADING =================

  if (!productData) {

    return (
      <div className='border-t-2 pt-10 text-center text-gray-500'>
        Loading product...
      </div>
    )

  }

  return (

    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>

      {/* ================= PRODUCT DATA ================= */}

      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* ================= PRODUCT IMAGES ================= */}

        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>

          <div className='scroller flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>

            {productData.image.map((item, index) => (

              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                alt={`${productData.name} ${index + 1}`}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
              />

            ))}

          </div>

          <div className='w-full sm:w-[80%]'>

            <img
              src={image}
              className='w-full h-auto'
              alt={productData.name}
            />

          </div>

        </div>

        {/* ================= PRODUCT INFORMATION ================= */}

        <div className='flex-1'>

          <h1 className='font-medium text-2xl mt-2'>
            {productData.name}
          </h1>

          {/* ================= RATING ================= */}

          <div className='flex items-center gap-1 mt-2'>

            {[1, 2, 3, 4].map(star => (

              <img
                key={star}
                src={assets.star_icon}
                alt=""
                className='w-3.5'
              />

            ))}

            <img
              src={assets.star_dull_icon}
              alt=""
              className='w-3.5'
            />

            <p className='pl-2'>
              (122)
            </p>

          </div>

          {/* ================= PRICE ================= */}

          <p className='mt-5 text-3xl font-medium'>
            {currency}{productData.price}
          </p>

          {/* ================= DESCRIPTION ================= */}

          <p className='mt-5 text-gray-500 md:w-4/5'>
            {productData.description}
          </p>

          {/* ================= PRODUCT SIZES ================= */}

          <div className='flex flex-col gap-4 my-8'>

            {productData.subCategory === 'Bags' ? (

              // ================= BAGS =================

              <div>

                <p className='mb-3 font-medium'>
                  Size
                </p>

                <div className='flex gap-2'>

                  <span className='border border-orange-500 bg-gray-100 py-2 px-4'>
                    One Size
                  </span>

                </div>

              </div>

            ) : (

              // ================= CLOTHING & SHOES =================

              <div>

                <p className='mb-3 font-medium'>

                  {productData.subCategory === 'Shoes'
                    ? 'Select Shoe Size'
                    : 'Select Size'}

                </p>

                <div className='flex flex-wrap gap-2'>

                  {productData.sizes.map((item, index) => (

                    <button
                      key={index}
                      type="button"
                      onClick={() => setSize(item)}
                      className={`border py-2 px-4 bg-gray-100 cursor-pointer transition-colors ${size === item
                          ? 'border-orange-500'
                          : 'border-gray-200'
                        }`}
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>

            )}

          </div>

          {/* ================= ADD TO CART BUTTON ================= */}

          <button
            onClick={handleAddToCart}
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />

          {/* ================= PRODUCT BENEFITS ================= */}

          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>

            <p>
              100% original product.
            </p>

            <p>
              Cash on delivery is available for this product.
            </p>

            <p>
              Easy return and exchange policy within 7 days.
            </p>

          </div>

        </div>

      </div>

      {/* ================= DESCRIPTION & REVIEWS ================= */}

      <div className='mt-20'>

        <div className='flex'>

          <b className='border px-5 py-3 text-sm'>
            Description
          </b>

          <p className='border px-5 py-3 text-sm'>
            Reviews (122)
          </p>

        </div>

        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>

          <p>
            An e-commerce website is a website that sells
            products and services online. It is a platform
            that allows customers to buy and sell goods and
            services over the internet. An e-commerce website
            is a website that sells products and services
            online. It is a platform that allows customers
            to buy and sell goods and services over the internet.
          </p>

          <p>
            E-commerce websites typically provide a user
            interface for customers to browse and purchase
            products and services. They may also allow
            customers to create an account, make payments,
            and track their orders. E-commerce websites may
            also provide customer support, product reviews,
            and other features to enhance the shopping experience.
          </p>

        </div>

      </div>

      {/* ================= RELATED PRODUCTS ================= */}

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

    </div>

  )

}

export default Product
