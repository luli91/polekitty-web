import { motion } from "framer-motion"
import type { FC } from "react"
import { Link } from "react-router-dom"

const About: FC = () => {
  return (
    <section className="relative w-screen min-h-screen bg-black backdrop-blur-lg text-[#FAEBD7] px-6 py-16 flex flex-col items-center justify-center text-center overflow-auto">
      {/* Logo flotante para tablet y desktop */}
      <Link to="/" className="hidden md:block absolute top-10 left-6 z-50">
        <img
          src="/Polekitty-logo-blanco.png"
          alt="Logo PoleKitty’S"
          className="w-16 md:w-40 transition-transform duration-300 ease-in-out hover:scale-105 drop-shadow-lg"
        />
      </Link>

      {/* Logo para mobile centrado arriba */}
      <div className="md:hidden flex justify-center mb-8">
        <Link to="/">
          <img
            src="/Polekitty-logo-blanco.png"
            alt="Logo PoleKitty’S"
            className="w-20 transition-transform duration-300 ease-in-out hover:scale-105 drop-shadow-lg"
          />
        </Link>
      </div>
      
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold mb-8"
      >
        Sobre mí
      </motion.h2>

      <motion.img
        src="/Florperfil.jpeg"
        alt="Florencia Díaz, fundadora de Polekitty’S"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-40 md:w-56 rounded-full shadow-lg mb-6"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-base md:text-lg max-w-3xl space-y-4 text-left"
      >
        <p>
          ¡Hola! Soy <strong>Florencia Díaz</strong>, instructora de Pole dance y creadora del espacio <strong>PoleKitty’S</strong>.
        </p>
        <p>
          Hace 5 años descubrí el mundo del Pole, y desde entonces esta disciplina se volvió una gran parte de mi vida. Hace 1 año comencé a dar clases como instructora certificada en nivel básico, con el objetivo de acompañar a otras mujeres a descubrir su fuerza, sensualidad y confianza a través del movimiento.
        </p>
        <p>
          En mis clases trabajamos técnica, musicalidad, actitud y expresión corporal. Me especializo en coreografías estilo <em>Exotic Flow</em> y en <em>floorwork</em> (trabajo en el suelo sin barra), un estilo que amo por su potencia, fluidez y libertad.
        </p>
        <p>
          También organizo eventos coreográficos donde presentamos lo trabajado en clase en el escenario de Vértigo. Estas experiencias permiten que cada alumna conecte con su sensualidad y gane seguridad en escena.
        </p>
        <p>
          Mi enfoque mezcla técnica, entrenamiento físico y mucha actitud, porque creo que el Pole es mucho más que una disciplina: es una herramienta de empoderamiento.
        </p>
        <p>
          Las clases están pensadas para que todas puedan animarse, sin importar la edad, el cuerpo o el nivel con el que empieces.
        </p>
        <p className="text-center font-medium mt-6">
          Si estás buscando un espacio donde entrenar, expresarte y disfrutar del proceso, te invito a sumarte. ✨
        </p>
      </motion.div>

      {/* Galería mobile: vertical */}
<div className="flex flex-col gap-6 mt-10 items-center md:hidden">
  {["flor-pose1.jpeg", "flor-pose2.jpeg", "flor-pose3.jpeg", "flor-pose4.jpeg"].map((src, i) => (
    <img
      key={i}
      src={`/${src}`}
      alt={`Florencia pose ${i + 1}`}
      className="w-64 rounded-lg shadow-md border-[4px] border-white"
    />
  ))}
</div>

{/* Galería tablet: alineada lateralmente */}
<div className="hidden md:flex lg:hidden justify-center gap-6 mt-10 flex-wrap">
  {["flor-pose1.jpeg", "flor-pose2.jpeg", "flor-pose3.jpeg", "flor-pose4.jpeg"].map((src, i) => (
    <img
      key={i}
      src={`/${src}`}
      alt={`Florencia pose ${i + 1}`}
      className="w-52 rounded-lg shadow-md border-[4px] border-white"
    />
  ))}
</div>

{/* Galería desktop: desparramadas tipo impresas */}
<div className="hidden lg:block">
  <motion.img
    src="/flor-pose1.jpeg"
    alt="Florencia pose 1"
    initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
    animate={{ opacity: 1, rotate: -5, scale: 1 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="absolute bottom-10 left-6 w-60 shadow-xl rounded-lg border-[6px] border-white"
  />
  <motion.img
    src="/flor-pose3.jpeg"
    alt="Florencia pose 2"
    initial={{ opacity: 0, rotate: 8, scale: 0.9 }}
    animate={{ opacity: 1, rotate: 4, scale: 1 }}
    transition={{ delay: 0.7, duration: 0.8 }}
    className="absolute top-[30%] right-8 w-56 shadow-xl rounded-md border-[5px] border-white"
  />
  <motion.img
    src="/flor-pose2.jpeg"
    alt="Florencia pose 3"
    initial={{ opacity: 0, rotate: -4, scale: 0.9 }}
    animate={{ opacity: 1, rotate: -2, scale: 1 }}
    transition={{ delay: 0.9, duration: 0.8 }}
    className="absolute top-[43%] left-4 transform -translate-y-1/2 w-52 shadow-xl rounded-md border-[5px] border-white"
  />
  <motion.img
    src="/flor-pose4.jpeg"
    alt="Florencia pose 4"
    initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
    animate={{ opacity: 1, rotate: 2, scale: 1 }}
    transition={{ delay: 1.1, duration: 0.8 }}
    className="absolute bottom-16 right-10 w-56 shadow-xl rounded-md border-[5px] border-white"
  />
</div>

    </section>
  )
}

export default About