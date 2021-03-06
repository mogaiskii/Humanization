var json_text = {"Имя свойства 1":
            [
                {"name":"Первый вариант","подсвойство":null},
                {"name":"Второй вариант","подсвойство":
                    {"Имя подсвойства 1":
                    [
                        {"name":"Первый подвариант","подсвойство":null},
                        {"name":"Второй подвариант","подсвойство":null}
                    ],
                    "Имя подсвойства 2":
                    [
                        {"name":"Первый подвариант", "подсвойство":null},
                        {"name":"Второй подвариант", "подсвойство":null}
                    ]
                    }
                }
            ],
            "Имя свойства 2":
            [
                {"name":"Первый вариант", "подсвойство":null},
                {"name":"Второй вариант", "подсвойство":null}
            ]
            }


function reverse(where){ //TODO: parse recursively 
    var js_object = parse_block( $("#json_form").children('*').children('div') );
    var json_text = JSON.stringify( js_object );//TODO:from function
    $(where).val(json_text);
}


function parse_block(cat_div_block, modif=''){
    var js_object = {}
    var childs = cat_div_block.children();
    var current = childs.first();
    while(current[0]!=undefined){
        if(current[0].value=="+"){
            break;
        }
        if( current.is('input') && current.attr('type')=="text" ){
            var vrt_list = []
            if( current.next().next().is('div') ){
                var sub_block = current.next().next();
                var sub_current = sub_block.children().first();
                while(sub_current[0]!=undefined){
                    if(sub_current[0].value=="+"){
                        break;
                    }
                    if( sub_current.is('input') && sub_current.attr('type')=="text" ){
                        var one_vrt = {"name":sub_current.val(),"подсвойство":null};
                        if( sub_current.next().next().is('div') ){
                            one_vrt["подсвойство"] = parse_block(sub_current.next().next());
                        }
                        vrt_list.push(one_vrt);
                    }
                    sub_current = sub_current.next();
                }
            }
            js_object[current.val()]=vrt_list;
        }   
        current = current.next();
    }
    return js_object
}



            //TODO: DEBUG
            viewInsertor(json_text,"Свойство","#json_form");
            reverse('#JSON_area');

    $(document).ready(function(){
        $("#clicker").click(function(){
            var json_text = $("#JSON_area").val();
         viewInsertor(JSON.parse(json_text),"Свойство","#json_form");
        });
    })

    
            
    function viewInsertor(json_var, naming, form){
        $("#main_wrap").remove();

        var wraper = $("<div>",{id:"main_wrap"});
        
        wraper = wraper.append(viewCreator(json_var,naming));

        wraper = wraper.append($("<input>",{type:"button",value:"Применить", onclick:"reverse('#JSON_area')"}));

        $(form).append(wraper);
    }

var last_id = 0

function viewCreator(json_var, naming){
    var wraper = $("<div>",{class:"cat_block"});
        for(var prop in json_var){  //проход по свойства
            var block = $("<input>",{id:prop, type:"text", value:prop, class:"property"});  //Название свойства
            block = block.add($("<input>",{type:"button",value:"x", onclick:"del_block($(this))"}));
            if(json_var[prop]!=null){  //если есть варианты
                var subblock = $("<div>", {class:"cat_block"});  //создаем подблок для вариантов
                for(var vrt_n in json_var[prop]){  //проход по вариантам(номерам,хих)
                    var vrt = json_var[prop][vrt_n];  //перевод номера варианта в объект

                    var nInput = $("<input>",{id:vrt['name'],type:"text",value:vrt["name"], class:"var"});  //input для варианта(имя)
                    nInput = nInput.add($("<input>",{type:"button",value:"x", onclick:"del_block($(this))"}));
                    if(vrt["подсвойство"]){  //если у варианта есть подсвойство
                            //рекурсивный вызов. создание внутреннего блока
                        var underblock = viewCreator(vrt["подсвойство"],"подсвойство "+vrt["name"]);
                        nInput = nInput.add(underblock); 
                    }
                    else{
                        //возможность создания внутреннего блока
                        nInput = nInput.add($("<input>",{type:"button",value:"->", onclick:"lvl_down($(this))"}));//TODO: onclick
                    }
                    subblock = subblock.append(nInput);  //вгруз варианта в подблок вариантов
                }
                subblock = subblock.append($("<input>",{type:"button",value:"+", onclick:"add_variant($(this))",class:"add-button"}));
                block = block.add(subblock[0]);  //вгруз подблока вариантов сразу после инпута с данным свойством
            }
            var label = $("<label>",{for:prop,text:naming,class:"property"});//прикручивание label (~naming)
            label = label.add(block);
            wraper = wraper.append(label);
            //возможность добавления свойства
            wraper = wraper.append($("<input>",{type:"button",value:"+", onclick:"add_prop($(this))",class:"add-button"}));
        }
        return wraper[0];//выдача готового блока
    }


function add_prop(sender){
    sender.after($("<input>",{type:"button",value:"+", onclick:"add_prop($(this))",class:"add-button"}));
    sender.after($("<input>",{type:"button",value:"->", onclick:"lvl_down($(this))"}));
    sender.after($("<input>",{type:"button",value:"x", onclick:"del_block($(this))"}));
    sender.after($("<input>",{type:"text", class:"var"})); 
    
    
    sender.remove();
}

function make_prop(){
    var block = $("<div>",{class:"cat_block"});
    block = block.append($("<input>",{type:"text", class:"var"}));  //Название свойства
    block = block.append($("<input>",{type:"button",value:"x", onclick:"del_block($(this))"}));
    block = block.append($("<input>",{type:"button",value:"->", onclick:"lvl_down($(this))"}));
    block = block.append($("<input>",{type:"button",value:"+", onclick:"add_prop($(this))",class:"add-button"}));
    return block[0];
}

function add_variant(sender){
    sender.after($("<input>",{type:"button",value:"+", onclick:"add_variant($(this))",class:"add-button"}));
    sender.after($("<input>",{type:"button",value:"->", onclick:"lvl_down($(this))"}));
    sender.after($("<input>",{type:"button",value:"x", onclick:"del_block($(this))"}));
    sender.after($("<input>",{type:"text", class:"var"})); 
    
    sender.remove();
}
function make_var(){
    var block = $("<div>",{class:"cat_block"});
    block = block.append($("<input>",{type:"text", class:"var"}));  //Название свойства
    block = block.append($("<input>",{type:"button",value:"x", onclick:"del_block($(this))"}));
    block = block.append($("<input>",{type:"button",value:"->", onclick:"lvl_down($(this))"}));
    block = block.append($("<input>",{type:"button",value:"+", onclick:"add_variant($(this))",class:"add-button"}));
    return block[0];
}

function lvl_down(sender){
    
    
    if (sender.prev().hasClass("property")){
        sender.after(make_prop());
    }
    else {
        sender.after(make_var())
    }
    sender.remove();
}

function del_block(sender){
    
    sender.prev().remove();
    
    if(sender.next().is('input') && sender.next().val()=="->"){
        sender.next().remove();
    }
    if(sender.next().is('div')){
        sender.next().remove();
    }
    sender.remove();
}
