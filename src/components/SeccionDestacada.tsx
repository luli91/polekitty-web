type Props = {
  titulo: string;
  subtitulo?: string;
};

const SeccionDestacada = ({ titulo, subtitulo }: Props) => {
  return (
    <section className="relative bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-400 rounded-2xl p-6 shadow-xl text-white text-center overflow-hidden border border-fuchsia-300">
      {/* Confetti decorativo */}
      <div className="absolute inset-0 pointer-events-none opacity-20 animate-pulse">
        <div className="absolute top-0 left-0 w-16 h-16 bg-pink-300 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-violet-300 rounded-full blur-2xl" />
      </div>

      {/* Título principal */}
      <h2 className="text-3xl font-extrabold tracking-tight mb-2 drop-shadow-md">
        {titulo}
      </h2>

      {/* Subtítulo con glow */}
      {subtitulo && (
        <p className="text-base text-fuchsia-100 italic drop-shadow-sm">
          {subtitulo}
        </p>
      )}
    </section>
  );
};

export default SeccionDestacada;
