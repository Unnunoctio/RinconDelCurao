import { useLocation, useNavigate } from 'react-router-dom'

export const addQueryUrl = (label, value) => {
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  queryParams.set(label, value)

  navigate(`?${queryParams.toString()}`)
}
