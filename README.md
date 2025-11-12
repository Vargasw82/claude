# Cotizador de Proyectos

Sistema de cotización de proyectos basado en tiempo de trabajo y costo de herramientas.

## Características

- **Cálculo automático de tarifa por hora** basado en costo mensual y jornada laboral
- **Gestión de tareas del SOW** con estimación de horas
- **Cálculo de costos de herramientas** prorrateado por las horas del proyecto
- **Interfaz intuitiva** con los colores de tu marca
- **Exportación de cotizaciones** en formato de texto
- **Diseño responsive** para usar en cualquier dispositivo

## Cómo usar

### 1. Configuración de Tarifa

En la primera sección puedes ajustar:
- **Costo Mensual**: Tu ingreso mensual deseado (por defecto: 100,000 MXN)
- **Horas Diarias**: Horas de trabajo por día (por defecto: 8 horas)
- **Días Semanales**: Días laborales por semana (por defecto: 5 días)

El sistema calculará automáticamente tu tarifa por hora usando la fórmula:

```
Horas Mensuales = Horas Diarias × Días Semanales × 4.33
Tarifa por Hora = Costo Mensual ÷ Horas Mensuales
```

### 2. Scope of Work (SOW)

Agrega las tareas de tu proyecto:
1. Ingresa el nombre de la tarea
2. Ingresa las horas estimadas
3. Haz clic en "Agregar Tarea"

Cada tarea mostrará:
- Nombre de la tarea
- Horas asignadas
- Costo individual (horas × tarifa por hora)

El sistema calculará automáticamente:
- **Total de Horas**: Suma de todas las horas de las tareas
- **Costo de Trabajo**: Total de horas × tarifa por hora

### 3. Herramientas y Recursos

Agrega las herramientas que usarás:
1. Ingresa el nombre de la herramienta
2. Ingresa el costo mensual de la herramienta
3. Haz clic en "Agregar Herramienta"

El sistema calculará el costo prorrateado usando la fórmula:

```
Costo Prorrateado = (Costo Mensual ÷ Horas Mensuales) × Horas del Proyecto
```

Esto significa que solo pagarás la porción de la herramienta correspondiente a las horas que dedicarás al proyecto.

### 4. Cotización Total

La sección final muestra:
- **Costo de Trabajo**: Total de horas × tarifa por hora
- **Costo de Herramientas**: Suma de costos prorrateados de todas las herramientas
- **TOTAL DEL PROYECTO**: Suma de costo de trabajo + costo de herramientas

### 5. Acciones Disponibles

- **Exportar Cotización**: Descarga un archivo de texto con el detalle completo de la cotización
- **Limpiar Todo**: Elimina todas las tareas y herramientas (con confirmación)

## Ejemplo de Uso

### Ejemplo 1: Proyecto de Desarrollo Web

**Configuración:**
- Costo mensual: 100,000 MXN
- 8 horas/día, 5 días/semana
- Tarifa por hora: ~577.37 MXN/hora

**Tareas:**
1. Diseño de interfaz: 10 horas = 5,773.70 MXN
2. Desarrollo frontend: 20 horas = 11,547.40 MXN
3. Integración backend: 15 horas = 8,660.55 MXN
4. Pruebas y ajustes: 5 horas = 2,886.85 MXN

**Total horas:** 50 horas
**Costo de trabajo:** 28,868.50 MXN

**Herramientas:**
- Adobe Creative Cloud: 1,200 MXN/mes → Prorrateado: 346.56 MXN
- Hosting: 500 MXN/mes → Prorrateado: 144.40 MXN

**Costo de herramientas:** 490.96 MXN

**TOTAL DEL PROYECTO:** 29,359.46 MXN

## Instalación

1. Descarga o clona este repositorio
2. Abre el archivo `index.html` en tu navegador web
3. ¡Listo! No requiere instalación de dependencias

## Tecnologías

- HTML5
- CSS3 (con variables CSS y diseño responsive)
- JavaScript Vanilla (ES6+)

## Colores de Marca

- **Fondo**: #521892 (Morado)
- **Elementos principales**: #ffeb02 (Amarillo)
- **Elementos secundarios**: #f2f2f2 (Gris claro)

## Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Dispositivos móviles

## Características Adicionales

- **Atajos de teclado**: Presiona Enter para navegar entre campos
- **Validación**: No permite valores negativos o vacíos
- **Formato de moneda**: Muestra cantidades en formato mexicano (MXN)
- **Animaciones suaves**: Transiciones y efectos visuales
- **Scrollbars personalizados**: Con los colores de tu marca

## Soporte

Para reportar problemas o sugerir mejoras, por favor crea un issue en el repositorio.

## Licencia

Este proyecto está disponible para uso personal y comercial.

---

Desarrollado con ❤️ para optimizar tu proceso de cotización de proyectos.
