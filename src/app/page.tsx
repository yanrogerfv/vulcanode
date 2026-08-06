"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore, ProjectTemplate } from '@/store/useProjectStore';
import {
    Anvil,
    ArrowRight,
    Sparkles,
    Layers,
    Sword,
    Home,
    Sun,
    Moon,
    Box,
    Flame,
    Heart,
    Cake,
    Minimize2,
    CheckCircle2,
    Share2,
    Download,
    Dot,
    GitCommitHorizontal,
    Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/lib/i18n/useT';
import { landingDict } from '@/lib/i18n/dictionaries/landing';

export default function LandingPage() {
    const router = useRouter();
    const { loadTemplate, theme, toggleTheme, language, setLanguage } = useProjectStore();
    const t = useT(landingDict);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(theme);
        }
    }, [theme]);

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            glowRef.current?.style.setProperty('--spot-x', `${e.clientX}px`);
            glowRef.current?.style.setProperty('--spot-y', `${e.clientY}px`);
        };
        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, []);

    const handleStartWithTemplate = (template: ProjectTemplate) => {
        loadTemplate(template);
        router.push('/app');
    };

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden transition-colors duration-300 font-sans">

            {/* Background Decorative Obsidian / Orange Magma Glow */}
            <div className="absolute top-[-20%] left-1/6 -translate-x-1/2 w-225 h-125 bg-linear-to-tr from-orange-600/15 to-amber-500/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-150 h-150 bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Background Grid Texture */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.05] dark:opacity-[0.07]" />
            </div>

            {/* Forge Glow Cursor */}
            <div
                ref={glowRef}
                aria-hidden="true"
                className="fixed inset-0 z-0 pointer-events-none animate-pulse"
                style={{
                    background: 'radial-gradient(200px circle at var(--spot-x, 50%) var(--spot-y, 15%), rgba(255,106,19,0.10), transparent 65%)',
                }}
            />

            <nav className="max-w-6xl w-full mx-auto px-6 h-20 flex items-center justify-between z-10">
                <div className="flex items-center gap-3 hover:cursor-pointer select-none">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,106,19,0.4)]">
                        <Anvil className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="font-semibold text-2xl tracking-tight block leading-none">
                            Vulca<span className="text-orange-500">node</span>
                        </span>
                        <span className="text-[10px] uppercase font-normal text-muted-foreground tracking-widest block mt-0.5">
                            Hierarchical Crafting Platform
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-0.5 bg-secondary/40 border border-border rounded-xl p-0.5 text-xs">
                        <Button
                            variant={language === 'pt' ? 'default' : 'outline'}
                            onClick={() => setLanguage('pt')}
                            title={t('switchToPortuguese')}
                            className={`h-7 px-2 rounded-lg text-xs font-medium transition-colors hover:cursor-pointer ${language === 'pt' ? 'bg-orange-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            PT
                        </Button>
                        <Button
                            variant={language === 'en' ? 'default' : 'outline'}
                            onClick={() => setLanguage('en')}
                            title={t('switchToEnglish')}
                            className={`h-7 px-2 rounded-lg text-xs font-medium transition-colors hover:cursor-pointer ${language === 'en' ? 'bg-orange-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            EN
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        title={theme === 'dark' ? t('switchToLightTheme') : t('switchToDarkTheme')}
                        className="h-9 w-9 rounded-xl border-border bg-card hover:bg-secondary text-muted-foreground hover:text-orange-400 transition-all shadow-sm"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-foreground" />}
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => handleStartWithTemplate('blank')}
                        className="h-9 px-4 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium text-sm rounded-xl shadow-[0_0_15px_rgba(255,106,19,0.35)] transition-all transform hover:scale-105 gap-2 border-none"
                    >
                        <span>{t('createProjectNow')}</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-5xl w-full min-w-0 mx-auto px-6 pt-12 pb-16 flex flex-col items-center text-center relative z-10">

                <Badge variant="outline" className="px-4 py-1.5 bg-orange-500/10 border-orange-500/30 text-orange-400 rounded-full text-xs font-normal uppercase tracking-widest mb-6 shadow-sm gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> {t('heroBadge')}
                </Badge>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-foreground max-w-4xl leading-[1.08] mb-6">
                    {t('heroHeadlinePrefix')} <span className="text-orange-500 font-semibold">{t('heroHeadlineHighlight')}</span>
                </h1>

                <p className="text-base sm:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed mb-10">
                    {t('heroSubheadline')}
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full justify-center">
                    <Button
                        size="lg"
                        onClick={() => handleStartWithTemplate('blank')}
                        className="w-full sm:w-auto px-8 h-12 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium text-base rounded-xl shadow-[0_0_25px_rgba(255,106,19,0.4)] transition-all transform hover:scale-105 gap-2.5 border-none"
                    >
                        <span>{t('startModularForge')}</span>
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>

                {/* Templates Rápidos */}
                <div className="w-full pt-4 mb-16">
                    <span className="text-xs font-normal uppercase text-muted-foreground tracking-widest block mb-4">
                        {t('templatesIntro')}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto text-left">

                        {/* Budget / Composição Card */}
                        <Card
                            onClick={() => handleStartWithTemplate('budget')}
                            className="group bg-card/80 hover:bg-card border-border hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 shadow-md flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 transition-transform">
                                    <Home className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-medium text-base text-foreground group-hover:text-amber-400 transition-colors">{t('budgetTemplateTitle')}</h3>
                                    <p className="text-xs text-muted-foreground font-normal pt-0.5">{t('budgetTemplateDescPrefix')} <span className="text-emerald-400">{t('totalCostXLabel')}</span> {t('budgetTemplateDescSuffix')}</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 transform group-hover:translate-x-1 transition-all shrink-0" />
                        </Card>

                        {/* RPG Card */}
                        <Card
                            onClick={() => handleStartWithTemplate('rpg')}
                            className="group bg-card/80 hover:bg-card border-border hover:border-orange-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 shadow-md flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0 group-hover:scale-110 transition-transform">
                                    <Sword className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-medium text-base text-foreground group-hover:text-orange-400 transition-colors">{t('rpgTemplateTitle')}</h3>
                                    <p className="text-xs text-muted-foreground font-normal pt-0.5">{t('rpgTemplateDesc')}</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all shrink-0" />
                        </Card>

                        {/* Cake / Receita Card */}
                        <Card
                            onClick={() => handleStartWithTemplate('cake')}
                            className="group bg-card/80 hover:bg-card border-border hover:border-pink-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-300 shadow-md flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-500 shrink-0 group-hover:scale-110 transition-transform">
                                    <Cake className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-medium text-base text-foreground group-hover:text-pink-400 transition-colors">{t('cakeTemplateTitle')}</h3>
                                    <p className="text-xs text-muted-foreground font-normal pt-0.5">{t('cakeTemplateDesc')}</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-pink-500 transform group-hover:translate-x-1 transition-all shrink-0" />
                        </Card>

                    </div>
                </div>

            </div>

            {/* Preview Interativo Simulado */}
            <div className="max-w-6xl w-full mx-auto px-6 mb-24 relative z-10">
                <Card className="bg-card border-2 border-border rounded-2xl p-4 sm:p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden">

                    <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            <span className="text-xs font-normal text-muted-foreground ml-2">{t('previewLabel')}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Badge variant="outline" className="bg-secondary dark:bg-slate-900 border-border dark:border-slate-800 text-orange-600 dark:text-orange-400 text-xs font-normal">{t('previewCleanIconMode')}</Badge>
                            <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-mono font-normal">{t('previewTotalCostTop')}</Badge>
                        </div>
                    </div>

                    <div className="bg-canvas-bg border border-border dark:border-slate-800/80 rounded-xl p-8 h-115 flex items-center justify-center relative overflow-hidden select-none">
                        <div className="absolute inset-0 bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.06]" />

                        {/* Simulação da Crafting Tree invertida: Componentes na base, subindo em direção à Meta no topo */}
                        <div className="flex flex-col items-center justify-center gap-5 w-full relative z-10">

                            {/* Losango Final no Topo (Meta / Apex) */}
                            <div className="relative w-32 h-32 flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer">
                                <div className="w-24 h-24 rotate-45 rounded-2xl bg-card dark:bg-slate-950 border-2 border-orange-500 shadow-[0_0_35px_rgba(255,106,19,0.45)] absolute" />
                                <div className="z-10 flex flex-col items-center justify-center">
                                    <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400 drop-shadow mb-1" />
                                    <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{t('previewWeddingNode')}</span>
                                </div>
                            </div>

                            {/* Conexão vertical subindo até a meta */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-0.5 h-8 bg-linear-to-t from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                            </div>

                            {/* Nó Intermediário: Composição Casa */}
                            <div className="relative flex flex-col items-center hover:scale-110 transition-all duration-300 cursor-pointer">
                                <div className="absolute -top-6 px-3 py-0.5 rounded-full bg-secondary dark:bg-slate-900 border border-orange-500/50 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 shadow-xl font-bold whitespace-nowrap">
                                    {t('previewHomeCompositionCost')}
                                </div>
                                <div className="px-6 py-4 rounded-2xl bg-card dark:bg-slate-950 border-2 border-amber-500 shadow-2xl flex items-center gap-2.5">
                                    <Home className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    <span className="text-base font-medium text-foreground dark:text-slate-100">{t('previewHomeCompositionNode')}</span>
                                </div>
                            </div>

                            {/* Conexões verticais subindo dos dois componentes até a composição */}
                            <div className="flex items-center justify-center gap-16 sm:gap-32">
                                <div className="w-0.5 h-8 bg-linear-to-t from-orange-500 to-amber-500 shadow-[0_0_8px_rgba(255,106,19,0.8)]" />
                                <div className="w-0.5 h-8 bg-linear-to-t from-orange-500 to-amber-500 shadow-[0_0_8px_rgba(255,106,19,0.8)]" />
                            </div>

                            {/* Círculos de Componentes na base */}
                            <div className="flex items-center justify-center gap-6 sm:gap-10">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-card hover:scale-110 transition-all duration-300 dark:bg-slate-950 border-2 border-orange-500/80 shadow-[0_0_25px_rgba(255,106,19,0.25)] flex flex-col items-center justify-center text-center p-2 relative group cursor-pointer">
                                    <Box className="w-8 h-8 text-orange-600 dark:text-orange-400 drop-shadow mb-1" />
                                    <span className="text-xs font-semibold text-foreground dark:text-slate-100">{t('previewFridge')}</span>
                                </div>
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-card hover:scale-110 transition-all duration-300 dark:bg-slate-950 border-2 border-orange-500/80 shadow-[0_0_25px_rgba(255,106,19,0.25)] flex flex-col items-center justify-center text-center p-2 relative group cursor-pointer">
                                    <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400 drop-shadow mb-1" />
                                    <span className="text-xs font-semibold text-foreground dark:text-slate-100">{t('previewCooktop')}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </Card>
            </div>

            {/* Diferenciais */}
            <section className="max-w-5xl mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <Card className="bg-card border-border hover:-translate-y-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,106,19,0.2)] p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mb-4 font-normal">
                            <Box className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-medium mb-2">{t('featureCleanModeTitle')}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {t('featureCleanModeDesc')}
                    </p>
                </Card>

                <Card className="bg-card border-border hover:-translate-y-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,106,19,0.2)] p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4 font-normal">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-medium mb-2">{t('featureHierarchyTitle')}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {t('featureHierarchyDescPrefix')}<span className="text-emerald-400">{t('totalCostXLabel')}</span>{t('featureHierarchyDescSuffix')}
                    </p>
                </Card>

                <Card className="bg-card border-border hover:-translate-y-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,106,19,0.2)] p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4 font-normal">
                            <Minimize2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-medium mb-2">{t('featureCollapseTitle')}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {t('featureCollapseDesc')}
                    </p>
                </Card>

                <Card className="bg-card border-border hover:-translate-y-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,106,19,0.2)] p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4 font-normal">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-medium mb-2">{t('featureCascadeTitle')}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {t('featureCascadeDesc')}
                    </p>
                </Card>

                <Card className="bg-card border-border hover:-translate-y-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,106,19,0.2)] p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mb-4 font-normal">
                            <Share2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-medium mb-2">{t('featureShareTitle')}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {t('featureShareDesc')}
                    </p>
                </Card>

                <Card className="bg-card border-border hover:-translate-y-2 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,106,19,0.2)] p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4 font-normal">
                            <Download className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-medium mb-2">{t('featureExportTitle')}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {t('featureExportDesc')}
                    </p>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 relative z-10 bg-card font-normal">
                <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Vulcanode. {t('footerRights')}
                    </p>
                    <Link href="https://github.com/yanrogerfv/vulcanode" target="_blank" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <GitCommitHorizontal className="w-4 h-4 hover:rotate-90 hover:text-orange-400 hover:scale-110 transition-all duration-200" />
                    </Link>
                    <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            {t('footerTerms')}
                        </Link>
                        <Dot className="w-2 h-2 text-muted-foreground" />
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            {t('footerPrivacy')}
                        </Link>
                        <Dot className="w-2 h-2 text-muted-foreground" />
                        <Link href="mailto:contact@vulcanode.app" className="hover:text-foreground transition-colors">
                            {t('footerContact')}
                        </Link>
                        <Dot className="w-2 h-2 text-muted-foreground" />
                        <Link href='https://ko-fi.com/D5Q824L4EP' target='_blank' title='Buy me a Coffee' className="hover:text-orange-400 transition-colors">
                            <Coffee className="w-4 h-4" />
                        </Link>
                    </nav>
                </div>
            </footer>
        </main>
    );
}
