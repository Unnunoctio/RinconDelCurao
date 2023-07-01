import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useURLQuery = () => {
  const [pathname, setPathname] = useState([])
  const [params, setParams] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  // TODO: Obtener los params
  useEffect(() => {
    const paramsSearch = new URLSearchParams(location.search)

    const paramsObj = Object.fromEntries(paramsSearch.entries())
    if (Object.keys(paramsObj).length > 0) {
      setParams(paramsObj)
    } else {
      setParams(null)
    }
  }, [location.search])

  // TODO: Obtener el pathname
  useEffect(() => {
    const pathSplit = location.pathname.split('/')

    setPathname(pathSplit)
  }, [location.pathname])

  // TODO: Agrega 1 param o lo modifica
  const addParam = (label, value) => {
    const paramsSearch = new URLSearchParams(location.search)
    paramsSearch.set(label, value)

    navigate(`?${paramsSearch.toString()}`)
  }

  // TODO: Elimina 1 param
  const deleteParam = (label) => {
    const paramsSearch = new URLSearchParams(location.search)
    paramsSearch.delete(label)

    navigate(`?${paramsSearch.toString()}`)
  }

  // TODO: Agrega una lista de params: { label, value }
  const addMultiParams = (multiParams) => {
    const paramsSearch = new URLSearchParams(location.search)

    multiParams.map(param => paramsSearch.set(param.label, param.value))

    navigate(`?${paramsSearch.toString()}`)
  }

  // TODO: Actualiza una lista de params: { label, value }, Agregando y Eliminando
  const updateMultiParams = (addParams, deleteParams) => {
    const paramsSearch = new URLSearchParams(location.search)

    deleteParams.map(param => paramsSearch.delete(param))
    addParams.map(param => paramsSearch.set(param.label, param.value))

    navigate(`?${paramsSearch.toString()}`)
  }

  return {
    pathname,
    params,
    //* Metodos
    addParam,
    deleteParam,
    addMultiParams,
    updateMultiParams
  }
}
