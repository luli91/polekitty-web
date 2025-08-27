const PoleKittyInfo = () => (
  <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-2 border-violet-500 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] p-4 sm:w-[30%] text-sm text-violet-300 space-y-4 mt-6 sm:mt-0 transition-transform duration-300 hover:scale-[1.02]">
    <h3 className="text-violet-400 font-bold text-lg flex items-center gap-2">
      <span className="animate-bounce">📌</span> PoleKitty’s Info
    </h3>
    <div className="h-[1px] bg-gradient-to-r from-fuchsia-500 via-violet-500 to-fuchsia-500 opacity-40" />
    <ul className="list-disc list-inside space-y-1">
      <li>Ausencias no se recuperan</li>
      <li>Cancelación con 24hs permite recuperación</li>
      <li>Si no se abona la primera clase, se pierde el lugar</li>
      <li>Pack válido solo dentro del mes abonado</li>
    </ul>
    <div className="h-[1px] bg-gradient-to-r from-fuchsia-500 via-violet-500 to-fuchsia-500 opacity-40" />
    <h3 className="text-violet-400 font-bold text-lg mt-2"> Packs de clases</h3>
    <ul className="list-disc list-inside space-y-1">
      <li>Pack de 4 → $30.000</li>
      <li>Pack de 8 → $35.000</li>
      <li>Pack de 12 → $42.000</li>
      <li>Pack libre → $60.000 (20 clases)</li>
      <li>Clase particular → $15.000 (1:30hs)</li>
    </ul>
    <p className="mt-2 text-xs italic text-violet-400">
      Clases particulares: para técnica, show o muestra.
    </p>
    <div className="h-[1px] bg-gradient-to-r from-fuchsia-500 via-violet-500 to-fuchsia-500 opacity-40" />
    <h3 className="text-violet-400 font-bold text-lg mt-2"> Datos de pago</h3> 
    <p className="text-xs"> 
      Alias: exopole<br />
      Número: 11 4142-9761<br />
      Dirección: Avenida Crovara 1520, Villa Madero<br />
    </p> 
  </div>
);

export default PoleKittyInfo;
