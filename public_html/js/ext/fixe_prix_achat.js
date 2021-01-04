const FIXE_PRIX_ACHAT_MODAL_ID = "#fixe_prix_achat";

const COL_FIXE_PRIX_ACHAT_DEM_NUM = 1;
const COL_FIXE_PRIX_ACHAT_QUANTITY = 5;
const COL_FIXE_PRIX_ACHAT_PRIX = 6;
const COL_FIXE_PRIX_ACHAT_DATE = 7;
const COL_FIXE_PRIX_ACHAT_FOURN = 10;
const COL_FIXE_PRIX_ACHAT_REF_OFFRE = 11;
const COL_FIXE_PRIX_ACHAT_REM = 12;

var fixe_prix_achat_ui = [
            "#dem_num",
            "#dem_quantity",//quantité
            "#dem_buy_price",//prix HT
            "#dem_date",
            "#dem_fourn_combo",
            "#dem_ref_offre",
            "#dem_type_combo",
            "#dem_rem"
            ];

var fixe_prix_achat_sql = [
            "demPrix_num",
            "demPrix_autreQuantite",//quantity
            "demPrix_quantite",//prix achat
            "demPrix_date",
            "demPrix_fourn",
            "demPrix_numOffre",
            "",
            "demPrix_rem"
            ];

const TABLE_DEM="demandePrix";
const SQL_UPDATE_COND="demPrix_id=";
var g_demPrix_id = 0;

const PRIX_ACHAT_FIXE_STATUS="1";
const DEMPRIX_STATUS_SQL = "demPrix_status";

const DEM_FOURN_COMBO_UI="#dem_fourn_combo";
const DEM_FOURN_REF_OFFRE_UI="#dem_ref_offre";
const DEM_FOURN_TYPE_COMBO_UI="#dem_type_combo";



function record_prix_achat(){
    fixe_prix_achat_ui.forEach(function(el,index){
        if (($(el).attr('data-status')==="modify")&&(fixe_prix_achat_sql[index]!==""))
            sql_update(TABLE_DEM,fixe_prix_achat_sql[index],"'"+$(el).val()+"'",SQL_UPDATE_COND+g_demPrix_id);

    });    
    sql_update(TABLE_DEM,DEMPRIX_STATUS_SQL,PRIX_ACHAT_FIXE_STATUS,SQL_UPDATE_COND+g_demPrix_id);
}


var fixe_achat_buffer=[];
function init_fixe_prix_achat_modal(dem_id,dem_num){
    g_demPrix_id = dem_id;
    init_ui_fixe_prix_achat();
    load_data_dem_prix(dem_num);
}

function init_ui_fixe_prix_achat(){
    fixe_prix_achat_ui.forEach(function(el){
        $(el).css('background-color','aliceblue');
        $(el).on("change keyup paste", function(){
            $(el).css('color','red');
            $(el).attr('data-status','modify');
        });
    });
}

function load_data_dem_prix(dem_num){
    var buffer=[];
    service_get_dem_prix(dem_num,set_param_fixe_prix_bck,fixe_achat_buffer);
}

function set_param_fixe_prix_bck(arr){
    var arr_data = arr[0].split(";");
    /*fixe_prix_achat_ui.forEach(function(el,index){
        $(el).val(arr_data[index]);
    });*/
    
    
    $(FIXE_PRIX_ACHAT_MODAL_ID+' #dem_num').val(arr_data[COL_FIXE_PRIX_ACHAT_DEM_NUM]);
    $(FIXE_PRIX_ACHAT_MODAL_ID+' #dem_quantity').val(arr_data[COL_FIXE_PRIX_ACHAT_QUANTITY]);
    $(FIXE_PRIX_ACHAT_MODAL_ID+' #dem_buy_price').val(arr_data[COL_FIXE_PRIX_ACHAT_PRIX]);
    $(FIXE_PRIX_ACHAT_MODAL_ID+' #dem_date').val(arr_data[COL_FIXE_PRIX_ACHAT_DATE]);
    $(FIXE_PRIX_ACHAT_MODAL_ID+' #dem_fourn_combo').val(arr_data[COL_FIXE_PRIX_ACHAT_FOURN]);
    $(FIXE_PRIX_ACHAT_MODAL_ID+' #dem_ref_offre').val(arr_data[COL_FIXE_PRIX_ACHAT_REF_OFFRE]);
    $(FIXE_PRIX_ACHAT_MODAL_ID+' #dem_rem').val(arr_data[COL_FIXE_PRIX_ACHAT_REM]);
    
    //determine le type de demande 
    var type_combo = arr_data[COL_FIXE_PRIX_ACHAT_REF_OFFRE];
    if(type_combo.includes("fourn"))
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_TYPE_COMBO_UI).val(1);
    if(type_combo.includes("intern"))
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_TYPE_COMBO_UI).val(2);
    if(type_combo.includes("fab"))
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_TYPE_COMBO_UI).val(3);
    if(type_combo.includes("com_stock"))
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_TYPE_COMBO_UI).val(4);
    get_demande_type();
}

function select_fourn(){
    var x = document.getElementById("dem_fourn_combo").value;
    //document.getElementById("demo").innerHTML = "You selected: " + x;
}
const DEM_OFFRE_FOURNISSEUR=1;
const DEM_CALCUL_INTERN=2;
const DEM_FAB_COIFFE=3;
const DEM_COM_STOCK=4;


const FOURN_CAPSTECH = 4;
function select_type_demande(){
    var prefix = get_demande_type();
    var today="20180720";
    var index_demandes=1;
    $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_REF_OFFRE_UI).val(prefix+today+index_demandes);
    $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_REF_OFFRE_UI).attr('data-status','modify');
    $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_REF_OFFRE_UI).css('color','red');
    $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).attr('data-status','modify');
    $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).css('color','red');
}

function get_demande_type(){
    var x = document.getElementById("dem_type_combo").value;
    var prefix="";
    switch(parseInt(x)){
        case DEM_OFFRE_FOURNISSEUR:
            prefix="fourn_";
            $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",false); 
        break;
        case DEM_CALCUL_INTERN:
        prefix="intern_";
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
        case DEM_COM_STOCK:
        prefix="com_stock_";
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
        case DEM_FAB_COIFFE:
        prefix="fab_";
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        $(FIXE_PRIX_ACHAT_MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
    }
    return prefix;
}


