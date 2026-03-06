from seleniumbase import SB
import time
import re
import os
import random
from datetime import datetime

# ================= CONFIGURAÇÕES =================
URL = "https://thenanobutton.com"
CLIQUES_PARA_SAQUE = 3000

# CONFIGURAÇÃO DO CLIQUE DUPLO
MICRO_DELAY_ENTRE_CLIQUES = 0.03  # Tempo minúsculo entre o clique 1 e 2
COOLDOWN_MIN = 0.10               # Descanso mínimo após o par de cliques
COOLDOWN_MAX = 0.25               # Descanso máximo

carteira_usuario = ""

class Cores:
    VERDE = '\033[92m'
    CYAN = '\033[96m'
    AMARELO = '\033[93m'
    VERMELHO = '\033[91m'
    RESET = '\033[0m'

class Stats:
    def __init__(self):
        self.cliques = 0
        self.saques = 0
        self.start_time = time.time()

def log(msg, tipo="INFO"):
    t = datetime.now().strftime("%H:%M:%S")
    cor = {
        "INFO": Cores.VERDE, "WARN": Cores.AMARELO, 
        "ERROR": Cores.VERMELHO, "MONEY": Cores.CYAN
    }.get(tipo, Cores.RESET)
    print(f"[{t}] {cor}{msg}{Cores.RESET}")

def ler_valores_rapido(sb):
    """Lê saldo via Regex (Infalível)"""
    nano, dolar = 0.0, 0.0
    try:
        txt = sb.get_text("body")
        if "Ӿ" in txt:
            nano = float(re.search(r"Ӿ([0-9.]+)", txt).group(1))
        if "($" in txt:
            dolar = float(re.search(r"\(\$([0-9.]+)\)", txt).group(1))
    except: pass
    return nano, dolar

def main():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"{Cores.CYAN}=== NANO MINER V29 (DOUBLE TAP) ==={Cores.RESET}")
    
    global carteira_usuario
    carteira_usuario = input(">> Carteira: ").strip()
    st = Stats()
    
    print("\nIniciando sistema de rajada dupla...")
    time.sleep(2)

    while True:
        try:
            with SB(uc=True, test=True, headless=True, locale_code="pt-BR", page_load_strategy="eager") as sb:
                log("Navegador Pronto.", "INFO")
                try: sb.driver.get(URL)
                except: pass
                sb.sleep(3) 
                
                cliques_sessao = 0
                
                while True:
                    try:
                        # --- 1. RAJADA DUPLA (DOUBLE TAP) ---
                        
                        # Clique 1
                        sb.click("svg.button", timeout=0.1)
                        cliques_sessao += 1
                        st.cliques += 1
                        
                        # Micro-pausa para o site não ignorar o segundo clique
                        time.sleep(MICRO_DELAY_ENTRE_CLIQUES)
                        
                        # Clique 2
                        sb.click("svg.button", timeout=0.1)
                        cliques_sessao += 1
                        st.cliques += 1
                        
                        # --- 2. COOLDOWN (Resfriamento) ---
                        # Isso dá o ritmo "Humano"
                        time.sleep(random.uniform(COOLDOWN_MIN, COOLDOWN_MAX))
                        
                        # --- 3. LOG (Atualiza a cada 10 pares de cliques) ---
                        if cliques_sessao % 20 == 0:
                            n, d = ler_valores_rapido(sb)
                            
                            # Velocímetro
                            duracao = time.time() - st.start_time
                            cps = st.cliques / duracao if duracao > 0 else 0
                            
                            n_str = f"{n:.6f}" if n > 0 else "..."
                            print(f"\r[{cliques_sessao}/{CLIQUES_PARA_SAQUE}] {Cores.CYAN}Ӿ{n_str}{Cores.RESET} | {Cores.AMARELO}{cps:.1f} clicks/s (Double){Cores.RESET}   ", end="")

                    except Exception:
                        # --- 4. TRATAMENTO DE BLOQUEIO ---
                        # Se falhou no meio da rajada, verifica Captcha
                        if sb.is_element_visible("iframe") or sb.is_text_visible("humano") or sb.is_text_visible("captcha"):
                            print("")
                            log("PAUSA! Captcha detectado.", "WARN")
                            
                            try: sb.scroll_to("iframe")
                            except: pass
                            
                            sb.uc_gui_handle_cf()
                            sb.sleep(4)
                            
                            if sb.is_text_visible("Falha") or sb.is_text_visible("Failure"):
                                log("Falha. Refresh Tatico!", "ERROR")
                                sb.driver.refresh()
                                sb.sleep(3)
                        else:
                            # Se não é captcha, só espera um pouco
                            sb.sleep(1)

                    # --- 5. SAQUE ---
                    if carteira_usuario and cliques_sessao >= CLIQUES_PARA_SAQUE:
                        print("")
                        n, _ = ler_valores_rapido(sb)
                        log(f"SACANDO Ӿ{n:.6f}...", "MONEY")
                        try:
                            sb.type("#address", carteira_usuario)
                            sb.click('span:contains("Withdraw")')
                            sb.sleep(3)
                            sb.driver.refresh()
                            sb.sleep(4)
                            cliques_sessao = 0
                            st.saques += 1
                            log(f"Saque Realizado! Total: {st.saques}", "INFO")
                        except:
                            log("Erro no saque. Tentando novamente...", "ERROR")
                            sb.driver.refresh()
                            sb.sleep(3)

        except KeyboardInterrupt:
            print("\nParando...")
            break
        except Exception as e:
            log(f"Erro Crítico: {e}", "ERROR")
            time.sleep(5)

if __name__ == "__main__":
    main()