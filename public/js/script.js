function imprimir() {
    const botaoImprimir = document.getElementById("imprimirCertificado");
    botaoImprimir.style.display = "none";
  
    setTimeout(function () {
      botaoImprimir.style.display = "block";
    }, 1000);
  
    print();
  }