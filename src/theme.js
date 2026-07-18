import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: isDark ? '#94a3b8' : '#475569', // Muted slate colors
        light: isDark ? '#cbd5e1' : '#64748b',
        dark: isDark ? '#64748b' : '#334155',
        contrastText: isDark ? '#0f172a' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#38bdf8' : '#854d0e', // Cyan highlight for dark mode, golden/brown for light mode
        light: isDark ? '#7dd3fc' : '#a16207',
        dark: isDark ? '#0284c7' : '#713f12',
        contrastText: '#ffffff',
      },
      success: {
        main: isDark ? '#34d399' : '#15803d',
        light: isDark ? '#6ee7b7' : '#16a34a',
        dark: isDark ? '#059669' : '#166534',
      },
      warning: {
        main: isDark ? '#fbbf24' : '#b45309',
        light: isDark ? '#fcd34d' : '#d97706',
        dark: isDark ? '#d97706' : '#92400e',
      },
      error: {
        main: isDark ? '#f87171' : '#b91c1c',
        light: isDark ? '#fca5a5' : '#dc2626',
        dark: isDark ? '#ef4444' : '#991b1b',
      },
      background: {
        default: isDark ? '#0b0f19' : '#e2e4d9', // Deep dark blue canvas / warm light canvas
        paper: isDark ? '#111827' : '#ffffff',   // Dark card-paper background / clean white card-paper background
      },
      text: {
        primary: isDark ? '#f8fafc' : '#1e293b',   // Bright text for dark / dark slate text for light
        secondary: isDark ? '#94a3b8' : '#64748b', // Muted text
        disabled: isDark ? '#475569' : '#94a3b8',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
        selected: isDark ? 'rgba(255, 255, 255, 0.06)' : '#e8ebf5',
        disabledBackground: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700, fontFamily: '"Georgia", serif' }, // Classic Georgia serif stats
      h6: { fontWeight: 700 },
      body1: { fontSize: '0.9rem', lineHeight: 1.5 },
      body2: { fontSize: '0.85rem', lineHeight: 1.4 },
      caption: { fontSize: '0.75rem', fontWeight: 500 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.85rem',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#0b0f19' : '#e2e4d9',
            color: isDark ? '#f8fafc' : '#1e293b',
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#111827' : '#ffffff',
            borderRadius: 12,
            boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            transition: 'box-shadow 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '6px 14px',
            fontWeight: 600,
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          },
          containedPrimary: {
            backgroundColor: isDark ? '#3b82f6' : '#475569',
            '&:hover': {
              backgroundColor: isDark ? '#2563eb' : '#334155',
            }
          },
          outlined: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
            color: isDark ? '#f8fafc' : '#475569',
            '&:hover': {
              borderColor: isDark ? '#38bdf8' : '#475569',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            }
          }
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(11, 15, 25, 0.95)' : 'rgba(226, 228, 217, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            color: isDark ? '#f8fafc' : '#1e293b',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#0c0f1a' : '#ffffff',
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            margin: '2px 8px',
            borderRadius: 6,
            color: isDark ? '#94a3b8' : '#475569',
            transition: 'all 0.15s ease',
            '&.Mui-selected': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#e8ebf5',
              color: isDark ? '#22d3ee' : '#1e293b',
              fontWeight: 700,
              '& .MuiListItemIcon-root': {
                color: isDark ? '#22d3ee' : '#1e293b',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                height: '100%',
                width: 4,
                backgroundColor: isDark ? '#22d3ee' : '#854d0e',
                borderRadius: '0 2px 2px 0',
              }
            },
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.03)',
              color: isDark ? '#f8fafc' : '#0f172a',
            }
          }
        }
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#141b27' : '#f1f2ec',
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(0, 0, 0, 0.05)',
            padding: '12px 16px',
          },
          head: {
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: isDark ? '#94a3b8' : '#64748b',
          },
          body: {
            color: isDark ? '#cbd5e1' : '#1e293b', // Make sure table cells adapt dynamically to modes
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02) !important' : 'rgba(0, 0, 0, 0.01) !important',
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#0e1524' : '#ffffff',
            borderRadius: 8,
            transition: 'all 0.15s ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#38bdf8' : '#475569',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#38bdf8' : '#475569',
              borderWidth: 1.5,
            }
          },
          input: {
            padding: '10px 12px',
            fontSize: '0.85rem',
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.85rem',
            color: isDark ? '#94a3b8' : '#64748b',
            '&.Mui-focused': {
              color: isDark ? '#38bdf8' : '#475569',
            }
          }
        }
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#111827' : '#ffffff',
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: '8px !important',
            overflow: 'hidden',
            boxShadow: 'none',
            margin: '6px 0 !important',
            '&::before': {
              display: 'none',
            }
          }
        }
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            padding: '0 16px',
            minHeight: '44px !important',
            '&.Mui-expanded': {
              minHeight: '44px !important',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 0, 0, 0.01)',
            }
          },
          content: {
            margin: '10px 0 !important',
          }
        }
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: '16px',
            backgroundColor: isDark ? '#161f30' : '#fafafa',
            borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
          }
        }
      }
    },
  });
};
