"use client";

import { useAuthContext } from "../../contexts/AuthContext";

export default function UserProfile() {
  const { user, userProfile, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">No hay usuario autenticado</div>
      </div>
    );
  }

  const formatWalletAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPrivateKey = (pk: string) => {
    if (pk.length <= 10) return pk;
    return `${pk.slice(0, 6)}...${pk.slice(-4)}`;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Perfil de Usuario</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <div className="text-white font-mono bg-gray-900 px-3 py-2 rounded-lg">
            {userProfile.email}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Wallet Address
          </label>
          <div className="text-green-400 font-mono bg-gray-900 px-3 py-2 rounded-lg">
            {formatWalletAddress(userProfile.wallet_address)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Private Key (encriptada)
          </label>
          <div className="text-red-400 font-mono bg-gray-900 px-3 py-2 rounded-lg">
            {formatPrivateKey(userProfile.private_pk)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Fecha de Creación
          </label>
          <div className="text-gray-300 bg-gray-900 px-3 py-2 rounded-lg">
            {new Date(userProfile.created_at).toLocaleDateString()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Última Actualización
          </label>
          <div className="text-gray-300 bg-gray-900 px-3 py-2 rounded-lg">
            {new Date(userProfile.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
