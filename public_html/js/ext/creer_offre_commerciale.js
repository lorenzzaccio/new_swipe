
const CREER_OFFRE_COMMERCIALE_MODAL_ID = "#creer_offre_commerciale";

var MODAL_ID=CREER_OFFRE_COMMERCIALE_MODAL_ID;

const COL_CREER_OFFRE_NUM = 0;

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
const DEFAULT_COND1="Délai de livraison : 4 semaines à la commande, frais de livraison inclus,";
const DEFAULT_COND2="Conditionnement par carton de 2 500 pièces,";
const DEFAULT_COND3="Conditions de paiement : 45 jours fin de mois.";
const DEFAULT_COND4="Validité de l'offre : 6 mois.";
const DEFAULT_COND5="";

const SQL_UPDATE_COND_CREER_OFFRE="demPrix_id=";
var g_offrePix_num = 0;

const OFFRE_NUM_UI = "#offre_num";
const OFFRE_DATE_UI = "#offre_date";
const OFFRE_REF_FOURN_UI="#offre_ref_fourn";
const OFFRE_TYPE_COMBO_UI = "#offre_type_combo";
const COND1_UI = "#offre_cond1";
const COND2_UI = "#offre_cond2";
const COND3_UI = "#offre_cond3";
const COND4_UI = "#offre_cond4";
const COND5_UI = "#offre_cond5";

const AGENT_COMBO_UI = "#agent_combo";
var creer_offre_buffer=[];

const OFFRE_DEVIS_FOURNISSEUR=1;
const OFFRE_APPRO_CLIENT_SUP_5000=2; 
const OFFRE_FAB_INTERNE=3;
const OFFRE_DESTOCKAGE=4;
const OFFRE_FORFAIT_APPRO=5;
const OFFRE_FORFAIT_DESTOCK=6;
const OFFRE_CALCULEE_CAPSTECH=7;

var g_num_agent="1";

function init_creer_offre_commerciale_modal(){
    init_form_creer_offre();
    init_date_picker();
    var offre_date = new Date();
    var day_in_year = get_day_in_year(offre_date);
    offre_date = (offre_date.toISOString()).split("T")[0];
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' #offre_date').val(offre_date);
    $(AGENT_COMBO_UI).val(1);
    get_new_offre_num($(AGENT_COMBO_UI).val());
    offre_select_type_demande();
    init_ui_creer_offre_commerciale();
    $(COND1_UI).val(DEFAULT_COND1);
    $(COND2_UI).val(DEFAULT_COND2);
    $(COND3_UI).val(DEFAULT_COND3);
    $(COND4_UI).val(DEFAULT_COND4);
    $(COND5_UI).val(DEFAULT_COND5);
    //autocomplete
    autocomplete(document.getElementById("client_combo"), availableTagsClientList);
    
    autocomplete(document.getElementById("article_combo"), availableTagsArticleList);
    
    //load_data_dem_prix(dem_num);
}

function init_date_picker(){
    $( "#offre_date" ).datepicker();
    $.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
     $( "#offre_date" ).datepicker( "option", "dateFormat", "yy-mm-dd");
     $( "#offre_date" ).on( "change", function() {
         get_new_offre_num($(AGENT_COMBO_UI).val());
         select_type_demande();
     });
}

function get_new_offre_num(num_agent){
    var offre_date = $(OFFRE_DATE_UI).val();
    if((offre_date==="")||(offre_date===undefined)){
        offre_date = new Date();
        offre_date = (offre_date.toISOString()).split("T")[0];
        $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' #offre_date').val(offre_date);
    }
    var day_in_year = get_day_in_year(offre_date);
    var an =  offre_date.split("-")[0] - 2006;
    var offre_num = pad(num_agent,2)+an+"-"+day_in_year;
    service_allouer_num_offre(offre_num);
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+OFFRE_NUM_UI).attr('data-status','modify');
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+OFFRE_NUM_UI).css('color','red');
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+AGENT_COMBO_UI).attr('data-status','modify');
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+AGENT_COMBO_UI).css('color','red');
}

function init_ui_creer_offre_commerciale(){
    fixe_prix_achat_ui.forEach(function(el){
        //$(el).css('background-color','aliceblue');
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

function pad(num, size) {
    var s = "0" + num;
    return s.substr(s.length-size);
}

function service_allouer_num_offre(offre_num){
    service_get_num_offre_prix(offre_num,offre_set_param_fixe_prix_bck,creer_offre_buffer);
}

function load_data_dem_prix(dem_num){
    //service_get_dem_prix(dem_num,set_param_fixe_prix_bck,creer_offre_buffer);
}

function offre_set_param_fixe_prix_bck(arr){
    var arr_data = arr[0].split(";");
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' #offre_num').val(arr_data[COL_CREER_OFFRE_NUM]);    
}

function offre_select_type_demande(){
    var prefix = offre_get_demande_type();
    var today=$(OFFRE_DATE_UI).val();
    var index_demandes=1;
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+OFFRE_REF_FOURN_UI).val(prefix+today+"-"+index_demandes);
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+OFFRE_REF_FOURN_UI).attr('data-status','modify');
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+OFFRE_REF_FOURN_UI).css('color','red');
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+OFFRE_TYPE_COMBO_UI).attr('data-status','modify');
    $(CREER_OFFRE_COMMERCIALE_MODAL_ID+' '+OFFRE_TYPE_COMBO_UI).css('color','red');
}

