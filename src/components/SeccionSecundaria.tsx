import React from "react";

interface Props {
  titulo: string;
  children: React.ReactNode;
}

const SeccionSecundaria = ({ titulo, children }: Props) => (
  <div className="bg-gray-850 p-3 rounded-xl shadow-md border border-gray-700 mb-6">
    <h4 className="text-gray-300 font-semibold mb-2">{titulo}</h4>
    {children}
  </div>
);

export default SeccionSecundaria;
