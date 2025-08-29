const packs = [
  { nombre: "Pack de 4 clases", precio: 30000, clases: 4 },
  { nombre: "Pack de 8 clases", precio: 35000, clases: 8 },
  { nombre: "Pack de 12 clases", precio: 42000, clases: 12 },
  { nombre: "Pack libre (20 clases)", precio: 60000, clases: 20 },
  { nombre: "Clase particular", precio: 15000, clases: 1 },
];

const ComponenteSelectorDePack = ({ onSeleccionar }: { onSeleccionar: (pack: any) => void }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-fuchsia-600 mb-4 text-center">Elegí tu pack de clases</h2>
      <ul className="space-y-4">
        {packs.map((pack, index) => (
          <li
            key={index}
            className="border border-fuchsia-300 rounded-lg p-4 hover:bg-fuchsia-50 transition cursor-pointer"
            onClick={() => onSeleccionar(pack)}
          >
            <p className="text-lg font-semibold text-pink-700">{pack.nombre}</p>
            <p className="text-sm text-gray-600">💰 ${pack.precio} — 🧘 {pack.clases} clases</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComponenteSelectorDePack;
