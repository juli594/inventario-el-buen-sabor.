
import { useState, useEffect } from 'react';

// Componente encargado de administrar el inventario
function Inventario() {

  // Consultamos si existen ingredientes guardados en el navegador
  const [ingredientes, setIngredientes] = useState(() => {

    // Recuperamos los datos almacenados
    const datosGuardados = localStorage.getItem('ingredientes');

    // Si existen datos, los convertimos a formato JavaScript
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });

  // Variables para guardar los datos del formulario
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');

  // Variable para saber si estamos editando un ingrediente
  const [idEditar, setIdEditar] = useState(null);

  // Variable para guardar lo que escribimos en el buscador
  const [busqueda, setBusqueda] = useState('');

  // Guardamos los ingredientes cada vez que cambian
  useEffect(() => {

    localStorage.setItem('ingredientes', JSON.stringify(ingredientes));

  }, [ingredientes]);

  // Función para limpiar los campos del formulario
  function limpiarFormulario() {

    setNombre('');
    setCategoria('');
    setCantidad('');
    setStockMinimo('');
    setIdEditar(null);

  }

  // Función para registrar o actualizar un ingrediente
  function guardarIngrediente(e) {

    // Evitamos que la página se recargue
    e.preventDefault();

    // Validamos que los campos estén completos
    if (
      nombre.trim() === '' ||
      categoria.trim() === '' ||
      cantidad === '' ||
      stockMinimo === ''
    ) {

      alert('Por favor completa todos los campos');
      return;

    }

    // Validamos que las cantidades sean correctas
    if (Number(cantidad) < 0 || Number(stockMinimo) < 0) {

      alert('Las cantidades no pueden ser negativas');
      return;

    }

    // Creamos un objeto con la información del ingrediente
    const nuevoIngrediente = {

      id: idEditar !== null ? idEditar : Date.now(),
      nombre: nombre.trim(),
      categoria: categoria,
      cantidad: Number(cantidad),
      stockMinimo: Number(stockMinimo)

    };

    // Comprobamos si estamos editando o registrando
    if (idEditar !== null) {

      // Actualizamos el ingrediente seleccionado
      const listaActualizada = ingredientes.map((ingrediente) => {

        if (ingrediente.id === idEditar) {
          return nuevoIngrediente;
        }

        return ingrediente;

      });

      setIngredientes(listaActualizada);

    } else {

      // Agregamos el nuevo ingrediente a la lista
      setIngredientes([...ingredientes, nuevoIngrediente]);

    }

    // Limpiamos el formulario
    limpiarFormulario();

  }

  // Función para cargar los datos de un ingrediente en el formulario
  function editarIngrediente(ingrediente) {

    setNombre(ingrediente.nombre);
    setCategoria(ingrediente.categoria);
    setCantidad(ingrediente.cantidad);
    setStockMinimo(ingrediente.stockMinimo);
    setIdEditar(ingrediente.id);

  }

  // Función para eliminar un ingrediente
  function eliminarIngrediente(id) {

    // Preguntamos antes de eliminar
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este ingrediente?'
    );

    if (confirmar) {

      // Filtramos la lista para quitar el ingrediente seleccionado
      const listaActualizada = ingredientes.filter(
        (ingrediente) => ingrediente.id !== id
      );

      setIngredientes(listaActualizada);

    }

  }

  // Buscamos ingredientes por su nombre
  const ingredientesFiltrados = ingredientes.filter((ingrediente) =>
    ingrediente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Calculamos la cantidad total de ingredientes registrados
  const totalIngredientes = ingredientes.length;

  // Contamos los ingredientes que tienen stock bajo
  const stockBajo = ingredientes.filter(
    (ingrediente) => ingrediente.cantidad <= ingrediente.stockMinimo
  ).length;

  // Calculamos los ingredientes que tienen stock suficiente
  const stockDisponible = totalIngredientes - stockBajo;

  return (

    <div className="inventario">

      {/* Tarjetas con información del inventario */}
      <div className="tarjetas">

        <div className="tarjeta">
          <h3>Total ingredientes</h3>
          <p>{totalIngredientes}</p>
        </div>

        <div className="tarjeta">
          <h3>Stock disponible</h3>
          <p>{stockDisponible}</p>
        </div>

        <div className="tarjeta alerta">
          <h3>Stock bajo</h3>
          <p>{stockBajo}</p>
        </div>

      </div>

      {/* Formulario de ingredientes */}
      <section className="seccion">

        <h3>
          {idEditar !== null ? 'Editar ingrediente' : 'Registrar ingrediente'}
        </h3>

        <form onSubmit={guardarIngrediente} className="formulario">

          <div className="campo">
            <label>Nombre del ingrediente</label>

            <input
              type="text"
              placeholder="Ejemplo: Harina"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Categoría</label>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              <option value="Granos">Granos</option>
              <option value="Lácteos">Lácteos</option>
              <option value="Carnes">Carnes</option>
              <option value="Verduras">Verduras</option>
              <option value="Salsas">Salsas</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="campo">
            <label>Cantidad disponible</label>

            <input
              type="number"
              min="0"
              placeholder="Ejemplo: 20"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Stock mínimo</label>

            <input
              type="number"
              min="0"
              placeholder="Ejemplo: 5"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
            />
          </div>

          <div className="botones-formulario">

            <button type="submit" className="boton-guardar">
              {idEditar !== null ? 'Actualizar ingrediente' : 'Registrar ingrediente'}
            </button>

            {idEditar !== null && (

              <button
                type="button"
                className="boton-cancelar"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>

            )}

          </div>

        </form>

      </section>

      {/* Tabla donde mostramos los ingredientes */}
      <section className="seccion">

        <h3>Lista de ingredientes</h3>

        {/* Buscador */}
        <input
          type="text"
          className="buscador"
          placeholder="Buscar ingrediente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="tabla-contenedor">

          <table>

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Stock mínimo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {ingredientesFiltrados.length > 0 ? (

                ingredientesFiltrados.map((ingrediente) => (

                  <tr key={ingrediente.id}>

                    <td>{ingrediente.nombre}</td>

                    <td>{ingrediente.categoria}</td>

                    <td>{ingrediente.cantidad}</td>

                    <td>{ingrediente.stockMinimo}</td>

                    <td>
                      {ingrediente.cantidad <= ingrediente.stockMinimo ? (
                        <span className="estado-bajo">Stock bajo</span>
                      ) : (
                        <span className="estado-disponible">Disponible</span>
                      )}
                    </td>

                    <td>

                      <button
                        className="boton-editar"
                        onClick={() => editarIngrediente(ingrediente)}
                      >
                        Editar
                      </button>

                      <button
                        className="boton-eliminar"
                        onClick={() => eliminarIngrediente(ingrediente.id)}
                      >
                        Eliminar
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6">
                    No hay ingredientes para mostrar
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>

  );

}

// Exportamos el componente para utilizarlo en App.jsx
export default Inventario;
