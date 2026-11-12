
import './App.css';

// Importamos el componente de ingredientes
import Ingredientes from './components/Ingredientes';

// Componente principal de la aplicación
function App() {

  return (
    <div className="contenedor">

      {/* Encabezado de la pizzería */}
      <header className="encabezado">
        <h1>Pizzería El Buen Sabor</h1>
        <p>Sistema de control de inventario</p>
      </header>

      {/* Menú principal */}
      <nav className="menu">
        <button>Inicio</button>
        <button>Ingredientes</button>
        <button>Productos</button>
        <button>Movimientos</button>
      </nav>

      {/* Contenido principal */}
      <main className="contenido">

        <h2>Panel de inventario</h2>

        <p>Bienvenido al sistema de inventario.</p>

        {/* Mostramos el módulo de ingredientes */}
        <Ingredientes />

      </main>

    </div>
  );
}

// Exportamos el componente principal
export default App;
