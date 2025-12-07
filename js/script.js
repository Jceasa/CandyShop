const precoBis = 0.50
const precoTrufa = 3.00
const precoCremosino = 2.0


let total = 0
let qtd_item = 0
let listaDeVendas = []


function adicionar(elementoClicado) {
    const produtoContainer = elementoClicado.closest(".produto")
    const strongPreco = produtoContainer.querySelector('strong')
    const precoBase = parseFloat(strongPreco.getAttribute('data-preco'))

    const name = produtoContainer.querySelector("h2")
    const qtd = produtoContainer.querySelector("p")
    const quantidade = qtd.innerText


    if(metodoDePagamento() != false) {
        qtd.innerText = parseInt(quantidade) + 1

        total += precoBase
        document.getElementById("cash-register").innerText =  `Total : R$${total.toFixed(2)}`

        historico(name.innerText, strongPreco.innerText)
    }

    
}

function diminuir(elementoClicado) {
    const produtoContainer = elementoClicado.closest(".produto")

    const strongPreco = produtoContainer.querySelector('strong')

    const precoBase = parseFloat(strongPreco.getAttribute('data-preco'))
    const name = produtoContainer.querySelector("h2")
    const qtd = produtoContainer.querySelector("p")
    const quantidade = qtd.innerText

    if (quantidade == 0) {
        alert("Não a mais quantidade para diminuir")
        listaDeVendas = []
        return
    } else {
        qtd.innerText = parseInt(quantidade) - 1
        total -= precoBase
        document.getElementById("cash-register").innerText = `Total : R$${total.toFixed(2)}`
       
        let items_list = document.querySelectorAll(`[data-nome="${name.innerText}"]`)

        if (items_list.length > 0) {
            const ItemParaApagar = items_list[items_list.length - 1]

            ItemParaApagar.remove()
        }

    }

    
    
}

function historico(nomeDoItem, preco) {
    lista_historico = document.getElementById("prod-1")
    qtd_item++
    hora_atual = new Date().toLocaleString()

    const vendaAtual = {
        id: qtd_item,
        produto: nomeDoItem,
        valor: preco,
        data: hora_atual,
    }

    listaDeVendas.push(vendaAtual)

    if (!lista_historico) {
        console.log("Elemento 'box-lista_historico' não encontrado")
        return
    } else {
        

        const novoItem = `
        <div class='prod_${qtd_item}' data-nome='${nomeDoItem}'>
            <span>Item: ${nomeDoItem}</span>
            <span>Preço: ${preco}</span>
            <span>Data: ${hora_atual}</span>
            <span>Método de Pagamento: ${metodoDePagamento()}</span>
        </div>
        `
        lista_historico.insertAdjacentHTML("beforeend", novoItem)

    }






}


function metodoDePagamento() {
    const pix = document.getElementById("payment-pix")
    const money = document.getElementById("payment-money")
    const credit = document.getElementById("payment-credit-card")
    const debit = document.getElementById("payment-debit-card")

    let count = 0
    let choiceMethod = ""

    if (pix.checked) {
        count++
        choiceMethod = "PIX"
    }

    if (money.checked) {
        count++
        choiceMethod = "MONEY"
    }

    if (credit.checked) {
        count++
        choiceMethod = "CARTÃO DE CRÉDITO"
    }

    if (debit.checked) {
        count++
        choiceMethod = "CARTÃO DE DÉBITO"
    }

    if (count === 0) {
        alert("Por favor, selecione um método de pagamento!")
        return false
    }

    if (count > 1) {
        alert("Selecione APENAS UM método de pagamento!")

        pix.checked = false 
        money.checked = false 
        credit.checked = false 
        debit.checked = false 
    
        return false
    }

    return choiceMethod
    
}

function salvarRelatorio() {

    const jsonString = JSON.stringify(listaDeVendas, null, 2)

    const arquivoBlob = new Blob([jsonString], {type: "application/json"})

    const linkDownload = document.createElement("a")

    linkDownload.href = URL.createObjectURL(arquivoBlob)

    linkDownload.download = "relatorio_vendas.json"

    if (qtd_item == 0 || listaDeVendas.length == 0) {
        alert("Escolha itens para finalizar a compra")
    } else {
        document.body.appendChild(linkDownload)
        linkDownload.click()

        document.body.removeChild(linkDownload)
    }

    
}