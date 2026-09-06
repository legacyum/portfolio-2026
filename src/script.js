/* ==========================================================================
   Alessandro Altamirano — Portfolio Interactive Script
   CLI Engine, View Toggling, i18n Translation, Theme Switcher & Contact Handler
   ========================================================================== */
// --- Translation Dictionary (i18n) ---
const T = {
  es: {
    profile: '// perfil profesional',
    available: 'Disponible para oportunidades',
    role: 'Industrial Engineering<br><span>Data · Automation · Operations<br>Supply Chain · Logística · Planeamiento</span>',
    aboutNav: 'acerca de mí',
    casesNav: 'casos de estudio',
    recruiterNav: 'vista reclutador',
    credentialsNav: 'formación & herramientas',
    contactNav: 'contacto',
    catNav: 'gatito 3D',
    recruiterMode: 'modo reclutador',
    hero: 'Convierto procesos<br><em class="accent">en sistemas más claros.</em>',
    lead: 'Ingeniero Industrial en formación con experiencia en análisis de datos, automatización, operaciones, Supply Chain y planeamiento.',
    invoices: 'facturas gestionadas<br>por semana',
    costs: 'costos por<br>desabastecimiento',
    time: 'tiempo de descarga<br>optimizado',
    explore: 'explorar casos',
    download: 'ver CV',
    downloadCv: 'descargar',
    viewStar: 'ver desglose técnico STAR',
    simEyebrow: '// process_simulator',
    simTitle: 'Calculadora de Impacto Operativo',
    simIntro: 'Simula el impacto de automatizar flujos y digitalizar procesos en tu operación.',
    simVolLabel: 'Volumen semanal de registros / facturas',
    simTimeLabel: 'Tiempo promedio por tarea manual',
    simAutoLabel: 'Nivel de automatización objetivo',
    simPresetLabel: 'Escenarios rápidos:',
    simStatHours: 'Horas hombre ahorradas al mes',
    simSubHours: '≈ 12 jornadas laborales recuperadas',
    simStatSpeed: 'Velocidad de procesamiento',
    simSubSpeed: 'Reducción del 75% en tiempo de ciclo',
    simStatSavings: 'Ahorro operativo estimado',
    simSubSavings: 'Basado en costo estándar de $10/hora',
    cases: 'Casos de estudio',
    caseIntro: 'Resultados aplicados en datos, automatización, analítica y operaciones.',
    primaxKicker: 'INTELIGENCIA COMERCIAL · PRIMAX ECUADOR',
    primaxTitle: 'Dashboard para visibilizar KPI comerciales',
    primaxText: 'Diseño de un dashboard interactivo en Power BI para monitorear desempeño de asesores, distribución regional y segmentación de clientes.',
    primaxResult: 'Información comercial más visible para el seguimiento operativo.',
    primaxScope: 'Proyecto de impacto interno · PRIMAX Ecuador',
    etlKicker: 'ETL & DATA PIPELINE · PYTHON',
    etlTitle: 'Automatización de reportes logísticos (ETL)',
    etlText: 'Pipeline en Python para extraer, limpiar, clasificar y consolidar datos operativos, generando reportes ejecutivos en Excel y despacho por correo.',
    etlDocsLabel: 'documentos clasificados',
    etlAmountLabel: 'monto consolidado',
    machineTitle: 'Análisis predictivo de fallas en máquinas',
    machineText: 'Modelo de Machine Learning e Inteligencia Artificial (regresión logística) para predecir fallas industriales.',
    mlKpiLabel: 'clasificación multivariable',
    mlCodeLabel: 'código modular',
    repository: 'ver repositorio',
    vasmadKicker: 'LOGÍSTICA · PROYECTO APLICADO',
    vasmadTitle: 'Optimización logística y automatización',
    vasmadText: 'Mapeo de procesos en Bizagi, eliminación de cuellos de botella, flujos automatizados para órdenes de compra y 5S.',
    costLabel: 'costos por desabastecimiento',
    timeLabel: 'tiempo de descarga',
    cosmosKicker: '3D WEBGL & ASTROFÍSICA · THREE.JS',
    cosmosTitle: 'Cosmic Atlas — Sistema Solar Interactivo 3D',
    cosmosText: 'Simulación orbital interactiva con texturas de alta resolución, cálculo de órbitas, shaders de atmósfera y controles cinemáticos en WebGL.',
    cosmosFpsLabel: 'renderizado fluido',
    cosmosBodiesLabel: 'física & órbitas',
    launchCosmos: 'explorar en 3D',
    recruiterTitle: 'Perfil en 60 segundos',
    back: 'volver a terminal',
    focus: 'Enfoque',
    focusText: '<strong>Datos · Automatización · Operaciones</strong><br>Supply Chain, Bizagi (BPMN), analítica avanzada, Excel y automatización con Inteligencia Artificial (IA) para optimizar procesos y reducir costos.',
    experience: 'Experiencia',
    experienceText: '<strong>PX Servicios Generales · PRIMAX Ecuador</strong><br>Practicante Preprofesional de Gestión Documental · nov. 2025 — abr. 2026<br><br><strong>PMO · Comunidad Estudiantil PMI</strong><br>Dirección de Proyectos · nov. 2025 — ago. 2026',
    contactMe: 'contactarme',
    terminalTitle: 'Explora el perfil',
    terminalIntro: 'Usa la terminal para conocer más o escribe un comando.',
    clear: 'limpiar',
    welcome: 'Bienvenido.',
    welcomeText: 'Este es mi espacio de trabajo digital.',
    helpStart: 'Escribe <button class="quick-run" type="button" data-run="help">help</button> para ver los comandos disponibles.',
    quick: 'Comandos rápidos',
    credentials: 'Formación y herramientas',
    credIntro: 'Base técnica con foco en la mejora continua y certificaciones verificables.',
    education: 'EDUCACIÓN & GESTIÓN',
    degree: 'Ingeniería Industrial',
    university: 'Universidad Continental · 2022 — presente<br>Décimo ciclo',
    pmoDesc: '<strong>Miembro del Equipo PMO</strong><br>Comunidad Estudiantil PMI · nov. 2025 — ago. 2026<br><small class="muted">Planificación, control de cronogramas y metodología PMBOK.</small>',
    languages: 'Español nativo · Inglés intermedio',
    certPyTitle: 'Python para Análisis de Datos',
    certPySkills: 'Pandas · NumPy · Automatización · Scripting',
    certBiTitle: 'Power BI para Business Intelligence',
    certBiSkills: 'DAX · Power Query · Modelado Dimensional · Dashboards KPI',
    certExcelTitle: 'Excel Avanzado & Automatización',
    certExcelSkills: 'Tablas dinámicas · Fórmulas avanzadas · Macros/VBA · Análisis',
    certTradeTitle: 'Comercio Internacional y Logística',
    certTradeSkills: 'Importación · Exportación · Cadena de Suministro · Aduanas',
    contactTitle: '¿Tienes un reto?<br><em class="accent">Conversemos.</em>',
    contactIntro: 'Si buscas mejorar la visibilidad de datos, automatizar una tarea operativa o estructurar un proceso, escríbeme.',
    name: 'Nombre',
    email: 'Correo',
    message: 'Mensaje',
    send: 'abrir correo',
    note: 'Se abrirá tu cliente de correo; no almacenamos datos.',
    footer: 'Diseñado con intención, datos y café.',
    termsNav: 'términos & privacidad',
    copiedToast: '✓ Copiado al portapapeles',
    lanyardRole: 'Ingeniería Industrial · Data & Ops',
    lanyardQr: 'ESCANEAR LINKEDIN ↗',
        lanyardHint: '✦ ARRASTRA / TIRA DE LA CREDENCIAL',
    lanyardStageAria: 'Credencial interactiva 3D de Alessandro Altamirano',
    lanyardCardAria: 'Credencial física 3D de Alessandro Altamirano. Arrastra o gira la tarjeta.',
    lanyardFlipAria: 'Girar credencial para ver reverso',
    lanyardBackAria: 'Volver al frente de la credencial',
    terminalAiTitle: 'Alternar Bitácora Técnica',
    terminalInputPh: 'escribe un comando...',
    inProgressBadge: '● En curso (10° Ciclo)',
    lanyardFlipBtn: 'GIRAR CREDENCIAL / FLIP 3D',
    lanyardBackFlipBtn: 'VOLVER AL FRENTE',
    lanyardEduLabel: 'UNIVERSIDAD:',
    lanyardSpecLabel: 'ENFOQUE:',
    lanyardCoreLabel: 'CORE:',
    lanyardStatusLabel: 'ESTADO:',
    lanyardStatusVal: 'Disponible para retos',
    terminalModeLog: 'BITÁCORA',
    logPromptsTitle: '// BITÁCORAS & NOTAS DE CAMPO:',
    logChipPrimax: 'cat primax_log.md',
    logChipEtl: 'cat etl_pipeline.py',
    logChipVasmad: 'cat vasmad_mrp.md',
    logChipBizagi: 'cat bizagi_bpmn.md',
    logChipMl: 'cat ml_telemetry.py'
  },
  en: {
    profile: '// professional profile',
    available: 'Open to opportunities',
    role: 'Industrial Engineering<br><span>Data · Automation · Operations<br>Supply Chain · Logistics · Planning</span>',
    aboutNav: 'about me',
    casesNav: 'case studies',
    recruiterNav: 'recruiter view',
    credentialsNav: 'education & tools',
    contactNav: 'contact',
    catNav: '3D cat',
    recruiterMode: 'recruiter mode',
    hero: 'I turn processes<br><em class="accent">into clearer systems.</em>',
    lead: 'Industrial Engineering student with experience in data analytics, automation, operations, Supply Chain, and planning.',
    invoices: 'invoices handled<br>per week',
    costs: 'stockout costs<br>reduced',
    time: 'unloading time<br>optimized',
    explore: 'explore cases',
    download: 'view CV',
    downloadCv: 'download',
    viewStar: 'view technical STAR breakdown',
    simEyebrow: '// process_simulator',
    simTitle: 'Operational Impact Calculator',
    simIntro: 'Simulate the impact of workflow automation and digitizing processes in your operation.',
    simVolLabel: 'Weekly volume of invoices / records',
    simTimeLabel: 'Average time per manual task',
    simAutoLabel: 'Target automation rate',
    simPresetLabel: 'Quick scenarios:',
    simStatHours: 'Man-hours saved per month',
    simSubHours: '≈ 12 recovered work shifts',
    simStatSpeed: 'Processing speedup',
    simSubSpeed: '75% cycle time reduction',
    simStatSavings: 'Estimated operational savings',
    simSubSavings: 'Based on standard $10/hour baseline',
    cases: 'Case studies',
    caseIntro: 'Applied outcomes in data, automation, analytics and operations.',
    primaxKicker: 'COMMERCIAL INTELLIGENCE · PRIMAX ECUADOR',
    primaxTitle: 'Dashboard to make commercial KPIs visible',
    primaxText: 'Designed an interactive Power BI dashboard to monitor advisor performance, regional distribution and customer segmentation.',
    primaxResult: 'More visible commercial information for operational follow-up.',
    primaxScope: 'Internal Corporate Project · PRIMAX Ecuador',
    etlKicker: 'ETL & DATA PIPELINE · PYTHON',
    etlTitle: 'Logistics Reporting Automation (ETL)',
    etlText: 'Python pipeline to extract, clean, classify and consolidate operational data, generating executive Excel reports and email dispatch.',
    etlDocsLabel: 'documents classified',
    etlAmountLabel: 'consolidated value',
    machineTitle: 'Predictive analysis of machine failures',
    machineText: 'Machine Learning and Artificial Intelligence (logistic regression) model analyzing sensor data to predict industrial machine failures.',
    mlKpiLabel: 'multivariate classification',
    mlCodeLabel: 'modular code',
    repository: 'view repository',
    vasmadKicker: 'LOGISTICS · APPLIED PROJECT',
    vasmadTitle: 'Logistics optimization and automation',
    vasmadText: 'Bizagi process modeling, bottleneck analysis, automated purchase-order workflows and 5S application in operations.',
    costLabel: 'stockout costs',
    timeLabel: 'unloading time',
    cosmosKicker: '3D WEBGL & ASTROPHYSICS · THREE.JS',
    cosmosTitle: 'Cosmic Atlas — Interactive 3D Solar System',
    cosmosText: 'Interactive orbital simulation featuring high-resolution planet textures, orbital physics, atmosphere shaders, and cinematic WebGL controls.',
    cosmosFpsLabel: 'smooth rendering',
    cosmosBodiesLabel: 'physics & orbits',
    launchCosmos: 'explore in 3D',
    recruiterTitle: 'Profile in 60 seconds',
    back: 'back to terminal',
    focus: 'Focus',
    focusText: '<strong>Data · Automation · Operations</strong><br>Supply Chain, Bizagi (BPMN), advanced analytics, Excel, and AI-driven automation workflows to drive decision-making and reduce costs.',
    experience: 'Experience',
    experienceText: '<strong>PX Servicios Generales · PRIMAX Ecuador</strong><br>Document Management Intern · Nov 2025 — Apr 2026<br><br><strong>PMO · PMI Student Community</strong><br>Project Management · Nov 2025 — Aug 2026',
    contactMe: 'contact me',
    terminalTitle: 'Explore the profile',
    terminalIntro: 'Use the terminal to learn more or type a command.',
    clear: 'clear',
    welcome: 'Welcome.',
    welcomeText: 'This is my digital workspace.',
    helpStart: 'Type <button class="quick-run" type="button" data-run="help">help</button> to see available commands.',
    quick: 'Quick commands',
    credentials: 'Education and tools',
    credIntro: 'A technical foundation focused on continuous improvement and verified credentials.',
    education: 'EDUCATION & MANAGEMENT',
    degree: 'Industrial Engineering',
    university: 'Universidad Continental · 2022 — present<br>10th semester',
    pmoDesc: '<strong>PMO Team Member</strong><br>PMI Student Community · Nov 2025 — Aug 2026<br><small class="muted">Planning, schedule control and PMBOK methodology.</small>',
    languages: 'Native Spanish · Intermediate English',
    certPyTitle: 'Python for Data Analytics',
    certPySkills: 'Pandas · NumPy · Automation · Scripting',
    certBiTitle: 'Power BI for Business Intelligence',
    certBiSkills: 'DAX · Power Query · Dimensional Modeling · KPI Dashboards',
    certExcelTitle: 'Advanced Excel & Automation',
    certExcelSkills: 'Pivot tables · Advanced formulas · Macros/VBA · Data analysis',
    certTradeTitle: 'International Trade & Logistics',
    certTradeSkills: 'Imports · Exports · Supply Chain · Customs',
    contactTitle: 'Have a challenge?<br><em class="accent">Let’s talk.</em>',
    contactIntro: 'If you want to make data more visible, automate an operational task or structure a process, get in touch.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'open email',
    note: 'Your email app will open; no data is stored.',
    footer: 'Designed with intention, data and coffee.',
    termsNav: 'terms & privacy',
    copiedToast: '✓ Copied to clipboard',
    lanyardRole: 'Industrial Engineering · Data & Ops',
    lanyardQr: 'SCAN LINKEDIN ↗',
        lanyardHint: '✦ DRAG / TOSS THE ID BADGE',
    lanyardStageAria: 'Interactive 3D ID badge for Alessandro Altamirano',
    lanyardCardAria: 'Physical 3D ID badge for Alessandro Altamirano. Drag or flip the card.',
    lanyardFlipAria: 'Flip badge to see the back',
    lanyardBackAria: 'Return to the front of the badge',
    terminalAiTitle: 'Toggle technical log mode',
    terminalInputPh: 'type a command...',
    inProgressBadge: '● In progress (10th cycle)',
    lanyardFlipBtn: 'FLIP BADGE 3D',
    lanyardBackFlipBtn: 'FLIP TO FRONT',
    lanyardEduLabel: 'UNIVERSITY:',
    lanyardSpecLabel: 'FOCUS:',
    lanyardCoreLabel: 'CORE:',
    lanyardStatusLabel: 'STATUS:',
    lanyardStatusVal: 'Available for opportunities',
    terminalModeLog: 'DEV LOGS',
    logPromptsTitle: '// FIELD LOGS & DEV NOTES:',
    logChipPrimax: 'cat primax_log.md',
    logChipEtl: 'cat etl_pipeline.py',
    logChipVasmad: 'cat vasmad_mrp.md',
    logChipBizagi: 'cat bizagi_bpmn.md',
    logChipMl: 'cat ml_telemetry.py'
  }
};

// --- STAR Method Deep Dive Case Details Dictionary ---
const CASE_DETAILS = {
  es: {
    primax: {
      kicker: 'INTELIGENCIA COMERCIAL & GESTIÓN DOCUMENTAL · PRIMAX ECUADOR',
      title: 'Dashboard de Control Comercial y Validación Masiva B2B',
      subtitle: 'Gestión documental de alto volumen, analítica en Power BI y control transaccional en SAP ERP.',
      situation: 'Gestión y validación semanal de 100–200 facturas de combustible y transporte en portales B2B. Los datos comerciales se encontraban dispersos entre múltiples asesores y regiones, generando demoras en la consolidación gerencial y riesgos de desvíos en los estrictos SLAs documentarios.',
      task: 'Estandarizar el flujo de auditoría documental, asegurar el cumplimiento del 100% en SLA y centralizar los KPIs de ventas, desempeño por asesor y segmentación de clientes en una única fuente de verdad analítica.',
      action: 'Diseño y modelado dimensional en Power BI con Power Query y medidas DAX avanzadas; automatización de limpieza y consolidación de reportes diarios en Excel y scripts de apoyo; conciliación y cruce de datos financieros en SAP ERP y Primax Solutions.',
      result: '100% de cumplimiento en SLA documentario sin observaciones de auditoría; visibilidad inmediata de métricas comerciales para la gerencia y drástica reducción de horas hombre en consolidación manual de reportes.',
      tags: ['Power BI', 'Power Query', 'DAX', 'Python', 'SAP ERP', 'Excel Avanzado', 'Portales B2B', 'SLA Control']
    },
    etl: {
      kicker: 'AUTOMATIZACIÓN ETL & REPORTES LOGÍSTICOS · PYTHON',
      title: 'Pipeline ETL para Automatización de Reportes Operativos',
      subtitle: 'Procesamiento masivo de 48,000+ documentos, generación de Excel enriquecido y despacho por correo.',
      situation: 'El procesamiento de reportes operativos y logísticos requería consolidar manualmente decenas de miles de registros desde archivos crudos, generando lentitud, alta carga operativa y riesgos de errores en la clasificación de estados.',
      task: 'Diseñar e implementar un pipeline automatizado en Python que extraiga la data operativa cruda, limpie duplicados, clasifique estados y despache automáticamente un reporte ejecutivo formateado en Excel por email.',
      action: 'Desarrollo de pipeline modular con Pandas para ingesta y validación de tipos; lógica de clasificación automatizada (39,152 cerrados vs 9,681 pendientes); formateo visual y resumen financiero con OpenPyXL ($323M+ auditados); automatización de envío con módulo SMTP.',
      result: '48,833 documentos clasificados y consolidados en segundos con 0 errores de cálculo; reducción del 95% en tiempo de generación de reportes y distribución automática a stakeholders.',
      tags: ['Python', 'Pandas', 'OpenPyXL', 'SMTP', 'ETL', 'Automatización', 'Supply Chain', 'GitHub']
    },
    ml: {
      kicker: 'MACHINE LEARNING & IA INDUSTRIAL · REPOSITORIO GITHUB',
      title: 'Predicción Preventiva de Fallas en Maquinaria Industrial',
      subtitle: 'Modelo analítico de clasificación e Inteligencia Artificial para mantenimiento predictivo basado en telemetría de sensores.',
      situation: 'Las averías mecánicas imprevistas y el desgaste electromecánico en plantas industriales generan altos costos por inactividad y riesgos de paradas de línea imprevistas.',
      task: 'Construir un modelo analítico capaz de procesar telemetría multivariable de sensores (temperatura, torque, velocidad rotacional) y clasificar la probabilidad de fallo antes de que ocurra una avería catastrófica.',
      action: 'Análisis exploratorio de datos (EDA) en Python con Pandas y NumPy; balanceo de clases y normalización de variables; entrenamiento y evaluación de un modelo de Inteligencia Artificial (Regresión Logística con scikit-learn y curvas ROC-AUC); visualización en Matplotlib y Seaborn.',
      result: 'Detección temprana y precisa de patrones de fallo con código modular, reproducible y documentado en GitHub (legacyum/analisis-fallas-maquinas).',
      tags: ['Inteligencia Artificial (IA)', 'Python', 'scikit-learn', 'Machine Learning', 'Pandas', 'NumPy', 'Mantenimiento Predictivo', 'EDA', 'GitHub']
    },
    vasmad: {
      kicker: 'LOGÍSTICA, BIZAGI & MEJORA CONTINUA · DEYARLIN S.A.C. (VASMAD)',
      title: 'Reingeniería de Cadena de Suministro, Bizagi (BPMN) y 5S',
      subtitle: 'Modelado de procesos en Bizagi, optimización de inventarios con sistemas MRP/PAP, flujos automatizados de compras y estandarización Lean.',
      situation: 'Cuellos de botella recurrentes en el patio de recepción, demoras excesivas en tiempos de descarga de proveedores y riesgo continuo de quiebres de inventario por falta de visibilidad en la demanda.',
      task: 'Mapear procesos en Bizagi (BPMN), reducir los costos atribuibles a desabastecimiento, agilizar el tiempo de ciclo de descarga y automatizar la generación de órdenes de compra para materias primas críticas.',
      action: 'Diagramación de procesos AS-IS y TO-BE en Bizagi Modeler; estructuración de base de datos para planificación de requerimientos (MRP/PAP); creación de flujos automáticos en Power Automate para órdenes de compra; implementación de metodología Lean 5S en layout de almacenamiento.',
      result: '−15% en costos por desabastecimiento; −30% en tiempos de descarga de proveedores; estandarización operativa y trazabilidad total del stock.',
      tags: ['Bizagi (BPMN)', 'Power Automate', 'MRP / PAP', 'Lean 5S', 'Supply Chain', 'Modelado de Procesos', 'Gestión de Inventarios', 'Excel Avanzado']
    }
  },
  en: {
    primax: {
      kicker: 'COMMERCIAL INTELLIGENCE & DOCUMENT MANAGEMENT · PRIMAX ECUADOR',
      title: 'Commercial Control Dashboard & Massive B2B Validation',
      subtitle: 'High-volume document management, Power BI analytics and SAP ERP transactional control.',
      situation: 'Weekly processing and validation of 100–200 fuel and transport invoices across B2B portals. Commercial data was dispersed across advisors and regions, causing reporting delays and risks of SLA non-compliance.',
      task: 'Standardize document audit workflows, ensure 100% SLA compliance, and centralize sales KPIs, advisor performance, and customer segmentation into a single source of truth.',
      action: 'Dimensional data modeling in Power BI using Power Query and custom DAX measures; automated data cleaning and report consolidation in Excel/Python; financial reconciliation and data validation in SAP ERP and Primax Solutions.',
      result: '100% SLA document compliance with zero audit findings; real-time visibility into commercial metrics for management; drastic reduction in manual consolidation man-hours.',
      tags: ['Power BI', 'Power Query', 'DAX', 'Python', 'SAP ERP', 'Advanced Excel', 'B2B Portals', 'SLA Control']
    },
    etl: {
      kicker: 'ETL AUTOMATION & LOGISTICS REPORTING · PYTHON',
      title: 'ETL Pipeline for Automated Operations Reporting',
      subtitle: 'Massive processing of 48,000+ records, styled Excel workbook generation and automatic email dispatch.',
      situation: 'Manual generation of operational logistics reports required consolidating tens of thousands of raw entries, leading to slow turnaround and risks of misclassification.',
      task: 'Design and deploy an end-to-end automated Python pipeline to ingest raw data, clean duplicates, classify statuses and email executive formatted Excel reports.',
      action: 'Modular Python pipeline with Pandas for ingestion and schema enforcement; automated status classification (39,152 closed vs 9,681 pending); visual formatting and financial consolidation via OpenPyXL ($323M+ audited); automated distribution using Python SMTP module.',
      result: '48,833 documents classified and consolidated in seconds with 0 calculation errors; 95% report generation time reduction and hands-free distribution.',
      tags: ['Python', 'Pandas', 'OpenPyXL', 'SMTP', 'ETL', 'Automation', 'Supply Chain', 'GitHub']
    },
    ml: {
      kicker: 'INDUSTRIAL MACHINE LEARNING & AI · GITHUB REPOSITORY',
      title: 'Preventive Machine Failure Prediction in Industrial Equipment',
      subtitle: 'Classification and Artificial Intelligence model for predictive maintenance based on industrial sensor telemetry.',
      situation: 'Unplanned mechanical failures and electromechanical wear in industrial plants lead to severe downtime costs and unpredicted production line shutdowns.',
      task: 'Build a predictive AI model capable of processing multivariate sensor telemetry (temperature, torque, rotational speed) to classify failure probability before critical breakdown.',
      action: 'Exploratory Data Analysis (EDA) in Python using Pandas and NumPy; feature scaling and class normalization; Logistic Regression and AI training with scikit-learn and ROC-AUC curves; visualization in Matplotlib and Seaborn.',
      result: 'Accurate early detection of failure patterns with modular, reproducible code documented on GitHub (legacyum/analisis-fallas-maquinas).',
      tags: ['Artificial Intelligence (AI)', 'Python', 'Machine Learning', 'scikit-learn', 'Pandas', 'NumPy', 'Predictive Maintenance', 'EDA', 'GitHub']
    },
    vasmad: {
      kicker: 'LOGISTICS, BIZAGI & CONTINUOUS IMPROVEMENT · DEYARLIN S.A.C. (VASMAD)',
      title: 'Supply Chain Reengineering, Bizagi (BPMN) & 5S',
      subtitle: 'Bizagi process modeling, inventory optimization with MRP/PAP systems, automated purchasing flows and Lean standardization.',
      situation: 'Bottlenecks in the receiving bay, excessive supplier unloading times, and persistent risk of stockouts due to lack of visibility in material demand.',
      task: 'Map AS-IS / TO-BE processes in Bizagi (BPMN), reduce stockout costs, streamline unloading turnaround time, and automate purchase order generation for critical raw materials.',
      action: 'Process mapping and flow engineering in Bizagi Modeler; database restructuring for Materials Requirement Planning (MRP/PAP); building automated workflows in Power Automate for purchase orders; implementing 5S methodology across warehouse layout.',
      result: '−15% stockout cost reduction; −30% supplier unloading turnaround time; operational standardization and full inventory traceability.',
      tags: ['Bizagi (BPMN)', 'Power Automate', 'MRP / PAP', 'Lean 5S', 'Supply Chain', 'Process Modeling', 'Inventory Management', 'Advanced Excel']
    }
  }
};

