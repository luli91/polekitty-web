import { useState } from "react"
import { motion } from "framer-motion"
import type { FC } from "react"

const Gallery: FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const images = Array.from({ length: 18 }, (_, i) => `/alumna-estudio-${i + 1}.jpg`)

   const posiciones = [
  { top: "-10%", left: "10%" },
  { top: "-10%", left: "35%" },
  { top: "-10%", right: "5%" },
  { top: "15%", left: "5%" },
  { top: "4%", right: "25%" },
  { top: "18%", left: "43%" },
  { top: "40%", left: "5%" },
  { top: "15%", right: "5%" },
  { top: "20%", left: "25%" },
  { top: "47%", right: "42%" },
  { top: "34%", left: "60%" },
  { top: "50%", left: "25%" },
  { top: "40%", right: "5%" },
  { top: "65%", left: "5%" },
  { top: "60%", right: "22%" },
  { top: "75%", left: "25%" },
  { top: "77%", right: "37%" },
  { top: "70%", left: "82%" },
]

  return (
<section className="relative w-screen min-h-screen bg-black text-[#FAEBD7] overflow-x-hidden">

  {/* Imagen de fondo sutil */}
  <img
    src="/fondo-gallery.jpg"
    alt="Portada artística"
    className="absolute top-0 left-0 w-full h-full object-cover opacity-30 brightness-110 pointer-events-none select-none"
  />

  {/* Contenido principal encima */}
  <div className="relative z-10">
      {/* Título */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-3xl md:text-5xl font-bold py-10"
      >
        Galería de fotos
      </motion.h2>

      {/* Vista tipo Instagram en mobile */}
      <div className="grid grid-cols-3 gap-2 px-4 md:hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Alumna Estudio ${i + 1}`}
            className="w-full aspect-square object-cover rounded-md cursor-pointer hover:brightness-110 transition"
            onClick={() => setSelectedImage(src)}
          />
        ))}
      </div>

      {/* Collage artístico en desktop */}
        <div className="hidden md:block relative w-full h-[160vh] mt-30">
        {images.map((src, i) => (
            <motion.img
            key={i}
            src={src}
            alt={`Alumna Estudio ${i + 1}`}
            initial={{ opacity: 0, scale: 0.9, rotate: (i % 2 === 0 ? -10 : 10) }}
            animate={{ opacity: 1, scale: 1, rotate: (i % 2 === 0 ? -5 : 5) }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            className="absolute w-52 rounded-lg shadow-xl border-[4px] border-b-[60px] border-white"
            style={posiciones[i]}
            />
        ))}
        </div>

      {/* Imagen ampliada al hacer click */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Foto ampliada"
            className="max-w-[90%] max-h-[80vh] rounded-lg shadow-2xl border-[6px] border-white"
          />
          <p className="mt-4 text-sm text-[#FAEBD7] opacity-70">Tocá para cerrar</p>
        </div>
      )}
      </div>
    </section>
  )
}

export default Gallery
