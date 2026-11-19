import React, { useContext, useState, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relavent')

  // Liste des catégories
  const categories = ['Men', 'Women', 'Kids']

  // Liste des sous-catégories
  const subCategories = ['Topwear','Bottomwear','Winterwear','Bags','Shoes']

  // Sélection des catégories
  const toogleCategory = (e) => {
    const value = e.target.value
    setCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  // Sélection des sous-catégories
  const toogleSubCategory = (e) => {
    const value = e.target.value

    setSubCategory(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  // Filtrage et tri des produits
  const filterProducts = useMemo(() => {

    let productsCopy = [...products]

    // Filtrage par recherche
    if (search && showSearch) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(
          search.toLowerCase()
        )
      )
    }

    // Filtrage par catégorie
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        category.includes(item.category)
      )
    }

    // Filtrage par sous-catégorie
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item =>
        subCategory.includes(item.subCategory)
      )
    }

    // Tri des produits
    switch (sortType) {

      case 'low-high':
        productsCopy.sort(
          (a, b) => Number(a.price) - Number(b.price)
        )
        break

      case 'high-low':
        productsCopy.sort(
          (a, b) => Number(b.price) - Number(a.price)
        )
        break

      default:
        break
    }

    return productsCopy

  }, [
    products,
    search,
    showSearch,
    category,
    subCategory,
    sortType
  ])

  // Réinitialisation des filtres
  const clearFilters = () => {
    setCategory([])
    setSubCategory([])
    setSortType('relavent')
  }

  return (

    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* ================= FILTERS ================= */}

      <div className='min-w-60'>

        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS

          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''
              }`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* ================= CATEGORIES ================= */}

        <div
          className={`border border-gray-200 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'
            } sm:block`}
        >

          <p className='mb-3 text-sm font-medium'>
            CATEGORIES
          </p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

            {categories.map(item => (

              <label
                key={item}
                className='flex gap-2 items-center cursor-pointer'
              >

                <input
                  type="checkbox"
                  className='w-3'
                  value={item}
                  checked={category.includes(item)}
                  onChange={toogleCategory}
                />

                {item}

              </label>

            ))}

          </div>

        </div>

        {/* ================= PRODUCT TYPE ================= */}

        <div
          className={`border border-gray-200 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'
            } sm:block`}
        >

          <p className='mb-3 text-sm font-medium'>
            TYPE
          </p>

          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

            {subCategories.map(item => (

              <label
                key={item}
                className='flex gap-2 items-center cursor-pointer'
              >

                <input
                  type="checkbox"
                  className='w-3'
                  value={item}
                  checked={subCategory.includes(item)}
                  onChange={toogleSubCategory}
                />

                {item}

              </label>

            ))}

          </div>

        </div>

        {/* ================= CLEAR FILTERS ================= */}

        {(category.length > 0 || subCategory.length > 0) && (

          <button
            type="button"
            onClick={clearFilters}
            className='text-sm border border-gray-300 px-4 py-2 hover:bg-gray-100'
          >
            Clear Filters
          </button>

        )}

      </div>

      {/* ================= PRODUCT COLLECTION ================= */}

      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4 gap-3'>

          <Title
            text1={'ALL'}
            text2={'COLLECTIONS'}
          />

          {/* ================= SORT PRODUCTS ================= */}

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className='border-2 border-gray-300 px-2 text-sm'
          >

            <option value="relavent">
              Sort by: Relevant
            </option>

            <option value="low-high">
              Sort by: Low to High
            </option>

            <option value="high-low">
              Sort by: High to Low
            </option>

          </select>

        </div>

        {/* ================= PRODUCT COUNT ================= */}

        <p className='text-sm text-gray-500 mb-5'>
          {filterProducts.length} products found
        </p>

        {/* ================= PRODUCT GRID ================= */}

        {filterProducts.length > 0 ? (

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>

            {filterProducts.map(item => (

              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />

            ))}

          </div>

        ) : (

          <div className='text-center py-20'>

            <p className='text-gray-500 text-lg'>
              No products found
            </p>

            <p className='text-gray-400 text-sm mt-2'>
              Try changing your filters.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}

export default Collection
