Bottom sheet modal (estilo mobile) para confirmar acciones o editar un hábito rápido.

```jsx
<Dialog open={open} title="¿Eliminar hábito?" onClose={close} actions={<><Button variant="secondary" onClick={close}>Cancelar</Button><Button variant="danger" onClick={remove}>Eliminar</Button></>}>
  Esta acción no se puede deshacer.
</Dialog>
```
