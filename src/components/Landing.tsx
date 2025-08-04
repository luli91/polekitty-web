import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function Landing() {
  return (
   <section
  className="w-screen h-[150vh] bg-cover bg-center flex flex-col items-center justify-start text-white px-4 relative overflow-auto hide-scrollbar"
  style={{ backgroundImage: "url('/Florportada.png')" }}
>
  {/* Logo + texto */}
  <div className="mt-[40px] w-full flex flex-row items-center justify-center z-10 gap-8">
    {/* Logo */}
    <motion.img
      src="/Polekitty-logo-blanco.png"
      alt="Logo blanco de Polekitty Studio"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="w-20 md:w-28 object-contain"
    />

    {/* Texto */}
    <div className="flex flex-col items-start text-left">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg"
      >
        Polekitty Studio
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg md:text-2xl mb-4 max-w-xl self-center text-center"
      >
        Donde el cuerpo habla, la música guía y la sensualidad florece.
      </motion.p>
    </div>
  </div>

  {/* Botones debajo */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 z-10">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-xl py-6 px-4 cursor-pointer hover:bg-white/20 hover:border-white/40 transition duration-300"
    >
      <Link to="/booking">
        <h3 className="font-bold text-lg mb-2">Reservar Clase</h3>
        <p className="text-sm">Accedé al calendario y asegurá tu lugar</p>
      </Link>
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-xl py-6 px-4 cursor-pointer hover:bg-white/20 hover:border-white/40 transition duration-300"
    >
      <Link to="/gallery">
        <h3 className="font-bold text-lg mb-2">Explorar el Arte</h3>
        <p className="text-sm">Mirá momentos, clases y presentaciones</p>
      </Link>
    </motion.div>

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-xl py-6 px-4 cursor-pointer hover:bg-white/20 hover:border-white/40 transition duration-300"
    >
      <Link to="/About">
        <h3 className="font-bold text-lg mb-2">Conocé a la Creadora</h3>
        <p className="text-sm">Descubrí la historia detrás de Polekitty</p>
      </Link>
    </motion.div>
  </div>
</section>

  )
}

