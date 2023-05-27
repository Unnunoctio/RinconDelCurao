import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useQueryURL = () => {
  const [queryPaths, setQueryPaths] = useState([])
  const [queryParams, setQueryParams] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)

    const paramsObj = Object.fromEntries(params.entries())
    if (Object.keys(paramsObj).length > 0) {
      setQueryParams(paramsObj)
    } else {
      setQueryParams(null)
    }
  }, [location.search])

  useEffect(() => {
    const pathSplit = location.pathname.split('/')

    setQueryPaths(pathSplit)
  }, [location.pathname])

  const addQueryParamURL = (label, value) => {
    const params = new URLSearchParams(location.search)
    params.set(label, value)

    navigate(`?${params.toString()}`)
  }

  const addQueryMultiParamsURL = (multiParams) => {
    const params = new URLSearchParams(location.search)

    multiParams.map(param => params.set(param.label, param.value))

    navigate(`?${params.toString()}`)
  }

  return {
    queryPaths,
    queryParams,
    //* Metodos
    addQueryParamURL,
    addQueryMultiParamsURL
  }
}
