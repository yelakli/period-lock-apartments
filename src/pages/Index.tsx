import React from "react";

const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4">🚧 Opération Estivage terminée🚧</h1>
        <p className="text-lg mb-6">
          Nous vous remercions de bien vouloir passer au réglement des réservations auprès des personnes concernées.
        </p>
        <div className="animate-bounce text-3xl">🔧</div>
      </div>
    </div>
  );
};

export default ComingSoon;