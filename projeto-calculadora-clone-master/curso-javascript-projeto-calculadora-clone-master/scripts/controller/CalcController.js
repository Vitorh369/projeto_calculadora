//21
class CalcController {
    
    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperation = '';
        this._lastNumber = '';
        
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    //evento colar ctrl + V
    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        });

    }

    //evento copia ctrl + C 
    copyToClipboard() {

        if (navigator.clipboard) {
            navigator.clipboard.writeText(this.displayCalc);
        }

    }
    // valores inicial da calculadora
    initialize(){
       
        this.setDisplayDateTime();

        //metodo de intervalo de tempo para data e hora. atuliza acada 1 segundo
        setInterval(() => {
            
            this.setDisplayDateTime();
       
        }, 1000);

        // inciando a calculadora do zero
        this.setLastNumberToDisplay();

        //evento de double click
        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            })
        })
    
    }

    // metodo para liga e desliga o som da calculadora
    toggleAudio(){

        // dos metodos abaixo, esse é o mais inchuto. como ele é booleano, se for true vai ser false e vice versa
        this._audioOnOff = !this._audioOnOff;
        
       
        //this._audioOnOff = (this._audioOnOff) ? false : true;


        // if(this._audioOnOff){
        //     this._audioOnOff = false;
        // } else {
        //     this._audioOnOff = true;
        // }
    }

    //metodo do audio
    playAudio() {

        if (this._audioOnOff) {
            
            this._audio.currentTime = 0;
            this._audio.play();

        }
    }

    // botoes e evento de teclado
    initKeyboard(){

        document.addEventListener('keyup', e=> {

           this.playAudio();

           console.log(e.key)
            
           // key é achave da tecla
           switch(e.key){
    
                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
    
                case '+':
                case '*':
                case '/':
                case '-':
                case '%':
                    this.addOperation(e.key)
                    break;
                
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                
                case 'ponto':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;

            }
        });

    }

    // metdo que recebe o elemento que nesse caso é o botão, os eventos como clikc, drag e etc... e a função
    addEventListenerAll(element, events, fn){

        // o split vai se trasformar em um array de events. o argumento q passamos para o split é qual a condição para separa um do outro. nesse caso é o espaço ''
        events.split(' '). forEach(event => {

            // false caso o evento tenha mais de um click ao mesmo tempo
            element.addEventListener(event, fn, false);
        });
    }

    //metodo para apaga tudo na calculadora
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    // metodo para soma tudo na calculadora e limpar historico
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    // metodo para pegar a ultima posição do array
    getLastOperation(){
        return this._operation[this._operation.length-1];
        
    }

    //verificar se é um operador + - * /
    isOperatior(value){
       
        //index of vai verificar se value esta dentro do array. Se o valor estiver la, ele vai devolve o index. Caso não encontra vai devolve -1
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    //metodo para retira a ultima posição do array
    setLastOperation(value){
        this._operation[this._operation.length - 1] = value
    }

    //metodo para adcionar item no array
    pushOperation(value){
        this._operation.push(value);  
            
        if(this._operation.length > 3){

            this.calc();
         }
    }

    getResult(){
        
        try{
            //join vai transforama o array em um string e passamos como argumento vazio"" para retira as virgulas. exemplo: "3 + 5"
            //eval é um metodo q reconhece operadores e realiza a soma, multiplicação, subtração ou divisão
            return eval(this._operation.join(""));
        } catch {
            // colocado o setTimeout caso de o erro vai aparece o zero, mas querios ERROR. para isso vai aparecer o ZERO em milissegundo e depois o ERROR
            setTimeout(()=> {
                this.setError();
            }, 1)
            
        }
    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length === 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if (last === '%') {

            result /= 100;
            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();

    }

    //metodo paara buscar o ultimo operador
    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperatior(this._operation[i]) === isOperator) {
                lastItem = this._operation[i];
                break;
            }
         }

         if(!lastItem){

            lastItem = (isOperator) ? this._lastOperation : this._lastNumber;
         }


        return lastItem;

    }

    //metodo para buscar o ultimo numero
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0

        //colocando o numero no display
        this.displayCalc = lastNumber;
    }
    
    //metodo para ir adiocionando valores na calculadora.
    addOperation(value){

        //verificando se é um numero
        if(isNaN(this.getLastOperation())){
            
            // vericar se é um operador + - / *, se for operador troca
            if(this.isOperatior(value)){

                this.setLastOperation(value); 

             //se for um numero adicionamos no array e mostramos no display
            } else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else{

            //se for um operador vai adicionar no array
            if(this.isOperatior(value)){

                this.pushOperation(value);

            } else{

                //pegando o ultimo valor da do array, transforma em string para concatenar com value q outra string
                let newValue = this.getLastOperation().toString() + value.toString();
                //depois de concatenar tranforma para tipo numerico
                this.setLastOperation(newValue);

                //metodo para mostra o ultimo numero no display
                this.setLastNumberToDisplay();
            }
            
        }

    }
    

    setError(){
        this.displayCalc ='Error'
    }

 //metodo do ponto '.'
 addDot() {

    let lastOperation = this.getLastOperation();

    //O método split() divide uma String em uma lista ordenada de substrings
    //verificacão para ter apenas um ponto
    if( typeof lastOperation === 'string' && lastOperation && lastOperation.split('').indexOf('.') > -1) return

    if (this.isOperatior(lastOperation) || !lastOperation) {
        this.pushOperation('0.');
    } else {
        this.setLastOperation(lastOperation.toString() + '.');
    }

    this.setLastNumberToDisplay();

}

    execBtn(value){

        this.playAudio();
        switch(value){

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+')
                break;
            
            case 'subtracao':
                this.addOperation('-')
                break;

            case 'divisao':
                this.addOperation('/')
                break;

            case 'multiplicacao':
                this.addOperation('*')
                break;

            case 'porcento':
                this.addOperation('%')
                break;

            case 'igual':
                this.calc();
                break;
            
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }
        
    }

    //document.querySelector() serve para manipular o dom como acessar algum elemento do dcoumento para manipular 
    //document.querySelectorAll() vai trazer o elemento principal ee todos aqueles que casam com eles
    initButtonsEvents(){
       let buttons = document.querySelectorAll("#buttons > g, #parts > g");

       //manipulando o evento
       buttons.forEach((btn, index)=>{

        //drag: Esse evento é acionado continuamente enquanto o usuário arrasta o elemento
        //click: evento ded click
        this.addEventListenerAll(btn,'click drag', e=> {

            // className.baseVal trazer só nome da class
             let textBtn= btn.className.baseVal.replace("btn-", "");

             this.execBtn(textBtn);

       });

       // eventos de mouse: mouseover mouseup mousedown
       this.addEventListenerAll(btn,"mouseover mouseup mousedown", e=> {

            //pointer é a mãozinha do mouser
            btn.style.cursor ="pointer";
       })

     });

    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year:"numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    //innerHTML vai retorna para web o valor q atribuimos 
    get displayTime(){
      return  this._timeEl.innerHTML;
    }

    get displayDate(){
        return  this._dateEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
      }
  
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }


    get displayCalc(){
     return this._displayCalcEl.innerHTML;
     
    }

    set displayCalc(value){

        //valor maximo de digitos
        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }

    get  currentDate(){
        return new Date();
    }

    set currentDate(valor){
        this._currentDate = valor
    }
}