// --- Terms & Conditions and Privacy Dictionary ---
const TERMS_CONTENT = {
  es: {
    kicker: 'AVISO LEGAL, TÉRMINOS & PRIVACIDAD',
    title: 'Términos de Uso y Política de Privacidad',
    subtitle: 'Marco de transparencia, confidencialidad profesional y protección de datos.',
    sections: [
      {
        title: '01 / Propósito del Sitio & Propiedad Intelectual',
        text: 'Este sitio web es un portafolio profesional y técnico perteneciente a <strong>Alessandro Altamirano</strong>. Su objetivo es exhibir proyectos, metodologías y competencias en Ingeniería Industrial, Supply Chain, analítica de datos (Power BI, SQL, Python) y automatización. Todo el código, diseño y redacción son de uso demostrativo e ilustrativo.'
      },
      {
        title: '02 / Privacidad & Protección de Datos',
        text: '<strong>No recopilamos ni almacenamos datos personales</strong> en bases de datos de terceros ni empleamos cookies de rastreo o publicidad. El formulario de contacto y los enlaces de correo utilizan protocolos directos del cliente (<code>mailto:</code>), garantizando que tu mensaje sea enviado únicamente desde tu propio gestor de correo.'
      },
      {
        title: '03 / Confidencialidad & Proyectos Corporativos',
        text: 'Los casos de estudio sobre empresas (ej. PRIMAX Ecuador, DEYARLIN S.A.C.) describen arquitecturas, metodologías (SLA, MRP, 5S) y porcentajes de impacto operativo con fines exclusivamente pedagógicos y profesionales. <strong>No se divulgan datos estratégicos, financieros confidenciales ni información sensible no autorizada</strong>.'
      },
      {
        title: '04 / Enlaces Externos & Credenciales Verificadas',
        text: 'Los enlaces dirigidos a servicios externos (LinkedIn, GitHub, Santander Open Academy, NASA Space Apps Challenge, Udemy, Anthropic) corresponden a repositorios y credenciales oficiales del autor y están sujetos a los términos de cada plataforma.'
      }
    ],
    note: 'Última actualización: 2026 · Lima, Perú (UTC−5)'
  },
  en: {
    kicker: 'LEGAL NOTICE, TERMS & PRIVACY',
    title: 'Terms of Use & Privacy Policy',
    subtitle: 'Transparency framework, professional confidentiality, and data protection.',
    sections: [
      {
        title: '01 / Site Purpose & Intellectual Property',
        text: 'This website is a professional portfolio by <strong>Alessandro Altamirano</strong>, designed to showcase competencies and projects in Industrial Engineering, Supply Chain, data analytics (Power BI, SQL, Python), and automation. Design, code, and content are illustrative.'
      },
      {
        title: '02 / Privacy & Data Protection',
        text: '<strong>We do not collect or store personal data</strong> on third-party servers, nor do we use tracking cookies. The contact form and email links rely directly on client-side <code>mailto:</code> protocols, ensuring your communications remain private within your email client.'
      },
      {
        title: '03 / Corporate Confidentiality & Case Studies',
        text: 'Case studies referencing corporate environments (e.g. PRIMAX Ecuador, DEYARLIN S.A.C.) present generalized methodologies, architectures, and relative impact metrics for demonstration purposes. <strong>No sensitive, proprietary, or confidential data is exposed</strong>.'
      },
      {
        title: '04 / External Links & Verified Credentials',
        text: 'Links to external services (LinkedIn, GitHub, Santander Open Academy, NASA Space Apps, Udemy, Anthropic) point to verified assets and credentials, subject to each platform’s respective policies.'
      }
    ],
    note: 'Last updated: 2026 · Lima, Peru (UTC−5)'
  }
};

// --- Application State ---
let lang = 'es';
let history = [];
let index = -1;
let draftInput = '';
let theme = 0;
let isAiMode = false;

// --- DOM Element Selection (Interface Contracts) ---
const body = document.body;
const out = document.querySelector('#output');
const input = document.querySelector('#input');
const view = document.querySelector('#view');
const recruiter = document.querySelector('#recruiter');

// --- CLI Commands Content Dictionary ---
const C = {
  es: {
    help: [
      'COMANDOS DISPONIBLES',
      '<ul class="out-list"><li><strong>about</strong> — resumen profesional.</li><li><strong>experience</strong> — experiencia en PRIMAX y PMO.</li><li><strong>simulate</strong> — calculadora interactiva de impacto ROI.</li><li><strong>cases</strong> — casos de estudio.</li><li><strong>case [primax|etl|ml|vasmad]</strong> — desglose técnico STAR detallado.</li><li><strong>stats</strong> — métricas e impacto cuantitativo.</li><li><strong>skills</strong> — herramientas técnicas.</li><li><strong>education</strong> — formación y credenciales verificadas.</li><li><strong>contact</strong> — canales para conectar.</li><li><strong>recruiter</strong> — vista rápida para reclutadores.</li><li><strong>terms</strong> — aviso legal, términos y política de privacidad.</li><li><strong>cv</strong> — abrir visor modal de CV. Presiona Tab para autocompletar.</li></ul>'
    ],
    about: [
      'SOBRE MÍ',
      '<p>Estudiante de <span class="green">Ingeniería Industrial</span> (décimo ciclo) en la Universidad Continental. Combino <span class="green">análisis de datos, automatización y control de operaciones</span> con sólida formación en <span class="green">Supply Chain, logística y planeamiento de inventarios (MRP)</span>.</p><p>Experiencia en gestión documental de alto volumen B2B, SAP ERP y Dirección de Proyectos (PMO) bajo estándares PMI / PMBOK.</p>'
    ],
    experience: [
      'EXPERIENCIA / 2025 — 2026',
      '<p><span class="green">Practicante Preprofesional de Gestión Documental</span><br>PX Servicios Generales · PRIMAX Ecuador · Lima, Perú (nov. 2025 — abr. 2026)</p><ul class="out-list"><li>Registro y validación de <strong>100–200 facturas semanales</strong> en portales B2B.</li><li>Dashboard en <strong>Power BI</strong> para KPI comerciales, asesores, regiones y clientes.</li><li>Automatización de extracción, limpieza y consolidación de reportes diarios en Excel.</li><li>Procesos transaccionales en SAP y Primax Solutions.</li></ul><p style="margin-top:14px;"><span class="green">Miembro del Equipo de Dirección de Proyectos (PMO)</span><br>Comunidad Estudiantil PMI · Lima, Perú (nov. 2025 — ago. 2026)</p><ul class="out-list"><li>Planificación, seguimiento y control de proyectos internos bajo estándares PMI / PMBOK.</li><li>Gestión de cronogramas, entregables y comunicación interdepartamental.</li></ul>'
    ],
    simulate: [
      'CALCULADORA DE IMPACTO OPERATIVO (ROI)',
      '<p>Usa <code>simulate</code> para ejecutar el modelo de ROI en consola o personaliza los parámetros con: <code>simulate [volumen] [minutos] [porcentaje_auto]</code> (ej. <code>simulate 300 10 70</code>).</p>'
    ],
    stats: [
      'MÉTRICAS & IMPACTO CUANTITATIVO',
      '<ul class="out-list"><li><strong>100–200</strong> facturas semanales gestionadas bajo SLA estricto.</li><li><strong>48,833</strong> documentos clasificados vía ETL en Python ($323M+ USD consolidados).</li><li><strong>−15%</strong> reducción de costos por desabastecimiento con control MRP.</li><li><strong>−30%</strong> optimización de tiempos en procesos logísticos.</li><li><strong>~97.4 h/mes</strong> ahorro promedio de horas en flujos automatizados con Power Automate y Python.</li></ul>'
    ],
    cases: [
      'CASOS DE ESTUDIO',
      '<ul class="out-list"><li><strong>01 / Power BI:</strong> dashboard comercial interno para PRIMAX Ecuador. Escribe <code>case primax</code> para desglose STAR.</li><li><strong>02 / ETL Logística:</strong> automatización de 48K+ docs en Python ($323M+ USD). <a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/PROYECTO_ETL_LOGISTICA">GitHub ↗</a> · Escribe <code>case etl</code>.</li><li><strong>03 / Machine Learning:</strong> predicción de fallas con regresión logística. <a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/analisis-fallas-maquinas">GitHub ↗</a> · Escribe <code>case ml</code>.</li><li><strong>04 / Mejora Continua:</strong> −15% costos y −30% tiempo en VASMAD. Escribe <code>case vasmad</code>.</li></ul>'
    ],
    skills: [
      'STACK TÉCNICO & DOMINIOS',
      '<div class="out-grid"><p><span>Supply Chain &amp; Bizagi</span>MRP / PAP, gestión de inventarios, Bizagi (BPMN AS-IS/TO-BE), optimización de flujos, logística internacional, 5S y Lean.</p><p><span>Análisis &amp; BI</span>Power BI, Power Query, DAX, Excel Avanzado (VBA/Macros/Modelado financiero), SQL, KPIs operativos y comerciales.</p><p><span>Automatización &amp; IA</span>Python, Inteligencia Artificial (IA / Machine Learning), Prompt Engineering (Claude / GPT), pipelines ETL, Power Automate, n8n.</p><p><span>Gestión &amp; PMO</span>Metodología PMBOK, Bizagi Modeler, SAP ERP, control de cronogramas y entregables, gestión documental B2B.</p></div>'
    ],
    education: [
      'FORMACIÓN & CREDENCIALES VERIFICADAS',
      '<ul class="out-list"><li><strong>Ingeniería Industrial</strong> — Universidad Continental, 2022 — presente. Décimo ciclo.</li><li><strong>PMO:</strong> Dirección de Proyectos en Comunidad Estudiantil PMI (2025 — 2026).</li><li><strong>Python para Análisis de Datos:</strong> Santander Open Academy <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1cQc80EHDGVL-HHTvodDKgtxesuoVq0IT/view?usp=sharing">credencial ↗</a></li><li><strong>Power BI para BI:</strong> Santander Open Academy <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1jqEA5AxWUhB4RaCrlOAuPybT3x-dP993/view?usp=sharing">credencial ↗</a></li><li><strong>Excel Avanzado & Automatización:</strong> Fundación Telefónica <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1thaxesW5lzO6yov0ce5aqxhTkFfruI2j/view?usp=sharing">credencial ↗</a></li><li><strong>Comercio Internacional & Logística:</strong> Udemy <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1VJO_tBVTvv6llyoNRzwT90XEhjDDzB2H/view?usp=sharing">credencial ↗</a></li><li><strong>Galactic Problem Solver:</strong> NASA Space Apps Challenge <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1zkQ49YxqPnr1A7bpui4AeKSvIUpMw0BJ/view?usp=sharing">credencial ↗</a></li><li><strong>Claude Code in Action:</strong> Anthropic (Automatización con IA) <a class="out-link" target="_blank" rel="noreferrer" href="https://verify.skilljar.com/c/aeqidtgg2pe2">credencial ↗</a></li></ul>'
    ],
    contact: [
      'CONECTEMOS',
      '<p>¿Tienes un reto de datos, automatización u operaciones? Conversemos.</p><ul class="out-list"><li>email: <a class="out-link" href="mailto:alessandro.altamirano23@gmail.com">alessandro.altamirano23@gmail.com</a></li><li>teléfono: <a class="out-link" href="tel:+51944521832">+51 944 521 832</a></li><li>LinkedIn: <a class="out-link" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/alessandroaltamirano">alessandroaltamirano ↗</a></li></ul>'
    ],
    terms: [
      'AVISO LEGAL & POLÍTICA DE PRIVACIDAD',
      '<p>Este sitio web es un portafolio profesional de carácter técnico y demostrativo perteneciente a <span class="green">Alessandro Altamirano</span>.</p><ul class="out-list"><li><strong>Privacidad:</strong> no se recopilan ni almacenan datos personales; el contacto opera exclusivamente mediante <code>mailto:</code>.</li><li><strong>Confidencialidad:</strong> proyectos corporativos presentados bajo abstracción metodológica sin datos sensibles.</li><li><strong>Credenciales:</strong> respaldadas por certificados emitidos por Santander, NASA, Fundación Telefónica, Anthropic y Udemy.</li></ul>'
    ]
  },
  en: {
    help: [
      'AVAILABLE COMMANDS',
      '<ul class="out-list"><li><strong>about</strong> — professional summary.</li><li><strong>experience</strong> — PRIMAX & PMO experience.</li><li><strong>simulate</strong> — interactive ROI impact calculator.</li><li><strong>cases</strong> — case studies.</li><li><strong>case [primax|etl|ml|vasmad]</strong> — detailed STAR technical deep-dive.</li><li><strong>stats</strong> — quantitative impact metrics.</li><li><strong>skills</strong> — technical toolkit (Power BI, Python, Excel, Bizagi, AI).</li><li><strong>education</strong> — education and verified credentials.</li><li><strong>contact</strong> — ways to connect.</li><li><strong>recruiter</strong> — recruiter-friendly view.</li><li><strong>terms</strong> — legal notice, terms & privacy policy.</li><li><strong>cv</strong> — open CV modal viewer. Press Tab to autocomplete.</li></ul>'
    ],
    about: [
      'ABOUT ME',
      '<p><span class="green">Industrial Engineering</span> student (10th semester) at Universidad Continental. I combine <span class="green">data analytics, automation, and operational control</span> with strong domain expertise in <span class="green">Supply Chain, logistics, inventory planning (MRP), and Bizagi BPMN</span>.</p><p>Experience in high-volume B2B document workflows, SAP ERP, and Project Management Office (PMO) under PMI / PMBOK standards.</p>'
    ],
    experience: [
      'EXPERIENCE / 2025 — 2026',
      '<p><span class="green">Document Management Intern</span><br>PX Servicios Generales · PRIMAX Ecuador · Lima, Peru (Nov 2025 — Apr 2026)</p><ul class="out-list"><li>Recorded and validated <strong>100–200 invoices weekly</strong> in B2B portals.</li><li>Built a <strong>Power BI</strong> dashboard for commercial KPIs, advisors, regions and customers.</li><li>Automated extraction, cleaning and consolidation of daily Excel reports.</li><li>Handled transactional processes in SAP and Primax Solutions.</li></ul><p style="margin-top:14px;"><span class="green">PMO Team Member</span><br>PMI Student Community · Lima, Peru (Nov 2025 — Aug 2026)</p><ul class="out-list"><li>Internal project planning, schedule control and monitoring under PMI / PMBOK standards.</li><li>Coordinated cross-functional deliverables and team communication.</li></ul>'
    ],
    simulate: [
      'OPERATIONAL IMPACT CALCULATOR (ROI)',
      '<p>Use <code>simulate</code> to run the ROI model in console or customize with: <code>simulate [volume] [minutes] [automation_percentage]</code> (e.g. <code>simulate 300 10 70</code>).</p>'
    ],
    stats: [
      'QUANTITATIVE IMPACT METRICS',
      '<ul class="out-list"><li><strong>100–200</strong> weekly invoices validated under strict SLA.</li><li><strong>48,833</strong> logistics records classified via Python ETL ($323M+ consolidated).</li><li><strong>−15%</strong> stockout cost reduction through MRP control.</li><li><strong>−30%</strong> turnaround and logistics process optimization.</li><li><strong>~97.4 h/mo</strong> average hours saved via Power Automate, AI workflows and Python.</li></ul>'
    ],
    cases: [
      'CASE STUDIES',
      '<ul class="out-list"><li><strong>01 / Power BI:</strong> internal commercial dashboard for PRIMAX Ecuador. Type <code>case primax</code> for STAR breakdown.</li><li><strong>02 / Logistics ETL:</strong> automated 48K+ records processing in Python ($323M+ USD). <a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/PROYECTO_ETL_LOGISTICA">GitHub ↗</a> · Type <code>case etl</code>.</li><li><strong>03 / Machine Learning & AI:</strong> failure prediction using logistic regression. <a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/analisis-fallas-maquinas">GitHub ↗</a> · Type <code>case ml</code>.</li><li><strong>04 / Continuous Improvement:</strong> Bizagi BPMN, −15% stockout costs and −30% unloading time at VASMAD. Type <code>case vasmad</code>.</li></ul>'
    ],
    skills: [
      'TECHNICAL STACK & DOMAINS',
      '<div class="out-grid"><p><span>Supply Chain &amp; Bizagi</span>MRP / PAP, inventory management, Bizagi (BPMN), flow optimization, international trade & logistics, 5S & Lean.</p><p><span>Analytics &amp; BI</span>Power BI, Power Query, DAX, Advanced Excel (VBA/Macros/Financial Modeling), SQL, operational & commercial KPIs.</p><p><span>Automation &amp; AI</span>Python, Pandas, Artificial Intelligence (AI / Machine Learning), Prompt Engineering, ETL pipelines, Power Automate, n8n.</p><p><span>Management &amp; PMO</span>PMBOK methodology, Bizagi Modeler, SAP ERP, milestone control and B2B workflows.</p></div>'
    ],
    education: [
      'EDUCATION & VERIFIED CREDENTIALS',
      '<ul class="out-list"><li><strong>Industrial Engineering</strong> — Universidad Continental, 2022 — present. 10th semester.</li><li><strong>PMO:</strong> Project Management Office at PMI Student Community (2025 — 2026).</li><li><strong>Python for Data Analytics:</strong> Santander Open Academy <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1cQc80EHDGVL-HHTvodDKgtxesuoVq0IT/view?usp=sharing">credential ↗</a></li><li><strong>Power BI for BI:</strong> Santander Open Academy <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1jqEA5AxWUhB4RaCrlOAuPybT3x-dP993/view?usp=sharing">credential ↗</a></li><li><strong>Advanced Excel & Automation:</strong> Fundación Telefónica <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1thaxesW5lzO6yov0ce5aqxhTkFfruI2j/view?usp=sharing">credential ↗</a></li><li><strong>International Trade & Logistics:</strong> Udemy <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1VJO_tBVTvv6llyoNRzwT90XEhjDDzB2H/view?usp=sharing">credential ↗</a></li><li><strong>Galactic Problem Solver:</strong> NASA Space Apps Challenge <a class="out-link" target="_blank" rel="noreferrer" href="https://drive.google.com/file/d/1zkQ49YxqPnr1A7bpui4AeKSvIUpMw0BJ/view?usp=sharing">credential ↗</a></li><li><strong>Claude Code in Action:</strong> Anthropic (AI Automation) <a class="out-link" target="_blank" rel="noreferrer" href="https://verify.skilljar.com/c/aeqidtgg2pe2">credential ↗</a></li></ul>'
    ],
    contact: [
      'LET’S CONNECT',
      '<p>Do you have a data, automation or operations challenge? Let’s talk.</p><ul class="out-list"><li>email: <a class="out-link" href="mailto:alessandro.altamirano23@gmail.com">alessandro.altamirano23@gmail.com</a></li><li>phone: <a class="out-link" href="tel:+51944521832">+51 944 521 832</a></li><li>LinkedIn: <a class="out-link" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/alessandroaltamirano">alessandroaltamirano ↗</a></li></ul>'
    ],
    terms: [
      'LEGAL NOTICE & PRIVACY POLICY',
      '<p>This website is a technical and professional demonstration portfolio owned by <span class="green">Alessandro Altamirano</span>.</p><ul class="out-list"><li><strong>Privacy:</strong> No personal data is stored or harvested; contact operates strictly via <code>mailto:</code>.</li><li><strong>Confidenciality:</strong> Corporate case studies presented under generalized methodology with zero sensitive disclosure.</li><li><strong>Credentials:</strong> Backed by verifiable certifications from Santander, NASA, Telefónica, Anthropic & Udemy.</li></ul>'
    ]
  }
};

// Autocompletion Candidates
const names = [...Object.keys(C.es), 'cosmos', 'orbit', 'space', 'solar', 'terms', 'terminos', 'legal', 'privacy', 'cv', 'resume', 'clear', 'recruiter', 'terminal', 'github', 'linkedin', 'matrix', 'case', 'intro', 'splash', 'loader', 'excel', 'bizagi', 'bpmn', 'ia', 'ai', 'ask', 'cat', 'log', 'notes', 'neofetch', 'sysinfo', 'htop', 'top', 'exit', 'bash'];

// Theme Labels Dictionary (i18n)
const themeLabels = {
  es: ['tema: verde', 'tema: cyan', 'tema: ámbar'],
  en: ['theme: green', 'theme: cyan', 'theme: amber']
};

function updateThemeButtonLabel() {
  const themeBtn = document.querySelector('#theme');
  if (themeBtn) {
    themeBtn.textContent = themeLabels[lang][theme];
  }
}

// --- Helper Functions ---
function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[c]));
}

function addOutput(cmd, html, customPrompt) {
  if (!out) return;
  const el = document.createElement('div');
  el.className = 'output';
  const now = new Date();
  const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
  const promptUser = customPrompt || (isAiMode ? '<span class="prompt" style="color:var(--accent);">alessandro@bitacora</span>:<b>~</b>$' : '<span class="prompt">alessandro@portfolio</span>:<b>~</b>$');
  el.innerHTML = '<div class="echo-row"><p class="echo">' + promptUser + ' ' + escapeHtml(cmd) + '</p><span class="echo-badge" aria-hidden="true"><span class="echo-dot"></span>' + timeStr + '</span></div>' + html;
  out.append(el);
  out.scrollTop = out.scrollHeight;
}

