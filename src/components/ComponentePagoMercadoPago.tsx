import { useEffect } from "react";

const ComponentePagoMercadoPago = ({ pack, uid }: { pack: any; uid: string }) => {
  useEffect(() => {
    const generarPreferencia = async () => {
      const res = await fetch("https://us-central1-polekitty.cloudfunctions.net/crearPreferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          nombrePack: pack.nombre,
          precio: pack.precio,
          clases: pack.clases,
        }),
      });

      const { init_point } = await res.json();
      window.location.href = init_point;
    };

    generarPreferencia();
  }, [pack, uid]);

  return (
    <div className="text-center mt-10 text-gray-600">
      Redirigiendo a MercadoPago para completar tu compra... 🛍️
    </div>
  );
};

export default ComponentePagoMercadoPago;


