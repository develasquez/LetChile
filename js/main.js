var VEHICULO_LIVIANO = 1;
var VEHICULO_PESADO = 2;
var USO_COMERCIAL = "53eb0f23a7bbb9c0610f9401";
var USO_ESPECIAL_DEFAULT = "552dd5df834c1e1606be10a9";
var SERVER = 'http://www.letchile.cl';
var idInspeccion = 0;
var vUsuario = '';
var listafotos = [];
var pictureSource;
var destinationType;
var inspeccionFallida = false;

/* <Funciones de Varias>*/  
    var getTime = function() {
        var momentoActual = new Date();
        var hora = momentoActual.getHours();
        var minuto = momentoActual.getMinutes();
        var segundo = momentoActual.getSeconds();
        return ((hora.toString().length == 1) ? '0' : '') + hora.toString() + "" + ((minuto.toString().length == 1) ? '0' : '') + minuto.toString() + "" + ((segundo.toString().length == 1) ? '0' : '') + segundo.toString();
    }
    var isValid = function(p_str_Cont) {
        try{
            var p_str_Control = '#' + p_str_Cont;
            var num = '1234567890.,';
            var abc = ' abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ_-1234567890.,´áéíóú�?É�?ÓÚ@üÜ"';
            var v_str_valor = $(p_str_Control).val();
            if (v_str_valor.length == 0 && $(p_str_Control).hasClass('ui-obligatorio')) {
                $(p_str_Control).addClass('ui-state-error');
                if ($(p_str_Control)[0].type == 'select-one') {
                    $(p_str_Control).parent().addClass('ui-state-error');
                }
                return false;
            } else {
                if ($(p_str_Control).hasClass('number')) {
                    for (var i = 0; i < v_str_valor.length; i++) {
                        if (num.indexOf(v_str_valor.substring(i, i + 1)) == -1) {
                            $(p_str_Control).addClass('ui-state-error');
                            return false;
                        }
                    }
                } else if (($(p_str_Control).attr('type') == 'text' || $(p_str_Control).attr('type') == 'password') && !$(p_str_Control).hasClass('date')) {
                    for (i = 0; i < v_str_valor.length; i++) {
                        if (abc.indexOf(v_str_valor.substring(i, i + 1)) == -1) {
                            $(p_str_Control).addClass('ui-state-error');
                            return false;

                        }
                    }
                } else if ($(p_str_Control)[0].type == 'select-one') {
                    if ($(p_str_Control).val() == "" || $(p_str_Control).val() == null) {
                        $(p_str_Control).parent().addClass('ui-state-error');
                        return false;
                    }
                } else if ($(p_str_Control).hasClass('date')) {
                    var RegExPattern = /[0-9]{2}\/[0-9]{2}[0-9]{2}\/[0-9]{4}/;

                    if ($(p_str_Control).val().match(RegExPattern)) {
                        $(p_str_Control).addClass('ui-state-error');
                        return false;
                    }
                }
                $(p_str_Control).removeClass('ui-state-error');
                if ($(p_str_Control)[0].type == 'select-one') {
                    $(p_str_Control).parent().removeClass('ui-state-error');
                }
                return true;
            }
        }catch(ex){
            if ($(p_str_Control)[0].type == 'select-one') {
                $(p_str_Control).parent().addClass('ui-state-error');
            }else{
                $(p_str_Control).addClass('ui-state-error');
            }
            return false;

        }
    };
    var parseDate = function(date) {

        return getDate(eval("new " + date.replace(/\//g, "")));
    };
    var getDate = function(_date) {
        var momentoActual;
        var day;
        var month;
        var year;
        if (!_date) {
            momentoActual = new Date();
        } else
            momentoActual = new Date(_date);
        {
            day = momentoActual.getDate();
            month = momentoActual.getMonth() + 1;
            year = momentoActual.getFullYear();

        }
        return ((day.toString().length == 1) ? '0' : '') + day.toString() + "/" + ((month.toString().length == 1) ? '0' : '') + month.toString() + "/" + year.toString()
    }
    var showLoading = function () {
        $.mobile.loading( 'show', {
                    text: "Cargando...",
                    textVisible: true,
                    theme: "a",
                    textonly: false,
                    html: ""
        });
    };
    var hideLoading = function () {

        $.mobile.loading( 'hide');
    };
    var openPanel = function(id) {
        
        $(id).panel("open");
    };
    var sinConexion = function(){

        alert("No se ha podido establecer conexión con el servidor.");
    };
    var chkVal = function(el,val){
        if(val){
        $(el).prop("checked", (val == "true" ? true : (val == true ? true : false)));
        }
        return $(el).is(":checked");
    };
    var rdoVal = function(el,val){
        if(val){
            $(el + '[value="'+ val +'"]').prop("checked", true );
        }
        return $(el).val();
    };
    var testConection = function(fn, err) { 
        showLoading();
        $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaTipoInsp',
                data: {},
                async: true,
            success: function(response) {
                
                hideLoading();
                fn(response);
            },
            error: function(xhr, type) {
                
                err(xhr, type);
            }
        });
    };
    Array.prototype.where = function (query) {
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        if (typeof query !== 'object') {
          throw new TypeError();
        }
        var returnArray = new Array();
        for (var attr in query) {
          returnArray[returnArray.length] = this.filter(function(e,i,a){
            var obj = e[attr] == this.toString();
            return obj;
          },query[attr]);
        }
        return returnArray[0];
    };
    document.addEventListener("deviceready", function(event){
        navigator.splashscreen.hide();
        document.addEventListener("backbutton", function (event) {
            var hash = document.location.hash;
            for(var i=1;i<paginas.length;i++){
                
                if (paginas[i].page == hash){
                    document.location.href =  paginas[i].back;

                    event.preventDefault();
                    return false;
                }
            }
        }, false);
    }, false);
    String.prototype.trim = function() {

        return this.replace(/^\s+|\s+$/g, '');
    };
    var paginas =[
            {page:"",back:""},
            {page:"#bandejaInspecciones",back:"#main"},
            {page:"#inspeccion",back:"#bandejaInspecciones"},
            {page:"#Comunas",back:"#bandejaInspecciones"},
            {page:"#Marcas",back:"#bandejaInspecciones"},
            {page:"#detalleDanos",back:"#inspeccion"},
            {page:"#accesorios",back:"#detalleDanos"},
            {page:"#foto",back:"#accesorios"},
            {page:"#hito",back:"#inspeccion"}
            ];  

var mySelf = {
    session: {
        idUsuario: 0,
        loggedIn: false,
        token: ''
    },
    /* <Funciones de Listas>*/
        setComunas:function (data) {
            data = data.data;
            for (var i = 0; i< data.length; i++){
                   $("#listaComunas").append($("<li>").addClass("liComuna").append($("<a>").attr({"href":"#inspeccion", "value": data[i]._id}).text(data[i].comuna)))
            }
              $(".liComuna").click(function() {
                
                $("#txtcomunaAsegurado").val($(this).find("a").text())           
                $("#txtcomunaAsegurado").attr("idComuna",$(this).find("a").attr("value"))
            })
        },
        getComunas : function () {
            if(JSON.parse(localStorage.getItem("Comunas"))){
                var response=  JSON.parse(localStorage.getItem("Comunas"));
                mySelf.setComunas(response)
                hideLoading();
                return true;
            }
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaComunas',
                async: true,
                data: {},
                success: function(response) {
                   localStorage.setItem("Comunas", JSON.stringify(response));
                   mySelf.setComunas(response)
                    hideLoading();
                },
                error: function(xhr, type) {
                    
                    var response=  JSON.parse(localStorage.getItem("Comunas"));
                   mySelf.setComunas(response)
                   hideLoading();
                }
            });
        },
        setMarcas:function (data) {
            data = data.data;
            $("#listaMarcas").html("");
            for (var i = 0; i< data.length; i++){
                   $("#listaMarcas").append($("<li>").addClass("liMarca").append($("<a>").attr({"href":"#inspeccion", "value": data[i]._id}).text(data[i].marca).data("data",data[i])))
            }
             $(".liMarca").click(function() {
                
                $("#txtMarca").val($(this).find("a").text())
                $("#txtMarca").attr("idMarca",$(this).find("a").attr("value"))
                mySelf.setModelos_marca($(this).find("a").data("data").idMarca,function () {
                    setTimeout(function(){
                        $('html, body').animate({
                            scrollTop: $("#txtMarca").offset().top
                        }, 450);
                    },300)
                });
            })
        },
        getMarcas : function () {
            if(JSON.parse(localStorage.getItem("Marcas"))){
                var response=  JSON.parse(localStorage.getItem("Marcas"));
                mySelf.setMarcas(response)
                hideLoading();
                return true;
            }
           showLoading();
           $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaMarca',
                async: true,
                data: {},
                success: function(response) {
                    hideLoading();
                    
                   localStorage.setItem("Marcas", JSON.stringify(response));
                   mySelf.setMarcas(response)
                },
                error: function(xhr, type) {
                    
                    var response=  JSON.parse(localStorage.getItem("Marcas"));
                   mySelf.setMarcas(response);
                   hideLoading();
                }
            });
        },
        getModelos: function (idMarca,fun) {

            if(JSON.parse(localStorage.getItem("Modelos"))){
                var data = [];
                
                var ModelosFall = JSON.parse(localStorage.getItem("Modelos"));
                
                for (var i = 0; i< ModelosFall.length; i++){
                    //Aca obtienes el id de la marca, TU usa ModelosFall[i].idMarca
                
                    if(ModelosFall[i].idMarca == idMarca ){
                        data[data.length] = ModelosFall[i];
                    }
                }
                mySelf.setModelos(data,fun);
                hideLoading();                
                return true;
            }
           showLoading();
           $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaModelo',
                async: true,
                data: {codMarca:''},
                success: function(response) {
                    
                    hideLoading()
                    
                   var data = response.data;

                   localStorage.setItem("Modelos", JSON.stringify(data));
                   mySelf.setModelos(data,fun);
                },
                error: function(xhr, type) {
                    var data = [];
                    var ModelosFall = JSON.parse(localStorage.getItem("Modelos"));
                    for (var i = 0; i< ModelosFall.length; i++){
                            if(ModelosFall[i].marca[0].idMarca == parseInt(idMarca) ){
                                    data[data.length] = ModelosFall[i];
                            }
                        }
                    mySelf.setModelos(data,fun);
                    hideLoading();

                }
            });
        },
        setModelos_marca:function(idMarca,fun){
            try{
                var marcas=  JSON.parse(localStorage.getItem("Marcas"));
                var data = [];
                        var ModelosFall = JSON.parse(localStorage.getItem("Modelos"));
                        for (var i = 0; i< ModelosFall.length; i++){
                                if(ModelosFall[i].idMarca == idMarca ){
                                        data[data.length] = ModelosFall[i];
                                }
                            }
                mySelf.setModelos(data,fun);
            }
            catch(ex){

            }
        },
        setModelos:function ( data,fun) {
            $("#cboModelo").html("");
            $("#cboModelo").append($("<option>").attr("value",0).text("Seleccione..."));
            
            for (var i = 0; i< data.length; i++){
                $("#cboModelo").append($("<option>").attr("value",data[i]._id).text(data[i].modelo).data("data",data[i]));
            }
            
                
            try{
                $("#cboModelo").selectmenu('refresh');
                fun();
            }catch(ex){}         
        },
        getTipo_inspeccion: function (fun) {
            if(JSON.parse(localStorage.getItem("Tipo_inspeccion"))){
                var response=  JSON.parse(localStorage.getItem("Tipo_inspeccion"));
                mySelf.setTipo_inspeccion(response)
                hideLoading();
                return true;
            }
           showLoading();
           $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaTipoInsp',
                async: true,
                success: function(response) {
                    hideLoading()
                    
                   var data = response.data;

                   localStorage.setItem("Tipo_inspeccion", JSON.stringify(data));
                   mySelf.setTipo_inspeccion(data,fun);
                },
                error: function(xhr, type) {
                    response = JSON.parse(localStorage.getItem("Tipo_inspeccion"));
                    mySelf.setTipo_inspeccion(response);
                    hideLoading();

                }
            });
        },
        setTipo_inspeccion:function ( data,fun) {
            $("#cboTipoInspeccion").html("");
            $("#cboTipoInspeccion").append($("<option>").attr("value",0).text("Seleccione..."));
            
            for (var i = 0; i< data.length; i++){
                $("#cboTipoInspeccion").append($("<option>").attr("value",data[i]._id).text(data[i].tipo_inspeccion));
            }
            
                
            try{
                $("#cboTipoInspeccion").selectmenu('refresh');
                fun();
            }catch(ex){}            
        },
        getColor: function (fun) {
            if(JSON.parse(localStorage.getItem("color"))){
                var response=  JSON.parse(localStorage.getItem("color"));
                mySelf.setColor(response)
                hideLoading();
                return true;
            }
           showLoading();
           $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaColores',
                async: true,
                success: function(response) {
                    hideLoading()
                    
                   var data = response.data;

                   localStorage.setItem("color", JSON.stringify(data));
                   mySelf.setColor(data,fun);
                },
                error: function(xhr, type) {
                    response = JSON.parse(localStorage.getItem("color"));
                    mySelf.setColor(response);
                    hideLoading();
                }
            });
        },
        setColor:function ( data,fun) {
            $("#cboColor").html("");
            $("#cboColor").append($("<option>").attr("value",0).text("Seleccione..."));
            
            for (var i = 0; i< data.length; i++){
                $("#cboColor").append($("<option>").attr("value",data[i]._id).text(data[i].color));
            }
            
                
            try{
                $("#cboColor").selectmenu('refresh');
                fun();
            }catch(ex){}           
        },
        getPieza: function (fun,el) {
            if(JSON.parse(localStorage.getItem("Pieza"))){
                var response=  JSON.parse(localStorage.getItem("Pieza"));
                mySelf.setPieza(response,fun,el)
                hideLoading();
                return true;
            }
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaPiezas',
                async: true,
                success: function(response) {
                    hideLoading();
                   var data = response.data;
                   localStorage.setItem("Pieza", JSON.stringify(data));
                   mySelf.setPieza(data,fun,el);
                },
                error: function(xhr, type) {
                    response = JSON.parse(localStorage.getItem("Pieza"));
                    mySelf.setPieza(response);
                    hideLoading();
                }
            });
        },
        setPieza:function ( data,fun, el) {
            if(!el){
                el = "select.cboTipoParte"; 
            }
            $(el).html("");
            $(el).append($("<option>").attr("value",0).text("Seleccione..."));
            
            for (var i = 0; i< data.length; i++){
                $(el).append($("<option>").attr("value",data[i]._id).text(data[i].pieza));
            }
            try{
                $(el).selectmenu('refresh');
                fun();
            }catch(ex){}           
        },

        getUso_vehiculo: function (fun) {
            if(JSON.parse(localStorage.getItem("uso_vehiculo"))){
                var response=  JSON.parse(localStorage.getItem("uso_vehiculo"));
                mySelf.setUso_vehiculo(response)
                hideLoading();
                return true;
            }
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaUsoVeh',
                async: true,
                success: function(response) {
                    hideLoading();
                   var data = response.data;
                   localStorage.setItem("uso_vehiculo", JSON.stringify(data));
                   mySelf.setUso_vehiculo(data,fun);
                },
                error: function(xhr, type) {
                    response = JSON.parse(localStorage.getItem("uso_vehiculo"));
                    mySelf.setUso_vehiculo(response);
                    hideLoading();
                }
            });
        },
        setUso_vehiculo:function ( data,fun, el) {
            if(!el){
                el = "select.cboUsoVehiculo"; 
            }
            $(el).html("");
            $(el).append($("<option>").attr("value",0).text("Seleccione..."));
            
            for (var i = 0; i< data.length; i++){
                $(el).append($("<option>").attr("value",data[i]._id).text(data[i].uso_vehiculo));
            }
            try{
                $(el).selectmenu('refresh');
                fun();
            }catch(ex){}           
        },
        getTipo_dano: function (fun,el) {
            if(JSON.parse(localStorage.getItem("tipo_dano"))){
                var response=  JSON.parse(localStorage.getItem("tipo_dano"));
                mySelf.setTipo_dano(response,fun,el);
                hideLoading();
                return true;
            }
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaTipoDanio',
                async: true,
                success: function(response) {
                    hideLoading();
                   var data = response.data;
                   localStorage.setItem("tipo_dano", JSON.stringify(data));
                   mySelf.setTipo_dano(data,fun);
                },
                error: function(xhr, type) {
                    response = JSON.parse(localStorage.getItem("tipo_dano"));
                    mySelf.setTipo_dano(response);
                    hideLoading();
                }
            });
        },
        setTipo_dano:function ( data,fun, el) {
            if(!el){
                el = "select.cboTipoDano"; 
            }
            $(el).html("");
            $(el).append($("<option>").attr("value",0).text("Seleccione..."));
            
            for (var i = 0; i< data.length; i++){
                $(el).append($("<option>").attr("value",data[i]._id).text(data[i].tipo_dano));
            }   
            try{
                
                $(el).selectmenu('refresh');
                fun();
            }catch(ex){}           
        },
        getDeducible: function (fun,el) {
            if(JSON.parse(localStorage.getItem("deducible"))){
                var response=  JSON.parse(localStorage.getItem("deducible"));
                mySelf.setDeducible(response,fun,el);
                hideLoading();
                return true;
            }
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaDeducibles',
                async: true,
                success: function(response) {
                    hideLoading();
                   var data = response.data;
                   localStorage.setItem("deducible", JSON.stringify(data));
                   mySelf.setDeducible(data,fun);
                },
                error: function(xhr, type) {
                    response = JSON.parse(localStorage.getItem("deducible"));
                    mySelf.setDeducible(response);
                    hideLoading();
                }
            });
        },
        setDeducible:function ( data,fun, el) {
            if(!el){
                el = "select.cboDeducible"; 
            }
            $(el).html("");
            $(el).append($("<option>").attr("value",0).text("Seleccione..."));
            
            for (var i = 0; i< data.length; i++){
                $(el).append($("<option>").attr("value",data[i]._id).text(data[i].deducible));
            }   
            try{
                
                $(el).selectmenu('refresh');
                fun();
            }catch(ex){}           
        },
        getTipo_vehiculo: function (fun) {
            if(JSON.parse(localStorage.getItem("Tipo_vehiculo"))){
                var response=  JSON.parse(localStorage.getItem("Tipo_vehiculo"));
                mySelf.setTipo_vehiculo(response)
                hideLoading();
                return true;
            }
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/listaTipoVeh',
                async: true,
                success: function(response) {
                    hideLoading();
                   var data = response.data;
                   localStorage.setItem("Tipo_vehiculo", JSON.stringify(data));
                   mySelf.setTipo_vehiculo(data,fun);
                },
                error: function(xhr, type) {
                    response = JSON.parse(localStorage.getItem("Tipo_vehiculo"));
                    mySelf.setTipo_vehiculo(response);
                    hideLoading();
                }
            });
        },
        setTipo_vehiculo:function ( data,fun, el) {
            if(!el){
                el = "#cboTipoVehiculo"; 
            }
            $(el).html("");
            $(el).append($("<option>").attr("value",0).text("Seleccione..."));
            
            for (var i = 0; i< data.length; i++){
                $(el).append($("<option>").attr("value",data[i]._id).text(data[i].tipo_vehiculo));
            }   
            try{
                $(el).selectmenu('refresh');
                fun();
            }catch(ex){}           
        },
        getHitoMotivo: function (fun) {
            if(JSON.parse(localStorage.getItem("hitoMotivo"))){
                var response=  JSON.parse(localStorage.getItem("hitoMotivo"));
                mySelf.setHitoMotivo(response);
                hideLoading();
                return true;
            }
           showLoading();
           $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/hitoMotivo.json',
                async: true,
                success: function(response) {
                    hideLoading();
                    
                   var data = response.data;

                   localStorage.setItem("hitoMotivo", JSON.stringify(data));
                   mySelf.setHitoMotivo(data,fun);
                },
                error: function(xhr, type) {
                    response = JSON.parse(localStorage.getItem("hitoMotivo"));
                    mySelf.setHitoMotivo(response);
                    hideLoading();
                }
            });
        },
        setHitoMotivo:function ( data,fun) {
            try{
                $("#cboHitoMotivo").html("");
                $("#cboHitoMotivo").append($("<option>").attr("value",0).text("Seleccione..."));
                for (var i = 0; i< data.length; i++){
                    $("#cboHitoMotivo").append($("<option>").attr("value",data[i]._id).text(data[i].motivo));
                }
            
                
            
                $("#cboHitoMotivo").selectmenu('refresh');
                fun();
            }catch(ex){}           
        },
    /* <Carga Items de Bandeja>*/
        itemListaInspecciones: function(data) {
            localStorage.setItem(data._id,JSON.stringify(data));
            var li = $('<li>')
                    .attr("id",data._id)
                    .append($('<a href="#">')
                            .append($('<h2>').text(data.asegurado))
                            .append($('<p>').append('<strong>').text(data.rut))

                            .append($('<p>').addClass('ui-li-aside').text(data.fecha_cita)))
                            .data("data",data)
                            
                    .on("swiperight", function() {
                        var data = $(this).data("data");
                        $(this).find(".ui-link-inherit div").remove();
                        $(this).find(".ui-link-inherit").append($("<div>"))
                        $(this).find(".ui-link-inherit div").append($("<p>").text("Comuna: " + data.comuna).addClass("ui-li-desc"));
                        $(this).find(".ui-link-inherit div").append($("<p>").text("Telefono: " + data.telefono).addClass("ui-li-desc"));
                        $(this).find(".ui-link-inherit div").append($("<p>").text("Compañía: " + data.cia).addClass("ui-li-desc"));
                    })
                    .on("click", function() {
                        inspeccionFallida = false;
                        $("#vistaFallida").hide();
                        var data = $(this).data("data");
                        
                        mySelf.getCabeceraInspeccion(data)
                    });
            $("#listaInspecciones").append(li);
            
        },
    /* <Funciones de Base de Datos>*/
        db: window.openDatabase("inspecciones_cliente", "1.0", "inspecciones", 5 * 1024 * 1024),
        db_select_inspeccion: function(_self, id, fun) {
            _self.db.transaction(function(tx) {

                var sql = 'select idInspeccion,timestamp, idMotivoInspeccion ,Correo, corredor, rutAsegurado , nombreAsegurado, direccionAsegurado, comunaAsegurado, idComuna, fonoAsegurado, tipoVehiculo, usoVehiculo,usoEspecial, nroPuertas, marca, idMarca, modelo, idModelo, version, patente, ano,dobletraccion,diesel, motor, color, chasis ,completa, accesorios, sync   from inspeccion where  idInspeccion = ?';
                tx.executeSql(sql, [id],fun); 
            });
        },
        db_insert_inspeccion: function(_self, idInspeccion, idMotivoInspeccion, Correo,corredor, rutAsegurado, nombreAsegurado, direccionAsegurado, comunaAsegurado, idComuna, fonoAsegurado, tipoVehiculo, usoVehiculo,usoEspecial, nroPuertas, marca, idMarca, modelo, idModelo, version, patente, ano, dobletraccion, diesel, motor, color, chasis, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'select  idInspeccion from inspeccion where(idInspeccion = ?)';
                tx.executeSql(sql, [idInspeccion], function(tx, results) {
                    
                    if (results.rows.length == 0) {
                        tx.executeSql('INSERT INTO inspeccion (idInspeccion,timestamp, idMotivoInspeccion ,Correo,corredor,  rutAsegurado , nombreAsegurado, direccionAsegurado, comunaAsegurado, idComuna, fonoAsegurado, tipoVehiculo, usoVehiculo,usoEspecial, nroPuertas, marca, idMarca, modelo, idModelo, version, patente, ano,dobletraccion,diesel, motor, color, chasis ,completa, sync ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ',
                                [idInspeccion, new Date(), idMotivoInspeccion, Correo,corredor, rutAsegurado, nombreAsegurado, direccionAsegurado, comunaAsegurado, idComuna, fonoAsegurado, tipoVehiculo, usoVehiculo,usoEspecial, nroPuertas, marca, idMarca, modelo, idModelo, version, patente, ano, dobletraccion, diesel, motor, color, chasis,0, 0],
                                function(tx, results) {

                                    if (results.insertId) {
                                        fun(tx);
                                    }
                                });
                    } else {
                        
                        _self.db_update_inspeccion(_self, idInspeccion, idMotivoInspeccion, Correo,corredor, rutAsegurado, nombreAsegurado, direccionAsegurado, comunaAsegurado, idComuna, fonoAsegurado, tipoVehiculo, usoVehiculo,usoEspecial, nroPuertas, marca, idMarca, modelo, idModelo, version, patente, ano, dobletraccion, diesel, motor, color, chasis, fun)
                    }
                });

            })
        },
        db_delete_inspeccion: function(_self, idInspeccion, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'delete from inspeccion where idInspeccion = ?';
                tx.executeSql(sql,[idInspeccion],fun);
            })
        },    
        db_update_inspeccion: function(_self, idInspeccion, idMotivoInspeccion, Correo,corredor, rutAsegurado, nombreAsegurado, direccionAsegurado, comunaAsegurado, idComuna, fonoAsegurado, tipoVehiculo, usoVehiculo,usoEspecial, nroPuertas, marca, idMarca, modelo, idModelo, version, patente, ano, dobletraccion, diesel, motor, color, chasis, fun) {
            _self.db.transaction(function(tx) {
                
                var sql = 'update inspeccion  set  idMotivoInspeccion = ?, Correo= ?, corredor= ?,   rutAsegurado = ?,  nombreAsegurado= ?,  direccionAsegurado= ?,  comunaAsegurado= ?,  idComuna= ?,  fonoAsegurado= ?,  tipoVehiculo= ?,  usoVehiculo= ?, usoEspecial =?,  nroPuertas= ?,  marca= ?,  idMarca= ?,  modelo= ?,  idModelo= ?,  version= ?,  patente= ?,  ano= ?,  dobletraccion= ?, diesel= ?,  motor= ?,  color= ?,  chasis = ?   where idInspeccion = ?';
                
                tx.executeSql(sql,
                        [idMotivoInspeccion, Correo,corredor, rutAsegurado, nombreAsegurado, direccionAsegurado, comunaAsegurado, idComuna, fonoAsegurado, tipoVehiculo, usoVehiculo, usoEspecial, nroPuertas, marca, idMarca, modelo, idModelo, version, patente, ano, dobletraccion, diesel, motor, color, chasis,idInspeccion],
                        fun);
            });
        },
        db_registra_Accesorios: function(_self, idInspeccion, accesorios, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'update inspeccion  set    accesorios = ?  where idInspeccion = ?';
                tx.executeSql(sql,
                        [accesorios, idInspeccion],
                        fun);
            })
        },
        db_update_inspeccion_completa: function(_self,  idInspeccion, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'update inspeccion set  completa = 1  where  idInspeccion = ?';
                tx.executeSql(sql, [idInspeccion],fun); 
            });
        },
        db_select_danio: function(_self, id, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'select id, idInspeccion, idPieza, idTipoDanio,  deducible, observacion from danio where  idInspeccion = ?';
                tx.executeSql(sql, [id], fun);
            })
        },
        db_insert_danio: function(_self, idInspeccion, idPieza, idTipoDanio, /*idUbicacion,*/ deducible, observacion, fun) {
            _self.db.transaction(function(tx) {
                        tx.executeSql('INSERT INTO danio (idInspeccion, idPieza, idTipoDanio,  deducible, observacion ) values (?,?,?,?,?) ',
                                [idInspeccion, idPieza, idTipoDanio, /*idUbicacion,*/ deducible, observacion],fun);
            });
        },
        db_delete_danio: function(_self, id, fun) {
            _self.db.transaction(function(tx) {
                
                var sql = 'delete from danio where  id = ?';
                tx.executeSql(sql, [id], fun);
            });
        },
        db_select_danioNeumatico: function(_self, id, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'select id, idInspeccion, Id_Neumatico, Id_estadoneumatico, Cantidad, Marca, Modelo , medida, observacion from danioNeumatico where  idInspeccion = ?';
                tx.executeSql(sql, [id], fun);
            });
        },
        db_insert_danioNeumatico: function(_self, idInspeccion, Id_Neumatico, Id_estadoneumatico, Cantidad, Marca, Modelo , medida, deducible, fun) {
            _self.db.transaction(function(tx) {
                        tx.executeSql('INSERT INTO danioNeumatico (idInspeccion, Id_Neumatico, Id_estadoneumatico, Cantidad, Marca, Modelo , medida, observacion) values (?,?,?,?,?,?,?,?) ',
                                [idInspeccion, Id_Neumatico, Id_estadoneumatico, Cantidad, Marca, Modelo , medida, deducible],fun);
            });
        },
        db_delete_danioNeumatico: function(_self, id, fun) {
            _self.db.transaction(function(tx) {
                
                var sql = 'delete from danioNeumatico where  id = ?';
                tx.executeSql(sql, [id], fun);
            });
        },
        db_select_fotografias:function(_self, id, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'select id , idInspeccion, urlSD , sync from fotografias where idInspeccion = ?';
                tx.executeSql(sql, [id],fun);
            });
        },
        db_insert_fotografias:function(_self, idInspeccion, urlSD, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'insert into fotografias (idInspeccion, urlSD,  sync) values (?,?,?)';
                tx.executeSql(sql, [idInspeccion, urlSD, 0],fun);
            });
        },
        db_delete_fotografias:function(_self, id, fun) {
            _self.db.transaction(function(tx) {
                var sql = 'delete from fotografias where id = ?';
                tx.executeSql(sql, [id],fun);
            });
        },
    /* <Funciones de Inspeccion>*/
        validaCabeceraInspeccion: function() {
            var a = true;
            a = (isValid("txtMarca") && a);
            a = (isValid("cboModelo") && a);
            a = (isValid("txtpatente") && a);
            a = (isValid("txtano") && a);
            a = (isValid("cboTipoVehiculo") && a);
            a = (isValid("cboUsoVehiculo") && a);
            a = (isValid("txtmotor") && a);
            a = (isValid("txtchasis") && a);
            if ($("#cboUsoVehiculo").val() == USO_COMERCIAL) {
                a = (isValid("cboUsoVehiculoComercial") && a);
            }
            return a;
        },
        insertaCabecera: function(_fun) {
            var tipo_inspeccion = $("#cboTipoInspeccion").val();
            var mail = $("#txtCorreo").val();
            var corredor = $("#txtCorredor").val();
            var rut = $("#txtrutAsegurado").val();
            var asegurado = $("#txtnombreAsegurado").val();
            var direccion = $("#txtdireccionAsegurado").val();
            var comuna = $("#txtcomunaAsegurado").val();
            var idComuna = $("#txtcomunaAsegurado").attr("idComuna");
            var telefono = $("#txtfonoAsegurado").val();
            var tipo_vehiculo = $("#cboTipoVehiculo").val();
            var uso_vehiculo = $("#cboUsoVehiculo").val();
            var usoEspecial = $("#cboUsoVehiculoComercial").val();
            var numero_puertas = $("#txtnroPuertas").val();
            var marca = $("#txtMarca").val();
            var idMarca = $("#txtMarca").attr("idMarca");
            var modelo = $("#cboModelo option:selected").text();
            var version = $("#txtVersion").val();
            var idModelo =  $("#cboModelo").val();
            var patente = $("#txtpatente").val();
            var ano = $("#txtano").val();
            var dobletraccion = chkVal("#checkbox_v_4x4");
            var diesel = chkVal("#checkbox_v_Dies");
            var motor = $("#txtmotor").val();
            var color = $("#cboColor").val();
            var chasis = $("#txtchasis").val();
            mySelf.db_insert_inspeccion(mySelf,
                idInspeccion,
                tipo_inspeccion,
                mail,
                corredor,
                rut,
                asegurado,
                direccion,
                comuna, idComuna,
                telefono,
                tipo_vehiculo,
                uso_vehiculo,
                usoEspecial,
                numero_puertas,
                marca, idMarca,
                modelo, idModelo,
                version,
                patente,
                ano,
                dobletraccion,
                diesel,
                motor,
                color,
                chasis,
                function(tx) { 
                    if(_fun){
                        _fun();
                    }
                });
        },
        insertaDanio:function (el) {  
            var idDanio = 0;
            try{
                idDanio = $(el).data("data").id;
            }
            catch(e){
                //nada
            }
            if (idDanio == 0){
                var idPieza = $($(el).find("select.cboTipoParte")[0]).val();
                var idTipoDanio = $($(el).find("select.cboTipoDano")[0]).val();
                /*var idUbicacion = $($(el).find("select.cboUbicacionDano")[0]).val();*/
                var deducible = $($(el).find("select.cboDeducible")[0]).val();
                var observacion = $($(el).find(".txtDescDano")[0]).val();
            
                mySelf.db_insert_danio(mySelf, idInspeccion, idPieza, idTipoDanio, /*idUbicacion,*/ deducible, observacion,function (tx,results) {
                    
                    $(el).data("data",{id:results.insertId});
                });
            }
        },
        insertaDanioNeumatico:function (el) {     
            var idDanioNeumatico = 0;
            try{
                idDanioNeumatico = $(el).data("data").id;
            }
            catch(e){
            }
            if (idDanioNeumatico == 0){
                var Id_Neumatico = $($(el).find("select.cboUbicacionDanoNeumaticos")[0]).val();
                var Id_estadoneumatico= $($(el).find("select.cboTipoDanoNeumaticos")[0]).val();
                var Cantidad=  $("#txtCantidadNeumaticos").val();
                var Marca   =  $($(el).find(".txtMarcaNeumaticos")[0]).val();
                var Modelo  = $($(el).find(".txtModeloNuematico")[0]).val();
                var medida  = $("#txtMedidas").val();
                var deducible= $($(el).find("select.cboDeducibleNeumatico")[0]).val();
                mySelf.db_insert_danioNeumatico(mySelf,  idInspeccion, Id_Neumatico, Id_estadoneumatico, Cantidad, Marca, Modelo , medida, deducible, function (tx,results) {
                    
                    $(el).data("data",{id:results.insertId});
                });
            }
        },
        getDanioInspeccion:function (idInspeccion) {
            mySelf.db_select_danio(mySelf, idInspeccion,function (tx, results) {
                if(results.rows.length){
                    $("#ulDanos").html("");
                    for (var i = 0; i < results.rows.length ; i++) {
                        try{
                            $("#masDano").click();
                            var e =  results.rows.item(i) ;               
                            var liDano = $($(".liDano")[i]);
                            $($(liDano)[0]).data("data",e);
                            $($(liDano).find("select.cboTipoParte")[0]).val(e.idPieza);
                            $($(liDano).find("select.cboTipoDano")[0]).val(e.idTipoDanio);
                            //$($(liDano).find("select.cboUbicacionDano")[0]).val(e.idUbicacion);
                            $($(liDano).find("select.cboDeducible")[0]).val(e.deducible);
                            $($(liDano).find(".txtDescDano")[0]).val(e.observacion);
                            $(liDano).find('select').selectmenu('refresh');
                        }catch(ex){}

                    }
                }
               
            })
        },
        getDanioNeumatico:function (idInspeccion) {
            mySelf.db_select_danioNeumatico(mySelf, idInspeccion,function (tx, results) {
                for (var i = 0; i < results.rows.length ; i++) {
                    $("#masDanoNeumatico").click();
                    var e =  results.rows.item(i);                
                    var liDanoNeumatico = $($(".liDanoNeumatico")[i]);
                    $($(liDanoNeumatico)[0]).data("data",e);
                    $($(liDanoNeumatico).find("select.cboUbicacionDanoNeumaticos")[0]).val(e.Id_Neumatico);
                    $($(liDanoNeumatico).find("select.cboTipoDanoNeumaticos")[0]).val(e.Id_estadoneumatico);
                    $($(liDanoNeumatico).find(".txtMarcaNeumaticos")[0]).val(e.Marca);
                    $($(liDanoNeumatico).find(".txtModeloNuematico")[0]).val(e.Modelo);
                   $($(liDanoNeumatico).find("select.cboDeducibleNeumatico")[0]).val(e.deducible);
                   try{$(liDanoNeumatico).find('select').selectmenu('refresh');}catch(ex){}
                }
                
            });
        },
        insertaAccesorio:function(idInspeccion){
            //TODO
        },
        readNoSyncInspects: function(_self, fun) {
            $("#countNoSincOT").hide();
            _self.db.transaction(function(tx) {
                tx.executeSql("select count(1) as count from inspeccion where sync = ?", [false], function(tx, results) {
                    var rows = results.rows.item(0);
                    if (rows.count > 0) {
                        $("#countNoSincOT").text(rows.count);
                        $("#countNoSincOT").show();
                    }
                    try {
                        fun();
                    }
                    catch (e) {
                    }
                });
            });
        },
        getListaInspecciones: function() {
            var vUsuario = JSON.parse(localStorage.getItem("usuario"));
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/inspeccionesMovil',
                data: {p_usuario: vUsuario.usuario},
                async: true,
                success: function(response) {
                    hideLoading();
                    localStorage.setItem("listaInspecciones", JSON.stringify(response));
                    var data = response.data;
                    $("#listaInspecciones").html("");
                    $.each(data, function(i, e) {
                        mySelf.itemListaInspecciones(e);
                        //mySelf.getCabeceraInspeccion(e, false);
                    });
                    try{$("#listaInspecciones").listview('refresh');}catch(ex){}
                    mySelf.setStatusInspeccion();
                },
                error: function(xhr, type) {
                    sinConexion();
                    var response = JSON.parse(localStorage.getItem("listaInspecciones"));
                    var data = response.data;
                    $.each(data, function(i, e) {
                        mySelf.itemListaInspecciones(e);
                    });
                    try{$("#listaInspecciones").listview('refresh');}catch(ex){}
                    mySelf.setStatusInspeccion();
                }
            });
        },
        getCabeceraInspeccion: function(data, obtieneData) {
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/inspeccion/' + data._id + '.json',
                async: true,
                success: function(response) {
                    hideLoading();
                    var data = response.data;
                    $.each(data, function(i, e) {

                        localStorage.setItem(e._id, JSON.stringify(response));
                        if (obtieneData == undefined) {
                            mySelf.setCabeceraInspeccion(e);
                        }
                    })

                },
                error: function(xhr, type) {

                    var e = JSON.parse(localStorage.getItem(data._id));
                    //e = e.data[0];
                    mySelf.setCabeceraInspeccion(e);
                }
            });
        },
        setCabeceraInspeccion: function(data) {
            idInspeccion = data._id;
            mySelf.db_select_inspeccion(mySelf, idInspeccion, function(tx, results) {
                if (results.rows.length > 0) {
                    var row = results.rows.item(0);
                    $("#cboTipoInspeccion").val(row.idMotivoInspeccion);
                    $("#txtCorreo").val(row.Correo);
                    $("#txtCorredor").val(row.corredor);
                    $("#txtrutAsegurado").val(row.rutAsegurado);
                    $("#txtnombreAsegurado").val(row.nombreAsegurado);
                    $("#txtdireccionAsegurado").val(row.direccionAsegurado);
                    $("#txtcomunaAsegurado").val(row.comunaAsegurado);
                    $("#txtcomunaAsegurado").attr("idComuna",row.idComuna);
                    $("#txtfonoAsegurado").val(row.fonoAsegurado);
                    $("#cboTipoVehiculo").val(row.tipoVehiculo);
                    $("#cboUsoVehiculo").val(row.usoVehiculo);
                    $("#cboUsoVehiculoComercial").val(row.usoEspecial);
                    $("#txtnroPuertas").val(row.nroPuertas);
                    $("#txtMarca").val(row.marca);
                    $("#txtMarca").attr("idMarca",row.idMarca);          
                    $("#txtpatente").val(row.patente);
                    $("#txtVersion").val(row.version);
                    $("#txtano").val(row.ano);
                    chkVal("#checkbox_v_Dies",row.diesel);
                    chkVal("#checkbox_v_4x4",row.dobletraccion);
                    $("#txtmotor").val(row.motor);
                    $("#cboColor").val(row.color);
                    $("#txtchasis").val(row.chasis);
       
                    mySelf.setModelos_marca(row.idMarca,function () {
                        try{
                            
                            $("#cboModelo").val(row.idModelo).selectmenu('refresh');  
                        }catch(ex){}
                    })
                    try{
                        accesorios = JSON.parse(row.accesorios) || {};  
                        mySelf.setAccesorios(accesorios);
                        mySelf.getDanioInspeccion(idInspeccion);  
                        mySelf.db_select_fotografias(mySelf, idInspeccion, function (tx, results) {
                            if (results.rows.length > 0) {
                                for(var i=0; i<results.rows; i++){
                                    var url = row.item(i).urlSD;
                                    var insertId = row.item(i).id ;
                                    listafotos[listafotos.length] = url;
                                    getFromSD(url,function (result,imgName) {
                                        mySelf.addFoto(insertId, result, imgName);
                                    })
                                }
                            }
                        });
                    }catch(ex){
                    }

                } else {
                    $("#txtnombreAsegurado").val(data.asegurado);
                    $("#txtrutAsegurado").val(data.rut);
                    $("#txtdireccionAsegurado").val(data.direccion);
                    $("#txtcomunaAsegurado").val(data.comuna);
                    $("#txtcomunaAsegurado").attr("idComuna",$("li.liComuna a:contains('"+data.comuna+"')").attr("value"))
                    $("#txtfonoAsegurado").val(data.telefono);
                
                    var vlPatente;
                    if (data.patente == "") {
                        $("#txtpatente").attr("readonly","");
                        vlPatente = "ET-0000";
                    } else {
                        vlPatente = data.patente

                    }
                    $("#txtpatente").val(vlPatente);

                    
                }
                  
                    $.mobile.changePage('#inspeccion', {transition: 'slidedown'});
              
            })
        },
        setAccesorios : function(accesorios_p){
            for(var prop in accesorios_p){
                try{
               
                    if(prop.indexOf("txt") > -1  ){
                        $("#" + prop).val(accesorios_p[prop]);
                    }
                    if(prop.indexOf("cbo") > -1  ){
                        $("." + prop).val(accesorios_p[prop]);
                    }
                    if(prop.indexOf("checkbox")> -1){
                        chkVal('[name="' + prop + '"]' ,  accesorios_p[prop])
                    }
                    if(prop.indexOf("choice")> -1){
                        rdoVal('[name="' + prop + '"]' ,  accesorios_p[prop])
                    }
                }catch(ex){

                }
                
            }
        },
        getJSONInspeccion: function(){
            accesorios = {
                inspeccion:idInspeccion
            }; 


            $('#inspeccion [data-role="content"]').children().find('input[type="text"],input[type="number"], textarea ,  select').each(function(i,e){
                accesorios[  $(e).attr("id") || $(e).attr("class") ] =  $(e).val();
            });
            $('#inspeccion [data-role="content"]').children().find('input[type="checkbox"]:checked').each(function(i,e){
                accesorios[  $(e).attr("name")] =  $(e).val() == "on" ? true : false ;
            });
            $('#inspeccion [data-role="content"]').children().find('input[type="radio"]:checked').each(function(i,e){
                accesorios[  $(e).attr("name")] =  $("[name='"+ $(e).attr("name")+ "']").val();
            });

            $('#accesorios [data-role="content"]').children().find('input[type="text"],input[type="number"], textarea ,  select').each(function(i,e){
                accesorios[  $(e).attr("id") || $(e).attr("class") ] =  $(e).val();
            });
            $('#accesorios [data-role="content"]').children().find('input[type="checkbox"]:checked').each(function(i,e){
                accesorios[  $(e).attr("name")] =  $(e).val() == "on" ? true : false ;
            });
            $('#accesorios [data-role="content"]').children().find('input[type="radio"]:checked').each(function(i,e){
                accesorios[  $(e).attr("name")] =  $("[name='"+ $(e).attr("name")+ "']").val();
            });
            mySelf.db_registra_Accesorios(mySelf, idInspeccion , JSON.stringify(accesorios) , function () {  
            });
        },
        setStatusInspeccion:function () {
            
            $("#listaInspecciones li").each(function (i,e) {
                
                mySelf.db_select_inspeccion(mySelf, $(e).data("data")._id, function(tx, results) {
                    
                    if (results.rows.length > 0) {
                        var row = results.rows.item(0);
                        if(row.completa == 1){
                            
                            $("#"+ row.idInspeccion ).css("background-color","#abc4e5")
                                                     .unbind("click")
                                                     .on("click",function(){
                                                         alert("La inspección ya se ha realizado, por favor sincronice con el servidor.")
                                                     })

                        }else{
                            $("#"+ row.idInspeccion ).css("background-color","#EFF4EE")
                        }
                    }
                })
            })
        },
        syncInspecciones: function(_self) {
            _self.db.transaction(function(tx) {
                tx.executeSql("select idInspeccion, sync from inspeccion where sync = ? and completa = ?", [0,1], function(tx, results) {
                   
                   if(results.rows.length > 0){
                    testConection(function(response) {
                        
                        if (response.data) {
                            for (var i = 0; i < results.rows.length; i++) {
                                var inspeccion = results.rows.item(i);

                                mySelf.sendInspecciones(inspeccion.idInspeccion);

                                if (i == results.rows.length - 1) {
                                    setTimeout(function() {
                                        _self.db.transaction(function(tx) {
                                            tx.executeSql("delete from inspeccion where sync = ? and completa = ?", [0, 1], function(tx, results) {
                                                mySelf.readNoSyncInspects(mySelf,function () {
                                                   alert("La Sincronización se ha realizado con Exito ");
                                                });
                                            });
                                        });
                                    }, 5000);
                                }
                            }
                        } else {
                            sinConexion();
                        }
                    }, function(xhr, type) {
                        sinConexion();
                    });
                   }
                });
            });
        },
        sendInspeccionFallida: function(){
            mySelf.sendImagenes();
        },
        sendHito:function(params){
            
            showLoading();
            $.ajax({
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/bitacora/new',
                async: true,
                data: JSON.stringify(params),
                success: function(response) {
                    
                    hideLoading();
                    $.mobile.changePage("#bandejaInspecciones");
                },
                error: function(xhr, type) {
                    
                    localStorage.setItem("hito" + idInspeccion, JSON.stringify(params));
                    hideLoading();
                }
            });
        },
        sendInspecciones:function( idInspeccion) {
            testConection(function(tResponse) {
                if (tResponse.data ) {
                    mySelf.db_select_inspeccion (mySelf, idInspeccion, function (tx,resultsCab) {
                        if (resultsCab.rows.length > 0) {
                            var row = resultsCab.rows.item(0);
                            var params = {
                                inspeccion: idInspeccion
                                ,tipo_inspeccion:row.idMotivoInspeccion
                                ,direccion:row.direccionAsegurado
                                ,comuna: row.idComuna
                                ,telefono: row.fonoAsegurado
                                ,email: row.Correo
                                ,color: row.color
                                ,numero_puertas: row.nroPuertas
                                ,marca:row.idMarca
                                ,modelo: row.idModelo
                                ,version: row.version
                                ,patente: row.patente
                                ,ano: row.ano
                                ,tipo_vehiculo: row.tipoVehiculo
                                ,dobleTraccion: row.dobletraccion
                                ,diesel: row.diesel
                                ,uso_vehiculo: row.usoVehiculo
                                ,uso_especial: row.usoEspecial
                                ,motor: row.motor
                                ,chasis: row.chasis
                            }; 
                            showLoading();
                            
                            $.ajax({
                                type: "POST",
                                url: SERVER + '/letmovil/recibeDataInspeccion/',
                                data: {
                                        idInspeccion : idInspeccion,
                                        data: row.accesorios
                                    },
                                success: function(response) {
                           
                                    mySelf.sendImagenes(idInspeccion);
                                    mySelf.db_select_danio(mySelf, idInspeccion, function (tx,results) {    
                                        for(var i= 0 ; i<results.rows.length ;i++){
                                            mySelf.sendDanioPieza(results.rows.item(i));
                                        }
                                    });
                                    localStorage.removeItem(idInspeccion.toString());

                                    /*mySelf.db_select_danioNeumatico(mySelf, nuevoIdInspeccion, function (tx,results) {        
                                        for(i= 0 ; i<results.rows.length ;i++){
                                            mySelf.sendDanioNeumatico(results.rows.item(i));
                                        }   
                                    });*/
                                    var hitosPendientes = localStorage.getItem("hito" + idInspeccion, JSON.stringify(params));
                                    if(hitosPendientes.length > 0 ){
                                        mySelf.sendHito(JSON.parse(hitosPendientes));
                                    }
                                    mySelf.sendAccesorios(accesorios)
                                    hideLoading();
                                    
                                },
                                error: function(xhr, type) {
                                    
                                    mySelf.readNoSyncInspects(mySelf,function (tx,results) {
                                        sinConexion();
                                    });
                                }
                            });
                        }    
                    })   
                } else {
                }
            },
            function(xhr, type) {
            });
        },
        sendDanioPieza:function(paramsDa) {
            var params ={
                inspeccion:   paramsDa.idInspeccion,    
                pieza:        paramsDa.idPieza,
                tipo_dano:    paramsDa.idTipoDanio,
                deducible:    paramsDa.deducible,
                observacion:  paramsDa.observacion
            };
            showLoading();
            $.ajax({
                type: "POST",
                url: SERVER + '/letmovil/recibeDataDanio',
                data: params,
                success: function(response) {
                    data = JSON.parse(response);
                    if(!data.response.Ok){
             
                    }
                    hideLoading();
                },
                error: function(xhr, type) {
                    sinConexion();
                }
            });       
        },
        sendAccesorios:function(accesorios, sync) {
            showLoading();
            $.ajax({
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/accesorios/new',
                async: true,
                data: JSON.stringify(accesorios),
                success: function(response) {
                    hideLoading();
                },
                error: function(xhr, type) {
                    sinConexion();
                    hideLoading();
                   
                }
            });    
        },
        getAccesorios:function() {
            showLoading();
            $.ajax({
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/accesorios/' + idInspeccion + ".json",
                async: true,
                data: JSON.stringify({}),
                success: function(response) {
                    hideLoading();
                    accesorios = response;
                },
                error: function(xhr, type) {
                    sinConexion();
                    hideLoading();
                   
                }
            });    
        },
        sendDanioNeumatico:function(paramsNe, sync) {
            var params ={
                p_interno:  paramsNe.idInspeccion, 
                Id_Neumatico:   paramsNe.Id_Neumatico,
                Id_estadoneumatico: paramsNe.Id_estadoneumatico,
                Cantidad:   paramsNe.Cantidad,
                Marca:  paramsNe.Marca,
                Modelo: paramsNe.Modelo,
                medida: paramsNe.medida,
                //observacion:paramsNe.observacion //TODO nueva version
            }
            showLoading();
            $.ajax({
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/dano_neumatico/new',
                async: true,
                data: JSON.stringify(params),
                success: function(response) {
                    hideLoading();
                   

                },
                error: function(xhr, type) {
                   
                }
            });           
        },
        addFoto: function (insertId, result, imgName) {
            var smallImage = $('<img>');
            $(smallImage).css("display" , 'block');
            $(smallImage).attr("src", result);
            var br = $("<br>");
            var title = "<h3>" + getDate() + "-" + getTime() + "</h3>";
            var data = JSON.stringify({id:insertId, idInspeccion: idInspeccion});
            var foto = $("<div>")
                .attr("id",insertId)
                .append(title)
                .append(br)
                .append($(smallImage).width('90%'))
                .append(br)
                .append($("<label>").attr({"for": title}).text("Comentario:"))
                .append($("<input>").attr({"type": "text", "id": title , "class":"descripcionFoto ui-input-text ui-body-c"}))
                .data("data",data)
                .on("taphold",function () {
                    var data = JSON.parse($(this).data("data"));
                    if(confirm("¿Desea desasociar esta fotografía?")){
                        mySelf.db_delete_fotografias(mySelf,data.id,function () {
                            $("#"+ data.id).remove();
                        });
                    }
                });
            
            $("#album").append(foto);
        },
        sendImagenes:function(idInspeccion) {
            $(".descripcionFoto").each(function (i,e) {
                getFromSD(listafotos[i],function (base64, imgName) {
                    var params = {};
                    var url = "";
                    //Evaluamos si se ha declarado como inspeccion Fallida
                    if (!inspeccionFallida){
                        url = SERVER + '/letmovil/insrtaFotoInspeccion';
                        params ={
                            inspeccion:  idInspeccion, 
                            imagen: base64, 
                            nobreArchivo: imgName ,
                            titulo: $(e).val()
                        };
                    }else{
                        url = SERVER + '/inspeccion_fallida/new';
                        params ={
                            inspeccion:  idInspeccion, 
                            imagen: base64, 
                           // NobreArchivo:  idInspeccion + "_" + i + ".png" ,
                            comentario: $(e).val()
                        };
                    }

                    $.ajax({
                        //dataType: "json",
                        type: "POST",
                        //contentType: "application/json; charset=utf-8",
                        url: url,
                        //async: true,
                        data: params,
                        success: function(response) {
                            var data = JSON.parse(response);
                            if(!data.MSJ.Ok){
                                alert("Error al subir las imágenes");
                            }
                            hideLoading();
                        },
                        error: function(xhr, type) {
                            hideLoading(); 
                        }
                    });  
                }) ; 
            }) ;      
        },
    /* <Funciones de Navegacion>*/
        goToDanio:function () {
            if (mySelf.validaCabeceraInspeccion()) {
                    mySelf.insertaCabecera();
                    mySelf.getDanioInspeccion(idInspeccion); 
                    $.mobile.changePage("#detalleDanos");
                }else{
                    alert("Debe ingresar los campos requeridos");
                    $.mobile.changePage("#inspeccion");
                }
        },
        goToAccesorios:function () {
            if (mySelf.validaCabeceraInspeccion()) {
                    mySelf.insertaCabecera();
                    $.mobile.changePage("#accesorios");
                }else{
                    alert("Debe ingresar los campos requeridos");
                    $.mobile.changePage("#inspeccion");
                }
        },
        goToFoto:function () {
            $.mobile.changePage("#foto");
        },
    /* <Funciones de Login>*/
        login: function(){
            showLoading();
            $.ajax({
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                url: SERVER + '/letmovil/verificaLogeo',
                data: {p_usuario: $("#txtUsuario").val(), p_password: $("#txtPassword").val()},
                async: true,
                success: function(response) {
                    hideLoading();
                    var data = response.data[0];
                    if (data.usuario.length > 0) {
                        
                        localStorage.setItem("login", JSON.stringify(data));
                        localStorage.setItem("usuario", JSON.stringify(data));
                        mySelf.getListaInspecciones();
                        loggedIn = true;
                        $("#logOut").show();
                        $.mobile.changePage("#bandejaInspecciones");
                    }else{
                        alert("Error al Iniciar Sesion");
                    };
                },
                error: function(xhr, type) {
                    alert("Error al Iniciar Sesion \n" + type);
                }
            });
        },
        logOut : function() {
            $.mobile.changePage("#main");
            loggedIn = false;
            localStorage.setItem("login", "");
        },
    init: function(_self) {
        mySelf.readNoSyncInspects(mySelf,function (tx,results) {                    
        })
        //Login Automático
        try {
            var login = JSON.parse(localStorage.getItem("login"));
            if (login.usuario) {
                loggedIn = true;
                $("#logOut").show();
                $.mobile.changePage("#bandejaInspecciones");
                mySelf.getListaInspecciones();
            }
        } catch (ex) {
            hideLoading();
        }
        /* <Eventos del DOM>*/
            $("body").css("visibility","visible");
            $("#divUsoVehiculo").hide();
            $(".divDetalleDano").hide();
            /* <Eventos Botones>*/
                $(".logOut").click(function() {
                    mySelf.logOut();
                });
                $(".sincronizar").click(function() {
                    if (loggedIn == true) {
                        mySelf.syncInspecciones(mySelf);
                        testConection(function(){

                            localStorage.removeItem("Comunas");
                            localStorage.removeItem("Marcas");
                            localStorage.removeItem("Modelos");
                            localStorage.removeItem("Tipo_inspeccion");
                            localStorage.removeItem("color");
                            //localStorage.removeItem("ubicacion");
                            localStorage.removeItem("Pieza");
                            localStorage.removeItem("uso_vehiculo");
                            //localStorage.removeItem("uso_especial");
                            localStorage.removeItem("tipo_dano");
                            localStorage.removeItem("deducible");
                            localStorage.removeItem("Tipo_vehiculo");

                            mySelf.getComunas();
                            mySelf.getMarcas();
                            mySelf.getModelos();
                            mySelf.getTipo_inspeccion();
                            mySelf.getColor();
                            //////mySelf.getUbicacion();
                            mySelf.getPieza();
                            mySelf.getUso_vehiculo();
                            //mySelf.getUso_especial();
                            mySelf.getTipo_dano();
                            mySelf.getDeducible();
                            mySelf.getTipo_vehiculo();
                            mySelf.getHitoMotivo();

                        },function (err) {
                            sinConexion();
                        })
                    }
                });
                
                $(".menuFallida").click(function(){
                    inspeccionFallida = true;
                    $.mobile.changePage("#foto");
                    $("#vistaFallida").show();
                });
                $(".menuHito").click(function(){
                    $.mobile.changePage("#hito");
                });
                $(".liMarca").click(function() {
                    
                    $("#txtMarca").val($(this).find("a").text());
                    $("#txtMarca").attr("idMarca",$(this).find("a").attr("value"));
                    $("#txtMarca").attr("idMarca_code",$(this).find("a").data("data").idMarca);
                });
                $(".liComuna").click(function() {
                    $("#txtcomunaAsegurado").val($(this).find("a").text());
                    $("#txtcomunaAsegurado").attr("idMoneda",$(this).find("a").attr("value"));
                });
                $("#cboUsoVehiculo").change(function() {
                    if ($(this).val() == USO_COMERCIAL) {
                        $("#divUsoVehiculo").show();
                    } else {
                        $("cboUsoVehiculoComercial").val(USO_ESPECIAL_DEFAULT);
                        $("#divUsoVehiculo").hide();
                    }
                });
                $("#masDano").click(function() {

                    var nuevoLi = $(ulDano);
                    nuevoLi.find(".divDetalleDano").hide();
                    var cantLi = $("#ulDanos").find("li").length;
                    nuevoLi.find("[type='checkbox']").attr("name", "chk" + cantLi.length);

                    $(nuevoLi).attr("id",cantLi);

                    $("#ulDanos").append(nuevoLi);
                    $(".cboTipoParte").unbind("change");
                    $("#detalleDanos").trigger('create');
                    $(".deleteDanio").unbind("change");
                    $(".deleteDanio").click(function() {
                        try{
                          var idDanio = $($(this).parent()[0]).data("data");
                            mySelf.db_delete_danio(mySelf,idDanio.id , function (tx, results) {}) ; 
                        }
                        catch(e){}
                        
                        $(this).parent().remove();
                    });

                    var cboTipoParte = $("#ulDanos").find("#" + cantLi).find("select.cboTipoParte");
                    var cboTipoDano = $("#ulDanos").find("#" + cantLi).find("select.cboTipoDano");
                    var cboDeducible = $("#ulDanos").find("#" + cantLi).find("select.cboDeducible");

                    mySelf.getPieza(function(){},cboTipoParte);
                    mySelf.getTipo_dano(function(){},cboTipoDano);
                    mySelf.getDeducible(function(){},cboDeducible);


                    return nuevoLi;
                });
                $("#masDanoNeumatico").click(function() {
                    var nuevoLi = $(liDanoNeumatico);
                    $("#ulDanoNeumaticos").append(nuevoLi);
                    $("#accesorios").trigger('create');
                    $(".deleteDanioNeumatico").click(function() {
                        try{
                          var idDanioNeumatico = $($(this).parent()[0]).data("data");
                            mySelf.db_delete_danioNeumatico(mySelf,idDanioNeumatico.id , function (tx, results) {})  ;
                        }
                        catch(e){}
                        
                        $(this).parent().remove();
                    })
                    mySelf.getPieza();
                    mySelf.getTipo_dano();
                    ////mySelf.getUbicacion();
                    mySelf.getDeducible();
                    return nuevoLi;
                });
                $("#btnLogin").click(function() {
                    mySelf.login();
                });
                $("#btnComunas").click(function() {
                    $.mobile.changePage("#Comunas");
                });
                $("#btnMarcas").click(function() {
                    $.mobile.changePage("#Marcas");
                });
                $("#btnAceptaInspeccion").click(function() {
                   mySelf.goToDanio();
                });
                $("#btnAceptaHito").click(function() {
                    var params = {
                        inspeccion : idInspeccion,
                        usuario: JSON.parse(localStorage.getItem("usuario")).nombre,
                        hito : $("#txtHito").val(),
                        hitoMotivo : $("#cboHitoMotivo").val()
                    };
                   mySelf.sendHito(params);
                });
                $("#btnAceptaDano").click(function() {
                    $(".liDano").each(function (i,e) {
                         mySelf.insertaDanio(e);
                    });
                    $.mobile.changePage("#accesorios");
                    mySelf.getDanioNeumatico(idInspeccion);
                });
                $("#btnAceptaAccesorios").click(function() {
                    mySelf.getJSONInspeccion();
                    $(".liDanoNeumatico").each(function (i,e) {
                         mySelf.insertaDanioNeumatico(e);
                    });
                    $.mobile.changePage("#foto");
                });
                $("#btnFinalizar").click(function () {
             
                    if(!inspeccionFallida){
                        if (mySelf.validaCabeceraInspeccion()) {
                            mySelf.insertaCabecera(function () {

                                mySelf.db_update_inspeccion_completa(mySelf,idInspeccion,function (r,f) {
                                     mySelf.sendInspecciones(idInspeccion);
                                         document.location.href = '#bandejaInspecciones';
                                });
                            });
                        }
                    }else{
                        mySelf.sendInspeccionFallida();
                    }
                });
        /* <Creación de Tablas>*/ 
            _self.db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS danio (id INTEGER PRIMARY KEY AUTOINCREMENT,idInspeccion, idPieza, idTipoDanio,  deducible, observacion)');//idUbicacion,
                tx.executeSql('CREATE TABLE IF NOT EXISTS inspeccion (id INTEGER PRIMARY KEY AUTOINCREMENT, idInspeccion,timestamp, idMotivoInspeccion ,Correo, corredor, rutAsegurado , nombreAsegurado, direccionAsegurado, comunaAsegurado, idComuna, fonoAsegurado, tipoVehiculo, usoVehiculo, usoEspecial, nroPuertas, marca, idMarca, modelo, idModelo, version, patente, ano,dobletraccion,diesel, motor, color, chasis ,completa, accesorios, sync)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS danioNeumatico (id INTEGER PRIMARY KEY AUTOINCREMENT,idInspeccion, Id_Neumatico, Id_estadoneumatico, Cantidad, Marca, Modelo , medida, observacion)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS fotografias (id INTEGER PRIMARY KEY AUTOINCREMENT, idInspeccion, urlSD , sync)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS valores (idInspeccion, idcampo , valor)');
            });
        mySelf.getMarcas();
        mySelf.getComunas();
        mySelf.getModelos(0);
        mySelf.getTipo_inspeccion();
        mySelf.getColor();
        //mySelf.getUbicacion();
        mySelf.getPieza();
        mySelf.getTipo_vehiculo();
        mySelf.getUso_vehiculo();
        //mySelf.getUso_especial();
        mySelf.getHitoMotivo();
    }
};