// Engineering Log & First-Person Technical Knowledge Engine
function queryAiAssistant(question, userLang) {
  const q = question.toLowerCase().trim();
  const isEs = userLang === 'es';

  // 1. cat primax_log.md / PRIMAX
  if (q.includes('primax') || q.includes('factura') || q.includes('invoice') || q.includes('px') || q.includes('documental') || q.includes('b2b')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// BITÁCORA TÉCNICA // PRIMAX ECUADOR (PX SERVICIOS GENERALES)</div><p><strong>Notas de campo sobre mi experiencia en gestión documental y analítica comercial:</strong></p><ul class="out-list"><li><strong>Volumen auditado:</strong> Registro, validación y conciliación semanal de <strong>100–200 facturas comerciales</strong> en portales B2B bajo SLA estricto (100% de cumplimiento).</li><li><strong>Dashboard Comercial en Power BI:</strong> Diseñé una suite interactiva de KPIs comerciales para seguimiento de asesores, regiones y clientes en tiempo real, reemplazando reportes estáticos en PDF.</li><li><strong>Automatización en Excel y Python:</strong> Eliminé 3+ horas diarias de consolidación manual mediante rutinas de extracción, limpieza y cruce de datos con fórmulas dinámicas.</li><li><strong>Control transaccional en SAP:</strong> Gestión de módulos de compras y conciliación en SAP ERP y Primax Solutions con 0 discrepancias de auditoría.</li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// DEV LOG // PRIMAX ECUADOR (PX SERVICES)</div><p><strong>Field notes on document management and commercial analytics:</strong></p><ul class="out-list"><li><strong>Audited volume:</strong> Processed and verified <strong>100–200 weekly B2B invoices</strong> maintaining 100% SLA compliance with zero audit findings.</li><li><strong>Commercial Power BI Dashboard:</strong> Built an interactive KPI dashboard monitoring sales advisors, regional distributions, and customer segments.</li><li><strong>Automation in Excel & Python:</strong> Eliminated 3+ daily hours of manual consolidation bottlenecks via automated extraction and cleaning scripts.</li><li><strong>Transactional SAP ERP management:</strong> Reconciliation and execution across SAP ERP and Primax Solutions with zero discrepancies.</li></ul></div>';
  }

  // 2. cat etl_pipeline.py / ETL 48K Docs
  if (q.includes('etl') || (q.includes('python') && q.includes('logist')) || q.includes('48') || q.includes('pipeline') || q.includes('openpyxl')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// BITÁCORA TÉCNICA // PIPELINE ETL EN PYTHON (48,833 REGISTROS)</div><p><strong>Arquitectura y lecciones del pipeline de datos logísticos:</strong></p><ul class="out-list"><li><strong>Procesamiento masivo:</strong> Ingesta, limpieza y clasificación automatizada de <strong>48,833 registros logísticos</strong> consolidando más de <strong>$323M+ USD</strong>.</li><li><strong>Gestión de memoria:</strong> Implementé lectura por lotes (<code>chunksize=10000</code>) y tipado estricto en Pandas para evitar saturación de memoria RAM.</li><li><strong>Generación de reportes ejecutivos:</strong> Automatización con <code>openpyxl</code> para generar libros Excel con estilos corporativos y despacho automático por correo con <code>smtplib</code>.</li><li><strong>Repositorio en GitHub:</strong> <a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/PROYECTO_ETL_LOGISTICA">github.com/legacyum/PROYECTO_ETL_LOGISTICA ↗</a></li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// DEV LOG // PYTHON ETL PIPELINE (48,833 RECORDS)</div><p><strong>Architecture and field lessons from logistics data pipeline:</strong></p><ul class="out-list"><li><strong>Massive processing:</strong> Automated extraction, cleaning, and classification of <strong>48,833 logistics records</strong> totaling over <strong>$323M+ USD</strong>.</li><li><strong>Memory optimization:</strong> Handled batch ingestion with <code>chunksize=10000</code> in Pandas to avoid local memory bottlenecks.</li><li><strong>Executive report generation:</strong> Styled Excel workbook creation via <code>openpyxl</code> and automated dispatch using <code>smtplib</code>.</li><li><strong>GitHub repository:</strong> <a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/PROYECTO_ETL_LOGISTICA">github.com/legacyum/PROYECTO_ETL_LOGISTICA ↗</a></li></ul></div>';
  }

  // 3. cat vasmad_mrp.md / Supply Chain / 5S
  if (q.includes('vasmad') || q.includes('mrp') || q.includes('5s') || q.includes('desabastecimiento') || q.includes('descarga') || q.includes('almacen') || q.includes('almacén') || q.includes('supply chain') || q.includes('logistica') || q.includes('logistics')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// BITÁCORA TÉCNICA // REINGENIERÍA LOGÍSTICA & MRP (VASMAD)</div><p><strong>Diagnóstico e intervenciones en planta:</strong></p><ul class="out-list"><li><strong>Control de inventarios MRP:</strong> Reducción del <strong>15% en costos por desabastecimiento</strong> mediante el cálculo dinámico de Punto de Reorden (ROP) y Stock de Seguridad con nivel de servicio al 95%.</li><li><strong>Optimización de patio y descarga:</strong> Reducción del <strong>30% en tiempos de descarga de camiones</strong> aplicando zonificación física 5S y flujos automatizados de órdenes de compra en Power Automate.</li><li><strong>Mapeo de procesos en Bizagi:</strong> Diagramé los flujos AS-IS identificando cuellos de botella en recepción y diseñé el estándar TO-BE implementado con los operarios.</li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// DEV LOG // SUPPLY CHAIN & MRP REENGINEERING (VASMAD)</div><p><strong>Plant diagnostics and operational implementations:</strong></p><ul class="out-list"><li><strong>MRP Inventory Control:</strong> Reduced <strong>stockout costs by 15%</strong> through dynamic Reorder Point (ROP) and Safety Stock calculation at a 95% service level.</li><li><strong>Receiving bay optimization:</strong> Cut <strong>unloading turnaround times by 30%</strong> using 5S visual layout and automated purchase order flows in Power Automate.</li><li><strong>Bizagi process mapping:</strong> Mapped AS-IS flows to eliminate bottlenecks in receiving and established the standardized TO-BE workflow.</li></ul></div>';
  }

  // 4. cat bizagi_bpmn.md / BPMN
  if (q.includes('bizagi') || q.includes('bpmn') || q.includes('proceso') || q.includes('process') || q.includes('diagrama') || q.includes('flujo')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// BITÁCORA TÉCNICA // BIZAGI & MODELADO BPMN 2.0</div><p><strong>Metodología de análisis y reingeniería de procesos:</strong></p><ul class="out-list"><li><strong>Levantamiento en campo (AS-IS):</strong> Entrevistas directas con operarios, medición de tiempos de ciclo y mapeo de compuertas de decisión con estándar BPMN 2.0.</li><li><strong>Detección de cuellos de botella:</strong> Identificación de tiempos muertos en aprobaciones manuales y redundancia de datos entre departamentos.</li><li><strong>Diseño de procesos optimizados (TO-BE):</strong> Estandarización de carriles (swimlanes), puntos de control de calidad y automatización de traspasos entre sistemas.</li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// DEV LOG // BIZAGI & BPMN 2.0 PROCESS MODELING</div><p><strong>Process analysis and reengineering methodology:</strong></p><ul class="out-list"><li><strong>Field mapping (AS-IS):</strong> Direct interviews with floor workers, cycle time measurement, and BPMN 2.0 decision mapping.</li><li><strong>Bottleneck elimination:</strong> Pinpointed dead time in manual approval sign-offs and cross-department data redundancy.</li><li><strong>Optimized process design (TO-BE):</strong> Standardized swimlanes, quality gates, and automated handoffs between systems.</li></ul></div>';
  }

  // 5. cat ml_telemetry.py / Machine Learning
  if (q.includes('ml') || q.includes('machine learning') || q.includes('fallas') || q.includes('telemetria') || q.includes('telemetry') || q.includes('predictivo') || q.includes('predictive') || q.includes('ia') || q.includes('ai') || q.includes('claude')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// BITÁCORA TÉCNICA // MANTENIMIENTO PREDICTIVO & MACHINE LEARNING</div><p><strong>Implementación de modelos analíticos en planta industrial:</strong></p><ul class="out-list"><li><strong>Detección temprana de averías:</strong> Modelo de Regresión Logística multivariable en Python (scikit-learn) entrenado sobre telemetría de sensores (temperatura, torque, rpm, vibración).</li><li><strong>Métricas reales:</strong> <strong>91.4% de Accuracy</strong> y <strong>0.88 de F1-Score</strong>, priorizando Recall para no dejar pasar fallas críticas con tasa de falsos positivos inferior al 5%.</li><li><strong>Certificación Anthropic:</strong> Certificado en <em>Claude Code in Action</em> para automatización con agentes y flujos de trabajo basados en IA.</li><li><strong>Repositorio en GitHub:</strong> <a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/analisis-fallas-maquinas">github.com/legacyum/analisis-fallas-maquinas ↗</a></li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// DEV LOG // PREDICTIVE MAINTENANCE & MACHINE LEARNING</div><p><strong>Industrial plant analytical model implementation:</strong></p><ul class="out-list"><li><strong>Early failure classification:</strong> Multivariate Logistic Regression pipeline in Python (scikit-learn) trained on sensor telemetry (temperature, torque, rpm, vibration).</li><li><strong>Performance metrics:</strong> <strong>91.4% Accuracy</strong> and <strong>0.88 F1-Score</strong>, prioritizing Recall to prevent catastrophic machine downtime.</li><li><strong>Anthropic certified:</strong> Certified in <em>Claude Code in Action</em> for AI agents and structured engineering workflows.</li><li><strong>GitHub repository:</strong> <a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/analisis-fallas-maquinas">github.com/legacyum/analisis-fallas-maquinas ↗</a></li></ul></div>';
  }

  // 6. Why hire / Value proposition
  if (q.includes('contrat') || q.includes('hire') || q.includes('por que') || q.includes('por qué') || q.includes('why') || q.includes('perfil') || q.includes('valor') || q.includes('propuesta') || q.includes('fortaleza')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// PROPUESTA DE VALOR // ALESSANDRO ALTAMIRANO</div><p><strong>¿Por qué mi perfil aporta valor directo a tu equipo de operaciones y datos?</strong></p><ul class="out-list"><li><strong>Perfil híbrido único:</strong> Combino la visión estratégica de <strong>Ingeniería Industrial</strong> (10° ciclo) con dominio técnico de <strong>analítica de datos</strong> (Power BI, Python, SQL) y <strong>automatización de procesos</strong> (Bizagi BPMN, Power Automate, IA).</li><li><strong>Experiencia corporativa comprobada:</strong> En <strong>PRIMAX Ecuador</strong> gestioné y auditó 100–200 facturas B2B semanales bajo SLA estricto, construyendo dashboards comerciales en Power BI y automatizando reportes diarios con 0% margen de error.</li><li><strong>Foco directo en ROI y eficiencia:</strong> En <strong>VASMAD</strong> redujo un 15% los costos por desabastecimiento (MRP) y optimizó un 30% los tiempos de descarga logística aplicando Lean y BPMN.</li><li><strong>Mentalidad de mejora continua:</strong> Certificado por Santander, Anthropic (Claude Code in Action), Fundación Telefónica y NASA Space Apps Challenge.</li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// VALUE PROPOSITION // ALESSANDRO ALTAMIRANO</div><p><strong>Why does my profile deliver immediate value to operations & data teams?</strong></p><ul class="out-list"><li><strong>Unique hybrid skill set:</strong> Combines <strong>Industrial Engineering</strong> rigor (10th semester) with deep technical expertise in <strong>data analytics</strong> (Power BI, Python, SQL) and <strong>process automation</strong> (Bizagi BPMN, Power Automate, AI).</li><li><strong>Proven corporate track record:</strong> At <strong>PRIMAX Ecuador</strong>, handled and validated 100–200 weekly B2B invoices under strict SLAs, built commercial Power BI dashboards, and automated daily reporting.</li><li><strong>Direct ROI & operations focus:</strong> Reduced stockout costs by 15% (MRP) and cut logistics turnaround times by 30% at <strong>VASMAD</strong> through Lean & BPMN reengineering.</li><li><strong>Continuous learning mindset:</strong> Certified by Santander, Anthropic (Claude Code in Action), Fundación Telefónica, and NASA Space Apps Challenge.</li></ul></div>';
  }

  // 7. General Python & Power BI & Data
  if (q.includes('python') || q.includes('power bi') || q.includes('bi') || q.includes('dax') || q.includes('sql') || q.includes('data') || q.includes('dato')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// NOTAS DE CAMPO // PYTHON, ETL Y POWER BI</div><p><strong>Capacidades analíticas y de ingeniería de datos:</strong></p><ul class="out-list"><li><strong>Pipeline ETL en Python (Pandas / OpenPyXL):</strong> Procesó y clasificó de forma automatizada <strong>48,833 registros logísticos</strong> consolidando más de <strong>$323M USD</strong> con generación de reportes ejecutivos y despacho automático vía SMTP.</li><li><strong>Power BI & DAX Avanzado:</strong> Modelado dimensional en estrella, medidas DAX complejas, time-intelligence, optimización en Power Query y diseño de interfaces ejecutivas con alta usabilidad.</li><li><strong>Certificaciones oficiales:</strong> Certificado en <em>Python para Análisis de Datos</em> y <em>Power BI para Business Intelligence</em> por Santander Open Academy.</li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// DEV NOTES // PYTHON, ETL & POWER BI PROFICIENCY</div><p><strong>Data analytics and engineering capabilities:</strong></p><ul class="out-list"><li><strong>Python Logistics ETL Pipeline:</strong> Automated data extraction, classification and consolidation of <strong>48,833 logistics records</strong> totaling over <strong>$323M USD</strong>, with automated Excel generation and SMTP dispatch.</li><li><strong>Power BI & Advanced DAX:</strong> Star schema dimensional modeling, complex DAX measures, time-intelligence calculations, Power Query ETL, and executive UX dashboards.</li><li><strong>Official credentials:</strong> Certified in <em>Python for Data Analysis</em> and <em>Power BI for Business Intelligence</em> by Santander Open Academy.</li></ul></div>';
  }

  // 8. Excel
  if (q.includes('excel') || q.includes('macro') || q.includes('vba') || q.includes('tablas dinamicas') || q.includes('pivot')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// NOTAS // EXCEL AVANZADO & AUTOMATIZACIÓN</div><p><strong>Dominio de Microsoft Excel a nivel corporativo:</strong></p><ul class="out-list"><li>Certificación oficial en <em>Excel Avanzado & Automatización</em> por Fundación Telefónica.</li><li>Modelado financiero, macros en VBA para automatización de tareas repetitivas, tablas y gráficos dinámicos avanzados, fórmulas matriciales y Power Query para integración de datos.</li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// NOTES // ADVANCED EXCEL & AUTOMATION</div><p><strong>Corporate Microsoft Excel mastery:</strong></p><ul class="out-list"><li>Certified in <em>Advanced Excel & Automation</em> by Fundación Telefónica.</li><li>Financial modeling, VBA macros for routine automation, advanced dynamic pivot tables, complex matrix formulas, and Power Query data transformation.</li></ul></div>';
  }

  // 9. Contact
  if (q.includes('contacto') || q.includes('contact') || q.includes('telefono') || q.includes('teléfono') || q.includes('correo') || q.includes('email') || q.includes('linkedin') || q.includes('celular')) {
    return isEs
      ? '<div class="ai-response-box"><div class="ai-header-tag">// DATOS DE CONTACTO // DIRECTO</div><p>Puedes comunicarte directamente con Alessandro a través de:</p><ul class="out-list"><li>Email: <a class="out-link" href="mailto:alessandro.altamirano23@gmail.com">alessandro.altamirano23@gmail.com</a></li><li>Teléfono: <a class="out-link" href="tel:+51944521832">+51 944 521 832</a></li><li>LinkedIn: <a class="out-link" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/alessandroaltamirano">linkedin.com/in/alessandroaltamirano ↗</a></li></ul></div>'
      : '<div class="ai-response-box"><div class="ai-header-tag">// CONTACT DETAILS // DIRECT</div><p>You can reach Alessandro directly via:</p><ul class="out-list"><li>Email: <a class="out-link" href="mailto:alessandro.altamirano23@gmail.com">alessandro.altamirano23@gmail.com</a></li><li>Phone: <a class="out-link" href="tel:+51944521832">+51 944 521 832</a></li><li>LinkedIn: <a class="out-link" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/alessandroaltamirano">linkedin.com/in/alessandroaltamirano ↗</a></li></ul></div>';
  }

  // Default fallback
  return isEs
    ? '<div class="ai-response-box"><div class="ai-header-tag">// BITÁCORA TÉCNICA DE ALESSANDRO</div><p>Consulta registrada sobre: <em>"' + escapeHtml(question) + '"</em>.</p><p>Soy estudiante de 10° ciclo de <strong>Ingeniería Industrial</strong> en la Universidad Continental, especializado en <strong>Supply Chain, Analítica de Datos (Power BI, Python, SQL), Modelado de Procesos (Bizagi BPMN) y Automatización</strong>.</p><p>Comandos recomendados: <code>cat primax_log.md</code>, <code>cat etl_pipeline.py</code>, <code>cat vasmad_mrp.md</code> o <code>cat bizagi_bpmn.md</code>.</p></div>'
    : '<div class="ai-response-box"><div class="ai-header-tag">// ALESSANDRO FIELD LOGS</div><p>Query logged regarding: <em>"' + escapeHtml(question) + '"</em>.</p><p>I am a 10th-semester <strong>Industrial Engineering</strong> student at Universidad Continental specializing in <strong>Supply Chain, Data Analytics (Power BI, Python, SQL), Process Reengineering (Bizagi BPMN), and Automation</strong>.</p><p>Recommended commands: <code>cat primax_log.md</code>, <code>cat etl_pipeline.py</code>, <code>cat vasmad_mrp.md</code>, or <code>cat bizagi_bpmn.md</code>.</p></div>';
}

function getNeofetchOutput() {
  return '<div class="neofetch-wrap"><pre class="neofetch-ascii">' +
'      /\\\n' +
'     /  \\\n' +
'    / /\\ \\\n' +
'   / /  \\ \\\n' +
'  / /    \\ \\\n' +
' /_/      \\_\\\n' +
'</pre><div class="neofetch-info">' +
'<div style="font-weight:700;color:var(--accent);">alessandro@AltamiranoOS</div>' +
'<div class="neofetch-divider"></div>' +
'<div class="neofetch-row"><span class="neofetch-key">OS:</span><span class="neofetch-val">Industrial-Eng-Sys v2.6 x86_64</span></div>' +
'<div class="neofetch-row"><span class="neofetch-key">Host:</span><span class="neofetch-val">Universidad Continental (10° Ciclo)</span></div>' +
'<div class="neofetch-row"><span class="neofetch-key">Kernel:</span><span class="neofetch-val">Supply-Chain · Data · Operations</span></div>' +
'<div class="neofetch-row"><span class="neofetch-key">Uptime:</span><span class="neofetch-val">2022 — 2026 (4+ years continuous growth)</span></div>' +
'<div class="neofetch-row"><span class="neofetch-key">Shell:</span><span class="neofetch-val">bash 5.2 / zsh / altamirano-cli</span></div>' +
'<div class="neofetch-row"><span class="neofetch-key">Packages:</span><span class="neofetch-val">Power BI, Python, SQL, Excel, Bizagi, SAP ERP, IA</span></div>' +
'<div class="neofetch-row"><span class="neofetch-key">Certifications:</span><span class="neofetch-val">Santander, Telefónica, Anthropic, NASA Space Apps, Udemy</span></div>' +
'<div class="neofetch-row"><span class="neofetch-key">Memory:</span><span class="neofetch-val" style="color:#00ff66;">100% Focused / Available for Opportunities</span></div>' +
'<div class="neofetch-palette">' +
'<span class="palette-block" style="background:#00ff66;"></span>' +
'<span class="palette-block" style="background:#00e5ff;"></span>' +
'<span class="palette-block" style="background:#ffb700;"></span>' +
'<span class="palette-block" style="background:#d4af37;"></span>' +
'<span class="palette-block" style="background:#70a080;"></span>' +
'<span class="palette-block" style="background:#ffffff;"></span>' +
'</div></div></div>';
}

function getHtopOutput() {
  return '<div class="htop-wrap"><table class="htop-table">' +
'<thead><tr><th class="htop-th">PID</th><th class="htop-th">USER</th><th class="htop-th">CPU%</th><th class="htop-th">MEM%</th><th class="htop-th">STATE</th><th class="htop-th">COMMAND</th></tr></thead>' +
'<tbody>' +
'<tr><td class="htop-td htop-pid">1024</td><td class="htop-td">alessandro</td><td class="htop-td">28.4%</td><td class="htop-td">14.2%</td><td class="htop-td htop-status-run">RUN</td><td class="htop-td">python -m etl_logistics_pipeline.py --docs 48833</td></tr>' +
'<tr><td class="htop-td htop-pid">1025</td><td class="htop-td">alessandro</td><td class="htop-td">19.2%</td><td class="htop-td">22.8%</td><td class="htop-td htop-status-run">RUN</td><td class="htop-td">powerbi.service --dashboard primax_kpis.pbix</td></tr>' +
'<tr><td class="htop-td htop-pid">1026</td><td class="htop-td">alessandro</td><td class="htop-td">12.5%</td><td class="htop-td">8.6%</td><td class="htop-td htop-status-run">RUN</td><td class="htop-td">sap_gui.daemon --b2b-invoices-audit</td></tr>' +
'<tr><td class="htop-td htop-pid">1027</td><td class="htop-td">alessandro</td><td class="htop-td">9.1%</td><td class="htop-td">6.4%</td><td class="htop-td htop-status-run">RUN</td><td class="htop-td">bizagi_modeler --bpmn vasmad_to_be.bpm</td></tr>' +
'<tr><td class="htop-td htop-pid">1028</td><td class="htop-td">alessandro</td><td class="htop-td">15.0%</td><td class="htop-td">18.0%</td><td class="htop-td htop-status-run">RUN</td><td class="htop-td">anthropic_claude_agent --mode engineering_log</td></tr>' +
'</tbody></table></div>';
}

function runCommand(raw) {
  const trimmed = raw.trim();
  const cmd = trimmed.toLowerCase();
  if (!cmd) return;
  
  history.unshift(trimmed);
  index = -1;
  draftInput = '';

  const termWindow = document.querySelector('#terminalWindow');
  if (termWindow) {
    termWindow.classList.add('term-executing');
    setTimeout(() => termWindow.classList.remove('term-executing'), 220);
  }

  if (cmd === 'clear') {
    if (out) out.innerHTML = '';
    return;
  }

  // Handle Bitácora / AI Mode exit commands
  if (isAiMode && (cmd === 'exit' || cmd === 'bash' || cmd === 'cli' || cmd === 'terminal')) {
    isAiMode = false;
    updateTerminalAiState();
    addOutput(cmd, '<p><span class="green">' + (lang === 'es' ? '✓ Modo Bitácora desactivado. Regresando a Bash estándar.' : '✓ Log Mode disabled. Returning to standard Bash.') + '</span></p>');
    return;
  }

  // If in Bitácora / AI Mode, all raw text is directly processed as notes queries
  if (isAiMode) {
    addOutput(trimmed, queryAiAssistant(trimmed, lang));
    return;
  }

  if (cmd === 'cv' || cmd === 'resume') {
    openCvModal();
    addOutput(cmd, '<p>' + (lang === 'es' ? 'Abriendo visor modal de CV…' : 'Opening CV modal viewer…') + ' <a class="out-link" target="_blank" rel="noreferrer" href="CV_Alessandro_Altamirano_Salazar_2026.pdf">ver_cv.pdf ↗</a></p>');
    return;
  }
  if (cmd === 'terms' || cmd === 'terminos' || cmd === 'legal' || cmd === 'privacy') {
    openTermsModal();
    addOutput(cmd, '<p><span class="green">' + (lang === 'es' ? '✓ Abriendo modal de Términos de Uso y Privacidad…' : '✓ Opening Terms of Use & Privacy modal…') + '</span></p>');
    return;
  }
  if (cmd === 'intro' || cmd === 'splash' || cmd === 'loader') {
    if (typeof window.__replayPreloader === 'function') {
      window.__replayPreloader();
      addOutput(cmd, '<p><span class="green">' + (lang === 'es' ? '✓ Reanudando intro con Depth-Text 3D…' : '✓ Replaying 3D Depth-Text intro…') + '</span></p>');
      return;
    }
  }
  if (cmd.startsWith('simulate') || cmd.startsWith('simulador') || cmd.startsWith('calc')) {
    const parts = cmd.split(/\s+/);
    let vol = parseInt(parts[1], 10);
    let min = parseInt(parts[2], 10);
    let pct = parseInt(parts[3], 10);
    if (isNaN(vol)) vol = 150;
    if (isNaN(min)) min = 12;
    if (isNaN(pct)) pct = 75;
    addOutput(cmd, calculateSimulatorCli(vol, min, pct));
    return;
  }
  if (cmd === 'matrix' || cmd === 'rain') {
    if (typeof window.__boostBinaryMatrix === 'function') {
      window.__boostBinaryMatrix();
    }
    addOutput(cmd, '<p><span class="green">' + (lang === 'es' ? '✓ Modo Matrix sobrecargado: velocidad e iluminación maximizadas.' : '✓ Matrix mode boosted: velocity and luminescence maximized.') + '</span></p>');
    return;
  }
  if (cmd === 'neofetch' || cmd === 'sysinfo') {
    addOutput(cmd, getNeofetchOutput());
    return;
  }
    if (cmd === 'cosmos' || cmd === 'orbit' || cmd === 'space' || cmd === 'solar') {
    openCosmosModal();
    addOutput(cmd, '<p class="output-title">// ' + (lang === 'es' ? 'COSMIC ATLAS 3D · SISTEMA SOLAR' : 'COSMIC ATLAS 3D · SOLAR SYSTEM') + '</p><p><span class="green">' + (lang === 'es' ? '✓ Desplegando simulador astronómico WebGL interactivo...' : '✓ Launching interactive WebGL astronomy simulator...') + '</span></p>');
    return;
  }
  if (cmd === 'cat walk' || cmd === 'cat roam' || cmd === 'gato caminar' || cmd === 'gato pasear') {
    if (typeof window.__startCatRoam === 'function') {
      window.__startCatRoam();
    } else if (typeof window.__summonCat === 'function') {
      window.__summonCat();
    }
    addOutput(cmd, '<p class="output-title">// ' + (lang === 'es' ? 'GATO 3D · MODO PASEO LIBRE' : '3D CAT · FREE ROAMING MODE') + '</p><p><span class="green">' + (lang === 'es' ? '🐾 ¡El gato 3D ha salido a caminar por la pantalla!' : '🐾 3D Cat is now freely roaming the screen!') + '</span></p>');
    return;
  }
  if (cmd === 'cat home' || cmd === 'cat base' || cmd === 'gato casa' || cmd === 'gato base') {
    if (typeof window.__stopCatRoam === 'function') window.__stopCatRoam();
    addOutput(cmd, '<p class="output-title">// ' + (lang === 'es' ? 'GATO 3D · RETORNO A BASE' : '3D CAT · RETURN TO BASE') + '</p><p><span class="green">' + (lang === 'es' ? '🏠 El gato 3D ha regresado a su pedestal neón.' : '🏠 3D Cat returned to its neon dais.') + '</span></p>');
    return;
  }
  if (cmd === 'gato' || cmd === 'cat' || cmd === 'gatito' || cmd === 'kitty' || cmd === 'cat3d') {
    openCatModal();
    if (typeof window.__summonCat === 'function') window.__summonCat();
    addOutput(cmd, '<p class="output-title">// ' + (lang === 'es' ? 'GATO 3D PROCEDURAL · PROTO-LAB' : 'PROCEDURAL 3D CAT · PROTO-LAB') + '</p><p><span class="green">' + (lang === 'es' ? '✓ Desplegando laboratorio interactivo del Gato 3D...' : '✓ Launching interactive 3D Cat proto-lab...') + '</span></p>');
    return;
  }
  if (cmd === 'htop' || cmd === 'top') {
    addOutput(cmd, getHtopOutput());
    return;
  }
  if (cmd.startsWith('case ') || cmd === 'star' || cmd === 'case') {
    const parts = cmd.split(' ');
    const caseId = parts[1] || 'primax';
    openCaseModal(caseId, 'context');
    const resolvedName = (caseId === '2' || caseId === 'etl') ? 'Automatización ETL Python' : (caseId === '3' || caseId === 'ml') ? 'Machine Learning' : (caseId === '4' || caseId === 'vasmad') ? 'Logística VASMAD' : 'PRIMAX Ecuador';
    addOutput(cmd, '<p><span class="green">' + (lang === 'es' ? '✓ Abriendo visor de entregables y STAR para: ' : '✓ Opening deliverables & STAR breakdown for: ') + '<strong>' + resolvedName + '</strong></span></p>');
    return;
  }
  if (cmd.startsWith('cat ') || cmd.startsWith('log ') || cmd.startsWith('notes ')) {
    const query = trimmed.replace(/^(cat|log|notes)\s+/i, '');
    addOutput(trimmed, queryAiAssistant(query, lang));
    return;
  }
  if (cmd === 'recruiter') {
    setView('recruiter', true);
    return;
  }
  if (cmd === 'terminal') {
    setView('terminal', true);
    return;
  }
  if (cmd === 'github') {
    addOutput(cmd, '<p><a class="out-link" target="_blank" rel="noreferrer" href="https://github.com/legacyum/analisis-fallas-maquinas">analisis-fallas-maquinas ↗</a></p>');
    return;
  }
  if (cmd === 'linkedin') {
    addOutput(cmd, '<p><a class="out-link" target="_blank" rel="noreferrer" href="https://www.linkedin.com/feed/update/urn:li:activity:7458064691492249600/">Power BI project on LinkedIn ↗</a></p>');
    return;
  }
  if (cmd === 'excel') {
    addOutput(cmd, '<p class="output-title">// ' + (lang === 'es' ? 'EXCEL AVANZADO & AUTOMATIZACIÓN' : 'ADVANCED EXCEL & AUTOMATION') + '</p><p>' + (lang === 'es' ? 'Modelado financiero, macros/VBA, Power Query, tablas dinámicas avanzadas y automatización de reportes ejecutivos con 0% margen de error.' : 'Financial modeling, VBA/Macros, Power Query, advanced pivot tables, and automated executive reporting with zero error margin.') + '</p>');
    return;
  }
  if (cmd === 'bizagi' || cmd === 'bpmn') {
    addOutput(cmd, '<p class="output-title">// ' + (lang === 'es' ? 'BIZAGI & MODELADO DE PROCESOS (BPMN)' : 'BIZAGI & BPMN PROCESS MODELING') + '</p><p>' + (lang === 'es' ? 'Diagramación y reingeniería de procesos AS-IS / TO-BE en Bizagi Modeler, eliminación sistemática de cuellos de botella y estandarización de flujos operativos.' : 'AS-IS / TO-BE process mapping and reengineering in Bizagi Modeler, bottleneck elimination, and operational flow standardization.') + '</p>');
    return;
  }
  if (cmd.startsWith('ai ') || cmd.startsWith('ask ') || cmd.startsWith('ia ') || cmd.startsWith('prompt ')) {
    const questionText = trimmed.replace(/^(ai|ask|ia|prompt)\s+/i, '');
    if (questionText.trim()) {
      addOutput(trimmed, queryAiAssistant(questionText, lang));
    } else {
      addOutput(cmd, '<p class="output-title">// ' + (lang === 'es' ? 'BITÁCORA TÉCNICA & CONSULTAS' : 'TECHNICAL LOG & QUERIES') + '</p><p>' + (lang === 'es' ? 'Escribe <code>cat [archivo.md]</code> o activa el botón [ BITÁCORA ] en la barra superior.' : 'Type <code>cat [file.md]</code> or toggle [ DEV LOGS ] in the top bar.') + '</p>');
    }
    return;
  }
  if (cmd.startsWith('¿') || cmd.includes('?') || cmd.startsWith('why') || cmd.startsWith('what') || cmd.startsWith('how')) {
    addOutput(trimmed, queryAiAssistant(trimmed, lang));
    return;
  }
  if (cmd === 'ia' || cmd === 'ai' || cmd === 'genai') {
    addOutput(cmd, '<p class="output-title">// ' + (lang === 'es' ? 'INTELIGENCIA ARTIFICIAL & MACHINE LEARNING' : 'ARTIFICIAL INTELLIGENCE & MACHINE LEARNING') + '</p><p>' + (lang === 'es' ? 'Modelos predictivos en Python (scikit-learn), ingeniería de contexto y prompt engineering avanzado (Anthropic / Claude Code certified), e integración de automatización en flujos operativos. Escribe <code>cat ml_telemetry.py</code> para ver notas técnicas.' : 'Predictive models in Python (scikit-learn), context engineering & advanced prompt design (Anthropic / Claude Code certified), and operational automation. Type <code>cat ml_telemetry.py</code> for technical notes.') + '</p>');
    return;
  }

  const data = C[lang][cmd];
  if (!data) {
    addOutput(cmd, '<p class="error">' + (lang === 'es' ? 'comando no encontrado' : 'command not found') + ': ' + escapeHtml(cmd) + '. ' + (lang === 'es' ? 'Prueba con' : 'Try') + ' <button class="quick-run" type="button" data-run="help">help</button> ' + (lang === 'es' ? 'o consulta una bitácora con' : 'or view logs with') + ' <code>cat primax_log.md</code>.</p>');
    return;
  }
  addOutput(cmd, '<p class="output-title">// ' + data[0] + '</p>' + data[1]);
}

