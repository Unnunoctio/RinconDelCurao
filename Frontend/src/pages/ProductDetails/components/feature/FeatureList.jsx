import { Box, Heading, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import { useDimensions } from '../../../../hooks'
import { FeatureItem } from './FeatureItem'
import { AlcoholicIcon, BitternessIcon, BrandIcon, CategoryIcon, ContentIcon, PackagingIcon, PlaceIcon, QuantityIcon, StrainIcon, VineyardIcon, WheatIcon } from './FeatureSvg'

export const FeatureList = ({ brand, sub_category: subCategory, quantity, content, variety, strain, vineyard, alcoholic_grade: alcoholicGrade, bitterness, package: packageData, made_in: madeIn }) => {
  const { ref: featuresRef, dimensions: featuresDimensions } = useDimensions()

  return (
    <Box flex={1} ref={featuresRef} className='feature-content'>
      <Heading
        fontSize={{ base: 22, sm: 24 }} fontWeight='medium' textAlign='center'
        color={useColorModeValue('light.text.main', 'dark.text.main')}
      >
        Caracteristicas
      </Heading>
      <SimpleGrid
        className='feature-list'
        py={4} rowGap={3}
        columns={featuresDimensions.width <= 550 ? 1 : 2}
        justifyItems='center'
      >
        {// TODO: Icono Marca
          brand && (
            <FeatureItem title='Marca' icon={<BrandIcon boxSize={`${4 * 11}px`} />}>
              {brand}
            </FeatureItem>
          )
        }
        {// TODO: Icono Sub-Categoria
          subCategory && (
            <FeatureItem title='Categoria' icon={<CategoryIcon boxSize={12} />}>
              {subCategory}
            </FeatureItem>
          )
        }
        {// TODO: Icono Cantidad
          quantity && (
            <FeatureItem title='Cantidad' icon={<QuantityIcon boxSize={12} />}>
              {quantity} {quantity > 1 ? 'Unidades' : 'Unidad'}
            </FeatureItem>
          )
        }
        {// TODO: Icono Contenido
          content && (
            <FeatureItem title='Contenido' icon={<ContentIcon boxSize={`${4 * 11}px`} />}>
              {(content / 1000) > 1 ? `${content / 1000} L` : `${content} cc`}
            </FeatureItem>
          )
        }
        {// TODO: Icono de Estilo para cervezas
          variety && (
            <FeatureItem title='Estilo' icon={<WheatIcon boxSize={`${4 * 11}px`} />}>
              {variety}
            </FeatureItem>
          )
        }
        {// TODO: Icono de Cepa para vinos
          strain && (
            <FeatureItem title='Cepa' icon={<StrainIcon boxSize={12} />}>
              {strain}
            </FeatureItem>
          )
        }
        {// TODO: Icono de Viña para vinos
          vineyard && (
            <FeatureItem title='Viña' icon={<VineyardIcon boxSize={12} />}>
              {vineyard}
            </FeatureItem>
          )
        }
        {// TODO: Icono de Alcohol
          (alcoholicGrade !== undefined) && (
            <FeatureItem title='Grado Alcohólico' icon={<AlcoholicIcon boxSize={12} />}>
              {alcoholicGrade.toString().replace('.', ',')}°
            </FeatureItem>
          )
        }
        {// TODO: Icono de Amargor
          bitterness && (
            <FeatureItem title='Amargor' icon={<BitternessIcon boxSize={`${4 * 11}px`} />}>
              {bitterness}
            </FeatureItem>
          )
        }
        {// TODO: Icono de Packaging
          packageData && (
            <FeatureItem title='Envase' icon={<PackagingIcon boxSize={12} />}>
              {packageData}
            </FeatureItem>
          )
        }
        {// TODO: Icono de Lugar de Origen
          madeIn && (
            <FeatureItem title='Lugar de Origen' icon={<PlaceIcon boxSize={12} />}>
              {madeIn}
            </FeatureItem>
          )
        }
      </SimpleGrid>
    </Box>
  )
}
