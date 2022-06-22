$(document).ready(function(){
    
    //#inicializacion de variables globales
    var matrix = [];
    matrix["senal"] = [];
    matrix["frecuencia"] = [];
    matrix["probabilidad"] = [];

    //#funcion principal
    $("button[id=exec]").click(function(){
        matrix["senal"] = [];
        matrix["frecuencia"] = [];
        matrix["probabilidad"] = [];
        calcularSenales();
    });

    var calcularSenales = function() {
        var datos = $("#dataInit").val();
        var splitInfo = datos.split('');
        var lengthText = splitInfo.length;
        
        splitInfo.forEach((element, index) => {
            if (index == 0) {
                matrix["senal"].push(element);
                matrix["frecuencia"].push(1);
            } else {
                var auxIndex = matrix["senal"].indexOf(element);
                if (auxIndex >= 0){
                    matrix["frecuencia"][auxIndex] += 1;
                } else {
                    matrix["senal"].push(element);
                    matrix["frecuencia"].push(1);
                }
            }
        });
        calcularProbabilidad(lengthText);
    };

    var calcularProbabilidad = function(lengthText) {
        matrix["frecuencia"].forEach((number)=> {
            matrix["probabilidad"].push(number/lengthText);
        });
        calcularSenalTransmitida();
    };

    var calcularSenalTransmitida = function() {
        console.log("matrix");
        console.log(matrix);
        var datos = $("#dataInit").val();
        $("#dataH1").val(datos);
        console.log("HOLA BOTON");
    };
});