function setView(mode, shouldScroll = true) {
  const on = mode === 'recruiter';
  if (recruiter) recruiter.classList.toggle('show', on);
  if (view) {
    view.setAttribute('aria-pressed', on);
    view.textContent = on ? (lang === 'es' ? 'volver a terminal' : 'back to terminal') : T[lang].recruiterMode;
  }
  
  if (shouldScroll) {
    if (on) {
      recruiter?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      document.querySelector('#terminal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => input?.focus({ preventScroll: true }), 400);
    }
  }
}

function updateTerminalAiState() {
  const aiToggleBtn = document.querySelector('#terminalAiToggle, #terminalLogToggle');
  const promptUser = document.querySelector('#terminalPromptUser');
  const barTitle = document.querySelector('#terminalBarTitle');
  
  if (aiToggleBtn) {
    aiToggleBtn.classList.toggle('active', isAiMode);
    aiToggleBtn.setAttribute('aria-pressed', isAiMode ? 'true' : 'false');
  }
  if (promptUser) {
    promptUser.textContent = isAiMode ? 'alessandro@bitacora' : 'alessandro@portfolio';
  }
  if (barTitle) {
    barTitle.textContent = isAiMode 
      ? (lang === 'es' ? 'alessandro@portfolio [BITÁCORA TÉCNICA ACTIVA]' : 'alessandro@portfolio [DEV LOGS ACTIVE]')
      : 'alessandro@portfolio:~';
  }
  if (input) {
    if (isAiMode) {
      input.placeholder = lang === 'es' ? 'cat [archivo.md] o consulta notas técnicas...' : 'cat [file.md] or query dev notes...';
    } else {
      input.placeholder = lang === 'es' ? 'escribe un comando...' : 'type a command...';
    }
    input.setAttribute('aria-label', input.placeholder);
  }
}

function translate() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(e => {
    if (T[lang][e.dataset.t] !== undefined) {
      e.textContent = T[lang][e.dataset.t];
    }
  });
  document.querySelectorAll('[data-t-html]').forEach(e => {
    if (T[lang][e.dataset.tHtml] !== undefined) {
      e.innerHTML = T[lang][e.dataset.tHtml];
    }
  });
  
  const langBtn = document.querySelector('#language');
  if (langBtn) langBtn.textContent = lang === 'es' ? 'EN' : 'ES';

  const L = T[lang];
  const stage = document.querySelector('#lanyardStage');
  if (stage && L.lanyardStageAria) stage.setAttribute('aria-label', L.lanyardStageAria);
  const card = document.querySelector('#lanyardCard');
  if (card && L.lanyardCardAria) card.setAttribute('aria-label', L.lanyardCardAria);
  const flip = document.querySelector('#lanyardFlipTrigger');
  if (flip && L.lanyardFlipAria) flip.setAttribute('aria-label', L.lanyardFlipAria);
  const backFlip = document.querySelector('.back-flip-btn');
  if (backFlip && L.lanyardBackAria) backFlip.setAttribute('aria-label', L.lanyardBackAria);
  const aiToggle = document.querySelector('#terminalAiToggle');
  if (aiToggle && L.terminalAiTitle) {
    aiToggle.setAttribute('title', L.terminalAiTitle);
    aiToggle.setAttribute('aria-label', L.terminalAiTitle);
  }
  const input = document.querySelector('#input');
  if (input && L.terminalInputPh) input.setAttribute('placeholder', L.terminalInputPh);
  const badge = document.querySelector('.badge-status');
  if (badge && L.inProgressBadge) badge.textContent = L.inProgressBadge;
  
  updateTerminalAiState();
  setView(recruiter?.classList.contains('show') ? 'recruiter' : 'terminal', false);
  updateThemeButtonLabel();
}

// --- CV Modal Control ---
let cvBlobUrl = null;

function openCvModal() {
  const modal = document.querySelector('#cvModal');
  if (!modal) return;

  const iframe = modal.querySelector('iframe');
  if (iframe && !cvBlobUrl && typeof fetch === 'function') {
    fetch('CV_Alessandro_Altamirano_Salazar_2026.pdf')
      .then(res => {
        if (!res.ok) throw new Error('Network response: ' + res.status);
        return res.blob();
      })
      .then(blob => {
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        cvBlobUrl = URL.createObjectURL(pdfBlob);
        if (iframe) iframe.src = cvBlobUrl;
      })
      .catch(err => {
        // En caso de entorno sin fetch o error de red, conserva el src estático
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('PDF blob fallback:', err.message);
        }
      });
  }

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function closeCvModal() {
  const modal = document.querySelector('#cvModal');
  if (!modal) return;
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

function initCvModal() {
  const openBtn = document.querySelector('#openCvBtn');
  const heroBtn = document.querySelector('#heroCvBtn');
  const recruiterBtn = document.querySelector('#recruiterCvBtn');
  const closeBtn = document.querySelector('#closeCvBtn');
  const modal = document.querySelector('#cvModal');

  [openBtn, heroBtn, recruiterBtn].forEach(b => {
    b?.addEventListener('click', e => {
      e.preventDefault();
      openCvModal();
    });
  });
  closeBtn?.addEventListener('click', closeCvModal);
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeCvModal();
  });
}

// --- 5-Tabs Deliverables & Engineering Case Deep Dive Modal Control ---
function getBpmnSvg(caseId) {
  if (caseId === 'primax') {
    return `
      <svg class="bpmn-svg" viewBox="0 0 760 170" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="750" height="160" rx="6" fill="#0c110e" stroke="var(--line)" stroke-width="1.2"/>
        <line x1="5" y1="58" x2="755" y2="58" stroke="var(--line)" stroke-dasharray="3 3"/>
        <line x1="5" y1="112" x2="755" y2="112" stroke="var(--line)" stroke-dasharray="3 3"/>
        <text x="14" y="38" fill="var(--faint)" font-size="8.5" font-family="DM Mono">PROVEEDORES (B2B)</text>
        <text x="14" y="88" fill="var(--faint)" font-size="8.5" font-family="DM Mono">AUDITORÍA (ALESSANDRO)</text>
        <text x="14" y="142" fill="var(--faint)" font-size="8.5" font-family="DM Mono">SAP ERP & BI</text>
        
        <!-- Start Node -->
        <circle cx="160" cy="34" r="12" fill="rgba(var(--accent-rgb), 0.15)" stroke="var(--accent)" stroke-width="1.8"/>
        <text x="160" y="37" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">INICIO</text>
        <path d="M 172 34 L 205 34" stroke="var(--muted)" stroke-width="1.4" marker-end="url(#arrow)"/>

        <!-- Task 1: Emisión -->
        <rect x="205" y="18" width="105" height="32" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
        <text x="257" y="33" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">100–200 Facturas B2B</text>
        <path d="M 257 50 L 257 74" stroke="var(--muted)" stroke-width="1.4"/>

        <!-- Task 2: Validación -->
        <rect x="205" y="74" width="105" height="32" rx="4" fill="var(--panel2)" stroke="var(--accent)" stroke-width="1.4"/>
        <text x="257" y="89" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">Auditoría &amp; SLA 100%</text>
        <path d="M 310 90 L 350 90" stroke="var(--muted)" stroke-width="1.4"/>

        <!-- Gateway: Discrepancia -->
        <polygon points="370,76 392,90 370,104 348,90" fill="var(--panel)" stroke="var(--accent)" stroke-width="1.2"/>
        <text x="370" y="93" text-anchor="middle" fill="var(--accent)" font-size="8.5" font-weight="700">?</text>
        
        <!-- Sí path -->
        <path d="M 370 76 L 370 34 L 420 34" stroke="var(--rose)" stroke-width="1.4"/>
        <rect x="420" y="18" width="100" height="32" rx="4" fill="var(--panel2)" stroke="var(--rose)"/>
        <text x="470" y="33" text-anchor="middle" fill="var(--rose)" font-size="7.5" font-family="DM Mono">Rechazo / Reenvío</text>

        <!-- No path -->
        <path d="M 392 90 L 440 90 L 440 128 L 470 128" stroke="var(--accent)" stroke-width="1.4"/>
        <rect x="470" y="114" width="115" height="30" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
        <text x="527" y="129" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">Ingreso SAP ERP</text>
        
        <path d="M 585 129 L 615 129" stroke="var(--accent)" stroke-width="1.4"/>
        <!-- Task 4: Power BI -->
        <rect x="615" y="114" width="105" height="30" rx="4" fill="var(--panel2)" stroke="var(--accent)"/>
        <text x="667" y="129" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">Dashboard Power BI</text>

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--muted)"/>
          </marker>
        </defs>
      </svg>
    `;
  }
  if (caseId === 'etl') {
    return `
      <svg class="bpmn-svg" viewBox="0 0 760 170" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="750" height="160" rx="6" fill="#0c110e" stroke="var(--line)" stroke-width="1.2"/>
        <line x1="5" y1="58" x2="755" y2="58" stroke="var(--line)" stroke-dasharray="3 3"/>
        <line x1="5" y1="112" x2="755" y2="112" stroke="var(--line)" stroke-dasharray="3 3"/>
        <text x="14" y="38" fill="var(--faint)" font-size="8.5" font-family="DM Mono">FUENTES CRUDAS</text>
        <text x="14" y="88" fill="var(--faint)" font-size="8.5" font-family="DM Mono">PIPELINE PYTHON (ETL)</text>
        <text x="14" y="142" fill="var(--faint)" font-size="8.5" font-family="DM Mono">ENTREGABLES / SMTP</text>

        <circle cx="160" cy="34" r="12" fill="rgba(var(--accent-rgb), 0.15)" stroke="var(--accent)" stroke-width="1.8"/>
        <text x="160" y="37" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">INICIO</text>
        
        <path d="M 172 34 L 205 34" stroke="var(--muted)" stroke-width="1.4"/>
        <rect x="205" y="18" width="115" height="32" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
        <text x="262" y="33" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">48,833 Docs ($323M)</text>

        <path d="M 262 50 L 262 74" stroke="var(--muted)" stroke-width="1.4"/>
        <rect x="205" y="74" width="115" height="32" rx="4" fill="var(--panel2)" stroke="var(--accent)" stroke-width="1.4"/>
        <text x="262" y="89" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">Pandas Batch Ingestion</text>

        <path d="M 320 90 L 360 90" stroke="var(--muted)" stroke-width="1.4"/>
        <rect x="360" y="74" width="125" height="32" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
        <text x="422" y="89" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">Clasificación Estados</text>

        <path d="M 485 90 L 525 90 L 525 128 L 550 128" stroke="var(--accent)" stroke-width="1.4"/>
        <rect x="550" y="114" width="105" height="30" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
        <text x="602" y="129" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">OpenPyXL Formato</text>

        <path d="M 655 129 L 685 129" stroke="var(--accent)" stroke-width="1.4"/>
        <circle cx="705" cy="129" r="12" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/>
        <text x="705" y="132" text-anchor="middle" fill="var(--accent)" font-size="7.5" font-family="DM Mono">SMTP ✉</text>
      </svg>
    `;
  }
  if (caseId === 'ml') {
    return `
      <svg class="bpmn-svg" viewBox="0 0 760 170" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="750" height="160" rx="6" fill="#0c110e" stroke="var(--line)" stroke-width="1.2"/>
        <line x1="5" y1="58" x2="755" y2="58" stroke="var(--line)" stroke-dasharray="3 3"/>
        <line x1="5" y1="112" x2="755" y2="112" stroke="var(--line)" stroke-dasharray="3 3"/>
        <text x="14" y="38" fill="var(--faint)" font-size="8.5" font-family="DM Mono">SENSORES DE PLANTA</text>
        <text x="14" y="88" fill="var(--faint)" font-size="8.5" font-family="DM Mono">PIPELINE ML / SCIKIT</text>
        <text x="14" y="142" fill="var(--faint)" font-size="8.5" font-family="DM Mono">OPERACIONES &amp; ALERTAS</text>

        <circle cx="160" cy="34" r="12" fill="rgba(var(--accent-rgb), 0.15)" stroke="var(--accent)" stroke-width="1.8"/>
        <text x="160" y="37" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">INICIO</text>
        
        <path d="M 172 34 L 205 34" stroke="var(--muted)" stroke-width="1.4"/>
        <rect x="205" y="18" width="115" height="32" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
        <text x="262" y="33" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">Telemetría Temp/RPM</text>

        <path d="M 262 50 L 262 74" stroke="var(--muted)" stroke-width="1.4"/>
        <rect x="205" y="74" width="125" height="32" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
        <text x="267" y="89" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">StandardScaler &amp; SMOTE</text>

        <path d="M 330 90 L 370 90" stroke="var(--muted)" stroke-width="1.4"/>
        <rect x="370" y="74" width="125" height="32" rx="4" fill="var(--panel2)" stroke="var(--accent)" stroke-width="1.4"/>
        <text x="432" y="89" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">Regresión Logística (91.4%)</text>

        <path d="M 495 90 L 530 90" stroke="var(--muted)" stroke-width="1.4"/>
        <polygon points="545,76 567,90 545,104 523,90" fill="var(--panel)" stroke="var(--accent)" stroke-width="1.2"/>
        <text x="545" y="93" text-anchor="middle" fill="var(--accent)" font-size="8.5" font-weight="700">?</text>

        <path d="M 545 104 L 545 128 L 580 128" stroke="var(--rose)" stroke-width="1.4"/>
        <rect x="580" y="114" width="130" height="30" rx="4" fill="var(--panel2)" stroke="var(--rose)"/>
        <text x="645" y="129" text-anchor="middle" fill="var(--rose)" font-size="8" font-family="DM Mono">Alerta Cuadrilla (−22% Paradas)</text>
      </svg>
    `;
  }
  // VASMAD
  return `
    <svg class="bpmn-svg" viewBox="0 0 760 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="750" height="160" rx="6" fill="#0c110e" stroke="var(--line)" stroke-width="1.2"/>
      <line x1="5" y1="58" x2="755" y2="58" stroke="var(--line)" stroke-dasharray="3 3"/>
      <line x1="5" y1="112" x2="755" y2="112" stroke="var(--line)" stroke-dasharray="3 3"/>
      <text x="14" y="38" fill="var(--faint)" font-size="8.5" font-family="DM Mono">PLANEAMIENTO</text>
      <text x="14" y="88" fill="var(--faint)" font-size="8.5" font-family="DM Mono">COMPRAS &amp; MRP</text>
      <text x="14" y="142" fill="var(--faint)" font-size="8.5" font-family="DM Mono">ALMACÉN (5S)</text>

      <circle cx="160" cy="34" r="12" fill="rgba(var(--accent-rgb), 0.15)" stroke="var(--accent)" stroke-width="1.8"/>
      <text x="160" y="37" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">INICIO</text>
      
      <path d="M 172 34 L 205 34" stroke="var(--muted)" stroke-width="1.4"/>
      <rect x="205" y="18" width="115" height="32" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
      <text x="262" y="33" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">Pronóstico Demanda</text>

      <path d="M 262 50 L 262 74" stroke="var(--muted)" stroke-width="1.4"/>
      <rect x="205" y="74" width="125" height="32" rx="4" fill="var(--panel2)" stroke="var(--accent)" stroke-width="1.4"/>
      <text x="267" y="89" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">Explosión BOM &amp; ROP</text>

      <path d="M 330 90 L 370 90" stroke="var(--muted)" stroke-width="1.4"/>
      <rect x="370" y="74" width="130" height="32" rx="4" fill="var(--panel2)" stroke="var(--line)"/>
      <text x="435" y="89" text-anchor="middle" fill="var(--text)" font-size="8" font-family="DM Mono">Power Automate OC</text>

      <path d="M 500 90 L 540 90 L 540 128 L 570 128" stroke="var(--accent)" stroke-width="1.4"/>
      <rect x="570" y="114" width="145" height="30" rx="4" fill="var(--panel2)" stroke="var(--accent)"/>
      <text x="642" y="129" text-anchor="middle" fill="var(--accent)" font-size="8" font-family="DM Mono">Recepción 5S (−30% Tiempo)</text>
    </svg>
  `;
}

