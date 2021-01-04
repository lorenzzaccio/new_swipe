
const JOIN_ORDRE_FOURN_MODAL_ID = "#join_ordre_fourn";

var join_ordre_fourn_ui = [
            "#dem_num"
            ];

var join_ordre_fourn_sql = [
            "offrePrix_demNum"
            ];
          
const SQL_UPDATE_COND_JOIN_ORDRE_FOURN="offrePrix_id=";
var g_offrePrix_id = 0;

async function init_join_ordre_fourn_modal(offre_id,offre_num,prefix,article){
    g_offrePrix_id=offre_id;
    $(JOIN_ORDRE_FOURN_MODAL_ID+' #offre_num').val(offre_num);
    init_ui_join_ordre_fourn();
    let response = await getNumOrdreForArticleTask(prefix,article);
    await read_result(prefix,response);
    

}

async function read_result(prefix,res){
    if(res===-1){
        alert("aucun article correspondant");
        var article = prompt("Indiquer un nouvel article","");
        let response = await getNumOrdreForArticleTask(prefix,article);
        await read_result(prefix,response);
    }else{
        $('#dem_num').val(res.groups);
        $('#dem_num').css('color','red');
        $('#dem_num').attr('data-status','modify');
    }
}

function init_ui_join_ordre_fourn(){
    join_ordre_fourn_ui.forEach(function(el){
        $(el).css('background-color','aliceblue');
        $(el).on("change keyup paste", function(){
            $(el).css('color','red');
            $(el).attr('data-status')='modify';
        });
    });
}

function service_update_offre(offre_num){
    service_set_num_demprix(offre_num,set_param_dem_prix_bck,dem_prix_buffer);
}


function set_param_dem_prix_bck(arr){
   //Change offer status to offrePrix_attente_validation
   sql_update("offrePrix","offrePrix_status","'1'",SQL_UPDATE_COND_JOIN_ORDRE_FOURN+g_offrePrix_id,lcl_alert_cbk,[]);
}

var dem_prix_buffer=[];

function record_join_ordre_fourn(){
    join_ordre_fourn_ui.forEach(function(el,index){
        if (($(el).attr('data-status')==="modify")&&(join_ordre_fourn_sql[index]!==""))
            sql_update_async("offrePrix",join_ordre_fourn_sql[index],"'"+$(el).val()+"'",SQL_UPDATE_COND_JOIN_ORDRE_FOURN+g_offrePrix_id);
            sql_update_async("offrePrix","offrePrix_status","2",SQL_UPDATE_COND_JOIN_ORDRE_FOURN+g_offrePrix_id);
    });    
}

function lcl_alert_cbk(){
    alert("Opération effectuée avec succès");
    location.reload();
}