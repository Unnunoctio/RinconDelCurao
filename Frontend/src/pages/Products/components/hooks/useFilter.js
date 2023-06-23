import { linkItems } from '@assets/linkItems'
import { orderByItems } from '@assets/orderByItems'
import { useProductsStore, useURLQuery } from '@hooks'
import { sameStrings } from '@pages/Products/helpers'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

export const useFilter = () => {
  const [category, setCategory] = useState({})
  const { queryPaths, queryParams, updateQueryMultiParamsURL, addQueryParamURL, deleteQueryParamURL } = useURLQuery()
  const {
    currentPage, totalPages, filterLimits, filterActives, orderBy,
    handleCurrentPage, handleFilters, handleOrderBy, resetProducts
  } = useProductsStore()

  const { handleSubmit, setValue, getValues, reset, control } = useForm({
    defaultValues: {
      category: '',
      rangePrice: [0, 0],
      subCategory: [],
      brand: [],
      rangeGrade: [0.0, 0.0],
      conten: [],
      quantity: [],
      package: []
    }
  })
  const categoryWatch = useWatch({ control, name: 'category' })

  // TODO: Ejecución via Pathname
  useEffect(() => {
    reset()
    const category = linkItems.find(item => item.url === `/${queryPaths[1]}`)
    if (category) {
      setCategory(category)
      setValue('category', category?.name)
      resetProducts()
      console.log(getValues())
      handleFilters(getValues())
      console.log('Ejecución: Productos via Pathname')
    }
  }, [queryPaths])

  // TODO: Ejecución via Params
  useEffect(() => {
    if (queryParams && Object.entries(filterLimits).length > 0) {
      let changes = false

      const pageParam = parseInt(queryParams.page)
      if (!!pageParam && pageParam !== currentPage) changes = true

      const orderByParam = queryParams.orderBy
      if (!!orderByParam && orderByParam !== orderBy) changes = true

      const processParam = (param, keyForm, keyLimit) => {
        const itemParam = queryParams[param]
        if (!!itemParam && !sameStrings(filterActives[keyForm], itemParam.split(','))) {
          const itemFilter = filterLimits[keyLimit]?.filter((x) => itemParam.split(',').includes(x.value))
          if (itemFilter.length > 0) {
            setValue(keyForm, itemFilter)
            addQueryParamURL(param, itemFilter.map(obj => obj.value).join(','))
          } else {
            setValue(keyForm, [])
            deleteQueryParamURL(param)
          }
          changes = true
        }
      }

      processParam('category', 'subCategory', 'sub_category')
      processParam('brand', 'brand', 'brand')

      if (changes) {
        handleFilters(getValues())
        if (!!pageParam && pageParam !== currentPage) {
          if (pageParam <= totalPages && pageParam > 0) {
            handleCurrentPage(pageParam)
          } else {
            deleteQueryParamURL('page')
            handleCurrentPage(1) // por defecto
          }
        }
        if (!!orderByParam && orderByParam !== orderBy) {
          const orderByFilter = orderByItems.find(item => item.value === orderByParam)
          if (orderByFilter) {
            handleOrderBy(orderByFilter)
          } else {
            deleteQueryParamURL('orderBy')
            handleOrderBy(orderByItems[0]) // por defecto
          }
        }
        console.log('Ejecución: Productos via Params')
      }
    }
  }, [queryParams, filterLimits])

  // TODO: Ejecución via sin Params
  useEffect(() => {
    if (queryParams === null && categoryWatch !== '' && category.name === categoryWatch) {
      const category = categoryWatch
      reset()
      setValue('category', category)
      resetProducts()
      handleFilters(getValues())
      console.log('Ejecución: Productos via sin Params')
    }
  }, [queryParams])

  // TODO: Manejo de rangePrice y rangeGrade
  useEffect(() => {
    if (!filterActives.rangeGrade) setValue('rangeGrade', filterLimits.range_grade)
    if (!filterActives.rangePrice) setValue('rangePrice', filterLimits.range_price)
  }, [filterLimits])

  // TODO: OnSubmit
  const onSubmitFilter = async (data) => {
    handleFilters(data)
    handleCurrentPage(1)

    const deleteParams = []
    const addParams = [{ label: 'page', value: 1 }]

    const processParam = (param, key) => {
      if (data[key].length > 0) {
        addParams.push({ label: param, value: data[key].map(obj => obj.value).join(',') })
      } else {
        deleteParams.push(param)
      }
    }

    processParam('category', 'subCategory')
    processParam('brand', 'brand')

    updateQueryMultiParamsURL(addParams, deleteParams)
    console.log('Ejecución: Productos via Filter')
  }

  return {
    handleSubmit,
    control,
    onSubmitFilter
  }
}