$(function() {
    mySelf.init(mySelf);
});

/* <Funciones de Camara>*/
    var DestinationType = {
        DATA_URL : 0,                // Return image as base64 encoded string
        FILE_URI : 1                 // Return image file URI
    };
    var sourceType = {
        PHOTOLIBRARY : 0,
        CAMERA : 1,
        SAVEDPHOTOALBUM : 2
    };
    function getFromSD(ruta,_fun) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            window.resolveLocalFileSystemURI(ruta,function (fileEntry) {
                fileEntry.file(function (file) {
                    try{
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            var rslt = evt.target.result;
                            if(rslt.indexOf("image/jpeg;base64") == -1){
                                rslt= "image/jpeg;base64," + rslt;
                            }
                            var imgName = ruta.split("/")[ruta.split("/").length -1]
                            _fun(rslt, imgName);
                        };
                        reader.readAsDataURL(file);
                    }catch(ex){
                        //alert(ex);
                    }
                }, onFail);
            }, onFail);
        }, onFail);
    };
    function onPhotoDataSuccess(imageData) {
        try{
            listafotos[listafotos.length] = imageData;
            mySelf.db_insert_fotografias(mySelf, idInspeccion, imageData,function (tx,row) {
                var insertId = row.insertId;
                getFromSD(imageData,function (result, imgName) {
                    mySelf.addFoto(insertId, result, imgName);
                });
            });
        }catch(ex){
            alert(ex);
        }
    }
    function fromGalery() {  
        try{
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 100,
                destinationType: destinationType.FILE_URI, sourceType:sourceType.PHOTOLIBRARY});//
        }
        catch(ex){
            alert(JSON.stringify(ex));
        } 
    };
    function fromCamera() {
        try{
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 100,
                destinationType: destinationType.FILE_URI, sourceType:sourceType.CAMERA, saveToPhotoAlbum: true});//
        }
        catch(ex){
            alert(JSON.stringify(ex))
        }
    };
    function onFail(message) {
        //navigator.camera.getPicture(onPhotoDataSuccess, onFail2, {quality: 50,
          //  destinationType: 0, sourceType:0});//
        alert(JSON.stringify(message));
    }

