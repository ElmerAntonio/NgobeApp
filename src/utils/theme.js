// src/utils/theme.js

export const theme = {
  colors: {
    // Colores de la naturaleza y tonos tierra
    primary: '#2E7D32', // Verde bosque (montañas, naturaleza)
    secondary: '#8D6E63', // Tono tierra (madera, artesanía)
    accent: '#FBC02D', // Amarillo (sol, detalles en las naguas)
    background: '#F1F8E9', // Verde muy claro para el fondo
    surface: '#FFFFFF', // Blanco para tarjetas y contenedores
    textPrimary: '#212121', // Gris muy oscuro para texto principal
    textSecondary: '#757575', // Gris medio para texto secundario
    error: '#D32F2F', // Rojo para errores o alertas
    border: '#E0E0E0',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  typography: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212121',
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: '#212121',
    },
    body: {
      fontSize: 16,
      color: '#212121',
    },
    caption: {
      fontSize: 14,
      color: '#757575',
    },
  },
  borders: {
    radius: 8, // Bordes ligeramente redondeados
    radiusLarge: 16,
  }
};
