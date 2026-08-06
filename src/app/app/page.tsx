"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Header } from '@/components/canvas/Header';
import { Sidebar } from '@/components/canvas/Sidebar';
import { VulcanCanvas } from '@/components/canvas/VulcanCanvas';
import { TemplateSelectorModal } from '@/components/canvas/TemplateSelectorModal';
import { useProjectStore } from '@/store/useProjectStore';

export default function AppPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { theme, isViewOnly } = useProjectStore();
    const hasCheckedFirstVisit = useRef(false);

    useEffect(() => {
        // Sincronizar classe de tema na abertura
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        // Checagem de PRIMEIRA VISITA apenas: roda uma única vez na montagem.
        // Não pode depender de nodes.length, senão o modal reabre sempre que o canvas
        // volta a ficar vazio (ex: após "Limpar Canvas").
        if (hasCheckedFirstVisit.current) return;
        hasCheckedFirstVisit.current = true;

        const urlParams = new URLSearchParams(window.location.search);
        const shareHash = urlParams.get('share');
        if (!shareHash && useProjectStore.getState().nodes.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- inicialização única no mount a partir da URL do navegador, não deriva de props/estado reativo
            setIsModalOpen(true);
        }
    }, []);

    return (
        // O provider envolve o Header também: ele precisa do contexto do React Flow para
        // exportar o board inteiro em PNG (medidas reais dos nós vêm de lá, não do store).
        <ReactFlowProvider>
            <div className="h-screen w-screen flex flex-col overflow-hidden bg-background select-none text-foreground font-sans">

                {/* Barra Superior */}
                <Header onOpenTemplates={() => setIsModalOpen(true)} />

                {/* Área do Editor: Sidebar à esquerda e Canvas à direita (Sidebar escondida em modo Visualização) */}
                <div className="flex-1 flex overflow-hidden relative">
                    {!isViewOnly && <Sidebar />}
                    <VulcanCanvas />
                </div>

                {/* Modal Interativo de Seleção de Templates / Importação */}
                <TemplateSelectorModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </ReactFlowProvider>
    );
}
