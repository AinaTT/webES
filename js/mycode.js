$(document).ready(function () {
  $("img").attr("loading", "lazy")
  // $("img").attr("src", "data-src");
  $('img').addClass('lazyload');

  $('div.fullscreen').addClass('lazy2');
  $("img").attr("src", $("img").attr("data-src"));
  console.log($("img").attr("src", $("img").attr("data-src")));

  $("img").each(function () {
    var datasrc = $(this).attr("data-src");
    var src = $(this).attr("src");

    datasrc = $(this).attr("data-src", src);


    var datasrc1 = $(this).attr("data-src");
    var src1 = $(this).attr("src");
    console.log("data-src:" + datasrc1 + "/ src:" + src1);
  });



  var lazyloadImages;
  console.log("3");
  if ("IntersectionObserver" in window) {
    console.log("3");

    lazyloadImages = document.querySelectorAll(".lazy");
    var imageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          console.log("a3");

          var image = entry.target;
          image.src = image.dataset.src;
          console.log("3");
          image.classList.remove("lazy");
          imageObserver.unobserve(image);
        }
      });
    });

    lazyloadImages.forEach(function (image) {
      imageObserver.observe(image);
    });
  } else {
    var lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll(".lazy");

    function lazyload() {
      if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }

      lazyloadThrottleTimeout = setTimeout(function () {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function (img) {
          if (img.offsetTop < (window.innerHeight + scrollTop)) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
          }
        });
        if (lazyloadImages.length == 0) {
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }











  /* EN */
  if (window.location.href.indexOf("/en/") >= 0) {

    var link1 = '<li class="cursosF"><a class="linkB"  target="_blank" href="https://training.topciment.com">Book your training</a></li>';
    $(".profesionalesF").prepend(link1);
    var link2 = '<li class="exterioresF"><a class="linkB" href="https://www.topciment.com/en/gallery.html#exteriores">Terrace floors and exteriors</a></li>';
    $(".banyoF").prepend(link2);
    var link3 = '<li class="techoF"><a class="linkB" href="https://www.topciment.com/en/gallery.html#techo">Microcement in ceilings</a></li>';
    $(".banyoF").prepend(link3);
    var link3 = '<li class="piscinasF"><a class="linkB" href="https://www.topciment.com/en/gallery.html#piscinas">Microcement pools</a></li>';
    $(".banyoF").prepend(link3);
    $(".calcF a").attr("href", "https://www.topciment.com/en/calc/index.html")

    $.gdprcookie({
      title: "🍪 Do you accept cookies and the privacy policy?",
      subtitle: "Select cookies to accept ",

      message: "This website uses its own and third party cookies for its operation, as well as to obtain anonymous statistics on the use of the website. If you continue to browse we consider that you accept its use. You can change the settings or get more information in the  <strong> <a class='linkC' href='https://www.topciment.com/en/cookie-policy.html'>  Cookie Policy </strong>",
      delay: 600,
      expires: 1,
      acceptBtnLabel: "Accept Cookies",
      advancedBtnLabel: "Set up cookies",
      cookieName: "cookieControlPrefs",
      acceptReload: false,
      customShowMessage: undefined,
      customHideMessage: undefined,
      customShowChecks: undefined,
      cookieTypes: [{
          type: "Essentials",
          value: "Essentials",
          description: "These cookies are essential for the website to function properly."
        },
        {
          type: "Marketing ",
          value: "Marketing",
          description: "Cookies related to marketing, newsletters, social media, etc."
        },
        {
          type: "Preferences",
          value: "Preferences",
          description: "These are cookies related to your site's preferences, for example: remembering your user name, site colors, etc."
        },
        {
          type: "Analytics",
          value: "Analytics",
          description: "Cookies related to site visits, browser type, etc."
        }
      ],

    });

  } else if (window.location.href.indexOf("/de/") >= 0) {
    var link1 = '<li class="cursosF"><a class="linkB"  target="_blank" href="https://training.topciment.com">Schulung Platzreservierung</a></li>';
    $(".profesionalesF").prepend(link1);
    var link2 = '<li class="exterioresF"><a class="linkB" href="https://www.topciment.com/de/galerie.html#exteriores">Terrassen und Draussen Bodenbeschichtungen</a></li>';
    $(".banyoF").prepend(link2);
    var link3 = '<li class="techoF"><a class="linkB" href="https://www.topciment.com/de/galerie.html#techo">Mirozement auf dem Dachs</a></li>';
    $(".banyoF").prepend(link3);
    var link3 = '<li class="piscinasF"><a class="linkB" href="https://www.topciment.com/de/galerie.html#piscinas">Mikrozement Swimingpools</a></li>';
    $(".banyoF").prepend(link3);
    $(".calcF a").attr("href", "https://www.topciment.com/de/calc/index.html")
    $.gdprcookie({
      title: "🍪 Akzeptieren Sie Cookies und die Datenschutzrichtlinie?",
      subtitle: "Zu akzeptierende Cookies auswählen ",

      message: "Diese Website verwendet eigene und fremde Cookies für ihren Betrieb sowie zum Erhalt anonymer Statistiken über die Nutzung der Website. Wenn Sie weiter blättern, gehen wir davon aus, dass Sie mit der Verwendung einverstanden sind. Sie können die Einstellungen ändern oder weitere Informationen in der  <strong> <a class='linkC' href='https://www.topciment.com/de/cookie-richtlinie.html'> Cookie-Politik </strong>",
      delay: 600,
      expires: 1,
      acceptBtnLabel: "Cookies akzeptieren",
      advancedBtnLabel: "Einrichten von Cookies",
      cookieName: "cookieControlPrefs",
      acceptReload: false,
      customShowMessage: undefined,
      customHideMessage: undefined,
      customShowChecks: undefined,
      cookieTypes: [{
          type: "Grundlagen",
          value: "Grundlagen",
          description: "Diese Cookies sind für das ordnungsgemäße Funktionieren der Website unerlässlich."
        },
        {
          type: "Marketing ",
          value: "Marketing",
          description: "Cookies im Zusammenhang mit Marketing, Newslettern, sozialen Medien usw."
        },
        {
          type: "Präferenzen",
          value: "Präferenzen",
          description: "Dabei handelt es sich um Cookies, die sich auf die Präferenzen Ihrer Site beziehen, z.B.: Speichern Ihres Benutzernamens, Farben der Site usw."
        },
        {
          type: "Analytik",
          value: "Analytik",
          description: "Cookies im Zusammenhang mit Website-Besuchen, Browser-Typ usw."
        }

      ],

    });

  } else {
    xenioowebchat.Start("58a8dc52-1e3d-4295-8b8e-040257ffc9cd");
    $('.zsiq_floatmain').css({
      'display': 'none !important'
    });

    $(".zsiq_floatmain").addClass("hidelement");

    $('.zsiq_floatmain').css('cssText', 'display: none !important');
    //  $('#zsiq_float').remove();
    $("#zsiq_float").addClass("hidelement");
    /* New links on Footer */
    var link1 = '<li class="cursosF"><a class="linkB"  target="_blank" href="https://training.topciment.com">Reserva tu curso</a></li>';
    $(".profesionalesF").prepend(link1);
    var link2 = '<li class="exterioresF"><a class="linkB" href="https://www.topciment.com/galeria.html">Suelos de terrazas y exteriores</a></li>';
    $(".banyoF").prepend(link2);
    var link3 = '<li class="piscinasF"><a class="linkB" href="https://www.topciment.com/galeria.html">Piscinas de microcemento</a></li>';
    $(".banyoF").prepend(link3);
    var link3 = '<li class="techoF"><a class="linkB" href="https://www.topciment.com/galeria.html">Microcemento en techos</a></li>';
    $(".banyoF").prepend(link3);

    $.gdprcookie({
      title: "🍪 ¿Aceptas las cookies y la política de privacidad?",
      subtitle: "Seleccione las cookies para aceptar ",

      message: "Esta web usa cookies propias y de terceros para su funcionamiento, así como para obtener estadísticas anónimas de uso de la web. Si continua navegando consideramos que acepta su uso. Puede cambiar la configuración u obtener más información en la  <strong> <a class='linkC' href='https://www.topciment.com/uso-de-cookies.html'>  Política de Cookies </strong>",
      delay: 600,
      expires: 1,
      acceptBtnLabel: "Aceptar cookies",
      advancedBtnLabel: "Confugurar cookies",
      cookieName: "cookieControlPrefs",
      acceptReload: false,
      customShowMessage: undefined,
      customHideMessage: undefined,
      customShowChecks: undefined,
      cookieTypes: [{
          type: "Esenciales",
          value: "Esenciales",
          description: "Estas son cookies que son esenciales para que el sitio web funcione correctamente.."
        },
        {
          type: "Marketing ",
          value: "marketing",
          description: "Cookies relacionadas con el marketing, e.g. newsletters, social media, etc"
        },
        {
          type: "Preferencias",
          value: "preferences",
          description: "Se trata de cookies relacionadas con las preferencias de su sitio, por ejemplo, recordar su nombre de usuario, los colores del sitio, etc."
        },
        {
          type: "Analíticas",
          value: "analytics",
          description: "Cookies relacionadas con las visitas al sitio, el tipo de navegador, etc."
        }

      ],

    });
  }
  if (window.location.href.indexOf("bot") >= 0) {
    xenioowebchat.Start("58a8dc52-1e3d-4295-8b8e-040257ffc9cd");
  }



  $(".micard").hover(function () {
    $(this).toggleClass('shadow');
  });
  $(".micard").css('cursor', 'pointer');


  $(".menuSistemas a").click(function (evn) {
    $('html,body').scrollTo(this.hash, this.hash);
  });



  $('.gdprcookie-types').find('h2').text('myNewText');

  $('.imagen1').css({
    'background-position': 'top'
  });
  $('.fotomicro').css({
    'background-position': 'left'
  });

  $(window).scroll(function () {
    $('.fotomicro').css({
      'background-position': 'left'
    });


    var scrollTop = 0;
    scrollTop = $(window).scrollTop();

    if (window.location.href.indexOf("microcementos") >= 0) {
      if (scrollTop >= 800) {
        $('.bl').css({
          'color': 'black'
        });
      }

      if (scrollTop < 800) {
        $('.bl').css({
          'color': 'white'
        });
      }
    } else if (window.location.href.indexOf("efectto-microcemento-listo-al-uso") >= 0) {
      if (scrollTop >= 800) {
        $('.bl').css({
          'color': 'black'
        });
      }
    }




    if (scrollTop >= 100) {


      if ($(window).width() > 1200 && $(window).width() < 1345) {
        $('.imagen1').css({
          'background-position': 'top'
        });

        $('.botones li').css({
          'margin-right': '60px'
        });
      } else {
        $('.botones li').css({
          'margin-right': '82px'
        });
      }

      $('.dropdown').css({
        'display': 'table'
      });
      $('.logo1').css({
        'display': 'none'
      });
      $('.logo2').css({
        'display': 'inline-block'
      });
      $('#header').css({
        'height': '64px'
      });
      $('.menuBar').css({
        'height': 'inherit'
      });
      $('.menuBarContent').css({
        'width': '1400px'
      });
      $('.botones').css({
        'clear': 'none ',
        'padding-top': '20px',
        'margin-left': '100px'
      });

      $('#visiblemovil').css({
        'top': '0px'
      });
      $('.idiomas').css({
        'display': 'none'
      });
      $('#sidebar').css({
        /* 70px */
        'top': '100px'
      });
      $('#producmenu').css({
        'margin-left': '30px'
      });
    } else if (scrollTop < 100) {

      $('.imagen1').css({
        'background-position': 'top'
      });
      if ($(window).width() > 1200 && $(window).width() < 1345) {

      }
      $('.botones li').css({
        'margin-right': '82px'
      });
      $('.botones li').css({
        'margin-right': '129px'
      });
      $('.dropdown').css({
        'display': 'none'
      });
      $('.logo1').css({
        'display': 'block'
      });
      $('.logo2').css({
        'display': 'none'
      });
      $('#header').css({
        'height': '135px'
      });
      $('.menuBar').css({
        'height': '135px'
      });
      $('.menuBarContent').css({
        'width': '1200px'
      });
      $('.botones').css({
        'clear': 'both ',
        'padding-top': '40px',
        'margin-left': 'inherit'
      });
      $('#visiblemovil').css({
        'top': '0px'
      });
      $('.idiomas').css({
        'display': 'block'
      });
      $('#sidebar').css({
        'top': '200px'
      });
      $('#producmenu').css({
        'margin-left': '0px'
      });
    }

  });
  /* End function */
  /* Zoho bot */

  /* Function if it's in between */
  // js prototype
  if (typeof (Number.prototype.isBetween) === "undefined") {
    Number.prototype.isBetween = function (min, max, notBoundaries) {
      var between = false;
      if (notBoundaries) {
        if ((this < max) && (this > min)) between = true;

      } else {
        if ((this <= max) && (this >= min)) between = true;
      }
      return between;
    }
  }
});