function getCaseDeliverablesData(caseId, currentLang) {
  const isEs = currentLang === 'es';
  if (caseId === 'primax') {
    return {
      kpis: [
        { title: isEs ? 'Cumplimiento SLA' : 'SLA Compliance', val: '100%', sub: isEs ? 'Meta pactada: >=98%' : 'Target SLA: >=98%', fill: '100%', highlight: true },
        { title: isEs ? 'Volumen Semanal' : 'Weekly Volume', val: '150+', sub: isEs ? 'Facturas auditadas B2B' : 'B2B Invoices audited', fill: '85%' },
        { title: isEs ? 'Ciclo de Conciliación' : 'Reconciliation Cycle', val: '−45%', sub: isEs ? 'Optimización de tiempos' : 'Processing time reduction', fill: '75%' },
        { title: isEs ? 'Auditoría Externa' : 'External Audits', val: '0 Obs', sub: isEs ? 'Cero discrepancias SAP' : 'Zero discrepancies in SAP', fill: '100%', highlight: true }
      ],
      code: {
        filename: 'dax_sla_and_commercial_kpis.dax',
        lang: 'DAX / Power BI',
        content: `<span class="c-comment">// 1. Medida DAX para Cumplimiento Estricto de SLA Documental</span>
<span class="c-kw">% Cumplimiento SLA</span> = 
<span class="c-fn">DIVIDE</span>(
    <span class="c-fn">CALCULATE</span>(
        <span class="c-fn">COUNTROWS</span>(<span class="c-str">'Facturas_B2B'</span>),
        <span class="c-str">'Facturas_B2B'</span>[Dias_Validacion] &lt;= <span class="c-str">'Facturas_B2B'</span>[SLA_Objetivo_Dias],
        <span class="c-str">'Facturas_B2B'</span>[Estado] = <span class="c-str">"Conciliado"</span>
    ),
    <span class="c-fn">COUNTROWS</span>(<span class="c-str">'Facturas_B2B'</span>),
    <span class="c-num">0</span>
)

<span class="c-comment">// 2. Ventas Consolidadas por Asesor y Región</span>
<span class="c-kw">Ventas_Consolidadas_USD</span> = 
<span class="c-fn">SUMX</span>(
    <span class="c-fn">FILTER</span>(<span class="c-str">'Facturas_B2B'</span>, <span class="c-str">'Facturas_B2B'</span>[Anulada] = <span class="c-kw">FALSE</span>()),
    <span class="c-str">'Facturas_B2B'</span>[Cantidad_Galones] * <span class="c-fn">RELATED</span>(<span class="c-str">'Precios_Combustible'</span>[Precio_Unitario_USD])
)`
      },
      lessons: [
        { title: isEs ? 'Estandarización previa a la automatización' : 'Standardization before coding', desc: isEs ? 'Al inicio, los formatos dispares de los proveedores generaban excepciones manuales. Creé una plantilla de validación que redujo las inconsistencias en un 80% antes de tocar código.' : 'Initially, differing vendor formats caused manual exceptions. Establishing a pre-validation checklist eliminated 80% of mismatches before writing scripts.', type: 'normal' },
        { title: isEs ? 'Fricción en conciliaciones SAP' : 'SAP Reconciliation friction', desc: isEs ? 'Los desfases entre fechas de emisión y de registro contable alteraban los reportes semanales. Ajusté la lógica en Power Query para agrupar por periodo de devengo real.' : 'Mismatches between invoice issuance dates and accounting entries skewed weekly reports. Tuned Power Query logic to group by accrual periods.', type: 'challenge' },
        { title: isEs ? 'Qué mejoraría en una V2' : 'What I would improve in V2', desc: isEs ? 'Integrar OCR con validación automática de códigos QR de SUNAT/SRI para cargar el 100% de metadatos directamente a la base de datos sin digitación humana.' : 'Integrate OCR with direct tax authority QR code validation to ingest 100% of metadata directly into the database.', type: 'next-step' }
      ]
    };
  }
  if (caseId === 'etl') {
    return {
      kpis: [
        { title: isEs ? 'Registros Procesados' : 'Records Processed', val: '48,833', sub: isEs ? 'Auditoría logística completa' : 'Full logistics audit', fill: '100%', highlight: true },
        { title: isEs ? 'Monto Consolidado' : 'Consolidated Amount', val: '$323M+', sub: isEs ? 'En balances operativos' : 'In operational balances', fill: '95%' },
        { title: isEs ? 'Tiempo de Ejecución' : 'Execution Time', val: '18 seg', sub: isEs ? 'De 3.5 hrs manuales a 18s' : 'From 3.5 hrs manual to 18s', fill: '98%', highlight: true },
        { title: isEs ? 'Integridad de Datos' : 'Data Integrity', val: '100%', sub: isEs ? '0 errores de cálculo' : '0 calculation errors', fill: '100%' }
      ],
      code: {
        filename: 'pipeline_etl_logistica.py',
        lang: 'Python (Pandas / OpenPyXL)',
        content: `<span class="c-kw">import</span> pandas <span class="c-kw">as</span> pd
<span class="c-kw">from</span> openpyxl <span class="c-kw">import</span> load_workbook

<span class="c-kw">def</span> <span class="c-fn">process_logistics_batch</span>(raw_file_path: <span class="c-str">str</span>):
    <span class="c-comment"># Ingesta por bloques (chunksize) para optimizar memoria RAM</span>
    chunks = pd.<span class="c-fn">read_csv</span>(raw_file_path, chunksize=<span class="c-num">10000</span>, dtype={<span class="c-str">'ID_Doc'</span>: <span class="c-str">str</span>, <span class="c-str">'Monto'</span>: <span class="c-str">float</span>})
    df = pd.<span class="c-fn">concat</span>([clean_chunk(c) <span class="c-kw">for</span> c <span class="c-kw">in</span> chunks], ignore_index=<span class="c-kw">True</span>)
    
    <span class="c-comment"># Clasificación de 48,833 documentos operativos</span>
    df[<span class="c-str">'Estado_Normalizado'</span>] = df[<span class="c-str">'Estado_Raw'</span>].<span class="c-fn">apply</span>(
        <span class="c-kw">lambda</span> x: <span class="c-str">'CERRADO'</span> <span class="c-kw">if</span> x <span class="c-kw">in</span> [<span class="c-num">1</span>, <span class="c-str">'OK'</span>, <span class="c-str">'CLOSE'</span>] <span class="c-kw">else</span> <span class="c-str">'PENDIENTE'</span>
    )
    resumen = df.<span class="c-fn">groupby</span>(<span class="c-str">'Estado_Normalizado'</span>).<span class="c-fn">agg</span>(
        Total_Docs=(<span class="c-str">'ID_Doc'</span>, <span class="c-str">'count'</span>),
        Monto_USD=(<span class="c-str">'Monto'</span>, <span class="c-str">'sum'</span>)
    )
    <span class="c-kw">return</span> df, resumen`
      },
      lessons: [
        { title: isEs ? 'Optimización de memoria en ejecución local' : 'Memory management on local machines', desc: isEs ? 'Procesar 48K filas de golpe saturaba la memoria en equipos estándar. Implementar chunksize y tipos categóricos redujo el consumo de RAM en un 65%.' : 'Ingesting 48K rows at once exhausted RAM on standard machines. Implementing chunksize and categorical types cut RAM usage by 65%.', type: 'normal' },
        { title: isEs ? 'Fechas y nulos no controlados' : 'Uncontrolled nulls and date formats', desc: isEs ? 'Alrededor del 3% de los registros tenían fechas en formatos inconsistentes (DD/MM vs MM/DD). Añadí un módulo de validación con regex y log de auditoría.' : 'Around 3% of rows had mixed date formats (DD/MM vs MM/DD). Added a regex parser and automated exception log.', type: 'challenge' },
        { title: isEs ? 'Qué mejoraría en una V2' : 'What I would improve in V2', desc: isEs ? 'Migrar el script a una arquitectura serverless (AWS Lambda / Google Cloud Run) para ejecución automática ante la llegada de nuevos archivos a un bucket S3.' : 'Migrate to a serverless pipeline (Cloud Run / AWS Lambda) triggered by S3 bucket uploads.', type: 'next-step' }
      ]
    };
  }
  if (caseId === 'ml') {
    return {
      kpis: [
        { title: isEs ? 'Precisión (Accuracy)' : 'Model Accuracy', val: '91.4%', sub: isEs ? 'En conjunto de prueba' : 'On test holdout set', fill: '91%', highlight: true },
        { title: isEs ? 'F1-Score Fallas' : 'Failure F1-Score', val: '0.88', sub: isEs ? 'Balance Precision / Recall' : 'Precision/Recall balance', fill: '88%' },
        { title: isEs ? 'Paradas Imprevistas' : 'Unplanned Downtime', val: '−22%', sub: isEs ? 'Reducción en planta' : 'Plant downtime reduction', fill: '70%', highlight: true },
        { title: isEs ? 'Falsos Positivos' : 'False Positive Rate', val: '< 4.8%', sub: isEs ? 'Control de alertas falsas' : 'Controlled false alarms', fill: '95%' }
      ],
      code: {
        filename: 'predictive_maintenance_model.py',
        lang: 'Python (scikit-learn)',
        content: `<span class="c-kw">from</span> sklearn.linear_model <span class="c-kw">import</span> LogisticRegression
<span class="c-kw">from</span> sklearn.preprocessing <span class="c-kw">import</span> StandardScaler
<span class="c-kw">from</span> sklearn.metrics <span class="c-kw">import</span> classification_report, roc_auc_score

<span class="c-comment"># Pipeline de escalado y entrenamiento</span>
scaler = <span class="c-fn">StandardScaler</span>()
features = [<span class="c-str">'temperatura_c'</span>, <span class="c-str">'torque_nm'</span>, <span class="c-str">'rpm_eje'</span>, <span class="c-str">'vibracion_hz'</span>]
X_train_scaled = scaler.<span class="c-fn">fit_transform</span>(X_train[features])

<span class="c-comment"># Manejo de desbalanceo severo de clases (2% fallas)</span>
model = <span class="c-fn">LogisticRegression</span>(class_weight=<span class="c-str">'balanced'</span>, solver=<span class="c-str">'liblinear'</span>, random_state=<span class="c-num">42</span>)
model.<span class="c-fn">fit</span>(X_train_scaled, y_train)

y_pred_proba = model.<span class="c-fn">predict_proba</span>(scaler.<span class="c-fn">transform</span>(X_test[features]))[:, <span class="c-num">1</span>]
print(f<span class="c-str">"ROC-AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}"</span>)`
      },
      lessons: [
        { title: isEs ? 'El sesgo del 98% de exactitud' : 'The 98% Accuracy Trap', desc: isEs ? 'Con solo un 2% de fallas, predecir siempre "sin falla" daba 98% de accuracy pero era inútil. Enfocarme en Recall y la curva ROC-AUC fue lo que realmente aportó valor operativo.' : 'With only 2% failures, a naive model achieved 98% accuracy but was useless. Optimizing Recall and ROC-AUC delivered real operational value.', type: 'normal' },
        { title: isEs ? 'Ruido en la telemetría' : 'Sensor telemetry noise', desc: isEs ? 'Picos transitorios de arranque disparaban falsas alarmas. Implementé una ventana móvil de suavizado (rolling mean de 3 muestras) para estabilizar la señal.' : 'Motor startup spikes triggered false alarms. Added a 3-sample rolling mean smoothing filter to stabilize sensor signals.', type: 'challenge' },
        { title: isEs ? 'Qué mejoraría en una V2' : 'What I would improve in V2', desc: isEs ? 'Probar un ensamble Gradient Boosting (XGBoost/LightGBM) y desplegar un microservicio en FastAPI conectado a sensores IoT MQTT en tiempo real.' : 'Benchmark Gradient Boosting (LightGBM) and deploy as a lightweight FastAPI microservice listening to MQTT IoT streams.', type: 'next-step' }
      ]
    };
  }
  // VASMAD
  return {
    kpis: [
      { title: isEs ? 'Costos Desabastecimiento' : 'Stockout Costs', val: '−15%', sub: isEs ? 'Optimización con MRP' : 'MRP inventory savings', fill: '75%', highlight: true },
      { title: isEs ? 'Tiempo de Descarga' : 'Unloading Turnaround', val: '−30%', sub: isEs ? 'Estandarización 5S' : '5S Lean standard', fill: '80%', highlight: true },
      { title: isEs ? 'Rotación de Inventarios' : 'Inventory Turnover', val: '+25%', sub: isEs ? 'En ítems de alta rotación' : 'On critical SKUs', fill: '85%' },
      { title: isEs ? 'Espacio Útil Almacén' : 'Usable Warehouse Space', val: '+18%', sub: isEs ? 'Reorganización de layout' : 'Layout reorganization', fill: '70%' }
    ],
    code: {
      filename: 'mrp_reorder_point_calculations.sql',
      lang: 'SQL / Supply Chain',
      content: `<span class="c-comment">-- Cálculo dinámico de Punto de Reorden (ROP) y Stock de Seguridad</span>
<span class="c-kw">WITH</span> Parametros_Logistica <span class="c-kw">AS</span> (
    <span class="c-kw">SELECT</span> 
        sku_id,
        <span class="c-fn">AVG</span>(demanda_diaria_unidades) <span class="c-kw">AS</span> d_promedio,
        <span class="c-fn">STDEV</span>(demanda_diaria_unidades) <span class="c-kw">AS</span> d_desv_std,
        <span class="c-fn">AVG</span>(lead_time_dias) <span class="c-kw">AS</span> lt_promedio,
        <span class="c-num">1.645</span> <span class="c-kw">AS</span> z_score_95_pct <span class="c-comment">-- Nivel de Servicio 95%</span>
    <span class="c-kw">FROM</span> registro_consumo_insumos
    <span class="c-kw">GROUP BY</span> sku_id
)
<span class="c-kw">SELECT</span> 
    sku_id,
    <span class="c-fn">ROUND</span>(d_promedio * lt_promedio + (z_score_95_pct * d_desv_std * <span class="c-fn">SQRT</span>(lt_promedio)), <span class="c-num">0</span>) <span class="c-kw">AS</span> punto_de_reorden_unidades
<span class="c-kw">FROM</span> Parametros_Logistica;`
    },
    lessons: [
      { title: isEs ? 'La teoría del MRP vs la realidad del almacén' : 'MRP theory meets physical reality', desc: isEs ? 'Tener fórmulas precisas no servía si los operarios no encontraban el material físico. Implementar primero las 5S y zonificación por colores fue el pilar del éxito.' : 'Precise formulas were useless if workers could not find physical items. Deploying 5S visual tagging first was the key enabler.', type: 'normal' },
      { title: isEs ? 'Resistencia al cambio en compras' : 'Procurement resistance to change', desc: isEs ? 'Los compradores pedían por intuición. Crear una interfaz sencilla en Excel que sugería la cantidad exacta de reposición con base en el ROP generó confianza gradual.' : 'Buyers ordered based on intuition. Building a clean Excel tool that suggested exact replenishment based on ROP earned gradual trust.', type: 'challenge' },
      { title: isEs ? 'Qué mejoraría en una V2' : 'What I would improve in V2', desc: isEs ? 'Conectar el cálculo de ROP directamente con la API del ERP para emitir órdenes de compra electrónicas de forma totalmente desatendida.' : 'Connect ROP calculations directly to the ERP API for fully automated purchase order dispatch.', type: 'next-step' }
    ]
  };
}

function renderStarCaseContent(caseId, activeTab = 'context') {
  const dict = CASE_DETAILS[lang] || CASE_DETAILS.es;
  const data = dict[caseId] || dict.primax;
  if (!data) return '';

  const deliv = getCaseDeliverablesData(caseId, lang);
  const isEs = lang === 'es';

  const tabLabels = {
    context: isEs ? '01. Contexto &amp; STAR' : '01. Context &amp; STAR',
    bpmn: isEs ? '02. Flujo BPMN (Bizagi)' : '02. BPMN Flow (Bizagi)',
    kpis: isEs ? '03. Dashboard &amp; KPIs' : '03. Dashboard &amp; KPIs',
    code: isEs ? '04. Código &amp; DAX' : '04. Code &amp; DAX',
    lessons: isEs ? '05. Lecciones de Campo' : '05. Field Lessons'
  };

  let paneHtml = '';

  if (activeTab === 'bpmn') {
    paneHtml = `
      <div class="case-tab-pane">
        <div class="bpmn-diagram-wrap">
          <div class="bpmn-header-bar">
            <span class="bpmn-tag">// BIZAGI BPMN 2.0 // MAPEO DE PROCESO AS-IS &amp; TO-BE</span>
            <span class="bpmn-badge">${isEs ? 'Vector SVG Interactivo' : 'Interactive SVG Vector'}</span>
          </div>
          ${getBpmnSvg(caseId)}
          <div class="bpmn-legend">
            <div class="bpmn-legend-item"><span class="bpmn-legend-box" style="background:var(--accent);"></span> <span>${isEs ? 'Punto Clave / Automatización' : 'Key Milestone / Automation'}</span></div>
            <div class="bpmn-legend-item"><span class="bpmn-legend-box" style="background:var(--panel2); border:1px solid var(--line);"></span> <span>${isEs ? 'Tarea Operativa' : 'Operational Task'}</span></div>
            <div class="bpmn-legend-item"><span class="bpmn-legend-box" style="background:var(--rose);"></span> <span>${isEs ? 'Excepción / Alerta' : 'Exception / Alert'}</span></div>
          </div>
        </div>
      </div>
    `;
  } else if (activeTab === 'kpis') {
    paneHtml = `
      <div class="case-tab-pane">
        <div class="kpi-dashboard-grid">
          ${deliv.kpis.map(k => `
            <div class="kpi-card">
              <p class="kpi-metric-title">${escapeHtml(k.title)}</p>
              <h4 class="kpi-metric-num ${k.highlight ? 'highlight' : ''}">${escapeHtml(k.val)}</h4>
              <div class="kpi-progress-track"><div class="kpi-progress-fill" style="width:${k.fill || '80%'};"></div></div>
              <p class="kpi-metric-sub">${escapeHtml(k.sub)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeTab === 'code') {
    paneHtml = `
      <div class="case-tab-pane">
        <div class="code-snippet-box">
          <div class="code-header">
            <span class="code-filename">${escapeHtml(deliv.code.filename)}</span>
            <span class="muted">${escapeHtml(deliv.code.lang)}</span>
          </div>
          <pre class="code-body"><code>${deliv.code.content}</code></pre>
        </div>
      </div>
    `;
  } else if (activeTab === 'lessons') {
    paneHtml = `
      <div class="case-tab-pane">
        <div class="field-notes-box">
          ${deliv.lessons.map(l => `
            <div class="field-note-item ${l.type}">
              <h5 class="field-note-title">${escapeHtml(l.title)}</h5>
              <p class="field-note-desc">${escapeHtml(l.desc)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // Default: 'context' (STAR Grid)
    const sLabel = isEs ? 'Situación / Contexto' : 'Situation / Context';
    const tLabel = isEs ? 'Tarea / Objetivo' : 'Task / Objective';
    const aLabel = isEs ? 'Acción / Solución' : 'Action / Solution';
    const rLabel = isEs ? 'Resultado / Impacto' : 'Result / Impact';

    paneHtml = `
      <div class="case-tab-pane">
        <div class="star-grid">
          <div class="star-card">
            <div class="star-label"><span>S</span> ${sLabel}</div>
            <p>${escapeHtml(data.situation)}</p>
          </div>
          <div class="star-card">
            <div class="star-label"><span>T</span> ${tLabel}</div>
            <p>${escapeHtml(data.task)}</p>
          </div>
          <div class="star-card">
            <div class="star-label"><span>A</span> ${aLabel}</div>
            <p>${escapeHtml(data.action)}</p>
          </div>
          <div class="star-card">
            <div class="star-label"><span>R</span> ${rLabel}</div>
            <p><strong>${escapeHtml(data.result)}</strong></p>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="star-modal-content" data-active-case="${caseId}">
      <div class="star-modal-header">
        <p class="star-kicker">${escapeHtml(data.kicker)}</p>
        <h3 class="star-title">${escapeHtml(data.title)}</h3>
        <p class="star-subtitle">${escapeHtml(data.subtitle)}</p>
      </div>
      <nav class="case-tabs-nav" aria-label="Entregables del caso">
        <button type="button" class="case-tab-btn ${activeTab === 'context' ? 'active' : ''}" data-tab-target="context"><span class="tab-num">01</span> ${tabLabels.context}</button>
        <button type="button" class="case-tab-btn ${activeTab === 'bpmn' ? 'active' : ''}" data-tab-target="bpmn"><span class="tab-num">02</span> ${tabLabels.bpmn}</button>
        <button type="button" class="case-tab-btn ${activeTab === 'kpis' ? 'active' : ''}" data-tab-target="kpis"><span class="tab-num">03</span> ${tabLabels.kpis}</button>
        <button type="button" class="case-tab-btn ${activeTab === 'code' ? 'active' : ''}" data-tab-target="code"><span class="tab-num">04</span> ${tabLabels.code}</button>
        <button type="button" class="case-tab-btn ${activeTab === 'lessons' ? 'active' : ''}" data-tab-target="lessons"><span class="tab-num">05</span> ${tabLabels.lessons}</button>
      </nav>
      <div class="case-tab-body">
        ${paneHtml}
      </div>
      <div class="star-footer">
        <span class="muted" style="font-size:9px; text-transform:uppercase; letter-spacing:0.08em;">// Stack Tecnológico Verificado</span>
        <ul class="star-tags">
          ${data.tags.map(tag => `<li>${escapeHtml(tag)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function openCaseModal(caseId, activeTab = 'context') {
  const modal = document.querySelector('#caseModal');
  const body = document.querySelector('#caseModalBody');
  if (!modal || !body) return;

  const validCase = (caseId === '1' || caseId === 'primax') ? 'primax'
    : (caseId === '2' || caseId === 'etl' || caseId === 'pipeline' || caseId === 'logistics_etl') ? 'etl'
    : (caseId === '3' || caseId === 'ml' || caseId === 'machine') ? 'ml'
    : (caseId === '4' || caseId === 'vasmad' || caseId === 'logistics') ? 'vasmad'
    : 'primax';

  body.innerHTML = renderStarCaseContent(validCase, activeTab);
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function closeCaseModal() {
  const modal = document.querySelector('#caseModal');
  if (!modal) return;
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

function initCaseModals() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-case]');
    if (btn) {
      e.preventDefault();
      const caseId = btn.getAttribute('data-case');
      openCaseModal(caseId, 'context');
      return;
    }

    const tabBtn = e.target.closest('.case-tab-btn[data-tab-target]');
    if (tabBtn) {
      e.preventDefault();
      const targetTab = tabBtn.getAttribute('data-tab-target');
      const container = tabBtn.closest('.star-modal-content');
      const caseId = container ? container.getAttribute('data-active-case') : 'primax';
      const body = document.querySelector('#caseModalBody');
      if (body) {
        body.innerHTML = renderStarCaseContent(caseId, targetTab);
      }
    }
  });

  const closeBtn = document.querySelector('#closeCaseBtn');
  const modal = document.querySelector('#caseModal');
  closeBtn?.addEventListener('click', closeCaseModal);
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeCaseModal();
  });
}

// --- Terms of Use & Privacy Modal Control ---
function renderTermsContent() {
  const data = TERMS_CONTENT[lang] || TERMS_CONTENT.es;
  return `
    <div class="terms-modal-content">
      <div class="terms-header-block">
        <p class="terms-kicker">${escapeHtml(data.kicker)}</p>
        <h3 class="terms-title">${escapeHtml(data.title)}</h3>
        <p class="terms-subtitle">${escapeHtml(data.subtitle)}</p>
      </div>
      <div class="terms-grid">
        ${data.sections.map(sec => `
          <div class="terms-item">
            <h4>${escapeHtml(sec.title)}</h4>
            <p>${sec.text}</p>
          </div>
        `).join('')}
      </div>
      <div class="terms-footer-note">
        ${escapeHtml(data.note)}
      </div>
    </div>
  `;
}

function openTermsModal() {
  const modal = document.querySelector('#termsModal');
  const body = document.querySelector('#termsModalBody');
  if (!modal || !body) return;

  body.innerHTML = renderTermsContent();
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function closeTermsModal() {
  const modal = document.querySelector('#termsModal');
  if (!modal) return;
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

function initTermsModal() {
  const openBtn = document.querySelector('#openTermsBtn');
  const closeBtn = document.querySelector('#closeTermsBtn');
  const modal = document.querySelector('#termsModal');

  openBtn?.addEventListener('click', e => {
    e.preventDefault();
    openTermsModal();
  });
  closeBtn?.addEventListener('click', closeTermsModal);
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeTermsModal();
  });
}

// --- Toast & Copy to Clipboard ---
let toastTimeout = null;
function showToast(msg) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function initCopyButtons() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const textToCopy = btn.getAttribute('data-copy');
    if (!textToCopy) return;

    if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }
    showToast(T[lang].copiedToast || (lang === 'es' ? '✓ Copiado al portapapeles' : '✓ Copied to clipboard'));
  });
}

// --- CLI Interactive Process & ROI Simulator ---
function calculateSimulatorCli(vol = 150, min = 12, autoPct = 75) {
  const ar = autoPct / 100;
  const tmh = (vol * (min / 60) * 4.333);
  const hs = tmh * ar;
  const sf = 1 / Math.max(0.05, (1 - ar * 0.9));
  const cs = Math.round(hs * 10);
  const ws = Math.max(1, Math.round(hs / 8));
  
  if (lang === 'es') {
    return `
      <div class="cli-simulator-box">
        <p class="cli-sim-title">⚡ <strong>CALCULADORA DE IMPACTO OPERATIVO (ROI)</strong></p>
        <div class="cli-sim-params">
          <span>📦 <b>Volumen:</b> ${vol} docs/sem</span>
          <span>⏱ <b>Tiempo manual:</b> ${min} min/doc</span>
          <span>⚙ <b>Automatización:</b> ${autoPct}%</span>
        </div>
        <div class="cli-sim-metrics">
          <div class="cli-sim-stat">
            <span class="cli-label">HORAS AHORRADAS / MES</span>
            <strong class="green">${hs.toFixed(1)} hrs</strong>
            <small>≈ ${ws} jornadas laborales recuperadas</small>
          </div>
          <div class="cli-sim-stat">
            <span class="cli-label">VELOCIDAD DE PROCESO</span>
            <strong class="green">${sf.toFixed(1)}x</strong>
            <small>Reducción del ${autoPct}% en tiempo de ciclo</small>
          </div>
          <div class="cli-sim-stat">
            <span class="cli-label">AHORRO OPERATIVO EST.</span>
            <strong class="green">$ ${cs.toLocaleString()} / mes</strong>
            <small>Base estándar $10/hora</small>
          </div>
        </div>
        <div class="cli-sim-presets">
          <span class="muted">Probar escenarios rápidos:</span>
          <button class="quick-run" type="button" data-run="simulate 150 12 75">Caso PRIMAX (150 facturas)</button>
          <button class="quick-run" type="button" data-run="simulate 300 10 70">Operación Logística (300 docs)</button>
          <button class="quick-run" type="button" data-run="simulate 500 15 85">Alta Escala (500 docs)</button>
        </div>
        <p class="cli-sim-hint"><small class="muted">Tip: También puedes escribir <code>simulate [volumen] [minutos] [%auto]</code> (ej. <code>simulate 250 15 80</code>)</small></p>
      </div>
    `;
  } else {
    return `
      <div class="cli-simulator-box">
        <p class="cli-sim-title">⚡ <strong>OPERATIONAL IMPACT &amp; ROI CALCULATOR</strong></p>
        <div class="cli-sim-params">
          <span>📦 <b>Volume:</b> ${vol} docs/wk</span>
          <span>⏱ <b>Manual Time:</b> ${min} min/doc</span>
          <span>⚙ <b>Automation:</b> ${autoPct}%</span>
        </div>
        <div class="cli-sim-metrics">
          <div class="cli-sim-stat">
            <span class="cli-label">MAN-HOURS SAVED / MO</span>
            <strong class="green">${hs.toFixed(1)} hrs</strong>
            <small>≈ ${ws} work shifts recovered</small>
          </div>
          <div class="cli-sim-stat">
            <span class="cli-label">PROCESSING SPEEDUP</span>
            <strong class="green">${sf.toFixed(1)}x</strong>
            <small>${autoPct}% cycle time reduction</small>
          </div>
          <div class="cli-sim-stat">
            <span class="cli-label">ESTIMATED SAVINGS</span>
            <strong class="green">$ ${cs.toLocaleString()} / mo</strong>
            <small>$10/hr baseline</small>
          </div>
        </div>
        <div class="cli-sim-presets">
          <span class="muted">Quick scenarios:</span>
          <button class="quick-run" type="button" data-run="simulate 150 12 75">PRIMAX Case (150 invoices)</button>
          <button class="quick-run" type="button" data-run="simulate 300 10 70">Logistics Flow (300 docs)</button>
          <button class="quick-run" type="button" data-run="simulate 500 15 85">Heavy Scale (500 docs)</button>
        </div>
        <p class="cli-sim-hint"><small class="muted">Tip: You can also type <code>simulate [volume] [minutes] [%auto]</code> (e.g. <code>simulate 250 15 80</code>)</small></p>
      </div>
    `;
  }
}



