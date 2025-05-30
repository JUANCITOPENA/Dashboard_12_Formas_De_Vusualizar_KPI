# Mejoras finales:
# - Asegurar datos para todas las regiones (incluyendo Latinoamérica)
# - Ajustar distribución para que haya más ganancias que pérdidas
# - Añadir regiones faltantes y garantizar cobertura

import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random

# Configuración
start_date = datetime(2022, 1, 1)
end_date = datetime(2025, 5, 30)
channels = ['directo', 'organico', 'pagado', 'referencia']
regions = ['africa', 'america_norte', 'america_sur', 'asia', 'europa', 'oceania', 'latinoamerica']
channel_display_names = {
    'directo': 'Directo',
    'organico': 'Búsqueda Orgánica',
    'pagado': 'Búsqueda Pagada',
    'referencia': 'Referencia'
}

# Crear rango de fechas
dates = pd.date_range(start=start_date, end=end_date)

# Generar datos con cobertura garantizada por región
data = []
for date in dates:
    for region in regions:
        value = random.randint(2000, 6000)  # valores mayores para más ganancias
        data.append({
            'date': date.strftime('%Y-%m-%d'),
            'value': value,
            'channel': random.choice(channels),
            'region': region
        })

df = pd.DataFrame(data)

# KPI Summary
total_revenue = df['value'].sum()
target_value = total_revenue * 1.05  # más conservador
overall_target = total_revenue * 1.2
change_last_month = round(np.random.uniform(3, 12), 1)  # positiva
progress_to_target = round((total_revenue / overall_target) * 100, 1)

kpiSummary = {
    "totalRevenue": int(total_revenue),
    "changeFromLastMonth": change_last_month,
    "currency": "$",
    "targetValue": int(target_value),
    "progressToOverallTarget": progress_to_target,
    "overallTarget": int(overall_target)
}

# Canal Data
channel_data = []
for channel in channels:
    total = df[df['channel'] == channel]['value'].sum()
    percent = (total / total_revenue) * 100
    channel_data.append({
        "name": channel_display_names[channel],
        "value": round(percent, 1),
        "channel": channel
    })

# Stacked Combo por trimestre
df['quarter'] = pd.to_datetime(df['date']).dt.to_period('Q')
combo = df.groupby('quarter')['value'].sum().reset_index()
combo['quarter'] = combo['quarter'].astype(str)

stackedComboData = {
    "categories": combo['quarter'].tolist(),
    "series": [
        {"name": "Ventas", "type": "column", "data": combo['value'].apply(int).tolist()},
        {"name": "Costos", "type": "column", "data": combo['value'].apply(lambda x: int(x * 0.35)).tolist()},
        {"name": "Beneficio", "type": "line", "data": combo['value'].apply(lambda x: int(x * 0.65)).tolist()}
    ]
}

# Boxplot por región
boxplotData = []
region_labels = {
    'africa': 'AFRICA',
    'america_norte': 'AMERICA NORTE',
    'america_sur': 'AMERICA SUR',
    'latinoamerica': 'LATINOAMÉRICA',
    'asia': 'ASIA',
    'europa': 'EUROPA',
    'oceania': 'OCEANIA'
}
for region_key, region_name in region_labels.items():
    values = df[df['region'] == region_key]['value']
    if len(values) > 0:
        stats = np.percentile(values, [0, 25, 50, 75, 100])
        boxplotData.append({"x": region_name, "y": [int(x) for x in stats]})

# Stacked bar 100 (simulado)
stackedBar100Data = {
    "categories": ["Q1", "Q2", "Q3", "Q4"],
    "series": [
        {"name": "Producto A", "data": [44, 42, 47, 45]},
        {"name": "Producto B", "data": [33, 35, 30, 32]},
        {"name": "Producto C", "data": [23, 23, 23, 23]}
    ]
}

stackedArea100Data = {
    "seriesFactors": [
        {"name": "Mayoristas", "factor": 0.35, "base": 30},
        {"name": "Minoristas", "factor": 0.3, "base": 25},
        {"name": "Almacenes", "factor": 0.2, "base": 20},
        {"name": "Online", "factor": 0.1, "base": 15},
        {"name": "Distribuidores", "factor": 0.05, "base": 10}
    ],
    "numPoints": 15,
    "startDate": start_date.strftime('%Y-%m-%d')
}

# Productos reales
productos = ["Smartphones", "Laptops", "Televisores", "Consolas", "Ropa", "Calzado", "Muebles", "Refrigeradores", "Lavadoras", "Accesorios"]
actual = [random.randint(200000, 1000000) for _ in productos]
anterior = [int(x * random.uniform(0.85, 0.95)) for x in actual]  # ganancias reales

productCategoryRevenue = {
    "categories": productos,
    "series": [
        {"name": "Actual", "data": actual},
        {"name": "Anterior", "data": anterior}
    ],
    "totalCurrentPeriod": sum(actual),
    "totalPreviousPeriod": sum(anterior)
}

# Compilar
final_data = {
    "kpiSummary": kpiSummary,
    "timeSeriesData": df[['date', 'value', 'channel', 'region']].to_dict(orient='records'),
    "channelData": channel_data,
    "stackedComboData": stackedComboData,
    "boxplotData": boxplotData,
    "trendlineTargetRangeData": [],
    "progressLineTrendValue": int(total_revenue * 0.6),
    "stackedBar100Data": stackedBar100Data,
    "stackedArea100Data": stackedArea100Data,
    "productCategoryRevenue": productCategoryRevenue
}

with open('data1.json', 'w', encoding='utf-8') as f:
    json.dump(final_data, f, indent=2)

print("✅ data.json generado exitosamente con todas las regiones, productos reales y ganancias consistentes.")
