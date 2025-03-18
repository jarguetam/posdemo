src/
├── app/
│   ├── core/                           # Núcleo de la aplicación
│   │   ├── auth/                       # Autenticación
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── services/
│   │   ├── config/                     # Configuración global
│   │   ├── constants/                  # Constantes globales
│   │   ├── interfaces/                 # Interfaces core
│   │   ├── layout/                     # Componentes de layout
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   ├── main/
│   │   │   ├── menu/
│   │   │   └── sidebar/
│   │   └── services/                   # Servicios core
│   │       ├── cache/
│   │       ├── http/
│   │       └── storage/
│   │
│   ├── data/                          # Capa de datos
│   │   ├── repositories/              # Implementaciones de repositorios
│   │   ├── datasources/              # Fuentes de datos
│   │   └── models/                   # Modelos de datos
│   │
│   ├── domain/                       # Capa de dominio
│   │   ├── entities/                 # Entidades de negocio
│   │   ├── repositories/             # Interfaces de repositorios
│   │   └── usecases/                # Casos de uso
│   │
│   ├── presentation/                 # Capa de presentación
│   │   ├── common/                   # Componentes compartidos
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   └── pipes/
│   │   │
│   │   ├── features/                 # Módulos funcionales
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── sales/
│   │   │   ├── purchases/
│   │   │   ├── customers/
│   │   │   └── suppliers/
│   │   │
│   │   └── shared/                   # Recursos compartidos
│   │       ├── components/
│   │       ├── models/
│   │       └── utils/
│   │
│   └── infrastructure/               # Capa de infraestructura
│       ├── api/                      # Servicios de API
│       ├── storage/                  # Servicios de almacenamiento
│       └── sync/                     # Servicios de sincronización
│
├── assets/                           # Recursos estáticos
└── environments/                     # Configuraciones de entorno
