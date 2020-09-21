/* Invalid character(s) '$(document).ready(function() {

	var altoPag = $(window).height();
	var altoPagOk = altoPag - 135;

	$(".link").click(function(e) {
	    e.preventDefault();

	    var altoMenu = $('.' + $(this).data('rel')).height();
		//$('.menuOculto').css('top', ((altoPagOk/2) - (altoMenu/2) + 135));
		$('.menuOculto').css('top', 200);

	    $(".link").css('color', '#808080');
	    $(this).css('color', 'white');

	    $('.menuOculto').hide();
	    //$('.menuOculto').toggle();
	    $('.' + $(this).data('rel')).toggle();
	});






});

' at 1:0. Ignoring. */

var $zoho = $zoho || {};
$zoho.salesiq = $zoho.salesiq || {
  widgetcode: '7e78cb83d15a60689cfbb20a8903bc4acf81a6c960d39dee1212f343ec7821c9533163b23229b79e91104310dadb43de',
  values: {},
  ready: function () {
	$zoho.salesiq.floatbutton.visible('hide');
  }
};
var d = document;
s = d.createElement('script');
s.type = 'text/javascript';
s.id = 'zsiqscript';
s.defer = true;
s.src = 'https://salesiq.zoho.com/widget';
t = d.getElementsByTagName('script')[0];
t.parentNode.insertBefore(s, t);

function trackVisitor() {
  try {
	if ($zoho) {
	  var LDTuvidObj = document.forms['WebToLeads2193829000000221001']['LDTuvid'];
	  if (LDTuvidObj) {
		LDTuvidObj.value = $zoho.salesiq.visitor.uniqueid();
	  }
	  var firstnameObj = document.forms['WebToLeads2193829000000221001']['First Name'];
	  if (firstnameObj) {
		name = firstnameObj.value + ' ' + name;
	  }
	  $zoho.salesiq.visitor.name(name);
	  var emailObj = document.forms['WebToLeads2193829000000221001']['Email'];
	  if (emailObj) {
		email = emailObj.value;
		$zoho.salesiq.visitor.email(email);
	  }
	}
  } catch (e) {}
}
    $zoho.salesiq.ready = function () {
        $zoho.salesiq.customfield.add({

            "name": "¿Eres profesional?",
            "hint": "¿Eres profesional? ",
            "type": "selectbox",
            "options": [{
                    "text": "Si",
                    "value": "Si"
                },
                {
                    "text": "No",
                    "value": "No"
                }

            ],


            "required": "true",
            "visibility": "both",
            "callback": function (value) {}
        });
        $zoho.salesiq.customfield.add({
            "name": "¿Aceptas comunicaciones por WhatsApp?",
            "hint": "¿Aceptas comunicaciones por WhatsApp?",
            "type": "selectbox",
            "options": [{
                    "text": "Si",
                    "value": "Si"
                },
                {
                    "text": "No",
                    "value": "No"
                }
            ],
            "required": "true",
            "visibility": "both",
            "callback": function (value) {}
        });
        $zoho.salesiq.customfield.add({
            "name": "Seleccione su provincia",
            "hint": "Seleccione su provincia",
			"type": "selectbox",
			"options":[
				{
					"text":"Álava",
					"value":"Álava"
				},
				{
					"text":"Albacete",
					"value":"Albacete"
				},
				{
					"text":"Alicante",
					"value":"Alicante"
				},
				{
					"text":"Almería",
					"value":"Almería"
				},
				{
					"text":"Asturias",
					"value":"Asturias"
				},
				{
					"text":"Ávila",
					"value":"Ávila"
				},
				{
					"text":"Badajoz",
					"value":"Badajoz"
				},
				{
					"text":"Barcelona",
					"value":"Barcelona"
				},
				{
					"text":"Burgos",
					"value":"Burgos"
				},
				{
					"text":"Cáceres",
					"value":"Cáceres"
				},
				{
					"text":"Cádiz",
					"value":"Cádiz"
				},
				{
					"text":"Cantabria",
					"value":"Cantabria"
				},
				{
					"text":"Castellón",
					"value":"Castellón"
				},
				{
					"text":"Ciudad Real",
					"value":"Ciudad Real"
				},
				{
					"text":"Córdoba",
					"value":"Córdoba"
				},
				{
					"text":"Cuenca",
					"value":"Cuenca"
				},
				{
					"text":"Gerona",
					"value":"Gerona"
				},
				{
					"text":"Granada",
					"value":"Granada"
				},
				{
					"text":"Guadalajara",
					"value":"Guadalajara"
				},
				{
					"text":"Guipúzcoa",
					"value":"Guipúzcoa"
				},
				{
					"text":"Huelva",
					"value":"Huelva"
				},
				{
					"text":"Huesca",
					"value":"Huesca"
				},
				{
					"text":"Islas Baleares",
					"value":"Islas Baleares"
				},
				{
					"text":"Jaén",
					"value":"Jaén"
				},
				{
					"text":"La Coruña",
					"value":"La Coruña"
				},
				{
					"text":"La Rioja",
					"value":"La Rioja"
				},
				{
					"text":"Las Palmas",
					"value":"Las Palmas"
				},
				{
					"text":"León",
					"value":"León"
				},
				{
					"text":"Lérida",
					"value":"Lérida"
				},
				{
					"text":"Lugo",
					"value":"Lugo"
				},
				{
					"text":"Madrid",
					"value":"Madrid"
				},
				{
					"text":"Málaga",
					"value":"Málaga"
				},
				{
					"text":"Murcia",
					"value":"Murcia"
				},
				{
					"text":"Navarra",
					"value":"Navarra"
				},
				{
					"text":"Orense",
					"value":"Orense"
				},
				{
					"text":"Palencia",
					"value":"Palencia"
				},
				{
					"text":"Pontevedra",
					"value":"Pontevedra"
				},
				{
					"text":"Salamanca",
					"value":"Salamanca"
				},
				{
					"text":"Santa Cruz de Tenerife",
					"value":"Santa Cruz de Tenerife"
				},
				{
					"text":"Segovia",
					"value":"Segovia"
				},
				{
					"text":"Sevilla",
					"value":"Sevilla"
				},
				{
					"text":"Soria",
					"value":"Soria"
				},
				{
					"text":"Tarragona",
					"value":"Tarragona"
				},
				{
					"text":"Teruel",
					"value":"Teruel"
				},
				{
					"text":"Toledo",
					"value":"Toledo"
				},
				{
					"text":"Valencia",
					"value":"Valencia"
				},
				{
					"text":"Valladolid",
					"value":"Valladolid"
				},
				{
					"text":"Vizcaya",
					"value":"Vizcaya"
				},
				{
					"text":"Zamora",
					"value":"Zamora"
				},
				{
					"text":"Zaragoza",
					"value":"Zaragoza"
				}
				
			],
            
            "required": "true",
            "visibility": "both",
            "callback": function (value) {}
        });


    }