// --- 3D Tilt Card Effects ---
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      const shiftX = ((x - centerX) / centerX) * 8;
      const shiftY = ((y - centerY) / centerY) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--shift-x', `${shiftX.toFixed(2)}px`);
      card.style.setProperty('--shift-y', `${shiftY.toFixed(2)}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.setProperty('--shift-x', '0px');
      card.style.setProperty('--shift-y', '0px');
    });
  });
}

// --- Scrollspy Navigation Indicator ---
function initScrollspy() {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (!navLinks.length || typeof IntersectionObserver !== 'function') return;

  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-10% 0px -40% 0px' });

  sections.forEach(sec => observer.observe(sec));
}

// --- Event Listeners with Null Guards ---
document.querySelector('#language')?.addEventListener('click', () => {
  lang = lang === 'es' ? 'en' : 'es';
  translate();
});

document.querySelector('#view')?.addEventListener('click', () => {
  setView(recruiter?.classList.contains('show') ? 'terminal' : 'recruiter', true);
});

// ==========================================================================
// Web Audio Terminal Sound Effects Engine
// Ultra-low latency synthetic mechanical keystroke clicks, space, and enter feedback
// ==========================================================================
let audioCtx = null;
let isAudioEnabled = true;

function getAudioContext() {
  if (!audioCtx && (typeof window !== 'undefined')) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playKeySound(type = 'char') {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    if (type === 'enter') {
      // Enter Key: Satisfying dual mechanical latch + confirmation tone
      masterGain.gain.setValueAtTime(0.065, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.06);

      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(680, now);
      clickOsc.frequency.exponentialRampToValueAtTime(220, now + 0.03);
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.03, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.03);

    } else if (type === 'space') {
      // Space Bar: Deeper acoustic resonance
      masterGain.gain.setValueAtTime(0.05, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.03);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.035);

    } else if (type === 'backspace') {
      // Backspace / Delete: Muted hollow click
      masterGain.gain.setValueAtTime(0.045, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.025);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.028);

    } else if (type === 'tab') {
      // Tab Autocomplete: Quick high-frequency micro chirp
      masterGain.gain.setValueAtTime(0.04, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.02);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.025);

    } else {
      // Standard Keypress: Tactile mechanical switch click (randomized pitch ± 40Hz)
      const baseFreq = 340 + (Math.random() * 80 - 40);
      masterGain.gain.setValueAtTime(0.042, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.018);
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.022);

      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'square';
      const clickFreq = 1100 + (Math.random() * 200 - 100);
      clickOsc.frequency.setValueAtTime(clickFreq, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.012);
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.02, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.012);
    }
  } catch (e) {}
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-run], [data-view], [data-command]');
  if (!b) return;
  if (b.dataset.view) {
    e.preventDefault();
    setView(b.dataset.view, true);
    return;
  }
  const cmd = b.dataset.run || b.dataset.command;
  if (cmd) {
    e.preventDefault();
    playKeySound('enter');
    runCommand(cmd);
    if (b.dataset.command) {
      document.querySelector('#terminal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

document.querySelector('#command')?.addEventListener('submit', e => {
  e.preventDefault();
  playKeySound('enter');
  if (input) {
    const val = input.value;
    input.value = '';
    const ghost = document.querySelector('#ghostText');
    if (ghost) ghost.textContent = '';
    runCommand(val);
  }
});

// Ghost Text Real-time Matching
function updateGhostText() {
  const ghost = document.querySelector('#ghostText');
  if (!ghost || !input) return;
  const val = input.value;
  if (!val || isAiMode) {
    ghost.textContent = '';
    return;
  }
  const lower = val.toLowerCase();
  const match = names.find(n => n.startsWith(lower));
  if (match && match !== lower) {
    ghost.textContent = val + match.slice(val.length);
  } else {
    ghost.textContent = '';
  }
}

input?.addEventListener('input', updateGhostText);

input?.addEventListener('keydown', e => {
  const ghost = document.querySelector('#ghostText');
  const isAtEnd = (input.selectionStart === input.value.length);

  // Play synthetic tactile keystroke sound
  if (e.key === 'Enter') {
    playKeySound('enter');
  } else if (e.key === ' ') {
    playKeySound('space');
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    playKeySound('backspace');
  } else if (e.key === 'Tab') {
    playKeySound('tab');
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    playKeySound('backspace');
  } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
    playKeySound('char');
  }
  
  if (keyMatch(e, 'Tab') || (e.key === 'ArrowRight' && isAtEnd)) {
    const q = input.value.trim().toLowerCase();
    if (q) {
      const match = names.find(n => n.startsWith(q));
      if (match) {
        e.preventDefault();
        input.value = match;
        if (ghost) ghost.textContent = '';
      }
    }
  }
  if (!history.length) return;
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (index === -1) {
      draftInput = input.value;
    }
    index = Math.min(index + 1, history.length - 1);
    input.value = history[index];
    if (ghost) ghost.textContent = '';
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (index > -1) {
      index--;
      if (index === -1) {
        input.value = draftInput;
      } else {
        input.value = history[index];
      }
      if (ghost) ghost.textContent = '';
    }
  }
});

function keyMatch(e, key) {
  return e.key === key;
}

// Bitácora / AI Mode Toggle in Terminal Bar
document.querySelectorAll('#terminalAiToggle, #terminalLogToggle').forEach(btn => {
  btn.addEventListener('click', () => {
    isAiMode = !isAiMode;
    updateTerminalAiState();
    playKeySound('enter');
    addOutput(
      isAiMode ? '[MODO BITÁCORA ACTIVADO]' : '[MODO BASH]',
      '<p><span class="green">' + (isAiMode 
        ? (lang === 'es' ? 'Bitácora técnica y notas de campo activadas. Escribe consultas o comandos <code>cat [archivo]</code> (o escribe <code>exit</code> para volver).' : 'Engineering log and dev notes activated. Type queries or <code>cat [file]</code> (or type <code>exit</code> to return).')
        : (lang === 'es' ? 'Modo Bash estándar activo. Escribe <code>help</code> para ver comandos disponibles.' : 'Standard Bash mode active. Type <code>help</code> to see available commands.')) + '</span></p>'
    );
    input?.focus();
  });
});

// Terminal Audio Toggle Action
document.querySelector('#terminalAudioToggle')?.addEventListener('click', () => {
  isAudioEnabled = !isAudioEnabled;
  const btn = document.querySelector('#terminalAudioToggle');
  if (btn) {
    btn.textContent = isAudioEnabled ? 'SND' : 'MUTE';
    btn.title = isAudioEnabled ? (lang === 'es' ? 'Sonido: Activado' : 'Sound: Enabled') : (lang === 'es' ? 'Sonido: Silenciado' : 'Sound: Muted');
    btn.classList.toggle('active', isAudioEnabled);
  }
  if (isAudioEnabled) playKeySound('tab');
  showToast(isAudioEnabled ? (lang === 'es' ? 'Sonido de teclado activado' : 'Keyboard sound enabled') : (lang === 'es' ? 'Sonido de teclado silenciado' : 'Keyboard sound muted'));
  input?.focus();
});

// Terminal Copy Log Action
document.querySelector('#terminalCopyBtn')?.addEventListener('click', () => {
  playKeySound('enter');
  if (!out) return;
  const text = out.innerText || out.textContent || '';
  if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  const btn = document.querySelector('#terminalCopyBtn');
  if (btn) {
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<span class="btn-text">✓</span>';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = origHtml;
      btn.classList.remove('copied');
    }, 1500);
  }
  showToast(lang === 'es' ? 'Log de terminal copiado' : 'Terminal log copied');
});

// Click anywhere in terminal to focus input (unless selecting text or clicking buttons)
document.querySelector('#terminalWindow')?.addEventListener('click', (e) => {
  if (e.target.closest('button, a, input, textarea, pre')) return;
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) return;
  input?.focus();
});

// Terminal Maximize / Restore Action
document.querySelector('#terminalMaximizeBtn')?.addEventListener('click', () => {
  playKeySound('enter');
  const term = document.querySelector('#terminalWindow') || document.querySelector('#terminal');
  if (term) {
    term.classList.toggle('maximized');
    const isMax = term.classList.contains('maximized');
    const btn = document.querySelector('#terminalMaximizeBtn');
    if (btn) btn.textContent = isMax ? 'MIN' : 'MAX';
    input?.focus();
  }
});

// AI Quick Question Chips Handler
document.addEventListener('click', e => {
  const chip = (e.target && typeof e.target.closest === 'function') ? e.target.closest('.ai-chip[data-ai-query]') : null;
  if (!chip) return;
  if (typeof e.preventDefault === 'function') e.preventDefault();
  const query = chip.getAttribute('data-ai-query');
  if (query) {
    if (input) input.value = '';
    const ghost = document.querySelector('#ghostText');
    if (ghost) ghost.textContent = '';
    runCommand(query);
    document.querySelector('#terminal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

document.querySelector('#clear')?.addEventListener('click', () => {
  if (out) out.innerHTML = '';
  input?.focus();
});

// Brand Link Click Interaction (Smooth Scroll + Cyber Pulse Wave)
document.querySelector('#brandLink')?.addEventListener('click', e => {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const brand = document.querySelector('#brandLink');
  if (brand) {
    brand.classList.add('brand-active-pulse');
    setTimeout(() => brand.classList.remove('brand-active-pulse'), 600);
  }
  if (typeof playKeySound === 'function') playKeySound('tab');
  if (typeof window !== 'undefined' && typeof window.__triggerRipple === 'function') {
    const rect = (brand && typeof brand.getBoundingClientRect === 'function')
      ? brand.getBoundingClientRect()
      : { left: 40, top: 40 };
    window.__triggerRipple(rect.left + 20, rect.top + 20, 1.4);
  }
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const terminal = document.querySelector('#terminalWindow');
  if (terminal) {
    terminal.classList.add('term-executing');
    setTimeout(() => terminal.classList.remove('term-executing'), 400);
  }
});

// Theme Selector Definition
const themes = ['', 'cyan', 'amber'];

document.querySelector('#theme')?.addEventListener('click', () => {
  theme = (theme + 1) % themes.length;
  if (body) body.dataset.theme = themes[theme];
  updateThemeButtonLabel();
});

// Mailto Contact Form Handler
document.querySelector('#contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.currentTarget);
  const subject = encodeURIComponent('Contacto desde tu portafolio — ' + d.get('name'));
  const text = encodeURIComponent('Nombre: ' + d.get('name') + '\nCorreo: ' + d.get('email') + '\n\n' + d.get('message'));
  location.href = 'mailto:alessandro.altamirano23@gmail.com?subject=' + subject + '&body=' + text;
});

// Real-time Clock & Footer Year Initialization
function updateClock() {
  const clockEl = document.querySelector('#clock');
  if (clockEl) {
    clockEl.textContent = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());
  }
}

updateClock();
setInterval(updateClock, 30000);

const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ==========================================================================
// ReactBits Depth-Text 3D Preloader Controller
// Multi-layer 3D extrusion, mouse-driven parallax and system boot progression
// ==========================================================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const stage = document.getElementById('depthTextStage');
  const container = document.getElementById('depthTextContainer');
  const statusEl = document.getElementById('preloaderStatus');
  const barEl = document.getElementById('preloaderBar');
  const pctEl = document.getElementById('preloaderPct');
  const skipBtn = document.getElementById('preloaderSkip');

  let progress = 0;
  let isDone = false;
  let animFrame = null;
  let floatAngle = 0;

  const steps = [
    { threshold: 0, textEs: 'INICIALIZANDO ARQUITECTURA DE SISTEMA...', textEn: 'INITIALIZING SYSTEM ARCHITECTURE...' },
    { threshold: 24, textEs: 'CARGANDO MÓDULOS: SUPPLY CHAIN & DATA OPS...', textEn: 'LOADING DATA & OPERATIONS CORE...' },
    { threshold: 52, textEs: 'CONECTANDO MOTOR ETL & WORKFLOWS DE PMO...', textEn: 'CONNECTING ETL & PMO WORKFLOWS...' },
    { threshold: 78, textEs: 'VERIFICANDO CREDENCIALES PROFESIONALES...', textEn: 'VERIFYING CREDENTIALS & METRICS...' },
    { threshold: 95, textEs: 'SISTEMA LISTO. DESPLEGANDO PORTAFOLIO...', textEn: 'SYSTEM READY. LAUNCHING PORTFOLIO...' }
  ];

  function updateStatus(val) {
    const matched = steps.slice().reverse().find(s => val >= s.threshold);
    if (matched && statusEl) {
      statusEl.textContent = lang === 'es' ? matched.textEs : matched.textEn;
    }
  }

  function setProgress(val) {
    progress = Math.min(100, Math.max(0, val));
    if (barEl) barEl.style.width = progress + '%';
    if (pctEl) pctEl.textContent = Math.round(progress) + '%';
    updateStatus(progress);
  }

  function completePreloader() {
    if (isDone) return;
    isDone = true;
    setProgress(100);
    if (animFrame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(animFrame);

    preloader.classList.add('preloader-hidden');
    setTimeout(() => {
      if (preloader) {
        preloader.style.display = 'none';
      }
    }, 700);
  }

  // Mouse move 3D tilt tracking
  function handlePointer(clientX, clientY) {
    if (!stage || isDone) return;
    const rect = typeof stage.getBoundingClientRect === 'function' ? stage.getBoundingClientRect() : { left: 0, top: 0, width: 600, height: 200 };
    const winW = typeof window !== 'undefined' && window.innerWidth ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' && window.innerHeight ? window.innerHeight : 800;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (clientX - centerX) / (winW / 2);
    const normY = (clientY - centerY) / (winH / 2);

    const rotY = (normX * 18).toFixed(2);
    const rotX = (-normY * 15).toFixed(2);
    const depthX = (normX * 12).toFixed(2);
    const depthY = (normY * 12).toFixed(2);

    if (container && typeof container.style?.setProperty === 'function') {
      container.style.setProperty('--rot-x', `${rotX}deg`);
      container.style.setProperty('--rot-y', `${rotY}deg`);
      container.style.setProperty('--depth-x', `${depthX}px`);
      container.style.setProperty('--depth-y', `${depthY}px`);
    }
  }

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('mousemove', e => handlePointer(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', e => {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // Subtle ambient float animation when idle
  function ambientFloat() {
    if (isDone) return;
    floatAngle += 0.035;
    const floatX = Math.sin(floatAngle) * 3;
    const floatY = Math.cos(floatAngle * 0.8) * 2.5;
    
    if (container && typeof container.style?.setProperty === 'function') {
      container.style.setProperty('--depth-x', `${floatX.toFixed(2)}px`);
      container.style.setProperty('--depth-y', `${floatY.toFixed(2)}px`);
    }
    if (typeof requestAnimationFrame === 'function') {
      animFrame = requestAnimationFrame(ambientFloat);
    }
  }
  if (typeof requestAnimationFrame === 'function') {
    animFrame = requestAnimationFrame(ambientFloat);
  }

  // Progressive simulation ticker (approx 1.8s total)
  const startTime = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now();
  const totalDuration = 1800;

  function tickProgress(now) {
    if (isDone) return;
    const currentTime = now || ((typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now());
    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(1, elapsed / totalDuration);
    const eased = 1 - Math.pow(1 - rawProgress, 2.5);
    setProgress(eased * 100);

    if (rawProgress < 1) {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(tickProgress);
      } else {
        setTimeout(() => tickProgress(), 50);
      }
    } else {
      completePreloader();
    }
  }
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(tickProgress);
  } else {
    setTimeout(completePreloader, 100);
  }

  // Skip handlers
  skipBtn?.addEventListener('click', completePreloader);
  preloader.addEventListener('click', e => {
    if (e.target !== skipBtn) completePreloader();
  });
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        completePreloader();
      }
    });
  }

  // Expose global replay function
  if (typeof window !== 'undefined') {
    window.__replayPreloader = function() {
      preloader.style.display = 'flex';
      preloader.classList.remove('preloader-hidden');
      isDone = false;
      setProgress(0);
      const start = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now();
      function tickReplay(now) {
        if (isDone) return;
        const cur = now || ((typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now());
        const elapsed = cur - start;
        const raw = Math.min(1, elapsed / 1400);
        setProgress((1 - Math.pow(1 - raw, 2.5)) * 100);
        if (raw < 1) {
          if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(tickReplay);
          } else {
            setTimeout(() => tickReplay(), 50);
          }
        } else {
          completePreloader();
        }
      }
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(tickReplay);
      } else {
        setTimeout(completePreloader, 100);
      }
    };
  }
}

// ==========================================================================
// ReactBits Interactive 3D Physics Lanyard Badge
// Pendulum physics, cubic Bezier cloth ribbon, dynamic tilt & D-ring anchoring
// ==========================================================================
function initLanyard() {
  const stage = document.getElementById('lanyardStage');
  const canvas = document.getElementById('lanyardCanvas');
  const card = document.getElementById('lanyardCard');
  if (!stage || !canvas || !card) return;

  const ctx = (canvas && typeof canvas.getContext === 'function') ? canvas.getContext('2d') : null;

  let width = stage.clientWidth || 320;
  let height = stage.clientHeight || 520;
  let dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;

  function resizeCanvas() {
    width = stage.clientWidth || 320;
    height = stage.clientHeight || 520;
    dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    if (ctx && typeof ctx.setTransform === 'function') {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }
  resizeCanvas();
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', resizeCanvas, { passive: true });
  }

  // Anchor and Geometry Constants
  const anchor = { x: width / 2, y: 0 };
  const cardAttachmentOffsetY = 46; // Distance from card top edge up to D-ring bar center
  const restAttachmentY = 125;      // Resting Y distance for ribbon attachment point
  const restCardTop = restAttachmentY + cardAttachmentOffsetY; // Resting card top (171px)

  let posX = width / 2;
  let posY = restCardTop;
  let velX = 0;
  let velY = 0;
  let angle = 0;
  let angleVel = 0;
  let rotX = 0;
  let rotY = 0;

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragCardStartX = 0;
  let dragCardStartY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let pointerVelX = 0;
  let pointerVelY = 0;
  let lastTime = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now();
  let idleTime = 0;
  let isFlipped = false;

  function updatePhysics(dt) {
    anchor.x = width / 2;
    anchor.y = 0;

    if (isDragging) {
      idleTime = 0;
    } else {
      idleTime += dt;

      // Natural idle ambient breeze
      const breezeX = Math.sin(idleTime * 1.5) * 1.2;
      const breezeY = Math.cos(idleTime * 1.1) * 0.6;

      const currentAttachX = posX;
      const currentAttachY = posY - cardAttachmentOffsetY;

      // Spring restoring force pulling back to resting hanging point
      const fx = (anchor.x + breezeX - currentAttachX) * 0.055;
      const fy = (restAttachmentY + breezeY - currentAttachY) * 0.055 + 0.42;

      velX = (velX + fx) * 0.92;
      velY = (velY + fy) * 0.92;

      posX += velX;
      posY += velY;

      // Pendulum angular restoration
      const dx = currentAttachX - anchor.x;
      const dy = Math.max(30, currentAttachY - anchor.y);
      const targetAngle = Math.atan2(dx, dy) * 0.85;
      const angleForce = (targetAngle - angle) * 0.065;
      angleVel = (angleVel + angleForce) * 0.88;
      angle += angleVel;

      // 3D dynamic card tilt
      rotY = velX * 1.8 + dx * 0.06;
      rotX = -(velY * 1.5 + (currentAttachY - restAttachmentY) * 0.06);
    }

    // Safety boundary clamping inside stage
    posX = Math.max(30, Math.min(width - 30, posX));
    posY = Math.max(cardAttachmentOffsetY + 20, Math.min(height - 50, posY));

    // Update DOM Card Position and 3D Transform
    const cardHalfW = 115;
    const cardLeft = posX - cardHalfW;
    const cardTop = posY;

    const angleDeg = (angle * 180 / Math.PI).toFixed(2);
    const rotXDeg = Math.max(-30, Math.min(30, rotX)).toFixed(2);
    const rotYDeg = Math.max(-30, Math.min(30, rotY)).toFixed(2);

    if (card && card.style) {
      card.style.transform = `translate3d(${cardLeft - (width / 2 - cardHalfW)}px, ${cardTop - 130}px, 0px) rotateZ(${angleDeg}deg) rotateX(${rotXDeg}deg) rotateY(${rotYDeg}deg)`;
      const glareAngle = (125 + rotY * 2).toFixed(1);
      if (typeof card.style.setProperty === 'function') {
        card.style.setProperty('--glare-angle', `${glareAngle}deg`);
      }
    }

    // Render ribbon canvas
    drawRibbon();
  }

  function drawRibbon() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const P0x = anchor.x;
    const P0y = 0;
    const P3x = posX;
    const P3y = posY - cardAttachmentOffsetY; // Attachment point inside top of D-ring

    const chordDx = P3x - P0x;
    const chordDy = P3y - P0y;
    const chordDist = Math.hypot(chordDx, chordDy) || 1;

    // Cubic Bezier Control Points
    // Top control point: drops vertically from anchor
    const cp1Dist = chordDist * 0.38;
    const cp1x = P0x;
    const cp1y = P0y + cp1Dist;

    // Bottom control point: smoothly aligns with the card/clip tilt angle (angle)
    const cp2Dist = chordDist * 0.35;
    const cp2x = P3x - Math.sin(angle) * cp2Dist;
    const cp2y = P3y - Math.cos(angle) * cp2Dist;

    // Cubic Bezier evaluation function
    function getBezier(t) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const bx = uuu * P0x + 3 * uu * t * cp1x + 3 * u * tt * cp2x + ttt * P3x;
      const by = uuu * P0y + 3 * uu * t * cp1y + 3 * u * tt * cp2y + ttt * P3y;

      // Derivative (tangent)
      const tx = 3 * uu * (cp1x - P0x) + 6 * u * t * (cp2x - cp1x) + 3 * tt * (P3x - cp2x);
      const ty = 3 * uu * (cp1y - P0y) + 6 * u * t * (cp2y - cp1y) + 3 * tt * (P3y - cp2y);
      const tLen = Math.hypot(tx, ty) || 1;

      // Normal vector (-ty, tx)
      const nx = -ty / tLen;
      const ny = tx / tLen;
      const tanAngle = Math.atan2(ty, tx);

      return { x: bx, y: by, nx, ny, tx: tx / tLen, ty: ty / tLen, angle: tanAngle };
    }

    const W = 28; // 28px strap width (matches D-ring loop width)
    const halfW = W / 2;
    const segments = 32;

    const leftPts = [];
    const rightPts = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const pt = getBezier(t);
      leftPts.push({ x: pt.x + pt.nx * halfW, y: pt.y + pt.ny * halfW });
      rightPts.push({ x: pt.x - pt.nx * halfW, y: pt.y - pt.ny * halfW });
    }

    // 1. Soft Drop Shadow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i <= segments; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
    for (let i = segments; i >= 0; i--) ctx.lineTo(rightPts[i].x, rightPts[i].y);
    ctx.closePath();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    ctx.restore();

    // 2. Base Ribbon Body (Matte Black Webbing with Lateral Shading)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(leftPts[0].x, leftPts[0].y);
    for (let i = 1; i <= segments; i++) ctx.lineTo(leftPts[i].x, leftPts[i].y);
    for (let i = segments; i >= 0; i--) ctx.lineTo(rightPts[i].x, rightPts[i].y);
    ctx.closePath();

    // Longitudinal & Cross Gradient
    if (typeof ctx.createLinearGradient === 'function') {
      const strapGrad = ctx.createLinearGradient(P0x - halfW, 0, P0x + halfW, 0);
      strapGrad.addColorStop(0, '#060807');
      strapGrad.addColorStop(0.12, '#141815');
      strapGrad.addColorStop(0.5, '#1e2420');
      strapGrad.addColorStop(0.88, '#141815');
      strapGrad.addColorStop(1, '#060807');
      ctx.fillStyle = strapGrad;
    } else {
      ctx.fillStyle = '#141815';
    }
    ctx.fill();

    // Outer Edge Piping / Stitches
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();
    ctx.restore();

    // 3. Longitudinal Subtle Texture Lines (Woven Webbing Feel)
    ctx.save();
    for (const offset of [-6, 6]) {
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const pt = getBezier(t);
        const px = pt.x + pt.nx * offset;
        const py = pt.y + pt.ny * offset;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.stroke();
    }
    ctx.restore();

    // 4. White Geometric Atom Emblem (Centered at t = 0.50)
    const midPt = getBezier(0.50);
    ctx.save();
    ctx.translate(midPt.x, midPt.y);
    ctx.rotate(midPt.angle - Math.PI / 2);

    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = 8;

    const embR = 9.5;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 4 Intersecting Rotated Loops (forming 8 lobes)
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 4);
      ctx.beginPath();
      if (typeof ctx.ellipse === 'function') {
        ctx.ellipse(0, 0, embR * 0.42, embR, 0, 0, Math.PI * 2);
      } else {
        ctx.arc(0, 0, embR, 0, Math.PI * 2);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Core bright circle
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 5. Bottom Hem Loop wrapping through D-Ring
    ctx.save();
    ctx.translate(P3x, P3y);
    ctx.rotate(angle);

    // Hem wrap rectangle
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(-halfW, -3, W, 7, 2);
    } else {
      ctx.rect(-halfW, -3, W, 7);
    }
    ctx.fillStyle = '#0a0d0b';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.stroke();

    // Bar-tack safety stitch across hem
    ctx.beginPath();
    ctx.moveTo(-halfW + 3, 0);
    ctx.lineTo(halfW - 3, 0);
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([2.5, 2]);
    }
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.stroke();
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  // Animation Frame Loop
  function loop(now) {
    const curTime = now || ((typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now());
    const dt = Math.min(0.05, (curTime - lastTime) / 1000);
    lastTime = curTime;
    updatePhysics(dt);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(loop);
    }
  }
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(loop);
  }

  // Pointer / Drag Interaction Handlers with Elastic Tension Constraint
  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    isDragging = true;
    dragStartX = e.clientX || 0;
    dragStartY = e.clientY || 0;
    dragCardStartX = posX;
    dragCardStartY = posY;
    lastPointerX = e.clientX || 0;
    lastPointerY = e.clientY || 0;
    pointerVelX = 0;
    pointerVelY = 0;

    const hint = document.getElementById('lanyardHint');
    if (hint) hint.style.opacity = '0';

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || 0;
    const clientY = e.clientY || 0;
    const dx = clientX - dragStartX;
    const dy = clientY - dragStartY;

    const rawX = dragCardStartX + dx;
    const rawY = dragCardStartY + dy;
    const rawAttachX = rawX;
    const rawAttachY = rawY - cardAttachmentOffsetY;

    // Elastic Ribbon Length Constraint
    const rawDist = Math.hypot(rawAttachX - anchor.x, rawAttachY - anchor.y) || 1;
    const maxStrapLen = 165;

    if (rawDist > maxStrapLen) {
      const excess = rawDist - maxStrapLen;
      const clampedDist = maxStrapLen + excess * 0.22;
      posX = anchor.x + ((rawAttachX - anchor.x) / rawDist) * clampedDist;
      posY = cardAttachmentOffsetY + ((rawAttachY - anchor.y) / rawDist) * clampedDist;
    } else {
      posX = rawX;
      posY = rawY;
    }

    pointerVelX = clientX - lastPointerX;
    pointerVelY = clientY - lastPointerY;
    lastPointerX = clientX;
    lastPointerY = clientY;

    // Smooth responsive angle and tilt during drag
    angle = Math.atan2(posX - anchor.x, Math.max(30, (posY - cardAttachmentOffsetY) - anchor.y)) * 0.82;
    rotY = Math.max(-28, Math.min(28, pointerVelX * 1.8));
    rotX = Math.max(-28, Math.min(28, -pointerVelY * 1.8));
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    // Fling momentum on release
    velX = Math.max(-22, Math.min(22, pointerVelX * 1.4));
    velY = Math.max(-22, Math.min(22, pointerVelY * 1.4));
    angleVel = pointerVelX * 0.018;

    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    }
  }

  card.addEventListener('pointerdown', onPointerDown);

  // Flip Card on Click / Touch Tap
  card.addEventListener('click', e => {
    if (e.target && typeof e.target.closest === 'function' && e.target.closest('.card-flip-btn')) {
      return; // Handled by dedicated button listener
    }
    const clientX = (e.clientX !== undefined) ? e.clientX : dragStartX;
    const clientY = (e.clientY !== undefined) ? e.clientY : dragStartY;
    const dist = Math.hypot(clientX - dragStartX, clientY - dragStartY);
    if (isNaN(dist) || dist < 10) {
      isFlipped = !isFlipped;
      card.classList.toggle('flipped', isFlipped);
    }
  });

  // Explicit Flip Buttons
  const flipBtns = card.querySelectorAll('.card-flip-btn');
  if (flipBtns && flipBtns.forEach) {
    flipBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        if (e.stopPropagation) e.stopPropagation();
        isFlipped = !isFlipped;
        card.classList.toggle('flipped', isFlipped);
      });
    });
  }

  // Keyboard accessibility
  card.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      isFlipped = !isFlipped;
      card.classList.toggle('flipped', isFlipped);
    }
    if (e.key === 'ArrowLeft') {
      velX -= 12;
      angleVel -= 0.15;
    }
    if (e.key === 'ArrowRight') {
      velX += 12;
      angleVel += 0.15;
    }
    if (e.key === 'ArrowUp') {
      velY -= 10;
    }
    if (e.key === 'ArrowDown') {
      velY += 10;
    }
  });
}

// Initialize Interactive Features
initPreloader();
initLanyard();
initCvModal();
initCaseModals();
  initCosmosIntegration();
initTermsModal();
initCopyButtons();

initTiltCards();
initScrollspy();
initScrollReveal();
initCat3D();

// ==========================================================================
// Cyber-Industrial Dynamic Background Engine
// Quantum Data Grid + Kinetic Particle Physics + Dynamic Shockwaves + LERP Themes
// ==========================================================================
function initCyberBackgroundEngine() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = (typeof canvas.getContext === 'function') ? canvas.getContext('2d', { alpha: true }) : null;
  if (!ctx) return;

  let width = (typeof window !== 'undefined') ? window.innerWidth : 1200;
  let height = (typeof window !== 'undefined') ? window.innerHeight : 800;
  let dpr = 1;

  // Grid & Space Metrics
  let cellSize = 48;
  let cols = 0;
  let rows = 0;
  let scrollY = (typeof window !== 'undefined') ? (window.scrollY || window.pageYOffset || 0) : 0;
  let targetScrollY = scrollY;

  // Animation & Physics Arrays
  let particles = [];
  let shockwaves = [];
  let animId = null;
  let lastTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  let lastInteractionTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  let lastAmbientPulseTime = 0;

  const pointer = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
    radius: 145,
    speed: 0
  };

  // Color & Theme Multi-palette (RGB values for smooth LERP)
  const themeProfiles = {
    '': {
      r: 201, g: 255, b: 98,       // Neon Lime (Default)
      secR: 128, secG: 229, secB: 255,
      gridAlpha: 0.024,
      crossAlpha: 0.08,
      nodeGlow: 0.85
    },
    'cyan': {
      r: 123, g: 238, b: 255,     // Cyber Cyan
      secR: 201, secG: 255, secB: 98,
      gridAlpha: 0.022,
      crossAlpha: 0.07,
      nodeGlow: 0.80
    },
    'amber': {
      r: 255, g: 206, b: 100,     // Industrial Amber
      secR: 255, secG: 133, secB: 109,
      gridAlpha: 0.026,
      crossAlpha: 0.09,
      nodeGlow: 0.90
    }
  };

  let currentColor = { r: 201, g: 255, b: 98, secR: 128, secG: 229, secB: 255, gridAlpha: 0.024, crossAlpha: 0.08, nodeGlow: 0.85 };
  let targetColor = { ...currentColor };

  function updateThemeColors() {
    const activeTheme = (document.body && document.body.dataset.theme) || '';
    const prof = themeProfiles[activeTheme] || themeProfiles[''];
    targetColor = { ...prof };
  }

  // --- Kinetic Particle Model (Data & Operations) ---
  class KineticNode {
    constructor() {
      this.init(true);
    }

    init(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : (Math.random() > 0.5 ? -20 : height + 20);
      this.originX = this.x;
      this.originY = this.y;

      // Depth layers: 1 = Far, 2 = Mid, 3 = Near
      const depthTier = Math.random();
      if (depthTier < 0.40) {
        this.depth = 1;
        this.radius = 1.0 + Math.random() * 0.6;
        this.baseAlpha = 0.20 + Math.random() * 0.15;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.parallaxFactor = 0.02;
      } else if (depthTier < 0.80) {
        this.depth = 2;
        this.radius = 1.5 + Math.random() * 0.8;
        this.baseAlpha = 0.45 + Math.random() * 0.20;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.parallaxFactor = 0.05;
      } else {
        this.depth = 3;
        this.radius = 2.2 + Math.random() * 1.0;
        this.baseAlpha = 0.75 + Math.random() * 0.25;
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.parallaxFactor = 0.085;
      }

      this.repelVx = 0;
      this.repelVy = 0;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.isSignal = Math.random() < 0.25;
    }

    update(dt, isReducedMotion) {
      const motionRate = isReducedMotion ? 0.12 : 1.0;

      // Natural kinetic drifting
      this.pulsePhase += this.pulseSpeed * motionRate * dt;
      this.x += (this.vx + Math.sin(this.pulsePhase) * 0.12) * motionRate * dt;
      this.y += (this.vy + Math.cos(this.pulsePhase) * 0.12) * motionRate * dt;

      // Magnetic Repulsion from Cursor
      if (pointer.active && !isReducedMotion) {
        const dx = this.x - pointer.x;
        const dy = this.y - pointer.y;
        const dist = Math.hypot(dx, dy);

        if (dist < pointer.radius && dist > 1) {
          const repelForce = (1 - (dist / pointer.radius)) * (this.depth === 3 ? 3.8 : 2.4);
          const angle = Math.atan2(dy, dx);
          this.repelVx += Math.cos(angle) * repelForce * 0.75;
          this.repelVy += Math.sin(angle) * repelForce * 0.75;
        }
      }

      // Physics Shockwave Influence
      for (let i = 0; i < shockwaves.length; i++) {
        const sw = shockwaves[i];
        const sDx = this.x - sw.x;
        const sDy = this.y - sw.y;
        const sDist = Math.hypot(sDx, sDy);
        const waveDelta = Math.abs(sDist - sw.radius);

        if (waveDelta < sw.width) {
          const waveFactor = (1 - (waveDelta / sw.width)) * sw.strength;
          const sAngle = Math.atan2(sDy, sDx);
          const push = waveFactor * 4.5 * (this.depth / 2);
          this.repelVx += Math.cos(sAngle) * push;
          this.repelVy += Math.sin(sAngle) * push;
        }
      }

      // Damping & application of repulsion momentum
      this.x += this.repelVx * dt;
      this.y += this.repelVy * dt;
      this.repelVx *= 0.90;
      this.repelVy *= 0.90;

      // Screen boundary wrapping
      const margin = 40;
      if (this.x < -margin) this.x = width + margin;
      if (this.x > width + margin) this.x = -margin;
      if (this.y < -margin) this.y = height + margin;
      if (this.y > height + margin) this.y = -margin;
    }
  }

  function resize() {
    dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2);
    width = (typeof window !== 'undefined') ? window.innerWidth : 1200;
    height = (typeof window !== 'undefined') ? window.innerHeight : 800;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    cellSize = width < 768 ? 54 : 48;
    cols = Math.ceil(width / cellSize) + 1;
    rows = Math.ceil(height / cellSize) + 1;

    // Allocate balanced particle count (approx 38 on mobile, 60 on desktop)
    const targetCount = width < 768 ? 36 : 58;
    particles = [];
    for (let i = 0; i < targetCount; i++) {
      particles.push(new KineticNode());
    }
  }

  function addShockwave(x, y, intensity = 1.0) {
    const maxRadius = Math.min(width, height) * 0.65;
    shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius,
      width: 75,
      speed: 8.2,
      strength: intensity,
      birth: (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
    });

    if (shockwaves.length > 5) shockwaves.shift();
  }

  function recordActivity() {
    lastInteractionTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  }

  // Pointer & Scroll Event Handlers
  window.addEventListener('pointermove', e => {
    pointer.targetX = e.clientX;
    pointer.targetY = e.clientY;
    pointer.active = true;
    recordActivity();
  }, { passive: true });

  window.addEventListener('pointerdown', e => {
    addShockwave(e.clientX, e.clientY, 1.15);
    recordActivity();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    targetScrollY = (typeof window !== 'undefined') ? (window.scrollY || window.pageYOffset || 0) : 0;
    recordActivity();
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    pointer.active = false;
  });

  // Global Bridge Trigger methods
  window.__triggerRipple = function(x, y, intensity) {
    const posX = x !== undefined ? x : width * 0.5;
    const posY = y !== undefined ? y : height * 0.45;
    addShockwave(posX, posY, intensity || 1.2);
  };

  window.__boostCyberMatrix = function() {
    addShockwave(width * 0.5, height * 0.5, 1.6);
    particles.forEach(p => {
      p.repelVx += (Math.random() - 0.5) * 6;
      p.repelVy += (Math.random() - 0.5) * 6;
    });
  };
  window.__boostBinaryMatrix = window.__boostCyberMatrix;

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 80);
  });

  const themeObs = new MutationObserver(() => updateThemeColors());
  if (document.body) {
    themeObs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  }

  resize();
  updateThemeColors();
  currentColor = { ...targetColor };

  // --- Main 60 FPS Render Loop ---
  function render(now) {
    const curTime = now || ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now());
    const elapsed = Math.max(1, curTime - lastTime);
    lastTime = curTime;
    const dt = Math.min(elapsed / 16.667, 2.2);

    const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth Scroll Parallax tracking
    scrollY += (targetScrollY - scrollY) * 0.12;

    // Smooth LERP Multi-Theme Color Interpolation
    currentColor.r += (targetColor.r - currentColor.r) * 0.08;
    currentColor.g += (targetColor.g - currentColor.g) * 0.08;
    currentColor.b += (targetColor.b - currentColor.b) * 0.08;
    currentColor.secR += (targetColor.secR - currentColor.secR) * 0.08;
    currentColor.secG += (targetColor.secG - currentColor.secG) * 0.08;
    currentColor.secB += (targetColor.secB - currentColor.secB) * 0.08;
    currentColor.gridAlpha += (targetColor.gridAlpha - currentColor.gridAlpha) * 0.08;
    currentColor.crossAlpha += (targetColor.crossAlpha - currentColor.crossAlpha) * 0.08;

    const cr = Math.round(currentColor.r);
    const cg = Math.round(currentColor.g);
    const cb = Math.round(currentColor.b);
    const sr = Math.round(currentColor.secR);
    const sg = Math.round(currentColor.secG);
    const sb = Math.round(currentColor.secB);

    // Pointer smoothing
    if (pointer.active) {
      pointer.x += (pointer.targetX - pointer.x) * 0.28;
      pointer.y += (pointer.targetY - pointer.y) * 0.28;
    } else {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    // Ambient Idle Breathing Pulse (every 5.5s of user inactivity)
    const isIdle = (curTime - lastInteractionTime) > 4200;
    if (isIdle && (curTime - lastAmbientPulseTime > 6500) && !isReducedMotion) {
      lastAmbientPulseTime = curTime;
      const ambX = width * (0.25 + Math.random() * 0.50);
      const ambY = height * (0.25 + Math.random() * 0.50);
      addShockwave(ambX, ambY, 0.45);
    }

    // Clear Canvas Viewport
    ctx.clearRect(0, 0, width, height);

    // -------------------------------------------------------------
    // 1. RENDER QUANTUM COORDINATE GRID & CROSSHAIRS
    // -------------------------------------------------------------
    const gridYOffset = (scrollY * 0.04) % cellSize;

    // Grid Lines
    ctx.beginPath();
    for (let c = 0; c < cols; c++) {
      const gx = c * cellSize;
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
    }
    for (let r = -1; r < rows; r++) {
      const gy = r * cellSize + gridYOffset;
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
    }
    ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${currentColor.gridAlpha.toFixed(4)})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Intersection Crosshairs `+` and Interactive Proximity Illumination
    const crossSize = 3.5;
    for (let r = -1; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * cellSize;
        const cy = r * cellSize + gridYOffset;

        let crossIntensity = 0;
        if (pointer.active) {
          const pDist = Math.hypot(cx - pointer.x, cy - pointer.y);
          if (pDist < 120) {
            crossIntensity = Math.max(0, (1 - (pDist / 120)) * 0.45);
          }
        }

        for (let i = 0; i < shockwaves.length; i++) {
          const sw = shockwaves[i];
          const sDist = Math.hypot(cx - sw.x, cy - sw.y);
          const sDelta = Math.abs(sDist - sw.radius);
          if (sDelta < sw.width) {
            const swFactor = (1 - (sDelta / sw.width)) * sw.strength * 0.55;
            if (swFactor > crossIntensity) crossIntensity = swFactor;
          }
        }

        const baseAlpha = (c % 2 === 0 && r % 2 === 0) ? currentColor.crossAlpha : currentColor.crossAlpha * 0.5;
        const finalAlpha = Math.min(0.85, baseAlpha + crossIntensity);

        if (finalAlpha > 0.03) {
          ctx.beginPath();
          ctx.moveTo(cx - crossSize, cy);
          ctx.lineTo(cx + crossSize, cy);
          ctx.moveTo(cx, cy - crossSize);
          ctx.lineTo(cx, cy + crossSize);
          ctx.strokeStyle = crossIntensity > 0.15 
            ? `rgba(255, 255, 255, ${finalAlpha.toFixed(3)})` 
            : `rgba(${cr}, ${cg}, ${cb}, ${finalAlpha.toFixed(3)})`;
          ctx.lineWidth = crossIntensity > 0.15 ? 1.1 : 0.75;
          ctx.stroke();
        }
      }
    }

    // -------------------------------------------------------------
    // 2. RENDER SHOCKWAVE EXPANSION RINGS
    // -------------------------------------------------------------
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      sw.radius += sw.speed * dt;
      sw.strength = Math.max(0, 1 - (sw.radius / sw.maxRadius));

      if (sw.strength <= 0 || sw.radius > sw.maxRadius) {
        shockwaves.splice(s, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${(sw.strength * 0.28).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, 0.6)`;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
    }

    // -------------------------------------------------------------
    // 3. RENDER KINETIC PARTICLES & DATA LINKS
    // -------------------------------------------------------------
    // Update and calculate positions with parallax
    const renderedNodes = [];
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update(dt, isReducedMotion);
      const renderY = p.y - (scrollY * p.parallaxFactor);
      renderedNodes.push({ node: p, rx: p.x, ry: renderY });
    }

    // Render Data Link Connections between nearby nodes
    const linkDistThreshold = width < 768 ? 68 : 88;
    ctx.lineWidth = 0.6;
    for (let i = 0; i < renderedNodes.length; i++) {
      const nA = renderedNodes[i];
      if (nA.node.depth === 1) continue; // Far layer does not draw heavy links

      for (let j = i + 1; j < renderedNodes.length; j++) {
        const nB = renderedNodes[j];
        const dx = nA.rx - nB.rx;
        const dy = nA.ry - nB.ry;
        const dist = Math.hypot(dx, dy);

        if (dist < linkDistThreshold) {
          const linkAlpha = (1 - (dist / linkDistThreshold)) * (nA.node.baseAlpha * nB.node.baseAlpha * 0.38);
          if (linkAlpha > 0.015) {
            ctx.beginPath();
            ctx.moveTo(nA.rx, nA.ry);
            ctx.lineTo(nB.rx, nB.ry);
            ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${linkAlpha.toFixed(3)})`;
            ctx.stroke();
          }
        }
      }
    }

    // Render Nodes (Points & Soft Glows)
    for (let i = 0; i < renderedNodes.length; i++) {
      const { node: p, rx, ry } = renderedNodes[i];

      let hoverExcitation = 0;
      if (pointer.active) {
        const pDist = Math.hypot(rx - pointer.x, ry - pointer.y);
        if (pDist < pointer.radius) {
          hoverExcitation = (1 - (pDist / pointer.radius)) * 0.45;
        }
      }

      const finalAlpha = Math.min(1.0, p.baseAlpha + hoverExcitation);

      // Node Body
      ctx.beginPath();
      ctx.arc(rx, ry, p.radius * (hoverExcitation > 0.2 ? 1.3 : 1.0), 0, Math.PI * 2);
      
      if (p.depth === 3 || hoverExcitation > 0.25) {
        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha.toFixed(3)})`;
        ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, 0.8)`;
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${finalAlpha.toFixed(3)})`;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      ctx.fill();

      // Outer micro-halo on near signal nodes
      if (p.isSignal && p.depth >= 2 && !isReducedMotion) {
        const haloAlpha = (Math.sin(p.pulsePhase) * 0.5 + 0.5) * 0.18;
        if (haloAlpha > 0.02) {
          ctx.beginPath();
          ctx.arc(rx, ry, p.radius * 3.0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${haloAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(render);
  }

  // Initial welcome ambient shockwave
  setTimeout(() => {
    addShockwave(width * 0.5, height * 0.38, 0.9);
  }, 900);

  // Visibility and Performance throttling
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else {
      lastTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      if (!animId) animId = requestAnimationFrame(render);
    }
  });

  animId = requestAnimationFrame(render);
}

// ==========================================================================
// Asciify ASCII Lens Background (Canvas UI — https://canvasui.dev/docs/components/asciify)
// Background Layer 3: an animated art canvas (aurora gradients, quantum plus
// grid, tech wordmark) that the vendored Canvas UI engine captures and redraws
// as ASCII glyphs inside a soft lens following the cursor.
// Requires vendor/asciify-vanilla.js (window.CanvasUIAsciify) + WebGL2. The
// layer is hidden and the classic cyber background stays untouched when the
// engine or WebGL2 is unavailable (test sandboxes, old browsers).
// ==========================================================================
function initAsciifyBackground() {
  const api = (typeof window !== 'undefined') && window.CanvasUIAsciify;
  const layer = document.getElementById('asciify-layer');
  const content = document.getElementById('asciify-content');
  const artCanvas = document.getElementById('asciify-art');
  const output = document.getElementById('asciify-canvas');
  if (!api || !layer || !content || !artCanvas || !output) return;

  // WebGL2 gate — without it the ASCII lens cannot render; keep the site's
  // existing background untouched instead of adding a partial layer.
  let glAvailable = false;
  try { glAvailable = !!output.getContext('webgl2'); } catch (err) { glAvailable = false; }
  if (!glAvailable) {
    layer.style.display = 'none';
    return;
  }

  const artCtx = (typeof artCanvas.getContext === 'function') ? artCanvas.getContext('2d', { alpha: true }) : null;
  if (!artCtx) {
    layer.style.display = 'none';
    return;
  }

  // --- Theme palettes (RGB, mirrors themeProfiles of the cyber engine) ---
  const artPalettes = {
    '':      { bg: [13, 17, 14],  accent: [201, 255, 98],  secondary: [128, 229, 255] },
    cyan:    { bg: [9, 19, 22],   accent: [123, 238, 255], secondary: [201, 255, 98] },
    amber:   { bg: [22, 18, 13],  accent: [255, 206, 100], secondary: [255, 133, 109] }
  };
  const currentPal = { bg: [13, 17, 14], accent: [201, 255, 98], secondary: [128, 229, 255] };
  let targetPal = artPalettes[''];

  function resolvePalette() {
    const t = (document.body && document.body.dataset && document.body.dataset.theme) || '';
    targetPal = artPalettes[t] || artPalettes[''];
  }

  // --- Art canvas metrics (capped internal resolution; gradients stay soft) ---
  let artW = 0;
  let artH = 0;
  function resizeArt() {
    const vw = (typeof window !== 'undefined' && window.innerWidth) ? window.innerWidth : 1200;
    const vh = (typeof window !== 'undefined' && window.innerHeight) ? window.innerHeight : 800;
    const cap = 1280;
    const s = Math.min(1, cap / Math.max(vw, 1));
    artW = Math.max(2, Math.round(vw * s));
    artH = Math.max(2, Math.round(vh * s));
    if (artCanvas.width !== artW || artCanvas.height !== artH) {
      artCanvas.width = artW;
      artCanvas.height = artH;
    }
  }

  // Deterministic decorative layout (stable across frames)
  const artBlobs = [
    { x: 0.24, y: 0.30, r: 0.52, a0: 0.34, a1: 0.12, ax: 0.045, ay: 0.06, sx: 0.11, sy: 0.07, px: 0.0,  py: 1.7,  secondary: false },
    { x: 0.78, y: 0.22, r: 0.42, a0: 0.26, a1: 0.09, ax: 0.06,  ay: 0.05, sx: 0.08, sy: 0.12, px: 2.3,  py: 0.4,  secondary: true },
    { x: 0.62, y: 0.74, r: 0.48, a0: 0.22, a1: 0.08, ax: 0.05,  ay: 0.07, sx: 0.09, sy: 0.06, px: 4.1,  py: 3.0,  secondary: false },
    { x: 0.12, y: 0.82, r: 0.38, a0: 0.16, a1: 0.06, ax: 0.07,  ay: 0.04, sx: 0.13, sy: 0.09, px: 1.2,  py: 5.1,  secondary: true }
  ];
  const artBits = [];
  (function seedBits() {
    let seed = 20260816;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }
    for (let i = 0; i < 14; i++) {
      artBits.push({
        x: 0.04 + rnd() * 0.92,
        y: 0.06 + rnd() * 0.88,
        len: 8 + Math.floor(rnd() * 22),
        alpha: 0.03 + rnd() * 0.05,
        speed: 0.4 + rnd() * 1.2
      });
    }
  })();

  const rgba = (rgb, a) => `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${a})`;
  const lerpPal = () => {
    for (let i = 0; i < 3; i++) {
      currentPal.bg[i] += (targetPal.bg[i] - currentPal.bg[i]) * 0.08;
      currentPal.accent[i] += (targetPal.accent[i] - currentPal.accent[i]) * 0.08;
      currentPal.secondary[i] += (targetPal.secondary[i] - currentPal.secondary[i]) * 0.08;
    }
  };

  function renderArt(tSec) {
    if (!artCtx) return;
    lerpPal();
    const w = artW;
    const h = artH;
    const t = tSec;

    // Base fill — mostly opaque so glyph coverage stays strong inside the lens
    artCtx.clearRect(0, 0, w, h);
    artCtx.fillStyle = rgba(currentPal.bg, 0.82);
    artCtx.fillRect(0, 0, w, h);

    // Drifting aurora gradients
    for (const b of artBlobs) {
      const cx = (b.x + Math.sin(t * b.sx + b.px) * b.ax) * w;
      const cy = (b.y + Math.cos(t * b.sy + b.py) * b.ay) * h;
      const rad = b.r * Math.min(w, h) * (1 + Math.sin(t * 0.07 + b.px) * 0.08);
      const col = b.secondary ? currentPal.secondary : currentPal.accent;
      const g = artCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rad, 4));
      g.addColorStop(0, rgba(col, b.a0));
      g.addColorStop(0.5, rgba(col, b.a1));
      g.addColorStop(1, rgba(col, 0));
      artCtx.fillStyle = g;
      artCtx.fillRect(0, 0, w, h);
    }

    // Quantum plus-grid
    artCtx.strokeStyle = rgba(currentPal.accent, 0.055);
    artCtx.lineWidth = 1;
    const cell = 96;
    const arm = 5;
    artCtx.beginPath();
    for (let gx = cell; gx < w; gx += cell) {
      for (let gy = cell; gy < h; gy += cell) {
        artCtx.moveTo(gx - arm, gy);
        artCtx.lineTo(gx + arm, gy);
        artCtx.moveTo(gx, gy - arm);
        artCtx.lineTo(gx, gy + arm);
      }
    }
    artCtx.stroke();

    // Scattered binary telemetry lines
    artCtx.font = `500 ${Math.max(10, Math.round(h * 0.014))}px "DM Mono", monospace`;
    artCtx.textBaseline = 'alphabetic';
    for (const bit of artBits) {
      let s = '';
      for (let i = 0; i < bit.len; i++) s += (((i + Math.floor(t * bit.speed)) % 3) === 0) ? '1' : '0';
      artCtx.fillStyle = rgba(currentPal.accent, bit.alpha);
      artCtx.fillText(s, bit.x * w, bit.y * h);
    }

    // Tech wordmark — becomes crisp readable ASCII inside the lens
    const wm = 'DATA·OPS·AUTOMATION';
    const wm2 = '// SUPPLY CHAIN · AI · BPMN';
    artCtx.textAlign = 'center';
    artCtx.font = `700 ${Math.max(24, Math.round(h * 0.115))}px "DM Mono", monospace`;
    artCtx.fillStyle = rgba(currentPal.accent, 0.11);
    artCtx.fillText(wm, w * 0.5, h * 0.46);
    artCtx.font = `500 ${Math.max(12, Math.round(h * 0.026))}px "DM Mono", monospace`;
    artCtx.fillStyle = rgba(currentPal.secondary, 0.09);
    artCtx.fillText(wm2, w * 0.5, h * 0.545);
    artCtx.textAlign = 'left';
  }

  // --- Asciify engine instance ---
  let asciify = null;
  try {
    const source = document.createElement('canvas');
    asciify = api.createAsciify(
      { source: source, content: content, output: output },
      {
        radius: ((typeof window !== 'undefined' && window.innerWidth < 720) ? 0.26 : 0.34),
        softness: 1,
        scale: 2,
        spacing: 1,
        charset: 'ascii',
        background: 'auto',
        backgroundOpacity: 0.92,
        contrast: 1.15,
        brightness: 0.06,
        strength: 1,
        baseStrength: 0,
        followSpeed: 4,
        glow: 0.8,
        aberration: 0.6
      }
    );
  } catch (err) {
    asciify = null;
  }
  if (!asciify) output.style.display = 'none';

  // --- Render loop (10 fps art; engine refreshes texture on capture) ---
  const ART_INTERVAL = 100;
  const reducedMotion = (typeof window !== 'undefined' && window.matchMedia)
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  let lastArt = 0;
  let artRaf = 0;

  function artLoop(now) {
    artRaf = requestAnimationFrame(artLoop);
    if (now - lastArt < ART_INTERVAL) return;
    lastArt = now;
    renderArt((now - startTime) / 1000);
    if (asciify) asciify.refresh();
  }

  function startArtLoop() {
    if (reducedMotion) {
      renderArt(0);
      if (asciify) asciify.refresh();
      return;
    }
    artRaf = requestAnimationFrame(artLoop);
  }

  // Theme shifts: retarget palette and force the engine to re-read the
  // backing color + recapture the art with new colors.
  resolvePalette();
  if (typeof MutationObserver !== 'undefined') {
    const themeObs = new MutationObserver(() => {
      resolvePalette();
      if (asciify) asciify.resize();
    });
    themeObs.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // Debounced window resize
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resizeArt();
      renderArt(reducedMotion ? 0 : ((performance.now() - startTime) / 1000));
      if (asciify) asciify.resize();
    }, 200);
  }, { passive: true });

  // Visibility throttling (mirrors the cyber engine pattern)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (artRaf) cancelAnimationFrame(artRaf);
      artRaf = 0;
    } else if (!reducedMotion && !artRaf) {
      lastArt = 0;
      artRaf = requestAnimationFrame(artLoop);
    }
  });

  resizeArt();
  startArtLoop();
}

