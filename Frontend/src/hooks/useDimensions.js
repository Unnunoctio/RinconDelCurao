import { useEffect, useRef, useState } from 'react'

const initialState = { width: 0, height: 0 }

export const useDimensions = () => {
  const ref = useRef(null)
  const [dimensions, setDimensions] = useState(initialState)

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    ref,
    dimensions
  }
}
