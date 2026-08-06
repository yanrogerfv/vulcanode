"use client";

import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { useProjectStore } from '@/store/useProjectStore';

const TermosPortugues: React.FC = () => (
  <>
    <section>
      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao acessar ou utilizar o Vulcanode (&quot;plataforma&quot;, &quot;serviço&quot;), você concorda com estes
        Termos e Condições de Uso. Se você não concorda com algum ponto aqui descrito, não utilize a plataforma.
      </p>
    </section>

    <section>
      <h2>2. O que é o Vulcanode</h2>
      <p>
        O Vulcanode é uma ferramenta gratuita para criação visual de <strong>árvores de crafting</strong> e
        <strong> grafos de composição modular</strong> — estruturas hierárquicas usadas tanto para receitas e
        itens de jogos quanto para agrupamentos do mundo real, como orçamentos e listas divididas por
        categoria. A plataforma funciona inteiramente no seu navegador, sem exigir cadastro, login ou
        qualquer informação pessoal para ser utilizada.
      </p>
    </section>

    <section>
      <h2>3. Como Funciona o Armazenamento dos Seus Dados</h2>
      <p>
        Os projetos que você cria (nós, conexões, tags, textos e valores) são salvos <strong>localmente no
          seu navegador</strong>, usando o mecanismo de armazenamento local (localStorage). Não mantemos um
        servidor ou banco de dados que armazene o conteúdo dos seus projetos.
      </p>
      <p>
        Isso significa que você é o único responsável por fazer backup dos seus projetos (por exemplo,
        gerando um link de compartilhamento ou exportando a árvore como imagem) antes de limpar os
        dados do navegador, trocar de dispositivo ou desinstalar o navegador utilizado.
      </p>
    </section>

    <section>
      <h2>4. Links de Compartilhamento</h2>
      <p>
        O recurso de compartilhamento gera um link que contém os dados do seu projeto codificados
        diretamente na própria URL. Qualquer pessoa que tenha acesso a esse link poderá visualizar (e,
        dependendo do modo escolhido, editar) o conteúdo do projeto. Avalie com cuidado com quem você
        compartilha esses links, especialmente se o conteúdo envolver informações sensíveis ou pessoais.
      </p>
    </section>

    <section>
      <h2>5. Uso Aceitável</h2>
      <p>Ao utilizar o Vulcanode, você concorda em NÃO:</p>
      <ul>
        <li>Utilizar a plataforma para fins ilegais ou não autorizados;</li>
        <li>Tentar interferir, sobrecarregar ou comprometer a segurança e o funcionamento do serviço;</li>
        <li>Distribuir, via links de compartilhamento, conteúdo ilícito, ofensivo ou que viole direitos de terceiros.</li>
      </ul>
    </section>

    <section>
      <h2>6. Propriedade Intelectual</h2>
      <p>
        O código, design, marca e identidade visual do Vulcanode são de propriedade de seus
        desenvolvedores. O conteúdo que você cria dentro dos seus próprios projetos (nomes, textos,
        estruturas e valores inseridos) pertence a você.
      </p>
    </section>

    <section>
      <h2>7. Isenção de Garantias</h2>
      <p>
        O Vulcanode é fornecido &quot;como está&quot; (as is), sem garantias de qualquer tipo, expressas ou
        implícitas, incluindo — mas não se limitando a — garantias de disponibilidade contínua,
        ausência de erros ou adequação a uma finalidade específica.
      </p>
    </section>

    <section>
      <h2>8. Limitação de Responsabilidade</h2>
      <p>
        Na máxima extensão permitida pela lei aplicável, o Vulcanode e seus desenvolvedores não se
        responsabilizam por perdas de dados decorrentes de limpeza do navegador, falhas locais de
        armazenamento, ou pelo uso indevido de links de compartilhamento por terceiros.
      </p>
    </section>

    <section>
      <h2>9. Alterações Destes Termos</h2>
      <p>
        Podemos atualizar estes Termos periodicamente para refletir mudanças na plataforma. A data da
        última atualização está sempre indicada no topo desta página. O uso continuado do serviço após
        alterações implica concordância com os novos termos.
      </p>
    </section>

    <section>
      <h2>10. Lei Aplicável</h2>
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil.
      </p>
    </section>

    <section>
      <h2>11. Contato</h2>
      <p>
        Dúvidas sobre estes Termos podem ser enviadas para{' '}
        <a href="mailto:contato@vulcanode.app">contato@vulcanode.app</a>.
      </p>
    </section>
  </>
);

