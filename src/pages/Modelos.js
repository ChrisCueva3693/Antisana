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
const ModelPost = ({ title, icon, description, code, language }) => (
  <article className="model-post">
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

export default function Modelos() {
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
        />

        <ModelPost 
          title="Nuestro Modelo para Predecir el Caudal de los Ríos"
          icon="💧"
          description="Este segundo script está optimizado para el caudal de los ríos. Aunque la estructura es muy similar, notarás que los parámetros del modelo Prophet son diferentes, ya que el comportamiento de un río no es igual al de la lluvia. Este código también es una plantilla: podemos usarlo con los datos de cualquier estación que mida caudales."
          code={prophetCaudalCode}
          language="python"
        />
      </div>

      <footer className="modelos-footer">
        <p>¡Y así es como funciona! En el proyecto Antisana - Guardián del Agua, hemos creado una caja de herramientas de predicción flexible y poderosa. Esto nos permite monitorear eficientemente múltiples puntos de nuestra región y ser verdaderos guardianes del ciclo del agua.</p>
      </footer>
    </div>
  );
}

/* Asegúrate de que tu archivo Modelos.css contenga los siguientes estilos.
  He añadido la clase .info-section y sus estilos correspondientes.
*/
/*
.modelos-page-container {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 30px; 
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.modelos-hero-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  border-radius: 15px;
  color: white;
}

.modelos-hero-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.modelos-hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.95;
}

.info-section {
    background-color: #f8f9fa;
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 50px;
    border: 1px solid #e9ecef;
}

.info-section h2 {
    font-size: 2rem;
    color: #333;
    border-bottom: 3px solid #00b894;
    padding-bottom: 10px;
    margin-top: 0;
    margin-bottom: 20px;
}

.info-section p, .info-section ul {
    color: #555;
    line-height: 1.7;
    font-size: 1.1rem;
    margin-bottom: 15px;
}

.info-section ul {
    padding-left: 20px;
}

.info-section strong {
    color: #000;
}

.modelos-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.model-post {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.model-post:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.post-header {
  background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  color: white;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.post-icon {
  font-size: 2.5rem;
}

.post-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
}

.post-content {
  padding: 30px;
}

.post-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 25px;
}

.code-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  border-left: 4px solid #00b894;
  padding-left: 15px;
}

.code-block-container {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.code-block-container pre {
  margin: 0 !important;
  font-size: 0.9rem !important;
  line-height: 1.4 !important;
}

.modelos-footer {
  text-align: center;
  padding: 40px 20px;
  margin-top: 50px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 2px solid #e9ecef;
}

.modelos-footer p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .modelos-hero-title {
    font-size: 2rem;
  }
  
  .modelos-hero-subtitle {
    font-size: 1rem;
  }

  .info-section h2 {
    font-size: 1.6rem;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-content {
    padding: 20px;
  }
  
  .modelos-page-container {
    padding: 15px;
  }
}
*/