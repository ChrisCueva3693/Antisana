import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Modelos.css';

// Componente para mostrar un bloque de código
const CodeBlock = ({ code, language }) => (
  <div className="code-block-container">
    <SyntaxHighlighter language={language} style={materialDark} showLineNumbers>
      {code.trim()}
    </SyntaxHighlighter>
  </div>
);

// Componente para una entrada del blog sobre un modelo
const ModelPost = ({ title, icon, description, code, language, animationDelay }) => (
  <article className="model-post" style={{ animationDelay: `${animationDelay}s` }}>
    <header className="post-header">
      <span className="post-icon">{icon}</span>
      <h2 className="post-title">{title}</h2>
    </header>
    <div className="post-content">
      <div className="post-description">{description}</div>
      <h3 className="code-title">Código Comentado</h3>
      <CodeBlock code={code} language={language} />
    </div>
  </article>
);

// NUEVO COMPONENTE: Sección de GitHub
const GithubSection = ({ githubLink, animationDelay }) => (
    <section className="github-section" style={{ animationDelay: `${animationDelay}s` }}>
        <h2 className="github-title">
            <span role="img" aria-label="icono de código">👨‍💻</span> Explora Nuestro Código en GitHub
        </h2>
        <p className="github-description">
            La transparencia es clave. Te invitamos a sumergirte en el corazón de nuestro proyecto.
            Visita nuestro repositorio en GitHub para ver el código fuente completo de nuestra pagina web,
            contribuciones y cómo funciona todo detrás de escena. ¡Tu feedback y colaboración son bienvenidos!
        </p>
        <a href={githubLink} target="_blank" rel="noopener noreferrer" className="github-button">
            <span className="button-icon-github"></span> Ir a GitHub
        </a>
    </section>
);