var ulDano = [
        '<li class="liDano ui-li ui-li-static ui-btn-up-c ui-first-child ui-last-child">',
        '<div class="deleteDanio ui-btn-right ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-up-undefined">X</div>',
        '<label for="cboTipoParte">Pieza/Parte:</label>',
        '<select class="cboTipoParte">',
        '</select>',
        '<label for="cboTipoDano">Tipo Daño:</label>',
        '<select class="cboTipoDano">',
        '</select>',
        /*'<label for="cboUbicacionDano ">Ubicacion:</label>',
        '<select class="cboUbicacionDano cboUbicacion">',
        '</select>',*/
        '<label for="cboDeducible" class="ui-input-text">Deducible:</label>',
        '<select class="cboDeducible">',
        '</select>',
        '<label for="txtDescDano" class="ui-input-text">Descripcion Daño:</label>',
        '<textarea type="text" class="txtDescDano" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"> </textarea>',
        '</li>'
        ].join('\n');
var liDanoNeumatico = [
        '<li class="liDanoNeumatico ui-li ui-li-static ui-btn-up-c ui-first-child ui-last-child">',
        '<div class="deleteDanioNeumatico ui-btn-right ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-up-undefined">X</div>',
        '<label for="txtMarcaNeumaticos">Ubicación:</label>',
        '<select class="cboUbicacionDanoNeumaticos cboUbicacion">',
        '</select>',
        '<label for="txtMarcaNeumaticos">Marca:</label>',
        '<input type="text" class="txtMarcaNeumaticos"> ',
        '<label for="txtModeloNuematicos">Modelo:</label>',
        '<input type="text" class="txtModeloNuematico"> ',
        '<label for="cboTipoDano">Tipo Daño:</label>  ',
        '<select class="cboTipoDanoNeumaticos">',
        '</select>',
        '<textarea type="text" class="txtObservacionNeumatico" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"> </textarea>',
        '</li>'].join('\n');