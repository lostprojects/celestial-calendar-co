export type ThemeConfig = {
  colors: {
    [key: string]: {
      [shade: string]: string;
    };
  };
  fonts: {
    [key: string]: {
      family: string;
      weights: number[];
    };
  };
  spacing: {
    [key: string]: string;
  };
  typography: {
    [key: string]: {
      fontSize: string;
      lineHeight: string;
    };
  };
  animations: {
    [key: string]: {
      keyframes: { [key: string]: { [key: string]: string } };
      duration: string;
      timing: string;
    };
  };
};

export const defaultTheme: ThemeConfig = {
  colors: {
    background: {
      DEFAULT: "#FCFAF7",
      sand: "#F5E6D3",
    },
    primary: {
      DEFAULT: "#403E43",
      dark: "#001018",
      light: "#E5D5C0",
    },
    accent: {
      palm: "#5E5F34",
      lightpalm: "#7A8C44",
      orange: "#D77145",
      lightorange: "#E0815D",
    },
  },
  fonts: {
    mono: {
      family: "IBM Plex Mono",
      weights: [400, 500, 600],
    },
    serif: {
      family: "Playfair Display",
      weights: [400, 500, 600, 700],
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "hero-h1": "2.5rem",      /* Updated from 3.5rem to match theme */
    "hero-h1-md": "3.25rem",  /* Updated from 4rem to match theme */
  },
  typography: {
    "hero-h1": {
      fontSize: "2.5rem",    /* Updated to match spacing */
      lineHeight: "1.15",    /* Updated for tighter spacing */
    },
    "hero-h1-md": {
      fontSize: "3.25rem",   /* Updated to match spacing */
      lineHeight: "1.15",    /* Updated for tighter spacing */
    },
    base: {
      fontSize: "1rem",
      lineHeight: "1.5",
    },
    sm: {
      fontSize: "0.875rem",
      lineHeight: "1.25",
    },
  },
  animations: {
    float: {
      keyframes: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-5px)" },
      },
      duration: "6s",
      timing: "ease-in-out",
    },
    "fade-up": {
      keyframes: {
        "0%": { opacity: "0", transform: "translateY(10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      duration: "0.3s",
      timing: "ease-out",
    },
    "pulse-subtle": {
      keyframes: {
        "0%, 100%": { opacity: "0.8" },
        "50%": { opacity: "0.9" },
      },
      duration: "4s",
      timing: "ease-in-out",
    },
  },
};

export const generateCssVariables = (theme: ThemeConfig): string => {
  let css = '';
  
  // Generate color variables
  Object.entries(theme.colors).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      const variableName = shade === "DEFAULT" 
        ? `--color-${colorName}` 
        : `--color-${colorName}-${shade}`;
      css += `  ${variableName}: ${value};\n`;
    });
  });

  // Generate font variables
  Object.entries(theme.fonts).forEach(([fontName, font]) => {
    css += `  --font-${fontName}: "${font.family}", ${fontName === 'mono' ? 'monospace' : 'serif'};\n`;
  });

  // Generate spacing variables
  Object.entries(theme.spacing).forEach(([size, value]) => {
    css += `  --spacing-${size}: ${value};\n`;
  });

  return css;
};

export const generateTailwindConfig = (theme: ThemeConfig) => {
  return {
    theme: {
      extend: {
        colors: Object.entries(theme.colors).reduce((acc, [name, shades]) => {
          acc[name] = shades;
          return acc;
        }, {} as Record<string, any>),
        fontFamily: Object.entries(theme.fonts).reduce((acc, [name, font]) => {
          acc[name] = [font.family, name === 'mono' ? 'monospace' : 'serif'];
          return acc;
        }, {} as Record<string, string[]>),
        spacing: theme.spacing,
        keyframes: Object.entries(theme.animations).reduce((acc, [name, animation]) => {
          acc[name] = animation.keyframes;
          return acc;
        }, {} as Record<string, any>),
        animation: Object.entries(theme.animations).reduce((acc, [name, animation]) => {
          acc[name] = `${name} ${animation.duration} ease-in-out infinite`;
          return acc;
        }, {} as Record<string, string>),
      },
    },
  };
};