
const AJOUTER_ACOMPTE_MODAL_ID = "#ajouter_acompte";

const COL_AJOUTER_ACOMPTE_OFFRE_NUM = 0;

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


const SQL_UPDATE_COND_AJOUTER_ACOMPTE="demPrix_id=";
var g_offrePix_num = 0;


const ACOMPTE_OFFRE_NUM_UI = "#acompte_offre_num";
const ACOMPTE_DATE_UI = "#acompte_date";
const ACOMPTE_DESC_UI = "#acompte_desc";
const ACOMPTE_TYPE_UI = "#acompte_type_combo";
const ACOMPTE_ARTICLE_NUM_UI = '#acompte_full_article';
const ACOMPTE_PRIX_UI = '#acompte_sell_price';
const ACOMPTE_UNITY_UI = '#acompte_unity'; //Deux unit : une pour avoir un libellé clair et l'autre pour la base de donnée : 1 ou 1000
const ACOMPTE_UNIT_UI = '#acompte_unit';
const ACOMPTE_CLIENT_ID_UI = "#acompte_client_id";
const ACOMPTE_STATUS_UI = "#acompte_status";
var creer_offre_buffer=[];

var g_num_agent="1";
var acompte_buffer = [];

function init_ajouter_acompte_modal(num_offre,client_id,status){
    //élément à récupérer
    var date;
    var prefix='CK00';
    var article = create_new_acompte_num();

    init_date_picker();
    var offre_date = new Date();
    var day_in_year = get_day_in_year(offre_date);
    offre_date = (offre_date.toISOString()).split("T")[0];
    $(AJOUTER_ACOMPTE_MODAL_ID+' #acompte_date').val(offre_date);
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_OFFRE_NUM_UI).val(num_offre);
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_CLIENT_ID_UI).val(client_id);

    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_STATUS_UI).val(status);
    select_type_acompte();
    init_form_ajouter_acompte();
}

function create_new_acompte_num(){
  service_get_num_acompte('AC00',set_num_acompte,acompte_buffer);
}

function set_num_acompte(buffer){
  var num = buffer[0];
  var article = pad(num,8);
  $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_ARTICLE_NUM_UI).val('AC00'+'-'+article);
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
    $( "#acompte_date" ).datepicker();
    $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
     $( "#acompte_date" ).datepicker( "option", "dateFormat", "yy-mm-dd");
     $( "#acompte_date" ).on( "change", function() {
     });
}

function pad(num, size) {
  var i,r='';
  for(i=0;i<size;i++)
      r+='0';
    var s = r+ num;
    return s.substr(s.length-size);
}

function select_type_acompte(){
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_DESC_UI).val($(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_TYPE_UI+ ' option:selected').text());
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_TYPE_UI).attr('data-status','modify');
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_TYPE_UI).css('color','red');
    var price = ($(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_TYPE_UI+ ' option:selected').val()).split('_')[0];
    var unity = parseInt(($(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_TYPE_UI+ ' option:selected').val()).split('_')[1]);
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_PRIX_UI).val(price);
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_PRIX_UI).attr('data-status','modify');
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_PRIX_UI).css('color','red');
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_UNIT_UI).val(unity===1?'euros':'euros au mille');
    $(AJOUTER_ACOMPTE_MODAL_ID+' '+ACOMPTE_UNITY_UI).val(unity);
}



function init_form_ajouter_acompte(){
    $( "#acompte_form" ).off( "submit");
    $( "#acompte_form" ).on( "submit", function( event ) {
      event.preventDefault();
      var data= $( this ).serialize();
      var options = { 
        type: "GET",
        dataType : 'json',
        crossDomain: true,
        cache: false,
        async: true,
        timeout: 10000, // 10 seconds for getting result, otherwise error.
        url: "../../capstech_lib/php/ajouter_acompte.php", // it's the URL of your component B
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