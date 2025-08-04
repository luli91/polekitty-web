src/
├── components/
│   ├── Landing/              # Hero principal y llamados emocionales
│   ├── Capsules/             # Mini bloques visuales que invitan a explorar
│   ├── Navigation/           # Menú personalizado con transiciones suaves
│   ├── BookingPreview/       # CTA reservá clase (preview desde la landing)
│   ├── Animations/           # Wrappers con Framer Motion y microinteracciones
│   ├── SEO/                  # Helmet para metadatos y visibilidad
│
├── pages/
│   ├── About.jsx             # Página narrativa sobre tu hermana
│   ├── Booking.jsx           # Calendario + info ampliada de reserva
│   ├── Gallery.jsx           # Exploración visual profunda
│   ├── Testimonials.jsx      # Opiniones de alumnas con visual emocional
│   ├── PrivateZone.jsx       # Zona protegida solo para alumnas
│   ├── Events.jsx            # Talleres y fechas destacadas
│   └── Dashboard.jsx         # Panel de administración para tu hermana
│
├── layout/
│   └── MainLayout.jsx        # Layout general con animaciones entre rutas
│
├── context/
│   └── AuthContext.jsx       # Manejo de autenticación y estados privados
│
├── hooks/
│   └── useCapsuleReveal.js  # Hook para mostrar cápsulas según scroll o intención
│
├── assets/
│   ├── images/               # Fondos, retratos y media visual
│   └── icons/                # SVGs artísticos para navegación
│
├── styles/
│   └── tailwind.config.js    # Config personalizada del diseño
│
├── App.jsx                   # Router + transición de rutas
└── main.jsx                  # Entrada principal al proyecto
