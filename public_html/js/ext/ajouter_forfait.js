
const AJOUTER_FORFAIT_MODAL_ID = "#ajouter_forfait";

var MODAL_ID=AJOUTER_FORFAIT_MODAL_ID;

const COL_AJOUTER_FORFAIT_OFFRE_NUM = 0;


var fixe_prix_achat_ui = [
            "#dem_num",
            "#dem_quantity",//quantité
            "#dem_buy_price",//prix HT
            "#dem_date",
            "#dem_fourn_combo",
            "#dem_ref_offre",
            "#offre_type_combo",
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


const SQL_UPDATE_COND_AJOUTER_FORFAIT="demPrix_id=";
var g_offrePix_num = 0;


const FORFAIT_OFFRE_NUM_UI = "#forfait_offre_num";
const FORFAIT_DATE_UI = "#forfait_date";
const FORFAIT_DESC_UI = "#forfait_desc";
const FORFAIT_TYPE_UI = "#forfait_type_combo";
const FORFAIT_ARTICLE_NUM_UI = '#forfait_full_article';
const FORFAIT_PRIX_UI = '#forfait_sell_price';
const FORFAIT_UNITY_UI = '#forfait_unity'; //Deux unit : une pour avoir un libellé clair et l'autre pour la base de donnée : 1 ou 1000
const FORFAIT_UNIT_UI = '#forfait_unit';
const FORFAIT_CLIENT_ID_UI = "#forfait_client_id";
const FORFAIT_STATUS_UI = "#forfait_status";
var creer_offre_buffer=[];
/*
const OFFRE_DEVIS_FOURNISSEUR=1;
const OFFRE_APPRO_CLIENT_SUP_5000=2; 
const OFFRE_FAB_INTERNE=3;
const OFFRE_DESTOCKAGE=4;
const OFFRE_FORFAIT_APPRO=5;
const OFFRE_FORFAIT_DESTOCK=6;
const OFFRE_CALCULEE_CAPSTECH=7;
*/
var g_num_agent="1";
var forfait_buffer = [];

function init_ajouter_forfait_modal(num_offre,client_id,status){
    //élément à récupérer
    var date;
    var prefix='FK00';
    var article = create_new_forfait_num();

    init_date_picker();
    var offre_date = new Date();
    var day_in_year = get_day_in_year(offre_date);
    offre_date = (offre_date.toISOString()).split("T")[0];
    $(MODAL_ID+' #forfait_date').val(offre_date);
    $(MODAL_ID+' '+FORFAIT_OFFRE_NUM_UI).val(num_offre);
    $(MODAL_ID+' '+FORFAIT_CLIENT_ID_UI).val(client_id);

    $(MODAL_ID+' '+FORFAIT_STATUS_UI).val(status);
    select_type_forfait();
    init_form_ajouter_forfait();
}

function create_new_forfait_num(){
  service_get_num_forfait('FK00',set_num_forfait,forfait_buffer);
}

function set_num_forfait(buffer){
  var num = buffer[0];
  var article = pad(num,8);
  $(MODAL_ID+' '+FORFAIT_ARTICLE_NUM_UI).val('FK00'+'-'+article);
}

function pad(num, size) {
  var r='';
  for(i=0; i<size;i++){
    r+='0';
  }
        var s = r + num;
        return s.substr(s.length-size);
}

function init_date_picker(){
    $( "#forfait_date" ).datepicker();
    $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
     $( "#forfait_date" ).datepicker( "option", "dateFormat", "yy-mm-dd");
     $( "#forfait_date" ).on( "change", function() {
     });
}
/*
function init_ui_creer_offre_commerciale(){
    fixe_prix_achat_ui.forEach(function(el){
        $(el).css('background-color','aliceblue');
        $(el).on("change keyup paste", function(){
            $(el).css('color','red');
            $(el).attr('data-status','modify');
        });
    });
}

function get_day_in_year(date){
    var now = new Date(date);
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
}
*/
function pad(num, size) {
  var i,r='';
  for(i=0;i<size;i++)
      r+='0';
    var s = r+ num;
    return s.substr(s.length-size);
}
/*
function service_allouer_num_offre(offre_num){
    service_get_num_offre_prix(offre_num,set_param_fixe_prix_bck,creer_offre_buffer);
}

function load_data_dem_prix(dem_num){
    //service_get_dem_prix(dem_num,set_param_fixe_prix_bck,creer_offre_buffer);
}*/
/*
function set_param_fixe_prix_bck(arr){
    var arr_data = arr[0].split(";");
    $(MODAL_ID+' #offre_num').val(arr_data[COL_AJOUTER_FORFAIT_OFFRE_NUM]);    
}
*/
function select_type_forfait(){
    /*var prefix = get_demande_type();
    var today=$(OFFRE_DATE_UI).val();
    var index_demandes=1;*/
    $(MODAL_ID+' '+FORFAIT_DESC_UI).val($(MODAL_ID+' '+FORFAIT_TYPE_UI+ ' option:selected').text());
    $(MODAL_ID+' '+FORFAIT_TYPE_UI).attr('data-status','modify');
    $(MODAL_ID+' '+FORFAIT_TYPE_UI).css('color','red');
    var price = ($(MODAL_ID+' '+FORFAIT_TYPE_UI+ ' option:selected').val()).split('_')[0];
    var unity = parseInt(($(MODAL_ID+' '+FORFAIT_TYPE_UI+ ' option:selected').val()).split('_')[1]);
    $(MODAL_ID+' '+FORFAIT_PRIX_UI).val(price);
    $(MODAL_ID+' '+FORFAIT_PRIX_UI).attr('data-status','modify');
    $(MODAL_ID+' '+FORFAIT_PRIX_UI).css('color','red');
    $(MODAL_ID+' '+FORFAIT_UNIT_UI).val(unity===1?'euros':'euros au mille');
    $(MODAL_ID+' '+FORFAIT_UNITY_UI).val(unity);
}



function init_form_ajouter_forfait(){
    $( "#forfait_form" ).off( "submit");
    $( "#forfait_form" ).on( "submit", function( event ) {
      event.preventDefault();
      var data= $( this ).serialize();
      var options = { 
        type: "GET",
        dataType : 'json',
        crossDomain: true,
        cache: false,
        async: true,
        timeout: 10000, // 10 seconds for getting result, otherwise error.
        url: "../../capstech_lib/php/ajouter_forfait.php", // it's the URL of your component B
        data:data, // serializes the form's elements
        beforeSubmit:  showRequest,  // pre-submit callback 
        success:       showResponse,  // post-submit callback 
        error:         showError
      };

      $(this).ajaxForm(options); 
      $(this).ajaxSubmit(options);

      return false;
    } );
}
function showError(formData, jqForm, options) { 
alert("ko");
}
// pre-submit callback 
function showRequest(formData, jqForm, options) { 
    var queryString = $.param(formData); 
    alert('About to submit: \n\n' + queryString); 
    jqForm.closest('.modal').modal('toggle');
    return true; 
} 
 
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
    alert('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
        '\n\nThe output div should have already been updated with the responseText.'); 
} 