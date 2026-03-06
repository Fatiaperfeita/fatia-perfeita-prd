#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import time
import os
import sys
import random
import subprocess
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException, 
    NoSuchElementException, 
    StaleElementReferenceException,
    WebDriverException
)
from webdriver_manager.chrome import ChromeDriverManager

# ================= CONFIGURAÇÕES =================
URL = "https://thenanobutton.com"
PASTA_PERFIL = "perfil_nano_miner"
INTERVALO_CLIQUE = 0.25
CLIQUES_PARA_SAQUE = 1000 
TIMEOUT_CAPTCHA = 20         
LIMITE_CLIQUES_FANTASMA = 5  

# ================= LOGS =================
class Cor:
    VERDE = '\033[92m'
    AMARELO = '\033[93m'
    VERMELHO = '\033[91m'
    AZUL = '\033[94m'
    CYAN = '\033[96m'
    CINZA = '\033[90m'
    RESET = '\033[0m'

def log_evento(msg, tipo="INFO"):
    agora = datetime.now().strftime("%H:%M:%S")
    cores = {"INFO": Cor.VERDE, "WARN": Cor.AMARELO, "ERROR": Cor.VERMELHO, "DEBUG": Cor.CINZA, "SUCCESS": Cor.CYAN}
    sys.stdout.write(f"\r[{agora}] {cores.get(tipo, Cor.RESET)}[{tipo}]{Cor.RESET} {msg}\n")
    sys.stdout.flush()

def banner():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"{Cor.CYAN}╔══════════════════════════════════════════════╗")
    print(f"║   NANO MINER - V9 (SHADOW DOM HUNTER)        ║")
    print(f"╚══════════════════════════════════════════════╝{Cor.RESET}")

# ================= DRIVER =================

def iniciar_driver():
    options = webdriver.ChromeOptions()
    caminho = os.path.join(os.getcwd(), PASTA_PERFIL)
    options.add_argument(f"--user-data-dir={caminho}")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument('--no-sandbox')
    options.add_argument("--disable-blink-features=AutomationControlled") 
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_argument("--window-size=1024,768")
    options.add_argument("--log-level=3")
    options.add_experimental_option("detach", False)

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    return driver, driver.service.process.pid

def matar_processo_especifico(pid):
    try:
        if os.name == 'nt':
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except: pass

def obter_saldo_bruto(driver):
    try: return driver.find_element(By.XPATH, "//h1[contains(text(), 'Ӿ')]").text.strip()
    except: return None

def realizar_saque(driver, carteira):
    log_evento("Tentando saque...", "WARN")
    try:
        driver.find_element(By.ID, "address").clear()
        driver.find_element(By.ID, "address").send_keys(carteira)
        time.sleep(0.5)
        btn = driver.find_element(By.XPATH, "//span[contains(text(), 'Withdraw')]/..")
        driver.execute_script("arguments[0].click();", btn)
        log_evento("Saque solicitado.", "INFO")
        time.sleep(3)
    except: pass

def tem_aviso_visual_captcha(driver):
    try:
        # Verifica visualmente se o aviso amarelo existe
        return any(a.is_displayed() for a in driver.find_elements(By.XPATH, "//*[contains(text(), 'complete the captcha')]"))
    except: return False

# ================= A MÁGICA DO SHADOW DOM =================

def encontrar_iframes_profundos(driver):
    """
    Usa JavaScript para atravessar recursivamente todos os Shadow DOMs
    e retornar qualquer iframe escondido lá dentro.
    """
    script_busca = """
    function getAllIframes(root) {
        let iframes = Array.from(root.querySelectorAll('iframe'));
        let shadowHosts = Array.from(root.querySelectorAll('*')).filter(el => el.shadowRoot);
        shadowHosts.forEach(host => {
            iframes = iframes.concat(getAllIframes(host.shadowRoot));
        });
        return iframes;
    }
    return getAllIframes(document.body);
    """
    try:
        # Retorna uma lista de WebElements (iframes) que o Python pode usar
        return driver.execute_script(script_busca)
    except:
        return []

