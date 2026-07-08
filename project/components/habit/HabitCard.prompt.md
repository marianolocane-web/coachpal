Tarjeta completa de hábito para la lista de "Hábitos de hoy" — nombre (clicable), racha, meta, hora, barra de votos de identidad (James Clear), botón de comentario y check de respuesta. El nombre se pone en rojo si la hora ya pasó y no se respondió (`overdue`, día todavía en curso); si el día ya cerró y el hábito nunca se completó (`missed`), toda la tarjeta se tiñe de coral suave con una etiqueta "No completado" — marca un área de mejora sin ser punitivo. Nombre tachado si ya se completó.

```jsx
<HabitCard
  habit={{ name: 'Meditar 10 min', streak: 12, time: '08:00', done: false, overdue: true,
    identity: { negativeEmoji: '🤯', positiveEmoji: '🧘‍♂️', votes: 7 } }}
  onToggle={markDone}
  onComment={openComment}
  onOpen={openDetail}
/>
// día pasado, no completado (solo lectura — no se puede comentar retroactivamente):
<HabitCard habit={{ name: 'Beber 2L de agua', time: 'Todo el día', done: false, missed: true, comment: 'Se me pasó, muy ocupada.' }} readOnly />
```