const TermsEnglish: React.FC = () => (
  <>
    <section>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Vulcanode (&quot;the platform&quot;, &quot;the service&quot;), you agree to these
        Terms and Conditions of Use. If you do not agree with any point described here, do not use the platform.
      </p>
    </section>

    <section>
      <h2>2. What Vulcanode Is</h2>
      <p>
        Vulcanode is a free tool for visually creating <strong>crafting trees</strong> and
        <strong> modular composition graphs</strong> — hierarchical structures used for game recipes and
        items as well as for real-world groupings, such as budgets and lists split by category. The
        platform runs entirely in your browser, without requiring sign-up, login, or any personal
        information to be used.
      </p>
    </section>

    <section>
      <h2>3. How Your Data Is Stored</h2>
      <p>
        The projects you create (nodes, connections, tags, text and values) are saved <strong>locally in
          your browser</strong>, using the browser&apos;s local storage mechanism (localStorage). We do not
        maintain a server or database that stores the content of your projects.
      </p>
      <p>
        This means you are solely responsible for backing up your projects (for example, by generating
        a share link or exporting the tree as an image) before clearing your browser data, switching
        devices, or uninstalling the browser you used.
      </p>
    </section>

    <section>
      <h2>4. Share Links</h2>
      <p>
        The sharing feature generates a link that contains your project&apos;s data encoded directly in the
        URL itself. Anyone with access to that link will be able to view (and, depending on the chosen
        mode, edit) the project&apos;s content. Consider carefully who you share these links with, especially
        if the content involves sensitive or personal information.
      </p>
    </section>

    <section>
      <h2>5. Acceptable Use</h2>
      <p>By using Vulcanode, you agree NOT to:</p>
      <ul>
        <li>Use the platform for illegal or unauthorized purposes;</li>
        <li>Attempt to interfere with, overload, or compromise the security and operation of the service;</li>
        <li>Distribute, via share links, content that is unlawful, offensive, or that infringes on third-party rights.</li>
      </ul>
    </section>

    <section>
      <h2>6. Intellectual Property</h2>
      <p>
        Vulcanode&apos;s code, design, brand and visual identity are owned by its developers. The content you
        create within your own projects (names, text, structures and values you enter) belongs to you.
      </p>
    </section>

    <section>
      <h2>7. Disclaimer of Warranties</h2>
      <p>
        Vulcanode is provided &quot;as is&quot;, without warranties of any kind, express or implied, including —
        but not limited to — warranties of continuous availability, error-free operation, or fitness for
        a particular purpose.
      </p>
    </section>

    <section>
      <h2>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, Vulcanode and its developers are not liable
        for data loss resulting from clearing browser data, local storage failures, or misuse of share
        links by third parties.
      </p>
    </section>

    <section>
      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these Terms periodically to reflect changes to the platform. The date of the last
        update is always shown at the top of this page. Continued use of the service after changes
        implies agreement with the new terms.
      </p>
    </section>

    <section>
      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Federative Republic of Brazil.
      </p>
    </section>

    <section>
      <h2>11. Contact</h2>
      <p>
        Questions about these Terms can be sent to{' '}
        <a href="mailto:contato@vulcanode.app">contato@vulcanode.app</a>.
      </p>
    </section>
  </>
);

export default function TermosPage() {
  const { language } = useProjectStore();

  return (
    <LegalLayout
      title={language === 'en' ? 'Terms and Conditions of Use' : 'Termos e Condições de Uso'}
      updatedAt={language === 'en' ? 'August 5, 2026' : '5 de agosto de 2026'}
    >
      {language === 'en' ? <TermsEnglish /> : <TermosPortugues />}
    </LegalLayout>
  );
}