def resolver_captcha_shadow(driver):
    log_evento("Iniciando varredura Shadow DOM (JS)...", "DEBUG")
    
    # 1. Pede ao JS para achar os iframes escondidos
    iframes = encontrar_iframes_profundos(driver)
    
    if not iframes:
        log_evento("Nenhum iframe encontrado nem via Shadow DOM.", "DEBUG")
        return False
    
    log_evento(f"JS encontrou {len(iframes)} iframes escondidos.", "DEBUG")

    for i, iframe in enumerate(iframes):
        try:
            # Verifica se o iframe parece ser do Cloudflare
            src = iframe.get_attribute("src") or ""
            if "cloudflare" not in src and "turnstile" not in src:
                continue # Pula iframes de propaganda ou analytics

            log_evento(f"Entrando no iframe #{i} (Cloudflare detectado)...", "WARN")
            
            # Entra no iframe
            driver.switch_to.frame(iframe)
            
            # Tenta clicar no checkbox
            checkbox = driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox']")
            if checkbox:
                log_evento("CHECKBOX ENCONTRADO! Clicando...", "SUCCESS")
                driver.execute_script("arguments[0].click();", checkbox[0])
                driver.switch_to.default_content()
                return True
            
            # Verifica se tem erro vermelho
            erro = driver.find_elements(By.XPATH, "//*[contains(text(), 'Falha') or contains(text(), 'Failure')]")
            if erro:
                log_evento("Ícone de Falha detectado.", "ERROR")
                driver.switch_to.default_content()
                return "ERRO_FATAL"

            driver.switch_to.default_content()
        except StaleElementReferenceException:
            # O iframe sumiu ou mudou enquanto tentávamos acessar
            driver.switch_to.default_content()
        except Exception:
            driver.switch_to.default_content()
    
    return False

# ================= MAIN =================

def main():
    banner()
    carteira = input("Carteira (Enter p/ pular): ").strip()
    driver, pid = iniciar_driver()

    cliques_totais = 0
    cliques_fantasma = 0
    
    try:
        log_evento("Carregando...", "INFO")
        driver.get(URL)
        time.sleep(5)
        saldo_ant = obter_saldo_bruto(driver)
        log_evento(f"Saldo Inicial: {saldo_ant}", "INFO")
        
        while True:
            # --- CAPTCHA CHECK ---
            visual = tem_aviso_visual_captcha(driver)
            logico = cliques_fantasma >= LIMITE_CLIQUES_FANTASMA
            
            if visual or logico:
                motivo = "Visual" if visual else "Saldo Congelado"
                log_evento(f"Bloqueio detectado ({motivo}).", "WARN")
                
                t_inicio = time.time()
                while True:
                    if time.time() - t_inicio > TIMEOUT_CAPTCHA:
                        log_evento("Timeout Captcha. Refresh.", "ERROR")
                        driver.refresh()
                        time.sleep(5)
                        cliques_fantasma = 0
                        saldo_ant = obter_saldo_bruto(driver)
                        break
                    
                    res = resolver_captcha_shadow(driver)
                    
                    if res == "ERRO_FATAL":
                        driver.refresh()
                        time.sleep(5)
                        break
                    
                    if res is True:
                        time.sleep(3)
                        # Se o aviso sumiu, sucesso
                        if not tem_aviso_visual_captcha(driver):
                            log_evento("Captcha resolvido!", "SUCCESS")
                            cliques_fantasma = 0
                            saldo_ant = obter_saldo_bruto(driver)
                            break
                    
                    time.sleep(1)
                continue

            # --- MINERAR ---
            try:
                # Clica direto no SVG via JS para garantir
                svg = driver.find_element(By.CSS_SELECTOR, "svg.button")
                driver.execute_script("arguments[0].dispatchEvent(new MouseEvent('click', {view: window, bubbles:true, cancelable: true}))", svg)
                
                time.sleep(INTERVALO_CLIQUE)
                
                saldo_atual = obter_saldo_bruto(driver)
                
                if saldo_atual == saldo_ant:
                    cliques_fantasma += 1
                    sys.stdout.write(f"\r{Cor.AMARELO}[TRAVADO]{Cor.RESET} Saldo imóvel ({cliques_fantasma}/{LIMITE_CLIQUES_FANTASMA})   ")
                    sys.stdout.flush()
                else:
                    cliques_totais += 1
                    cliques_fantasma = 0
                    saldo_ant = saldo_atual
                    sys.stdout.write(f"\r{Cor.VERDE}[MINERANDO]{Cor.RESET} #{cliques_totais} | {saldo_atual}    ")
                    sys.stdout.flush()
                
                if carteira and cliques_totais > 0 and cliques_totais % CLIQUES_PARA_SAQUE == 0:
                    realizar_saque(driver, carteira)
                    saldo_ant = obter_saldo_bruto(driver)

            except: pass

    except KeyboardInterrupt:
        log_evento("Parando...", "WARN")
    finally:
        if driver: 
            try: driver.quit()
            except: pass
        if pid: matar_processo_especifico(pid)

if __name__ == "__main__":
    main()