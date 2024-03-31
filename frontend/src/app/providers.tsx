'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@chakra-ui/pro-theme'
import { extendTheme } from '@chakra-ui/react'
import '@fontsource-variable/open-sans'
import '@fontsource-variable/spline-sans'

export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
    const proTheme = extendTheme(theme)
    const extendedConfig = {
        colors: { ...proTheme.colors, brand: proTheme.colors.blue },
    }
    const myTheme = extendTheme(extendedConfig, proTheme)
    return (
        <CacheProvider>
            <ChakraProvider theme={myTheme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}