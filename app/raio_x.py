from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time
import os

def iniciar_driver():
    options = webdriver.ChromeOptions()
    # Usa o mesmo perfil para garantir que o comportamento seja igual ao do bot
    caminho = os.path.join(os.getcwd(), "perfil_nano_miner")
    options.add_argument(f"--user-data-dir={caminho}")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument('--no-sandbox')
    
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    return driver

def analisar_html(driver):
    print("\n" + "="*50)
    print("INICIANDO ANÁLISE ESTRUTURAL DA PÁGINA")
    print("="*50)

    # 1. Lista todos os IFRAMES visíveis e invisíveis
    iframes = driver.find_elements(By.TAG_NAME, "iframe")
    print(f"\n[1] Total de Iframes detectados: {len(iframes)}")
    for i, frame in enumerate(iframes):
        try:
            src = frame.get_attribute("src")
            nome = frame.get_attribute("name")
            id_tag = frame.get_attribute("id")
            print(f"    - Iframe #{i}: ID='{id_tag}' | Name='{nome}' | SRC='{src[:50]}...'")
        except:
            print(f"    - Iframe #{i}: (Erro ao ler atributos)")

    # 2. Busca por SHADOW DOM (O suspeito principal)
    # Procura elementos comuns que costumam ter shadow roots
    print(f"\n[2] Verificando Shadow DOMs comuns...")
    
    # Scripts de JS para verificar Shadow Roots
    check_shadow = """
    let targets = document.querySelectorAll('*');
    let shadows = [];
    targets.forEach(el => {
        if (el.shadowRoot) {
            shadows.push({
                tag: el.tagName,
                id: el.id,
                class: el.className,
                html: el.shadowRoot.innerHTML.substring(0, 100)
            });
        }
    });
    return shadows;
    """
    try:
        shadows_encontrados = driver.execute_script(check_shadow)
        if shadows_encontrados:
            print(f"    🚨 ALERTA: {len(shadows_encontrados)} Shadow Roots encontrados!")
            for s in shadows_encontrados:
                print(f"    -> Tag: {s['tag']} | ID: {s['id']} | Conteúdo parcial: {s['html']}...")
        else:
            print("    -> Nenhum Shadow Root de primeiro nível encontrado.")
    except Exception as e:
        print(f"    -> Erro ao verificar JS: {e}")

    # 3. Procura pelo texto específico e seu Pai
    print(f"\n[3] Buscando o contêiner do texto 'complete the captcha'...")
    try:
        elem = driver.find_element(By.XPATH, "//*[contains(text(), 'complete the captcha')]")
        pai = elem.find_element(By.XPATH, "./..")
        print(f"    -> Texto encontrado na tag: <{elem.tag_name}>")
        print(f"    -> Pai do texto: <{pai.tag_name} class='{pai.get_attribute('class')}' id='{pai.get_attribute('id')}'>")
        print(f"    -> HTML do Pai: {pai.get_attribute('outerHTML')[:200]}")
    except:
        print("    -> Texto não encontrado no DOM principal (Confirmado: Está isolado ou em iframe).")

    print("\n" + "="*50)

def main():
    driver = iniciar_driver()
    driver.get("https://thenanobutton.com")
    
    print("\n⚠️  AGUARDANDO O CAPTCHA APARECER...")
    print("Assim que você ver o 'Please complete the captcha' ou a caixa, aguarde 5 segundos.")
    
    # Loop simples esperando o usuário ver o erro
    while True:
        try:
            # Verifica visualmente se o aviso apareceu
            aviso = driver.find_elements(By.XPATH, "//*[contains(text(), 'complete the captcha')]")
            if any(a.is_displayed() for a in aviso):
                print("\nDETECTADO! Iniciando raio-x em 3 segundos...")
                time.sleep(3)
                analisar_html(driver)
                break
        except:
            pass
        time.sleep(1)
    
    input("\nAnálise completa. Copie o resultado acima e me envie. Pressione Enter para fechar.")
    driver.quit()

if __name__ == "__main__":
    main()