// Initialize Cyber Background Engine + Asciify ASCII Lens on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCyberBackgroundEngine);
  document.addEventListener('DOMContentLoaded', initAsciifyBackground);
} else {
  initCyberBackgroundEngine();
  initAsciifyBackground();
}


// =========================================================================
// Cosmic Atlas 3D Modal Controller
// =========================================================================
function openCosmosModal() {
  const modal = document.querySelector('#cosmosModal');
  const container = document.querySelector('#cosmosCanvasContainer');
  if (!modal || !container) return;

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }

  // Populate Planet Rail Buttons
  const rail = document.querySelector('#cosmosPlanetRail');
  if (rail && window.CosmicAtlas) {
    const bodies = window.CosmicAtlas.getBodies();
    rail.innerHTML = bodies.map(b => `
      <button type="button" class="cosmos-chip${b.id === 'sun' ? ' active' : ''}" data-body-id="${b.id}" style="--chip-color: ${b.color}">
        <span class="cosmos-chip-dot"></span>
        <span class="cosmos-chip-name">${lang === 'en' ? (b.enName || b.name) : b.name}</span>
      </button>
    `).join('');
  }

  // Instant zero-lag activation
  if (window.CosmicAtlas) {
    window.CosmicAtlas.init(container);
  }
}

function closeCosmosModal() {
  const modal = document.querySelector('#cosmosModal');
  if (!modal) return;
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
  if (window.CosmicAtlas) {
    window.CosmicAtlas.pause();
  }
}

