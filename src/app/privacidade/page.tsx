"use client";

import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { useProjectStore } from '@/store/useProjectStore';

const PrivacidadePortugues: React.FC = () => (
  <>
    <section>
      <h2>1. Introdução</h2>
      <p>
        Esta Política de Privacidade explica como o Vulcanode lida com dados ao longo do uso da
        plataforma. Fomos construídos com um princípio simples: <strong>quanto menos dados precisarmos
          tocar, melhor</strong> — praticamente tudo acontece localmente, no seu próprio navegador.
      </p>
    </section>

    <section>
      <h2>2. Dados que Coletamos</h2>
      <p>
        O Vulcanode não exige cadastro, login, e-mail ou qualquer dado pessoal para ser utilizado. Os
        projetos que você cria — nós, conexões, nomes, tags, textos e valores — são salvos apenas no
        armazenamento local (localStorage) do seu navegador e <strong>nunca são enviados para nossos
          servidores</strong>, pois a plataforma não possui um backend que armazene esse conteúdo.
      </p>
    </section>

    <section>
      <h2>3. Armazenamento Local e Cookies</h2>
      <p>
        Utilizamos o localStorage do navegador para guardar seus projetos e preferências (como o tema
        claro/escuro escolhido). Isso não é um cookie de rastreamento — os dados ficam restritos ao seu
        próprio dispositivo e navegador, e podem ser apagados a qualquer momento limpando os dados do
        site nas configurações do seu navegador.
      </p>
    </section>

    <section>
      <h2>4. Links de Compartilhamento</h2>
      <p>
        Quando você gera um link de compartilhamento, os dados do projeto são codificados diretamente
        na URL — não passam por, nem ficam armazenados em, nenhum servidor nosso. Isso também significa
        que qualquer pessoa com acesso a esse link tem acesso ao conteúdo nele codificado; trate os
        links de compartilhamento com o mesmo cuidado que trataria qualquer outro conteúdo sensível.
      </p>
    </section>

    <section>
      <h2>5. Analytics e Terceiros</h2>
      <p>
        No momento, não utilizamos ferramentas de analytics, rastreamento ou publicidade de terceiros.
        Caso isso mude no futuro (por exemplo, para métricas agregadas e anônimas de uso da plataforma
        de hospedagem), esta política será atualizada para refletir a mudança antes de entrar em vigor.
      </p>
    </section>

    <section>
      <h2>6. Segurança</h2>
      <p>
        Como seus projetos não trafegam nem residem em nossos servidores, a segurança desses dados
        depende primariamente da segurança do seu próprio dispositivo e navegador. Recomendamos manter
        seu navegador atualizado e ter cuidado ao compartilhar links de projetos.
      </p>
    </section>

    <section>
      <h2>7. Seus Direitos (LGPD)</h2>
      <p>
        Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), reforçamos que, como
        não coletamos nem armazenamos dados pessoais em servidores próprios, os direitos de acesso,
        correção e exclusão sobre o conteúdo dos seus projetos já estão inteiramente sob seu controle
        direto, a qualquer momento, pelo próprio navegador.
      </p>
    </section>

    <section>
      <h2>8. Crianças e Adolescentes</h2>
      <p>
        O Vulcanode não é direcionado a menores de 13 anos e não tem a intenção de coletar dados de
        crianças.
      </p>
    </section>

    <section>
      <h2>9. Alterações a Esta Política</h2>
      <p>
        Podemos atualizar esta Política periodicamente. A data da última atualização está sempre
        indicada no topo desta página.
      </p>
    </section>

    <section>
      <h2>10. Contato</h2>
      <p>
        Dúvidas sobre esta Política podem ser enviadas para{' '}
        <a href="mailto:contato@vulcanode.app">contato@vulcanode.app</a>.
      </p>
    </section>
  </>
);

const PrivacyEnglish: React.FC = () => (
  <>
    <section>
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how Vulcanode handles data throughout the use of the platform. We
        were built around a simple principle: <strong>the less data we need to touch, the better</strong> —
        practically everything happens locally, in your own browser.
      </p>
    </section>

    <section>
      <h2>2. Data We Collect</h2>
      <p>
        Vulcanode does not require sign-up, login, email, or any personal data to be used. The projects
        you create — nodes, connections, names, tags, text and values — are saved only in your browser&apos;s
        local storage (localStorage) and <strong>are never sent to our servers</strong>, since the platform
        has no backend that stores this content.
      </p>
    </section>

    <section>
      <h2>3. Local Storage and Cookies</h2>
      <p>
        We use the browser&apos;s localStorage to save your projects and preferences (such as the chosen
        light/dark theme). This is not a tracking cookie — the data stays confined to your own device
        and browser, and can be deleted at any time by clearing the site data in your browser settings.
      </p>
    </section>

    <section>
      <h2>4. Share Links</h2>
      <p>
        When you generate a share link, the project&apos;s data is encoded directly into the URL — it does
        not pass through, nor is it stored on, any server of ours. This also means that anyone with
        access to that link has access to the content encoded in it; treat share links with the same
        care you would treat any other sensitive content.
      </p>
    </section>

    <section>
      <h2>5. Analytics and Third Parties</h2>
      <p>
        At this time, we do not use third-party analytics, tracking, or advertising tools. Should this
        change in the future (for example, for aggregated and anonymous usage metrics from the hosting
        platform), this policy will be updated to reflect the change before it takes effect.
      </p>
    </section>

    <section>
      <h2>6. Security</h2>
      <p>
        Since your projects do not travel through or reside on our servers, the security of that data
        depends primarily on the security of your own device and browser. We recommend keeping your
        browser up to date and being careful when sharing project links.
      </p>
    </section>

    <section>
      <h2>7. Your Rights (LGPD)</h2>
      <p>
        In accordance with Brazil&apos;s General Data Protection Law (LGPD, Law No. 13.709/2018), we
        emphasize that, since we do not collect or store personal data on our own servers, the rights of
        access, correction and deletion over the content of your projects already rest entirely under
        your direct control, at any time, through your own browser.
      </p>
    </section>

    <section>
      <h2>8. Children and Teenagers</h2>
      <p>
        Vulcanode is not directed at children under 13 and does not intend to collect data from
        children.
      </p>
    </section>

    <section>
      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Policy periodically. The date of the last update is always shown at the top
        of this page.
      </p>
    </section>

    <section>
      <h2>10. Contact</h2>
      <p>
        Questions about this Policy can be sent to{' '}
        <a href="mailto:contato@vulcanode.app">contato@vulcanode.app</a>.
      </p>
    </section>
  </>
);

export default function PrivacidadePage() {
  const { language } = useProjectStore();

  return (
    <LegalLayout
      title={language === 'en' ? 'Privacy Policy' : 'Política de Privacidade'}
      updatedAt={language === 'en' ? 'August 5, 2026' : '5 de agosto de 2026'}
    >
      {language === 'en' ? <PrivacyEnglish /> : <PrivacidadePortugues />}
    </LegalLayout>
  );
}