export default function Modelos() {
  // Código para Precipitación
  const prophetPrecipitacionCode = `
# --- PASO 0: IMPORTAR LAS HERRAMIENTAS NECESARIAS ---
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np
from matplotlib.patches import Rectangle
import matplotlib.dates as mdates

# Creamos una función para poder reutilizar fácilmente todo el proceso.
def forecast_with_prophet(csv_path):
    """
    Carga datos de un archivo CSV, entrena un modelo Prophet,
    y genera gráficos de predicción estilizados.
    """
    # --- PASO 1: CARGAR Y PREPARAR DATOS ---
    # Leemos el archivo de datos que nos indiquen en 'csv_path'.
    df = pd.read_csv(csv_path, sep=',')
    # Convertimos la columna de fecha a un formato de fecha real.
    df['Fecha'] = pd.to_datetime(df['Fecha'])
    # Convertimos la columna de precipitación a números.
    df['P43'] = pd.to_numeric(df['P43'], errors='coerce')
    # Seleccionamos las columnas que necesitamos y eliminamos filas vacías.
    df = df[['Fecha', 'P43']].dropna()
    # Prophet exige que las columnas se llamen 'ds' (fecha) y 'y' (valor).
    df.columns = ['ds', 'y']

    # --- PASO 2: CONFIGURAR Y ENTRENAR EL MODELO PROPHET ---
    # Creamos nuestro modelo y lo ajustamos para datos de lluvia.
    model = Prophet(
        daily_seasonality=True,          # Busca patrones diarios.
        weekly_seasonality=True,         # Busca patrones semanales.
        yearly_seasonality=True,         # Busca patrones anuales.
        seasonality_mode='multiplicative', # Los patrones son porcentuales (ej. +20% en verano).
        changepoint_prior_scale=0.15     # Flexibilidad para detectar cambios de tendencia.
    )
    # Añadimos un patrón mensual personalizado para más precisión.
    model.add_seasonality(name='monthly', period=30.5, fourier_order=5)
    # Entrenamos el modelo con nuestros datos históricos.
    model.fit(df)

    # --- PASO 3: REALIZAR LA PREDICCIÓN ---
    # Creamos un "esqueleto" de fechas para los próximos 365 días.
    future = model.make_future_dataframe(periods=365)
    # Pedimos al modelo que prediga los valores para esas fechas futuras.
    forecast = model.predict(future)

    # --- PASO 4: ETIQUETAR DÍAS SECOS Y LLUVIOSOS ---
    # Nos quedamos solo con las predicciones del futuro.
    forecast_future = forecast[forecast['ds'] > df['ds'].max()].copy()
    # Calculamos los umbrales del 25% (días secos) y 75% (días lluviosos).
    p25 = forecast_future['yhat'].quantile(0.25)
    p75 = forecast_future['yhat'].quantile(0.75)

    # Creamos una función para asignar etiquetas.
    def clasificar(valor):
        if valor < p25:
            return 'Sequía'
        elif valor > p75:
            return 'Lluvia Intensa'
        else:
            return 'Normal'
    # Aplicamos la función para crear la columna 'Etiqueta'.
    forecast_future['Etiqueta'] = forecast_future['yhat'].apply(clasificar)

    # --- PASO 5: GUARDAR LOS DATOS PREDICHOS ---
    forecast_future[['ds', 'yhat', 'Etiqueta']].to_csv("Prediccion_Prophet_Diaria_Etiquetada_43.csv", index=False, float_format='%.2f')

    # --- PASO 6: GENERAR GRÁFICOS ---
    # Definimos nuestra paleta de colores.
    BACKGROUND_COLOR = '#ffffff'
    PLOT_AREA_COLOR = '#f8f9fa'
    
    # Creamos la figura donde vamos a dibujar.
    fig, ax = plt.subplots(figsize=(14, 8), facecolor=BACKGROUND_COLOR)
    ax.set_facecolor(PLOT_AREA_COLOR)

    # Dibujamos la línea principal de la predicción.
    ax.plot(forecast_future['ds'], forecast_future['yhat'], 
             color='#00b894', linewidth=4, 
             label='Prediccion Normal', zorder=3)

    # Dibujamos los puntos de colores para los días especiales.
    sequia = forecast_future[forecast_future['Etiqueta'] == 'Sequía']
    lluvia = forecast_future[forecast_future['Etiqueta'] == 'Lluvia Intensa']
    ax.scatter(sequia['ds'], sequia['yhat'], color='#f39c12', s=50, label='Sequía', zorder=4, alpha=0.8)
    ax.scatter(lluvia['ds'], lluvia['yhat'], color='#3498db', s=50, label='Lluvia Intensa', zorder=4, alpha=0.8)
    
    # Añadimos todos los detalles: título, etiquetas, leyenda, etc.
    ax.set_title('PREDICCION DEL CLIMA - PROXIMOS 365 DIAS', fontsize=20, fontweight='bold')
    ax.set_xlabel('FECHA', fontweight='bold')
    ax.set_ylabel('LLUVIA (milimetros)', fontweight='bold')
    ax.legend()
    ax.grid(True, which='both', linestyle='--', linewidth=0.5)
    
    # Añadimos la firma del proyecto.
    fig.text(0.99, 0.01, 'Proyecto Antisana', ha='right', va='bottom', fontsize=12)

    # Guardamos el gráfico final como una imagen de alta calidad.
    plt.savefig("Solo_Prediccion_Resaltada_P43.png", dpi=300, bbox_inches='tight')
    plt.show()

# --- CÓMO USAR EL CÓDIGO ---
# Para analizar una estación, simplemente llamamos a la función con la ruta de su archivo.
# forecast_with_prophet("datos_estacion_limboasi.csv")
  `;

  // Código para Caudal
  const prophetCaudalCode = `
# --- PASO 0: IMPORTAR LIBRERÍAS ---
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# --- PASO 1: CARGAR Y PREPARAR DATOS DE CAUDAL ---
# En este ejemplo, cargamos directamente un archivo, pero podría ser una variable.
df = pd.read_csv("H15-Ramon_Huañuna_Caudal-Diario.csv", parse_dates=['fecha'])
df_prophet = df[['fecha', 'valor']].copy()
df_prophet.rename(columns={'fecha': 'ds', 'valor': 'y'}, inplace=True)

# --- PASO 2: CONFIGURAR Y ENTRENAR EL MODELO PARA CAUDAL ---
# Creamos el modelo con ajustes específicos para el caudal de un río.
model = Prophet(
    seasonality_mode='multiplicative', # El caudal también tiene cambios porcentuales.
    changepoint_prior_scale=0.1,       # Flexibilidad para la tendencia.
    seasonality_prior_scale=20.0,      # Le damos mucha importancia a los patrones estacionales.
    yearly_seasonality=20              # Aumentamos el "detalle" del patrón anual para que sea más preciso.
)
# Entrenamos el modelo con los datos del río.
model.fit(df_prophet)

# --- PASO 3: PREDICCIÓN Y ETIQUETADO ---
# El proceso de predecir y etiquetar es idéntico al modelo de lluvias.
future = model.make_future_dataframe(periods=365)
forecast = model.predict(future)
predicciones = forecast[forecast['ds'] > df_prophet['ds'].max()].copy()

# Clasificamos en "Caudal Alto" y "Caudal Bajo".
p25 = predicciones['yhat'].quantile(0.25)
p75 = predicciones['yhat'].quantile(0.75)
def clasificar_caudal(valor):
    if valor < p25: return 'Caudal Bajo'
    elif valor > p75: return 'Caudal Alto'
    else: return 'Normal'
predicciones['Etiqueta'] = predicciones['yhat'].apply(clasificar_caudal)

# --- PASO 4: CREAR Y GUARDAR EL GRÁFICO ---
# El código para el gráfico es similar al de precipitaciones.
fig, ax = plt.subplots(figsize=(14, 8))
ax.plot(predicciones['ds'], predicciones['yhat'], label='Caudal Predicho', color='#2980b9')
ax.set_title('PREDICCIÓN DE CAUDAL - PRÓXIMOS 365 DÍAS', fontsize=20, fontweight='bold')
ax.set_xlabel('Fecha', fontweight='bold')
ax.set_ylabel('Caudal (m³/s)', fontweight='bold')
ax.legend()
ax.grid(True, linestyle='--', alpha=0.6)

# Guardamos el gráfico y las predicciones en archivos CSV.
plt.savefig("H15-Ramon_Huañuna_Caudal-PREDICCION_365DIAS.png", dpi=300)
plt.show()

resultado = predicciones[['ds', 'yhat', 'Etiqueta']].copy()
resultado.to_csv("H15-Ramon_Huañuna_Caudal-PREDICCION_365DIAS.csv", index=False, float_format='%.2f')
  `;

  // CÓDIGO PARA TEMPERATURA
  const prophetTemperaturaCode = `
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# --- 1. Cargar y preparar datos ---
# Leer el nuevo CSV de temperatura
try:
    df = pd.read_csv("H15-Ramon_Huañuna_Temperatura-Diario.csv", parse_dates=['fecha'])
except FileNotFoundError:
    print("Error: El archivo 'H15-Ramon_Huañuna_Temperatura-Diario.csv' no fue encontrado.")
    print("Por favor, asegúrate de que el archivo esté en el mismo directorio que el script.")
    exit()


# Preparar datos para Prophet (columnas 'ds' para fecha y 'y' para valor)
df_prophet = df[['fecha', 'valor']].copy()
df_prophet.rename(columns={'fecha': 'ds', 'valor': 'y'}, inplace=True)


# --- 2. Configurar y entrenar el modelo Prophet ---
# Se ajusta el modo de estacionalidad a 'additive', que es más común para la temperatura.
# Los otros parámetros se mantienen, pero podrían ajustarse para optimizar el modelo.
model = Prophet(
    seasonality_mode='additive',       # Usa estacionalidad aditiva, mejor para temperatura
    changepoint_prior_scale=0.1,       # Flexibilidad de la tendencia
    seasonality_prior_scale=20.0,      # Peso de la estacionalidad
    yearly_seasonality=20              # Complejidad de la curva anual
)

print("Entrenando el modelo para predicción de temperatura...")
model.fit(df_prophet)
print("Entrenamiento completado.")


# --- 3. Crear fechas futuras y predecir ---
# Crear un dataframe con 365 días en el futuro para la predicción
future = model.make_future_dataframe(periods=365)
forecast = model.predict(future)


# --- 4. Preparar datos para el gráfico ---
# Extraer solo las predicciones futuras (días posteriores a la última fecha histórica)
fecha_max_historico = df_prophet['ds'].max()
predicciones = forecast[forecast['ds'] > fecha_max_historico].copy()

# Clasificar los días predichos en Temperatura Alta, Baja o Normal
# Se usan los cuantiles 0.25 y 0.75 como umbrales
p25 = predicciones['yhat'].quantile(0.25)
p75 = predicciones['yhat'].quantile(0.75)

def clasificar_temperatura(valor):
    """Clasifica un valor de temperatura en 'Baja', 'Alta' o 'Normal'."""
    if valor < p25:
        return 'Temperatura Baja'
    elif valor > p75:
        return 'Temperatura Alta'
    else:
        return 'Normal'

predicciones['Etiqueta'] = predicciones['yhat'].apply(clasificar_temperatura)


# --- 5. Crear el gráfico con el nuevo estilo ---

# Paleta de colores para temperatura
BACKGROUND_COLOR = '#ffffff'
PLOT_AREA_COLOR = '#f8f9fa'
TEXT_COLOR = '#2d3436'
GRID_COLOR = '#ddd'
NORMAL_LINE_COLOR = '#2ecc71'    # Verde para la predicción normal
TEMP_ALTA_COLOR = '#e74c3c'      # Rojo para temperatura alta
TEMP_BAJA_COLOR = '#3498db'      # Azul para temperatura baja

# Crear la figura y los ejes
fig, ax = plt.subplots(figsize=(14, 8), facecolor=BACKGROUND_COLOR)
ax.set_facecolor(PLOT_AREA_COLOR)

# Línea de predicción principal
ax.plot(predicciones['ds'], predicciones['yhat'],
         color=NORMAL_LINE_COLOR, linewidth=3,
         label='Predicción Normal', zorder=3)

# Puntos para eventos extremos (Temperatura Alta y Baja)
temp_baja = predicciones[predicciones['Etiqueta'] == 'Temperatura Baja']
temp_alta = predicciones[predicciones['Etiqueta'] == 'Temperatura Alta']

ax.scatter(temp_baja['ds'], temp_baja['yhat'],
           color=TEMP_BAJA_COLOR, s=80,
           label='Días de Temperatura Baja', zorder=5,
           edgecolors='white', linewidth=2)

ax.scatter(temp_alta['ds'], temp_alta['yhat'],
           color=TEMP_ALTA_COLOR, s=80,
           label='Días de Temperatura Alta', zorder=5,
           edgecolors='white', linewidth=2)

# --- Ajustes estéticos del gráfico ---
# Título
ax.set_title('PREDICCIÓN DE TEMPERATURA - PRÓXIMOS 365 DÍAS',
             fontsize=18, fontweight='bold', color=TEXT_COLOR, pad=25)

# Etiquetas de los ejes
ax.set_xlabel('FECHA', fontsize=14, color=TEXT_COLOR, fontweight='bold')
ax.set_ylabel('TEMPERATURA (°C)', fontsize=14, color=TEXT_COLOR, fontweight='bold')

# Formato de fechas en el eje X
ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=2))
plt.setp(ax.get_xticklabels(), rotation=0, ha='center', fontsize=12)

# Cuadrícula
ax.grid(True, linestyle='--', alpha=0.5, color=GRID_COLOR, linewidth=1)
ax.set_axisbelow(True)

# Bordes del gráfico
for spine in ax.spines.values():
    spine.set_color('#bdc3c7')
    spine.set_linewidth(1.5)

# Ticks (marcas en los ejes)
ax.tick_params(colors=TEXT_COLOR, which='both', labelsize=12)

# Leyenda
legend = ax.legend(loc='upper left', facecolor='white',
                    edgecolor='#bdc3c7', framealpha=1.0,
                    fontsize=12, title='Tipos de Temperatura', title_fontsize=13)
legend.get_frame().set_linewidth(1.5)
legend.get_title().set_weight('bold')

# Caja de resumen
info_text = f"""RESUMEN:
Días de Temperatura Alta: {len(temp_alta)}
Días de Temperatura Baja: {len(temp_baja)}
Temperatura promedio: {predicciones['yhat'].mean():.2f} °C"""

# Modificado: Cambiado y=0.98 a y=0.02 y va='top' a va='bottom' para moverlo abajo
ax.text(0.98, 0.02, info_text, transform=ax.transAxes,
        fontsize=11, color=TEXT_COLOR, ha='right', va='bottom',
        bbox=dict(boxstyle='round,pad=0.6', facecolor='white',
                  edgecolor='#74b9ff', linewidth=1.5, alpha=0.9),
        weight='bold')

# Firma
fig.text(0.99, 0.01, 'Proyecto Antisana',
          ha='right', va='bottom', fontsize=10, color='#636e72', weight='bold')

plt.tight_layout(rect=[0, 0.03, 1, 0.95])

# Guardar y mostrar el gráfico
output_image_file = "H15-Ramon_Huañuna_Temperatura-PREDICCION_365DIAS.png"
plt.savefig(output_image_file, dpi=300)
plt.show()


# --- 6. Guardar CSV con las predicciones y etiquetas ---
resultado = predicciones[['ds', 'yhat', 'Etiqueta']].copy()
resultado.rename(columns={'ds': 'fecha', 'yhat': 'valor_predicho', 'Etiqueta': 'clasificacion'}, inplace=True)

output_csv_file = "H15-Ramon_Huañuna_Temperatura-PREDICCION_365DIAS.csv"
resultado.to_csv(output_csv_file, index=False, float_format='%.3f')

print("\n✅ Archivos generados:")
print(f"📊 Gráfico: {output_image_file}")
print(f"📝 Predicciones: {output_csv_file}")
  `;

  return (
    <div className="modelos-page-container">
      <div className="modelos-hero-section">
        <h1 className="modelos-hero-title">Antisana, Guardián del Agua: Nuestro Código para Predecir el Futuro del Clima</h1>
        <p className="modelos-hero-subtitle">
          En el proyecto Antisana - Guardián del Agua, hemos desarrollado herramientas poderosas para anticiparnos a los ciclos del agua. No se trata de magia, sino de ciencia de datos y Python. Hemos creado dos modelos de predicción—uno para precipitaciones y otro para caudales—que podemos aplicar a los datos de cualquiera de nuestras estaciones de monitoreo, como las de Limboasi o Ramón Huañuna.
          <br/><br/>
          En este post, te compartimos los códigos completos que usamos, con explicaciones sencillas para que puedas entender cómo transformamos simples datos en predicciones visuales y valiosas. 💧📈
        </p>
      </div>

      <div className="info-section">
        <h2>El Cerebro del Modelo: ¿Qué es Prophet? 🧠</h2>
        <p>
          Antes de sumergirnos en el código, hablemos de nuestro principal aliado: <strong>Prophet</strong>. Es una librería de código abierto desarrollada por Meta (Facebook) diseñada específicamente para predecir datos de series temporales.
        </p>
        <p>
          Piensa en Prophet como un experto analista que mira un calendario lleno de datos históricos (como las lluvias de los últimos 10 años) y es capaz de identificar patrones ocultos:
        </p>
        <ul>
            <li><strong>Tendencia general:</strong> ¿Está lloviendo más o menos a lo largo de los años?</li>
            <li><strong>Patrones estacionales:</strong> ¿Qué meses conforman la temporada de lluvias y la temporada seca en la zona del Antisana?</li>
        </ul>
        <p>
          Una vez que Prophet aprende estos patrones, puede proyectarlos hacia el futuro para darnos una predicción bastante acertada de lo que está por venir.
        </p>
      </div>

      <div className="modelos-content">
        <ModelPost
          title="Nuestro Modelo para Predecir las Lluvias"
          icon="🌦️"
          description="Este primer código es nuestra plantilla para analizar las precipitaciones. Está diseñado como una función reutilizable: le das la ruta de un archivo CSV con datos de lluvia y automáticamente genera los gráficos y las predicciones. Esto nos permite analizar cualquiera de nuestras estaciones pluviales con el mismo código."
          code={prophetPrecipitacionCode}
          language="python"
          animationDelay={0.4}
        />

        <ModelPost
          title="Nuestro Modelo para Predecir el Caudal de los Ríos"
          icon="💧"
          description="Este segundo script está optimizado para el caudal de los ríos. Aunque la estructura es muy similar, notarás que los parámetros del modelo Prophet son diferentes, ya que el comportamiento de un río no es igual al de la lluvia. Este código también es una plantilla: podemos usarlo con los datos de cualquier estación que mida caudales."
          code={prophetCaudalCode}
          language="python"
          animationDelay={0.6}
        />

        {/* NUEVA SECCIÓN: Modelo para Predecir la Temperatura */}
        <ModelPost
          title="Nuestro Modelo para Predecir la Temperatura"
          icon="🌡️"
          description="Este código es para predecir las temperaturas. Al igual que los otros modelos, utiliza Prophet, pero con configuraciones específicas para capturar los patrones térmicos. Nos ayuda a entender las variaciones estacionales y a prepararnos para periodos de frío o calor, aplicando el mismo proceso a los datos de temperatura de cualquier estación."
          code={prophetTemperaturaCode}
          language="python"
          animationDelay={0.8}
        />
      </div>

      {/* NUEVA SECCIÓN: Visita Nuestro Código en GitHub */}
      <GithubSection
        githubLink="https://github.com/ChrisCueva3693/Antisana"
        animationDelay={1.0} // Un poco de retardo para que aparezca después de los ModelPosts
      />

      <footer className="modelos-footer">
        <p>¡Y así es como funciona! En el proyecto Antisana - Guardián del Agua, hemos creado una caja de herramientas de predicción flexible y poderosa. Esto nos permite monitorear eficientemente múltiples puntos de nuestra región y ser verdaderos guardianes del ciclo del agua.</p>
      </footer>
    </div>
  );
}