document.addEventListener('DOMContentLoaded', () => {
    // Cargar config del cliente
    document.getElementById('business-name').textContent = CLIENT_CONFIG.businessName;
    
    const rateInput = document.getElementById('exchange-rate');
    const savedRate = localStorage.getItem('exchange_rate') || CLIENT_CONFIG.defaultRate;
    rateInput.value = savedRate;

    // Guardar tasa si cambia
    rateInput.addEventListener('input', (e) => {
        localStorage.setItem('exchange_rate', e.target.value);
        calculate();
    });

    // Inputs
    const totalUsdInput = document.getElementById('total-usd');
    const payInputs = document.querySelectorAll('.pay-input');

    totalUsdInput.addEventListener('input', calculate);
    payInputs.forEach(input => input.addEventListener('input', calculate));

    document.getElementById('btn-reset').addEventListener('click', () => {
        totalUsdInput.value = '';
        payInputs.forEach(input => input.value = '');
        calculate();
    });

    function calculate() {
        const rate = parseFloat(rateInput.value) || 1;
        const totalUsd = parseFloat(totalUsdInput.value) || 0;
        
        // Calcular equivalencia total BS
        const totalBs = totalUsd * rate;
        document.getElementById('total-bs-text').textContent = `Eq: ${totalBs.toFixed(2)} BS`;

        // Sumar pagos recibidos (convertidos a USD)
        const usdCash = parseFloat(document.getElementById('pay-usd').value) || 0;
        const pmBs = parseFloat(document.getElementById('pay-pm-bs').value) || 0;
        const cashBs = parseFloat(document.getElementById('pay-cash-bs').value) || 0;
        const zelleUsd = parseFloat(document.getElementById('pay-zelle-usd').value) || 0;

        const totalPaidUsd = usdCash + zelleUsd + ((pmBs + cashBs) / rate);
        const differenceUsd = totalPaidUsd - totalUsd;

        const statusText = document.getElementById('status-text');
        const vueltoDetails = document.getElementById('vuelto-details');

        if (totalUsd === 0) {
            statusText.textContent = "Ingrese Montos";
            statusText.className = "text-xl font-bold text-slate-700 mt-1";
            vueltoDetails.textContent = "";
            return;
        }

        if (differenceUsd >= 0) {
            const vueltoBs = differenceUsd * rate;
            statusText.textContent = `Vuelto: $${differenceUsd.toFixed(2)}`;
            statusText.className = "text-xl font-bold text-emerald-600 mt-1";
            vueltoDetails.textContent = `En Bolívares: ${vueltoBs.toFixed(2)} BS`;
        } else {
            const faltaUsd = Math.abs(differenceUsd);
            const faltaBs = faltaUsd * rate;
            statusText.textContent = `Falta: $${faltaUsd.toFixed(2)}`;
            statusText.className = "text-xl font-bold text-rose-600 mt-1";
            vueltoDetails.textContent = `En Bolívares: ${faltaBs.toFixed(2)} BS`;
        }
    }

    // Botón de WhatsApp
    document.getElementById('btn-send-whatsapp').addEventListener('click', () => {
        const total = totalUsdInput.value || "0.00";
        const rate = rateInput.value;
        const status = document.getElementById('status-text').textContent;
        const details = document.getElementById('vuelto-details').textContent;

        const message = `*COMPROBANTE DE PAGO - ${CLIENT_CONFIG.businessName}*\n` +
                        `-----------------------------------\n` +
                        `*Total Venta:* $${total}\n` +
                        `*Tasa del Día:* ${rate} BS/$\n` +
                        `-----------------------------------\n` +
                        `*Resultado:* ${status}\n` +
                        `*Detalle:* ${details}\n\n` +
                        `¡Gracias por su preferencia!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    });
});