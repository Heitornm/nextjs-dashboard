'use client';

import React from 'react';

interface ConfirmationModalProps {
    title: string;
    message: React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * Componente Modal estilizado para confirmação de exclusão.
 * Utiliza classes Tailwind para centralização e aparência.
 */
export function ConfirmationModal({ title, message, onClose, onConfirm }: ConfirmationModalProps) {
    return (
        // Fundo escurecido e centralização (fixed, inset-0, flex, items-center, justify-center)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4 transition-opacity duration-300 ease-out">

            {/* Container do Modal */}
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-transform duration-300 ease-out scale-100">

                {/* Título com destaque de cor e AJUSTE break-words */}
                <h3 className="text-2xl font-semibold mb-4 text-red-700 border-b pb-2 break-words text-center">
                    {title}
                </h3>

                {/* Mensagem principal */}
                <p className="text-gray-700 mb-6 leading-relaxed justify-center text-center">
                    {message} 
                </p>
                {/* Botões de Ação */}
                <div className="flex justify-center space-x-3 mt-4">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium rounded-lg text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Confirmar Exclusão
                    </button>
                </div>
            </div>
        </div>
    );
}