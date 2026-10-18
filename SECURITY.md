# Política de seguridad

## Reportar una vulnerabilidad

**No abras un issue público para vulnerabilidades.**

Repórtalas por aquí:

1. **Private Vulnerability Reporting (recomendado)**
   - https://github.com/legacyum/portfolio-2026/security/advisories/new
   - Incluye descripción, pasos para reproducir, impacto y fix sugerido si tienes.

## Tiempos de respuesta

- Acuse de recibo en 48h.
- Respuesta detallada en 7 días.
- Te mantenemos al tanto y te acreditamos salvo que prefieras anonimato.

## Versiones soportadas

| Versión | Soporte |
| ------- | ------- |
| latest  | ✅ Sí   |
| older   | ❌ No   |

## Funciones activas

- ✅ Branch Protection en `main`
- ✅ Private Vulnerability Reporting
- ✅ Secret Scanning con Push Protection
- ✅ Dependabot Alerts + Security Updates
- ✅ Code Scanning (CodeQL)

## Formulario de contacto (Supabase)

- El formulario público inserta en la tabla `contact_messages` del proyecto Supabase `portfolio-contact`.
- La clave expuesta en el cliente es una **publishable key** (rol `anon`); nunca se usa `service_role` ni `sb_secret` en el navegador.
- RLS activado con política **solo INSERT** para `anon`/`authenticated`: la clave pública no puede leer, modificar ni borrar mensajes.
- Restricciones de longitud/formato en la propia tabla (`name`, `email`, `message`, `locale`) más honeypot y validación en cliente como primera barrera anti-spam.
- El origen de Supabase debe permanecer en `connect-src` del CSP en `vercel.json`, `src/_headers` y el meta de `src/index.html`.
- Si se rota el proyecto Supabase hay que actualizar endpoint y clave en `src/script.js`, regenerar `dist/` y repetir las tres superficies del CSP.

## Buenas prácticas al contribuir

- No commitear secretos (keys, tokens, passwords).
- Mantener dependencias al día.
- Revisar alertas de Dependabot y CodeQL.
