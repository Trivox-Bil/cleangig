import {extendTheme, useContrastText} from 'native-base';

export const defaultTheme = extendTheme({
    config: {
        initialColorMode: 'light',
    },
    colors: {
        brand: {
            50: '#ffefdb',
            100: '#ffd3ae',
            200: '#ffb77e',
            300: '#ff9b4c',
            400: '#ff7e1a',
            500: '#e66500',
            600: '#b44e00',
            700: '#813700',
            800: '#4f2100',
            900: '#200800',
        },
        accent: {
            50: '#deffef',
            100: '#b5f7d5',
            200: '#8bf2bb',
            300: '#5feba0',
            400: '#34e586',
            500: '#1acb6d',
            600: '#0e9e54',
            700: '#04713b',
            800: '#004522',
            900: '#001906',
        }
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'brand',
            },
        },
        Radio: {
            defaultProps: {
                colorScheme: 'brand',
            },
        },
        Input: {
            baseStyle: {
                fontSize: 16,
                borderColor: 'accent.200',
            },
        },
    },
    fontConfig: {
        Poppins: {
            300: {
                normal: 'Poppins_300Light',
                italic: 'Poppins_300Light_Italic',
            },
            400: {
                normal: 'Poppins_400Regular',
                italic: 'Poppins_400Regular_Italic',
            },
            500: {
                normal: 'Poppins_500Medium',
                italic: 'Poppins_500Medium_Italic',
            },
            600: {
                normal: 'Poppins_600SemiBold',
                italic: 'Poppins_600SemiBold_Italic',
            },
            700: {
                normal: 'Poppins_700Bold',
                italic: 'Poppins_700Bold_Italic',
            },
            800: {
                normal: 'Poppins_800ExtraBold',
                italic: 'Poppins_800ExtraBold_Italic',
            },
            900: {
                normal: 'Poppins_900Black',
                italic: 'Poppins_900Black_Italic',
            },
        },
    },
    fonts: {
        heading: 'Poppins',
        body: 'Poppins',
    },
});
