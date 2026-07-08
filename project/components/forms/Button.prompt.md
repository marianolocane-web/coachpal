Botón de acción principal, pill-shaped, para CTAs de la app (marcar hábito, guardar, empezar).

```jsx
<Button variant="primary" onClick={handleDone}>Marcar como hecho</Button>
<Button variant="accent" size="sm">Empezar racha</Button>
<Button variant="secondary">Ahora no</Button>
<Button variant="ghost">Saltar</Button>
<Button variant="danger">Eliminar hábito</Button>
```

Variantes: `primary` (verde, acción principal), `accent` (ámbar, momentos de energía/celebración), `secondary` (borde, acción alterna), `ghost` (texto, acción terciaria), `danger` (eliminar/destructivo). Tamaños `sm`/`md`/`lg`. Soporta `icon`, `fullWidth`, `disabled`.
