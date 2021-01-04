
const AJOUTER_CLICHE_MODAL_ID = "#ajouter_cliche";

const COL_AJOUTER_CLICHE_OFFRE_NUM = 0;

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


const SQL_UPDATE_COND_AJOUTER_CLICHE="demPrix_id=";
var g_offrePix_num = 0;


const CLICHE_OFFRE_NUM_UI = "#cliche_offre_num";
const CLICHE_DATE_UI = "#cliche_date";
const CLICHE_DESC_UI = "#cliche_desc";
const CLICHE_TYPE_UI = "#cliche_type_combo";
const CLICHE_ARTICLE_NUM_UI = '#cliche_full_article';
const CLICHE_PRIX_UI = '#cliche_sell_price';
const CLICHE_UNITY_UI = '#cliche_unity'; //Deux unit : une pour avoir un libellé clair et l'autre pour la base de donnée : 1 ou 1000
const CLICHE_UNIT_UI = '#cliche_unit';
const CLICHE_CLIENT_ID_UI = "#cliche_client_id";
const CLICHE_STATUS_UI = "#cliche_status";
var creer_offre_buffer=[];

var g_num_agent="1";
var cliche_buffer = [];

function init_ajouter_cliche_modal(num_offre,client_id,status){
    //élément à récupérer
    var date;
    var prefix='CK00';
    var article = create_new_cliche_num();

    init_date_picker();
    var offre_date = new Date();
    var day_in_year = get_day_in_year(offre_date);
    offre_date = (offre_date.toISOString()).split("T")[0];
    $(AJOUTER_CLICHE_MODAL_ID+' #cliche_date').val(offre_date);
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_OFFRE_NUM_UI).val(num_offre);
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_CLIENT_ID_UI).val(client_id);

    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_STATUS_UI).val(status);
    select_type_cliche();
    init_form_ajouter_cliche();
}

function create_new_cliche_num(){
  service_get_num_cliche('CK00',set_num_cliche,cliche_buffer);
}

function set_num_cliche(buffer){
  var num = buffer[0];
  var article = pad(num,8);
  $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_ARTICLE_NUM_UI).val('CK00'+'-'+article);
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
    $( "#cliche_date" ).datepicker();
    $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
     $( "#cliche_date" ).datepicker( "option", "dateFormat", "yy-mm-dd");
     $( "#cliche_date" ).on( "change", function() {
     });
}

function pad(num, size) {
  var i,r='';
  for(i=0;i<size;i++)
      r+='0';
    var s = r+ num;
    return s.substr(s.length-size);
}

function select_type_cliche(){
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_DESC_UI).val($(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_TYPE_UI+ ' option:selected').text());
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_TYPE_UI).attr('data-status','modify');
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_TYPE_UI).css('color','red');
    var price = ($(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_TYPE_UI+ ' option:selected').val()).split('_')[0];
    var unity = parseInt(($(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_TYPE_UI+ ' option:selected').val()).split('_')[1]);
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_PRIX_UI).val(price);
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_PRIX_UI).attr('data-status','modify');
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_PRIX_UI).css('color','red');
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_UNIT_UI).val(unity===1?'euros':'euros au mille');
    $(AJOUTER_CLICHE_MODAL_ID+' '+CLICHE_UNITY_UI).val(unity);
}



function init_form_ajouter_cliche(){
  $( "#cliche_form" ).off( "submit");
  $( "#cliche_form" ).on( "submit", function( event ) {
      event.preventDefault();
      var data= $( this ).serialize();
      var options = { 
        type: "GET",
        dataType : 'json',
        crossDomain: true,
        cache: false,
        async: true,
        timeout: 10000, // 10 seconds for getting result, otherwise error.
        url: "../../capstech_lib/php/ajouter_cliche.php", // it's the URL of your component B
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