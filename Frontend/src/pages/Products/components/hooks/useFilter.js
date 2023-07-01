import { linkItems } from '@assets/linkItems'
import { orderByItems } from '@assets/orderByItems'
import { useProductsStore, useURLQuery } from '@hooks'
import { VALUE_FLOAT, VALUE_INT } from '@pages/Products/assets'
import { sameStrings, verifyRanges } from '@pages/Products/helpers'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

export const useFilter = () => {
  const { pathname, params, addParam, deleteParam, updateMultiParams } = useURLQuery()
  const {
    currentPage, totalPages, filterLimits, filterActives, orderBy,
    handleCurrentPage, handleFilters, handleOrderBy, resetProducts
  } = useProductsStore()

  const { handleSubmit, setValue, getValues, reset, control } = useForm({
    defaultValues: {
      category: '',
      rangePrice: [-1, -1],
      subCategory: [],
      brand: [],
      rangeGrade: [-1, -1],
      content: [],
      quantity: [],
      package: []
    }
  })
  const categoryWatch = useWatch({ control, name: 'category' })

  // TODO: Ejecución via Pathname
  useEffect(() => {
    reset()
    const category = linkItems.find(item => item.url === `/${pathname[1]}`)
    if (category) {
      setValue('category', category?.name)
      resetProducts()
      handleFilters(getValues())
      console.log('Ejecución: Productos via Pathname')
    }
  }, [pathname])

  // TODO: Ejecución via Params
  useEffect(() => {
    if (params && Object.entries(filterLimits).length > 0) {
      let changes = false

      const pageParam = parseInt(params.page)
      if (!!pageParam && pageParam !== currentPage) changes = true

      const orderByParam = params.orderBy
      if (!!orderByParam && orderByParam !== orderBy) changes = true

      const processParam = (param, keyForm, keyLimit) => {
        const itemParam = params[param]
        if (!!itemParam && !sameStrings(filterActives[keyForm], itemParam.split(','))) {
          const itemFilter = filterLimits[keyLimit]?.filter((x) => itemParam.split(',').includes(`${x.value}`))
          if (itemFilter.length > 0) {
            setValue(keyForm, itemFilter)
            addParam(param, itemFilter.map(obj => obj.value).join(','))
          } else {
            setValue(keyForm, [])
            deleteParam(param)
          }
          changes = true
        }
      }

      const processRangeParam = (param, keyForm, keyLimit, valueType = VALUE_INT) => {
        const itemParam = params[param]
        if (itemParam) {
          let rangeParam = [0, 0]
          if (valueType === VALUE_INT) rangeParam = itemParam.split('to').map(x => parseInt(x))
          if (valueType === VALUE_FLOAT) rangeParam = itemParam.split('to').map(x => parseFloat(x))

          if (!sameStrings(filterActives[keyForm], itemParam.split('to')) || verifyRanges(rangeParam, filterLimits[keyLimit])) {
            if (rangeParam[0] < filterLimits[keyLimit][0]) rangeParam[0] = filterLimits[keyLimit][0]
            if (rangeParam[1] > filterLimits[keyLimit][1]) rangeParam[1] = filterLimits[keyLimit][1]

            setValue(keyForm, rangeParam)
            if (rangeParam[0] === filterLimits[keyLimit][0] && rangeParam[1] === filterLimits[keyLimit][1]) {
              deleteParam(param)
            } else {
              addParam(param, `${rangeParam[0]}to${rangeParam[1]}`)
            }
            changes = true
          } else if (sameStrings(filterActives[keyForm], itemParam.split('to'))) {
            setValue(keyForm, filterActives[keyForm])
          }
        }
      }

      processRangeParam('rangePrice', 'rangePrice', 'range_price')
      processRangeParam('rangeGrade', 'rangeGrade', 'range_grade', VALUE_FLOAT)
      processParam('category', 'subCategory', 'sub_category')
      processParam('brand', 'brand', 'brand')
      processParam('content', 'content', 'content')
      processParam('quantity', 'quantity', 'quantity')
      processParam('package', 'package', 'package')

      if (changes) {
        handleFilters(getValues())
        if (!!pageParam && pageParam !== currentPage) {
          if (pageParam <= totalPages && pageParam > 0) {
            handleCurrentPage(pageParam)
          } else {
            deleteParam('page')
            handleCurrentPage(1) // por defecto
          }
        }
        if (!!orderByParam && orderByParam !== orderBy) {
          const orderByFilter = orderByItems.find(item => item.value === orderByParam)
          if (orderByFilter) {
            handleOrderBy(orderByFilter)
          } else {
            deleteParam('orderBy')
            handleOrderBy(orderByItems[0]) // por defecto
          }
        }
        console.log('Ejecución: Productos via Params')
      }
    }
  }, [filterLimits])

  // TODO: Ejecución via sin Params
  useEffect(() => {
    const category = linkItems.find(item => item.url === `/${pathname[1]}`)
    if (params === null && categoryWatch !== '' && category.name === categoryWatch) {
      const category = categoryWatch
      reset()
      setValue('category', category)
      resetProducts()
      handleFilters(getValues())
      console.log('Ejecución: Productos via sin Params')
    }
  }, [params])

  // TODO: Manejo de rangePrice y rangeGrade
  useEffect(() => {
    if (Object.entries(filterLimits).length > 0) {
      if (!filterActives?.rangeGrade && !params?.rangeGrade) setValue('rangeGrade', filterLimits?.range_grade)
      if (!filterActives?.rangePrice && !params?.rangePrice) setValue('rangePrice', filterLimits?.range_price)
    }
  }, [filterLimits])

  // TODO: OnSubmit
  const onSubmitFilter = async (data) => {
    // setValue('rangePrice', [0, 1])
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

    const proccesRangeParam = (param, key, keyLimit) => {
      if (data[key][0] > filterLimits[keyLimit][0] || data[key][1] < filterLimits[keyLimit][1]) {
        addParams.push({ label: param, value: `${data[key][0]}to${data[key][1]}` })
      } else {
        deleteParams.push(param)
      }
    }

    proccesRangeParam('rangePrice', 'rangePrice', 'range_price')
    proccesRangeParam('rangeGrade', 'rangeGrade', 'range_grade')
    processParam('category', 'subCategory')
    processParam('brand', 'brand')
    processParam('content', 'content')
    processParam('quantity', 'quantity')
    processParam('package', 'package')

    updateMultiParams(addParams, deleteParams)
    console.log('Ejecución: Productos via Filter')
  }

  return {
    handleSubmit,
    control,
    onSubmitFilter
  }
}
