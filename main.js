$(document).ready(function(){

    //#inicializacion de variables globales
    var matrix = [];
    matrix["senal"] = [];
    matrix["frecuencia"] = [];
    matrix["probabilidad"] = [];
    matrix["senalTransmitida"] = [];
    matrix["probabilidadSenal"] = 0;
    senalDisponible = [];
    var selection = [];
    selection["tableData"] = $("#tableData");
    selection["dataInit"] = $("#dataInit");
    selection["canalValue"] = $('#canalValue');
    selection["blockFinalText"] = $('#blockFinalText');
    selection["divTable"] = $("#divTable");
    selection["dataH1"] = $("#dataH1");
    selection["finishData"] = $("#finishData");
    selection["canal"] = $("#canal");
    
    //#funcion principal
    $("button[id=exec]").click(function(){
        var datos = selection["dataInit"].val();
        cleanMatrix();
        if (datos.length > 0) {
            calcularSenales();
        }
    });

    selection["canal"].change(function() {
        if(this.checked) {
            selection["canalValue"].val('');
            selection["canalValue"].css("display", "block");
            selection["blockFinalText"].css("display", "block");
        } else {
            selection["canalValue"].val('');
            selection["canalValue"].css("display", "none");
            selection["blockFinalText"].css("display", "none");
        }
    });

    //#se calcula los tipos de señales y la cantidad que se repiten
    var calcularSenales = function() {
        var datos = selection["dataInit"].val();
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
        if (selection["canal"].is(':checked')) {
            valorarCanal();
        }
        
    };
    
    //#se calcula la probabilidad de cada señal
    var calcularProbabilidad = function(lengthText) {
        matrix["frecuencia"].forEach((number)=> {
            matrix["probabilidad"].push(number/lengthText);
        });
        calcularSenalTransmitida();
    };

    //#se calcula cuanta señal se va ha transmitir
    var calcularSenalTransmitida = function() {
        var datos = selection["dataInit"].val();
        matrix["probabilidad"].forEach((dataProbability) => {
            matrix["senalTransmitida"].push(dataProbability*Math.log2(1/dataProbability));
        });
        matrix["senalTransmitida"].forEach((senalTransmitidaX) => {
            matrix["probabilidadSenal"] += senalTransmitidaX;
        });
        selection["dataH1"].val(matrix["probabilidadSenal"]);
        imprimirTabla();
    };

    //#muestra los datos en la tabla
    var imprimirTabla = function() {
        selection["tableData"].empty();
        selection["divTable"].css("display", "block");
        var numeroSenal = matrix["senal"].length;
        //se configura la cabecera
        selection["tableData"].append('<tr><th># señal</th><th>Señal</th><th>Frecuencia</th><th>Probabilidad</th><th>Señal Transmitida</th></tr>');
        //se muestra la data
        for (let index = 0; index < matrix["senal"].length; index++) {
            selection["tableData"].append('<tr><td>S'+index+'</td><td>'+matrix["senal"][index]+
            '</td><td>'+matrix["frecuencia"][index]+'</td><td>'+matrix["probabilidad"][index]+
            '</td><td>'+matrix["senalTransmitida"][index]+'</td></tr>');
        }
    };

    $("#cleanAll").click(function(){
        clean();
    });

    var clean = function() {
        cleanMatrix();
        selection["tableData"].empty();
        selection["divTable"].css("display", "none");
        selection["dataH1"].val("");
        selection["dataInit"].val("");
        selection["finishData"].val("");
        selection["canalValue"].val("");
        selection["canal"].prop('checked', false);
        selection["canalValue"].css("display", "none");
        selection["blockFinalText"].css("display", "none");
    };

    var cleanMatrix = function() {
        matrix["senal"] = [];
        matrix["frecuencia"] = [];
        matrix["probabilidad"] = [];
        matrix["senalTransmitida"] = [];
        matrix["probabilidadSenal"] = 0;
        senalDisponible = [];
    };
    
    var valorarCanal = function() {
        var valorCanal = selection["canalValue"].val();
        var auxCanalActual = 0;
        matrix["senalTransmitida"].forEach((senalTransmitidaX, index) => {
            auxCanalActual += senalTransmitidaX;
            if (auxCanalActual <= valorCanal) {
                senalDisponible.push(matrix["senal"][index]);
            }
        });
        construirSeñalFinal();
    };

    var construirSeñalFinal = function() {
        var datos = selection["dataInit"].val();
        var splitInfoFinal = datos.split('');
        var dataFinal = "";
        splitInfoFinal.forEach((letra) => {
            var auxIndex = senalDisponible.indexOf(letra);
            if (auxIndex < 0){
                dataFinal += "-";
            } else {
                dataFinal += letra;
            }
        });
        selection["finishData"].val(dataFinal);
    };
});