function initCosmosIntegration() {
  const launchBtn = document.querySelector('#openCosmosBtn');
  const closeBtn = document.querySelector('#closeCosmosBtn');
  const modal = document.querySelector('#cosmosModal');

  launchBtn?.addEventListener('click', openCosmosModal);
  closeBtn?.addEventListener('click', closeCosmosModal);

  modal?.addEventListener('click', e => {
    if (e.target === modal) closeCosmosModal();
  });

  // Planet selection from rail
  document.querySelector('#cosmosPlanetRail')?.addEventListener('click', e => {
    const chip = e.target.closest('[data-body-id]');
    if (chip && window.CosmicAtlas) {
      const bodyId = chip.getAttribute('data-body-id');
      window.CosmicAtlas.focusBody(bodyId);
      document.querySelectorAll('#cosmosPlanetRail .cosmos-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    }
  });

  // Time Mode Controls (Real-Time, 1 Day/Sec, 1 Year/10Sec, Pause)
  document.querySelectorAll('.cosmos-speed-controls [data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      window.CosmicAtlas?.setTimeMode(mode);
      document.querySelectorAll('.cosmos-speed-controls [data-mode]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Sync to current second button
  document.querySelector('#cosmosSyncNowBtn')?.addEventListener('click', () => {
    window.CosmicAtlas?.syncToLiveTime();
    document.querySelectorAll('.cosmos-speed-controls [data-mode]').forEach(b => b.classList.remove('active'));
    document.querySelector('.cosmos-speed-controls [data-mode="realtime"]')?.classList.add('active');
  });

  // Listen to live clock updates
  window.addEventListener('cosmos:time-update', e => {
    const textEl = document.querySelector('#cosmosClockText');
    if (textEl && e.detail?.utcString) {
      textEl.textContent = e.detail.utcString;
    }
  });

  // Orbits toggle
  const orbitsBtn = document.querySelector('#cosmosOrbitsBtn');
  orbitsBtn?.addEventListener('click', () => {
    if (window.CosmicAtlas) {
      const show = window.CosmicAtlas.toggleOrbits();
      orbitsBtn.textContent = show ? 'ÓRBITAS: ON' : 'ÓRBITAS: OFF';
      orbitsBtn.classList.toggle('active', !show);
    }
  });

  // Listen to body changes from 3D raycaster
  window.addEventListener('cosmos:body-change', e => {
    const b = e.detail?.body;
    if (!b) return;

    const titleEl = document.querySelector('#cosmosBodyName');
    const typeEl = document.querySelector('#cosmosBodyType');
    const descEl = document.querySelector('#cosmosBodyDesc');
    const diamEl = document.querySelector('#cosmosMetricDiameter');
    const tempEl = document.querySelector('#cosmosMetricTemp');
    const orbitEl = document.querySelector('#cosmosMetricOrbit');

    if (titleEl) titleEl.textContent = lang === 'en' ? (b.enName || b.name) : b.name;
    if (typeEl) typeEl.textContent = b.stats?.type || 'CUERPO CELESTE';
    if (descEl) descEl.textContent = lang === 'en' ? (b.enDesc || b.desc) : b.desc;
    if (diamEl) diamEl.textContent = b.stats?.diameter || '—';
    if (tempEl) tempEl.textContent = b.stats?.temp || '—';
    if (orbitEl) orbitEl.textContent = b.stats?.orbit || b.stats?.mass || 'Centro de Masa';

    // Update active chip
    document.querySelectorAll('#cosmosPlanetRail .cosmos-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-body-id') === b.id);
    });
  });
}

// ==========================================================================
// Scroll Reveal Animations (IntersectionObserver, no deps)
// Adds .is-visible to .reveal elements when entering viewport.
// Stagger is driven by --stagger CSS variable per element.
// ==========================================================================
function initScrollReveal() {
  try {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    revealEls.forEach(el => io.observe(el));
  } catch (e) { /* silent */ }
}

// ==========================================================================
// Cat 3D Easter Peek — procedural Three.js mini-canvas.
// The renderer lives in cat3d-mini.js; this wrapper keeps the original Easter
// egg behavior: the cat peeks near cards, plays briefly, and can be clicked.
// ==========================================================================
function openCatModal() {
  const modal = document.getElementById('catModal');
  const iframe = document.getElementById('catModalIframe');
  if (!modal) return;
  if (iframe && iframe.dataset.src && (!iframe.src || iframe.src === 'about:blank' || iframe.src.endsWith('/'))) {
    iframe.src = iframe.dataset.src;
  }
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
  modal.classList.add('show');
  try {
    if (typeof window.__triggerRipple === 'function') {
      window.__triggerRipple(window.innerWidth / 2, window.innerHeight / 2, 0.85);
    }
  } catch (e) {}
}

function closeCatModal() {
  const modal = document.getElementById('catModal');
  if (!modal) return;
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
  modal.classList.remove('show');
}

function initCat3D() {
  try {
    const stage = document.getElementById('cat3DStage');
    const box = stage ? stage.querySelector('.cat-glyph-box') : null;
    const fallback = stage ? stage.querySelector('#cat3DFallback') : null;
    const mini = stage && window.Cat3DMini ? window.Cat3DMini.mount(stage) : null;
    if (!stage || !box || (!mini && !fallback)) return;

    let timeoutId = null;
    let isVisible = false;
    let isRoaming = false;
    let roamFrameId = null;
    let roamState = 'idle'; // 'idle' | 'walking'
    let idleWaitTimer = 0;

    // Viewport position & movement kinematics
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const walkSpeedPx = 135; // Pixels per second
    let lastRoamTime = 0;

    const walkBtn = stage.querySelector('#catWalkBtn');
    const modeBtn = stage.querySelector('#catModeBtn');
    const expandBtn = stage.querySelector('#catExpandBtn');
    const closeStageBtn = stage.querySelector('#catCloseStageBtn');
    const speechBubble = stage.querySelector('#catSpeechBubble');
    const glyphStatus = stage.querySelector('#catGlyphStatus');

    let bubbleTimeout = null;
    function say(text, duration = 2400) {
      if (!speechBubble) return;
      speechBubble.textContent = text;
      speechBubble.classList.add('is-active');
      clearTimeout(bubbleTimeout);
      bubbleTimeout = setTimeout(() => {
        speechBubble.classList.remove('is-active');
      }, duration);
    }

    // Mode Toggle (3D / ASCII / Hybrid)
    let catMode = '3d';
    if (modeBtn) {
      modeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        catMode = catMode === '3d' ? 'ascii' : catMode === 'ascii' ? 'hybrid' : '3d';
        if (mini && typeof mini.setMode === 'function') mini.setMode(catMode);
        modeBtn.textContent = catMode.toUpperCase();
      });
    }

    // Expand Button to open full 3D interactive laboratory modal
    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCatModal();
      });
    }

    const closeCatBtn = document.getElementById('closeCatBtn');
    if (closeCatBtn) closeCatBtn.addEventListener('click', closeCatModal);
    const catModal = document.getElementById('catModal');
    if (catModal) {
      catModal.addEventListener('click', (e) => {
        if (e.target === catModal) closeCatModal();
      });
    }

    function getCardTargets() {
      return Array.from(document.querySelectorAll('.case, .credential-card, .education'));
    }

    function positionNearRandomCard() {
      const cards = getCardTargets();
      if (!cards.length) return;
      const inView = cards.filter(c => {
        const r = c.getBoundingClientRect();
        return r.top < window.innerHeight * 0.92 && r.bottom > 80;
      });
      const pool = inView.length ? inView : cards;
      const card = pool[Math.floor(Math.random() * pool.length)];
      const rect = card.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const stageW = stageRect.width || 252;
      const stageH = stageRect.height || 196;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left = rect.right - 40;
      let top = rect.top - 22;
      if (left + stageW > vw - 8) left = Math.max(8, rect.left + rect.width * 0.35);
      if (left < 8) left = 8;
      if (top < 8 || top + stageH > vh - 8) {
        top = rect.top - stageH + 14;
        if (top < 8) top = Math.min(vh - stageH - 10, rect.bottom + 6);
      }
      left += (Math.random() - 0.5) * 12;
      top += (Math.random() - 0.5) * 10;
      currentX = Math.round(left);
      currentY = Math.round(top);
      stage.style.left = currentX + 'px';
      stage.style.right = 'auto';
      stage.style.top = currentY + 'px';
      stage.style.bottom = 'auto';
    }

    let currentCardSurface = null;
    let isClimbing = false;
    let mouseX = -9999;
    let mouseY = -9999;
    let lastMouseMoveTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    let isCatSleeping = false;
    let isCatPetting = false;
    let petTimer = 0;
    let zzzTimer = 0;

    function wakeUpCat() {
      if (!isCatSleeping) return;
      isCatSleeping = false;
      if (mini) {
        mini.setPose('sit');
        mini.setHeading(0);
      }
      if (glyphStatus) glyphStatus.textContent = 'AWAKE // ASCII';
      say('¡Desperté! 🐾');
      idleWaitTimer = 0.8;
    }

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMouseMoveTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        if (isCatSleeping) {
          wakeUpCat();
        }
      }, { passive: true });

      window.addEventListener('scroll', () => {
        lastMouseMoveTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        if (isCatSleeping) {
          wakeUpCat();
        }
      }, { passive: true });
    }

    function spawnAsciiParticles(type, count, sourceX, sourceY) {
      if (typeof document === 'undefined' || !document.createElement || !document.body) return;
      const glyphs = type === 'heart' ? ['♥', '♥', '★', '⋆', '✦', 'purr~'] : ['z', 'Z', 'z', 'Zzz'];
      const cls = type === 'heart' ? 'cat-ascii-heart' : 'cat-ascii-sleep';
      for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = `cat-ascii-particle ${cls}`;
        el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        const ox = (Math.random() - 0.5) * 60;
        const oy = (Math.random() - 0.5) * 20;
        const dx = (Math.random() - 0.5) * 50 + (type === 'sleep' ? 24 : 0);
        const rot = (Math.random() - 0.5) * 35;
        el.style.left = Math.round(sourceX + ox) + 'px';
        el.style.top = Math.round(sourceY + oy) + 'px';
        el.style.setProperty('--dx', Math.round(dx) + 'px');
        el.style.setProperty('--rot', Math.round(rot) + 'deg');
        document.body.appendChild(el);
        setTimeout(() => {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, type === 'heart' ? 1600 : 2300);
      }
    }

    function petCat(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      isCatSleeping = false;
      isCatPetting = true;
      petTimer = 2.4;
      if (mini) {
        mini.setPose('pet');
        if (typeof mini.playPurr === 'function') {
          mini.playPurr(2.2);
        }
        if (typeof mini.playMeow === 'function' && Math.random() < 0.45) {
          setTimeout(() => { if (mini) mini.playMeow(); }, 350);
        }
      }
      if (glyphStatus) glyphStatus.textContent = 'PURR // ♥';
      const rect = stage.getBoundingClientRect();
      const px = rect.left + rect.width * 0.5;
      const py = rect.top + 30;
      spawnAsciiParticles('heart', 6, px, py);

      const sweetPhrases = [
        '¡Prrr! Nivel de cariño: 100% ♥',
        '¡Purr purr! Gracias por las caricias 🐾',
        '¡Miau! Modo ronroneo activado ♥',
        'Ronroneando de felicidad ~⋆',
        '¡Acariciaste al gato de Alessandro!'
      ];
      say(sweetPhrases[Math.floor(Math.random() * sweetPhrases.length)]);
    }

    function getVisibleCards() {
      const cards = Array.from(document.querySelectorAll('.case, .credential-card, .education, #terminalWindow'));
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      return cards.filter(c => {
        const r = c.getBoundingClientRect();
        return r.top >= -40 && r.top < vh - 100 && r.bottom > 100 && r.width >= 120;
      });
    }

    function pickNextWaypoint() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const visibleCards = getVisibleCards();

      // 68% de probabilidad de trepar/posarse sobre el borde de una tarjeta visible
      if (visibleCards.length && Math.random() < 0.68) {
        let pool = visibleCards;
        if (currentCardSurface && visibleCards.length > 1) {
          pool = visibleCards.filter(c => c !== currentCardSurface);
          if (!pool.length) pool = visibleCards;
        }
        const card = pool[Math.floor(Math.random() * pool.length)];
        currentCardSurface = card;
        const rect = card.getBoundingClientRect();

        // Techo / borde superior de la tarjeta donde posar las patas
        const shelfY = Math.max(30, rect.top - 128);
        const minShelfX = Math.max(16, rect.left);
        const maxShelfX = Math.min(vw - 260, rect.right - 220);
        
        targetX = Math.max(minShelfX, Math.min(maxShelfX, minShelfX + Math.random() * Math.max(10, maxShelfX - minShelfX)));
        targetY = shelfY;
        isClimbing = true;
        roamState = 'walking';
        if (mini) mini.setPose('walk');
        if (glyphStatus) glyphStatus.textContent = 'CLIMB // ASCII';
      } else {
        // Paseo a nivel del suelo del viewport
        currentCardSurface = null;
        isClimbing = false;
        const minX = 24;
        const maxX = Math.max(minX + 80, vw - 276);
        targetX = minX + Math.random() * (maxX - minX);
        const groundBase = vh - 215;
        targetY = Math.max(40, groundBase + (Math.random() - 0.5) * 60);
        roamState = 'walking';
        if (mini) mini.setPose('walk');
        if (glyphStatus) glyphStatus.textContent = 'ROAM // ASCII';
      }
    }

    function roamLoop(now) {
      if (!isRoaming || !isVisible) {
        roamFrameId = null;
        return;
      }
      const dt = lastRoamTime ? Math.min((now - lastRoamTime) / 1000, 0.05) : 0.016;
      lastRoamTime = now;

      // 1. Manejo de estado de caricias activo
      if (isCatPetting) {
        petTimer -= dt;
        if (mini) mini.setPose('pet');
        if (petTimer <= 0) {
          isCatPetting = false;
          if (mini) mini.setPose('sit');
        }
        roamFrameId = requestAnimationFrame(roamLoop);
        return;
      }

      // 2. Siesta inteligente tras 6 segundos sin movimiento de mouse ni scroll
      const idleMs = now - lastMouseMoveTime;
      if (idleMs > 6000 && !isCatSleeping) {
        isCatSleeping = true;
        currentCardSurface = null;
        if (mini) {
          mini.setPose('sleep');
          mini.setHeading(0);
        }
        if (glyphStatus) glyphStatus.textContent = 'SLEEP // Zzz';
        say('Zzz... siesta gatuna 🐾');
        zzzTimer = 0.4;
      }

      if (isCatSleeping) {
        zzzTimer -= dt;
        if (zzzTimer <= 0) {
          zzzTimer = 1.6 + Math.random() * 0.8;
          spawnAsciiParticles('sleep', 1, currentX + 110, currentY + 45);
        }
        roamFrameId = requestAnimationFrame(roamLoop);
        return;
      }

      // 3. Modo reactivo con el cursor (< 260px)
      const catCenterX = currentX + 110;
      const catCenterY = currentY + 80;
      let isFollowingMouse = false;

      if (mouseX > 0 && mouseY > 0) {
        const distToMouse = Math.hypot(mouseX - catCenterX, mouseY - catCenterY);
        if (distToMouse < 260) {
          isFollowingMouse = true;
          // Comprobar si el cursor está sobre un elemento interactivo para no estorbar
          let isInteractive = false;
          if (typeof document !== 'undefined' && typeof document.elementFromPoint === 'function') {
            try {
              const elUnder = document.elementFromPoint(mouseX, mouseY);
              if (elUnder && elUnder.closest && elUnder.closest('button, a, input, textarea, select, .interactive, .terminal-tab, .portfolio-filter-btn, .theme-btn')) {
                isInteractive = true;
              }
            } catch (e) {}
          }

          if (isInteractive) {
            // Guardar distancia respetuosa (~60px) para dejar al usuario hacer click libremente
            const headingAngle = mouseX >= catCenterX ? 0.7 : -0.7;
            if (mini) {
              mini.setHeading(headingAngle);
              mini.setPose('sit');
            }
            if (glyphStatus) glyphStatus.textContent = 'WATCH // CURSOR';
          } else {
            // Seguir al cursor por la página o tarjetas
            targetX = Math.max(16, Math.min(window.innerWidth - 250, mouseX - 110));
            targetY = Math.max(16, Math.min(window.innerHeight - 190, mouseY - 70));
            roamState = 'walking';
            if (glyphStatus) glyphStatus.textContent = 'FOLLOW // MOUSE';
          }
        }
      }

      if (roamState === 'walking') {
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          const step = Math.min(dist, walkSpeedPx * dt);
          const nx = dx / dist;
          const ny = dy / dist;
          currentX += nx * step;
          currentY += ny * step;

          // Si está escalando o cambiando de altura, añade un arco parabólico de salto
          let arcOffset = 0;
          if (Math.abs(dy) > 35) {
            const progress = 1 - Math.min(1, dist / 180);
            arcOffset = -Math.sin(progress * Math.PI) * 32;
          }

          stage.style.left = Math.round(currentX) + 'px';
          stage.style.top = Math.round(currentY + arcOffset) + 'px';
          stage.style.right = 'auto';
          stage.style.bottom = 'auto';

          // Orientación 3D del gato según dirección de avance
          if (mini) {
            const targetHeading = nx >= 0 ? 0.72 : -0.72;
            mini.setHeading(targetHeading);
            mini.setPose('walk');
          }
        } else {
          // Llegada al destino / cornisa
          currentX = targetX;
          currentY = targetY;
          roamState = 'idle';
          idleWaitTimer = 2.8 + Math.random() * 3.8;
          if (mini) {
            mini.setPose('sit');
            mini.setHeading(0);
          }
          if (glyphStatus) glyphStatus.textContent = isClimbing ? 'CARD // TOP' : 'REST // ASCII';
          
          if (!isFollowingMouse) {
            if (isClimbing) {
              const climbPhrases = [
                '¡Trepé a la tarjeta! 🐾',
                'Excelente vista desde aquí 🔭',
                'Supervisando el portafolio...',
                'Un gato en la cornisa 🐈‍⬛',
                'Observando los proyectos~'
              ];
              say(climbPhrases[Math.floor(Math.random() * climbPhrases.length)]);
              if (mini && Math.random() < 0.6) mini.playMeow();
            } else if (Math.random() < 0.32) {
              const phrases = ['¡Miau!', 'Paseando en modo ASCII...', 'Explorando código 🐾', 'Purr~', '¡Lindo portafolio!'];
              say(phrases[Math.floor(Math.random() * phrases.length)]);
              if (mini) mini.playMeow();
            }
          }
        }
      } else {
        // Idle descansando en la cornisa o suelo
        if (!isFollowingMouse) {
          idleWaitTimer -= dt;
          if (idleWaitTimer <= 0) {
            pickNextWaypoint();
          }
        }
      }

      roamFrameId = requestAnimationFrame(roamLoop);
    }

    function startRoaming() {
      if (isRoaming) return;
      isRoaming = true;
      clearTimeout(timeoutId); // El paseo activo anula el auto-cierre
      stage.classList.add('cat-roaming', 'cat-visible');
      stage.classList.remove('cat-peeking');
      stage.setAttribute('aria-hidden', 'false');
      isVisible = true;

      const rect = stage.getBoundingClientRect();
      currentX = rect.left;
      currentY = rect.top;
      stage.style.left = Math.round(currentX) + 'px';
      stage.style.top = Math.round(currentY) + 'px';
      stage.style.right = 'auto';
      stage.style.bottom = 'auto';

      if (walkBtn) {
        walkBtn.textContent = 'BASE 🏠';
        walkBtn.classList.add('is-active-btn');
        walkBtn.title = 'Regresar a la base en la esquina';
      }

      // Activar modo ASCII transparente y atigrado al pasear
      catMode = 'ascii';
      isCatSleeping = false;
      isCatPetting = false;
      lastMouseMoveTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      if (modeBtn) modeBtn.textContent = '3D';
      if (mini) {
        mini.setMode('ascii');
        mini.setRoaming(true);
        mini.setPose('walk');
        mini.play();
      }

      say('¡A explorar tarjetas! 🐾');
      pickNextWaypoint();
      lastRoamTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      if (!roamFrameId) roamFrameId = requestAnimationFrame(roamLoop);
    }

    function stopRoaming(andDock = true) {
      if (!isRoaming) return;
      if (andDock) {
        say('Volviendo a casa...');
        currentCardSurface = null;
        isClimbing = false;
        targetX = Math.max(24, window.innerWidth - 274);
        targetY = Math.max(24, window.innerHeight - 218);
        roamState = 'walking';
        if (mini) mini.setPose('walk');

        const checkArrival = setInterval(() => {
          if (Math.hypot(targetX - currentX, targetY - currentY) <= 14 || !isRoaming) {
            clearInterval(checkArrival);
            isRoaming = false;
            if (roamFrameId) {
              cancelAnimationFrame(roamFrameId);
              roamFrameId = null;
            }
            stage.classList.remove('cat-roaming');
            stage.style.left = 'auto';
            stage.style.right = '22px';
            stage.style.top = 'auto';
            stage.style.bottom = '22px';

            if (walkBtn) {
              walkBtn.textContent = 'PASEAR 🐾';
              walkBtn.classList.remove('is-active-btn');
              walkBtn.title = 'Hacer que camine libremente por la página';
            }
            if (mini) {
              mini.setRoaming(false);
              mini.setHeading(0);
              mini.setPose('play');
            }
            if (glyphStatus) glyphStatus.textContent = 'PLAY // 3D';
            say('¡En casa!');
            timeoutId = setTimeout(hideCat, 12000);
          }
        }, 120);
      } else {
        isRoaming = false;
        if (roamFrameId) {
          cancelAnimationFrame(roamFrameId);
          roamFrameId = null;
        }
        stage.classList.remove('cat-roaming');
        if (walkBtn) {
          walkBtn.textContent = 'PASEAR 🐾';
          walkBtn.classList.remove('is-active-btn');
        }
        if (mini) {
          mini.setRoaming(false);
          mini.setPose('play');
        }
      }
    }

    if (walkBtn) {
      walkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isRoaming) {
          stopRoaming(true);
        } else {
          startRoaming();
        }
      });
    }

    // Close button on stage
    if (closeStageBtn) {
      closeStageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideCat();
      });
    }

    // Keep stage alive while user hovers over it
    stage.addEventListener('mouseenter', () => {
      if (!isRoaming) clearTimeout(timeoutId);
    });
    stage.addEventListener('mouseleave', () => {
      if (isVisible && !isRoaming) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(hideCat, 6000);
      }
    });

    stage.addEventListener('click', (e) => {
      if (e.target && (e.target.closest('.cat3d-top-bar') || e.target.closest('button'))) return;
      petCat(e);
    });

    function scheduleNext() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(showCat, 18000 + Math.random() * 24000);
    }

    function showCat(isManual) {
      if (isVisible) return;
      if (isManual) {
        currentX = window.innerWidth - 274;
        currentY = window.innerHeight - 218;
        stage.style.left = 'auto';
        stage.style.right = '22px';
        stage.style.top = 'auto';
        stage.style.bottom = '22px';
      } else {
        positionNearRandomCard();
      }
      isVisible = true;
      stage.classList.add('cat-visible');
      stage.classList.remove('cat-peeking');
      void stage.offsetWidth;
      stage.classList.add('cat-peeking');
      stage.setAttribute('aria-hidden', 'false');
      if (mini) {
        mini.setRoaming(false);
        mini.setPose('play');
        mini.play();
      } else if (fallback) {
        fallback.classList.add('is-active');
      }
      try {
        const r = stage.getBoundingClientRect();
        if (typeof window.__triggerRipple === 'function') {
          window.__triggerRipple(r.left + r.width * 0.5, r.top + r.height * 0.5, 0.68);
        }
      } catch (e) {}
      clearTimeout(timeoutId);
      timeoutId = setTimeout(hideCat, isManual ? 18000 : 5500);
    }

    function hideCat() {
      if (!isVisible) return;
      if (isRoaming) stopRoaming(false);
      isVisible = false;
      stage.classList.remove('cat-visible', 'cat-peeking', 'cat-roaming');
      stage.setAttribute('aria-hidden', 'true');
      if (mini) mini.hide();
      if (fallback) fallback.classList.remove('is-active', 'fallback-happy');
      scheduleNext();
    }

    box.addEventListener('click', () => {
      if (!isVisible) return;
      if (mini) {
        mini.playMeow();
        if (!isRoaming) {
          mini.play();
        } else {
          say('¡Miau! ❤️');
        }
      }
      if (fallback) fallback.classList.add('fallback-happy');
      try {
        const r = stage.getBoundingClientRect();
        if (typeof window.__triggerRipple === 'function') {
          window.__triggerRipple(r.left + r.width * 0.5, r.top + r.height * 0.5, 1.0);
        }
      } catch (e) {}
      if (!isRoaming) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(hideCat, 5000);
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        box.click();
      }
    });

    // Drag & Drop interaction for repositioning the cat
    let isDraggingCat = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    stage.addEventListener('mousedown', (e) => {
      if (e.target.closest('.cat3d-btn')) return;
      isDraggingCat = true;
      const rect = stage.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      currentX = rect.left;
      currentY = rect.top;
      stage.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingCat) return;
      currentX = e.clientX - dragOffsetX;
      currentY = e.clientY - dragOffsetY;
      targetX = currentX;
      targetY = currentY;
      stage.style.left = Math.round(currentX) + 'px';
      stage.style.top = Math.round(currentY) + 'px';
      stage.style.right = 'auto';
      stage.style.bottom = 'auto';
    });

    window.addEventListener('mouseup', () => {
      if (!isDraggingCat) return;
      isDraggingCat = false;
      stage.style.cursor = '';
      if (mini) mini.playMeow();
      if (isRoaming) {
        roamState = 'idle';
        idleWaitTimer = 1.8;
        if (mini) mini.setPose('sit');
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(timeoutId);
        if (mini) mini.pause();
      } else if (isVisible) {
        if (mini) mini.resume();
      } else {
        scheduleNext();
      }
    });

    const summonBtn = document.getElementById('summonCatBtn');
    if (summonBtn) summonBtn.addEventListener('click', () => showCat(true));

    timeoutId = setTimeout(showCat, 9000 + Math.random() * 5000);
    window.__summonCat = () => showCat(true);
    window.__hideCat = hideCat;
    window.__startCatRoam = startRoaming;
    window.__stopCatRoam = () => stopRoaming(true);
    window.__isCatRoaming = () => isRoaming;

    if (typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting && Math.random() < 0.22 && !isVisible) {
            setTimeout(showCat, 650);
          }
        });
      }, { threshold: 0.55 });
      document.querySelectorAll('.case, .credential-card').forEach(c => obs.observe(c));
    }
  } catch (e) {}
}
