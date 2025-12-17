/*
  --------------------------------------------------------------------------------------
  Garante formato correto para Valor
  --------------------------------------------------------------------------------------

*/

export function setupCurrencyMask(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', function () {
        // mantém apenas números
        let rawValue = this.value.replace(/\D/g, '');

        if (!rawValue) {
            this.value = 'R$ 0,00';
            return;
        }

        // remove zeros à esquerda
        rawValue = rawValue.replace(/^0+/, '') || '0';

        // garante pelo menos 3 dígitos (centavos)
        rawValue = rawValue.padStart(3, '0');

        // separa parte inteira e decimal
        let integerPart = rawValue.slice(0, -2);
        const decimalPart = rawValue.slice(-2);

        // adiciona separador de milhar
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // monta valor final
        this.value = `R$ ${integerPart},${decimalPart}`;
    });

    // valor inicial
    input.value = 'R$ 0,00';
}

/*
  --------------------------------------------------------------------------------------
  Garante formato correto para telefone
  --------------------------------------------------------------------------------------

*/

export function setupPhoneMask(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', function () {
        // mantém só números
        let value = this.value.replace(/\D/g, '');

        // limita no máximo 11 dígitos (DDD + celular)
        value = value.slice(0, 11);

        // aplica máscara progressiva
        if (value.length <= 2) {
            this.value = `(${value}`;
        } 
        else if (value.length <= 6) {
            this.value = `(${value.slice(0,2)}) ${value.slice(2)}`;
        } 
        else if (value.length <= 10) {
            // telefone fixo: (21) 9999-9999
            this.value = `(${value.slice(0,2)}) ${value.slice(2,6)}-${value.slice(6)}`;
        } 
        else {
            // celular: (21) 99999-9999
            this.value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
        }
    });

}

/*
  --------------------------------------------------------------------------------------
  Garante formato correto para CNPJ
  --------------------------------------------------------------------------------------

*/

export function setupCNPJMask(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', function () {
        // mantém apenas números
        let value = this.value.replace(/\D/g, '');

        // limita a 14 dígitos
        value = value.slice(0, 14);

        // aplica máscara progressiva
        if (value.length <= 2) {
            this.value = value;
        } 
        else if (value.length <= 5) {
            this.value = value.replace(/^(\d{2})(\d+)/, '$1.$2');
        } 
        else if (value.length <= 8) {
            this.value = value.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
        } 
        else if (value.length <= 12) {
            this.value = value.replace(
                /^(\d{2})(\d{3})(\d{3})(\d+)/,
                '$1.$2.$3/$4'
            );
        } 
        else {
            this.value = value.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                '$1.$2.$3/$4-$5'
            );
        }
    });
}