function offre_get_demande_type(){
    var x = $(OFFRE_TYPE_COMBO_UI).val();
    var prefix="";
    switch(parseInt(x)){
        case OFFRE_DEVIS_FOURNISSEUR:
            prefix="fourn_";
            //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",false); 
        break;
        case OFFRE_APPRO_CLIENT_SUP_5000:
        prefix="appro_";
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
        case OFFRE_FAB_INTERNE:
        prefix="fab_";
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
        case OFFRE_DESTOCKAGE:
        prefix="destock_";
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
        case OFFRE_FORFAIT_APPRO:
        prefix="forfait-appro_";
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
        case OFFRE_FORFAIT_DESTOCK:
        prefix="forfait-destock_";
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
        case OFFRE_CALCULEE_CAPSTECH:
        prefix="capstech_";
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).val(FOURN_CAPSTECH);
        //$(MODAL_ID+' '+DEM_FOURN_COMBO_UI).prop("disabled",true); 
        break;
    }
    return prefix;
}

function record_offre_commerciale(){
    fixe_prix_achat_ui.forEach(function(el,index){
        if (($(el).attr('data-status')==="modify")&&(fixe_prix_achat_sql[index]!==""))
            sql_update(TABLE_DEM,fixe_prix_achat_sql[index],"'"+$(el).val()+"'",SQL_UPDATE_COND_CREER_OFFRE+g_demPrix_id);

    });    
    sql_update(TABLE_DEM,DEMPRIX_STATUS_SQL,PRIX_ACHAT_FIXE_STATUS,SQL_UPDATE_COND_CREER_OFFRE+g_demPrix_id);
}

function init_form_creer_offre(){
   $( "#myform" ).off( "submit");
    $( "#myform" ).on( "submit", function( event ) {
      event.preventDefault();
      var data= $( this ).serialize();
      var options = { 
        type: "GET",
        dataType : 'json',
        crossDomain: true,
        cache: false,
        async: true,
        timeout: 10000, // 10 seconds for getting result, otherwise error.
        url: "../../capstech_lib_v2/php/create_offer.php", // it's the URL of your component B
        data:data, // serializes the form's elements
        beforeSubmit:  showRequest,  // pre-submit callback 
        success:       showResponse,  // post-submit callback 
        error:         showError
      };
      // inside event callbacks 'this' is the DOM element so we first 
      // wrap it in a jQuery object and then invoke ajaxSubmit 
      $(this).ajaxForm(options); 
      //$.ajax(options);
      $(this).ajaxSubmit(options);
     /* event.preventDefault();
      $(this).resetForm();

      $(this).clearForm();
      init_creer_offre_commerciale_modal();
      location.reload();*/
      // !!! Important !!! 
      // always return false to prevent standard browser submit and page navigation 
      return false;
    } );
/*
    // bind to the form's submit event 
    $('#myform').submit(function() { 
        var options = { 
        //type: "POST",
        //dataType : 'json',
        //url: "../../capstech_lib/php/create_offer.php", // it's the URL of your component B
        data: $("#myform").serialize(), // serializes the form's elements
        beforeSubmit:  showRequest,  // pre-submit callback 
        success:       showResponse  // post-submit callback 
    };

        console.log($("#myform").serialize());
        // inside event callbacks 'this' is the DOM element so we first 
        // wrap it in a jQuery object and then invoke ajaxSubmit 
        $(this).ajaxForm(options); 
 
        // !!! Important !!! 
        // always return false to prevent standard browser submit and page navigation 
        return false; 
    }); */
    /*
     $("#myform").submit(function() { // intercepts the submit event
      $.ajax({ // make an AJAX request
        type: "POST",
        dataType : 'json',
        url: "../../capstech_lib/php/create_offer.php", // it's the URL of your component B
        data: $("#myform").serialize(), // serializes the form's elements
        success: function(data)
        {
          // show the data you got from B in result div
          $("#result").html(data);
        },
        error: function(data){
            alert("ko!");
        }
      });
      //e.preventDefault(); // avoid to execute the actual submit of the form
    });*/
}
function showError(formData, jqForm, options) { 
alert("ko");
}
// pre-submit callback 
function showRequest(formData, jqForm, options) { 
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
    var queryString = $.param(formData); 
 
    // jqForm is a jQuery object encapsulating the form element.  To access the 
    // DOM element for the form do this: 
    // var formElement = jqForm[0]; 
 
    alert('About to submit: \n\n' + queryString); 
 
    // here we could return false to prevent the form from being submitted; 
    // returning anything other than false will allow the form submit to continue 
    //$(this).modal('hide');
    //$('#creer_offre_commerciale').modal('hide');
    jqForm.closest('.modal').modal('toggle');
    return true; 
} 
 
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property 
 
    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property 
 
    // if the ajaxForm method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server 
 
    alert('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
        '\n\nThe output div should have already been updated with the responseText.'); 
} 
async function allocate_new_article(){
    var letter='C';
    var choice = prompt("Type de prefix : C, V, E ?", "C");
    if(choice!='C'&&choice!=='E'&&choice!='V') alert("mauvaise réponse !");
    else
      letter=choice.trim();
    let response = await service_alloc_new_article(letter);
    let res = letter+"10-"+response.groups;
    $('#article_combo').val(res);
    return res;
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].toUpperCase().includes(val.toUpperCase())) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          b.setAttribute("class","autocomplete-item");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

console.log("init offre form");