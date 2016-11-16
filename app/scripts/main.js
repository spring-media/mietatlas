/*global window,document,$,cartodb,wt,Mustache */
/* jshint camelcase: false */
(function (window,document,$,cartodb,Mustache) {
  if (document.location.search === '?withfb' && (window.matchMedia('(max-width: 539px)').matches)) {
    $('html').addClass('mobdevice');
    $('body').html($('<div>').append($('#mobilefallback').clone()).html());
  } else {
    window.onload = function () {
      var css = {};
      css.ergebnis = $('#ergebnis_css').text();
      css.weisse = $('#weisse_css').text();
      css.hispanics = $('#hispanics_css').text();
      css.schwarze = $('#schwarze_css').text();
      css.arbeitslose = $('#arbeitslose_css').text();
      css.sieger = $('#sieger_css').text();
      css.clinton = $('#clinton_css').text();
      css.trump = $('#trump_css').text();
      css.historie = $('#historie_css').text();
      css.nichtwaehler = $('#nichtwaehler_css').text();

      //console.log(css);

      var minMax = {};
      minMax.trump = [0, 0];
      minMax.clinton = [0, 0];
      minMax.nichtwaehler = [0, 0];

      var colors = {};

    /*  colors.spd = ['#E30513', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      colors.afd = ['#2F8DCD', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      colors.linke = ['#E5007D', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      colors.gruene = ['#86BC24', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      colors.fdp = ['#F9D900', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      colors.cdu = ['#1C1C1B', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      colors.npd = ['#973939', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      colors.diepartei = ['#b51945', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      // colors.wahlbeteiligung = ['#F6A200',0.1,0.25,0.4,0.65,0.8,1];
      colors.wahlbeteiligung = ['#86b5bc', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
      colors.nichtwaehler = ['#86b5bc', 0.1, 0.25, 0.4, 0.65, 0.8, 1];
*/
      var legends = {};
      legends.clinton = 'quartile';
      legends.trump = 'quartile';
      legends.historie = 'dots';
      legends.ergebnis = 'quartile';
      legends.nichtwaehler = 'quartile';
      legends.sieger = 'dots';
      legends.weisse = 'quartile';
      legends.schwarze = 'quartile';
      legends.arbeitslose = 'quartile';
      legends.hispanics = 'quartile';


      colors.clinton = ['#dce8f5','#b8cfeb','#92b8e1','#68a2d7','#2f8dcd'];
      colors.trump = ['#f8d4d3','#edaaa8','#de7e80','#cc525a','#b71336'];
      colors.historie = ['#2f8dcd','#92b8e1','#edad08','#de7e80','#b71336',];
      colors.nichtwaehler = ['#e6f0f1','#cee1e4','#b7d2d7','#9ec3c9','#86b5bc'];
      //colors.ergebnis = ['#f1b8b6','#85b2de','#2f8dcd','#d97073','#b71336','#c4d7ef'];
      colors.ergebnis = ['#2f8dcd','#85b2de','#c4d7ef','#f1b8b6','#d97073','#b71336'];

      colors.weisse = ['#fee9b7','#fce095','#f8d672','#f3cc50','#edc31e'];


      colors.hispanics = ['#ffe8d6','#ffd1ac','#ffb77f','#fa9f54','#f18825'];
      colors.sieger = ['#2f8dcd','#b71336'];
      colors.schwarze = ['#e5cfdb','#caa0b8', '#ae7497', '#924676','#741057'];

      colors.arbeitslose = ['#e0e9d9','#c1d5b5','#a2c091','#83aa6d','#64964b'];

      var labels = {};
      labels.subhead = {};
      labels.subhead.legends = {};
      labels.legends = {};
      labels.legends.historie = ['5 Siege Dem.','4 Siege Dem.','Swing State','4 Siege Rep.','5 Siege Rep.'];
      labels.legends.sieger = ['Clinton','Trump'];
      labels.subhead.legends.historie = 'Vergangene<br/>5 US-Wahlen';
      labels.subhead.legends.sieger = 'Bundesstaat gewonnen';

      function getMaxMin(column) {
      var sql = new cartodb.SQL({ user: 'welt' });
      var qry = column;
      if (qry === 'clinton' || qry === 'trump') {
        qry = 'ergebnis_'+qry;
      }
      if (qry === 'weisse' || qry === 'schwarze' || qry === 'hispanics' || qry === 'arbeitslose') {
        qry = 'anteil_'+qry;
      }
      if(column === 'ergebnis') {
        var legend = $('.customLegend');
        $('.min', legend).text('Clinton');
        $('.max', legend).text('Trump');
        return true;
      }
      sql.execute('SELECT max('+qry+'), min('+qry+') FROM uswahl_2016')
      .done(function(data) {
      console.log(data.rows);
      var legend = $('.customLegend');
      $('.min', legend).text(data.rows[0].min + ' %');
      $('.max', legend).text(data.rows[0].max + ' %');
      })
      .error(function(errors) {
      // errors contains a list of errors
      console.log('errors:' + errors);
      });
      }
      function setLegendWithDots(column) {
        var legend = $('.customLegend');
        legend.children('div').hide();
        if (legends[column] === false) {
        } else {
          if(legends[column] === 'dots') {
            $('.dots',legend).show();
            var $ul = $('.dots ul',legend);
            $ul.children().remove();
            $('.subhead',legend).html(labels.subhead.legends.historie);
            for(var i=0;i<colors[column].length;i++) {
              $ul.append('<li><span>'+labels.legends[column][i]+'<span><span class="dot" style="background-color:'+colors[column][i]+'"></span></li>');
            }
          } else {
            $('.choropleth',legend).show();
            var $colors = $('.colors',legend);
            $colors.children().remove();
            for(var u=0;u<colors[column].length;u++) {
              $colors.append('<div class="quartile" style="background-color:'+colors[column][u]+'"></div>');
            }
            //$('.quartile', legend).each(function (i) {
              //$(this).css('background-color', colors[column][0]);
              //$(this).css('opacity', colors[column][i + 1]);
              //$(this).css('background-color', colors[column][i]);
            //});
            getMaxMin(column);
            console.log('min,max',minMax,column);
          //  $('.min', legend).text(minMax[column][0] + ' %');
          //  $('.max', legend).text(minMax[column][1] + ' %');
          }
        }
      }

//    var max = getMax('afd');

      var $catswitch = $('#catswitch');
      function getMousePosition(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX === null && event.clientX !== null) {
          eventDoc = (event.target && event.target.ownerDocument) || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;

          event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = event.clientY +
            (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0 );
        }

        return {
          x: event.pageX,
          y: event.pageY
        };
      }
      cartodb.createVis('map', 'https://welt.carto.com/api/v2/viz/b5f02cec-a503-11e6-bbe2-0ee66e2c9693/viz.json', { zoom: 4,shareable:false })
        .done(function (vis) {
          var PISent = false;
          var sublayer = vis.getLayers()[1].getSubLayer(1);
          vis.map.set({
            minZoom: 2,
            maxZoom: 10
          });
          $catswitch.children().on('click', function () {
            $catswitch.children().removeClass('active');
            $(this).addClass('active');
            var year = $(this).data('category');
            if (PISent) {
              wt.sendinfo({linkId: '_PE_uswahl_1_cat_' + year + '_'});
            }
            PISent = true;
            sublayer.on('featureClick', function () {
              //$('.cartodb-infowindow').hide();
              $('.cartodb-tooltip').hide();
            });
            // sublayer.set({interactivity:'cartodb_id,prozent,cdu,spd,gruene,fdp,fussnote,linke,afd,sonstige,wahlbeteiligung,gen'});
            // sublayer.set({interactivity: 'cartodb_id,prozent,cdu,spd,gruene,fdp,wgr,linke,afd,sieger,sonstige,wahlbeteiligung,gen'});
            // sublayer.set({interactivity: 'cartodb_id,prozent,cdu,cdu_diff,spd,spd_diff,gruene,gruene_diff,fdp,fdp_diff,wgr,wgr_diff,linke,linke_diff,afd,afd_diff,sieger,sonstige,sonstige_diff,wahlbeteiligung,wahlbeteiligung_diff,gen'});
            // sublayer.set({interactivity: 'cartodb_id,prozent,cdu,spd,gruene,fdp,wgr,linke,afd,sieger,sonstige,wahlbeteiligung,gen, fdp, piraten, spd_diff, cdu_diff, gruene_diff, linke_diff, afd_diff, fdp_diff, piraten_diff, sonstige_diff'});
            sublayer.set({interactivity: 'cartodb_id,geo_id_1,bundesstaat,anteil_weisse,anteil_hispanics,anteil_schwarze,vorsprung_cat,anteil_arbeitslose,ergebnis_clinton,ergebnis_trump,ergebnis_sonstige,sieger,vorsprung,historie,nichtwaehler'});
            //sublayer.set({interactivity: 'cartodb_id, cdu, spd, gruene, fdp,nichtwaehler, nichtwaehler_diff,linke, afd, sonstige,diepartei, wahlbeteiligung, gen, piraten, spd_diff, cdu_diff, gruene_diff, linke_diff, afd_diff, fdp_diff, piraten_diff'});
            sublayer.setInteraction(true);
            sublayer.on('featureOver featureClick', function (e, latlng, pos, data) {
              $('.cartodb-infowindow').hide();

              if (typeof data.cdu !== 'undefined') {
                data.cdu = data.cdu.toString().replace('.', ',');
              }



              if(typeof data.spd_diff !== 'undefined') {
                data.spd_diff = data.spd_diff.toString().replace('.',',');
                if(data.spd_diff >= 0) {
                  data.spd_diff = data.spd_diff.toString().replace(/^([^\+]*)$/gi,'+$1');
                }
              }


              /*data.cdu = typeof data.cdu !== 'undefined' ? data.cdu : '-';
              data.spd = typeof data.spd !== 'undefined' ? data.spd : '-';
              data.gruene = typeof data.gruene !== 'undefined' ? data.gruene : '-';
              data.fdp = typeof data.fdp !== 'undefined' ? data.fdp : '-';
              data.linke = typeof data.linke !== 'undefined' ? data.linke : '-';
              data.afd = typeof data.afd !== 'undefined' ? data.afd : '-';
              data.sonstige = typeof data.sonstige !== 'undefined' ? data.sonstige : '-';
              data.wahlbeteiligung = typeof data.wahlbeteiligung !== 'undefined' ? data.wahlbeteiligung : '-';
              data.wgr = typeof data.wgr !== 'undefined' ? data.wgr : '-';
              data.nichtwaehler = typeof data.nichtwaehler !== 'undefined' ? data.nichtwaehler : '-';*/
              var tooltip = $(Mustache.render($('#templatePopup').html(), data));
              var mousePos = getMousePosition(e);
              var offset = 20;
              var top = mousePos.y + offset;
              var left = mousePos.x + offset;
              $('.cartodb-tooltip').remove();
              tooltip.addClass('cartodb-tooltip');
              $('body').append(tooltip);
              tooltip.show();
              top = Math.min(top, $(window).height() - tooltip.height() - offset);
              if (left + tooltip.width() > $(window).width()) {
                left = mousePos.y - offset;
              }
              tooltip.css({top: top, left: left});
            });
            sublayer.on('featureOut', function () {
              $('.cartodb-tooltip').remove();
            });

            // sublayer.setSQL('SELECT the_geom_webmercator, cartodb_id, the_geom, gen, '+ year +' AS prozent, cdu,spd,gruene,fussnote,fdp,linke,afd,sonstige,wahlbeteiligung FROM mv_wahlergebnis_2011_merge');
            //sublayer.setSQL('SELECT the_geom_webmercator, cartodb_id, the_geom, gen, ' + year + ' AS prozent,cdu,cdu_diff,spd,spd_diff,gruene,gruene_diff,fdp,fdp_diff,linke,linke_diff,afd,afd_diff, wgr, wgr_diff, sieger, sonstige, sonstige_diff,wahlbeteiligung,wahlbeteiligung_diff FROM niedersachsen_kommunalwahl_2016_merge');
   // sublayer.set({interactivity: 'cartodb_id, cdu, spd, gruene, fdp, linke, afd, sonstige, wahlbeteiligung, gen, piraten, spd_diff, cdu_diff, gruene_diff, linke_diff, afd_diff, fdp_diff, piraten_diff, sonstige_diff'});
            // sublayer.setSQL('SELECT cartodb_id, the_geom, gen, ' + year + ' AS prozent,cdu,spd,gruene,fdp,linke,afd,sonstige,wahlbeteiligung,gen, piraten, spd_diff, cdu_diff, gruene_diff, linke_diff, afd_diff, fdp_diff, piraten_diff, sonstige_diff FROM berlin_wahlergebnis_2016_merge');
            //sublayer.setSQL('SELECT the_geom_webmercator, cartodb_id, the_geom, gen, ' + year + ' AS prozent,cdu,spd,gruene,fdp,linke,afd, wgr, sieger, sonstige,wahlbeteiligung, fdp, piraten, spd_diff, cdu_diff, gruene_diff, linke_diff, afd_diff, fdp_diff, piraten_diff, sonstige_diff FROM berlin_wahlergebnis_2016_merge');
            //sublayer.setSQL('SELECT cartodb_id, the_geom_webmercator, the_geom, ' + year + ' AS prozent,nichtwaehler_diff,sonstige,cdu,spd,nichtwaehler,gruene,diepartei, fdp,linke,afd,wahlbeteiligung,gen, piraten, spd_diff, cdu_diff, gruene_diff, linke_diff, afd_diff, fdp_diff, piraten_diff FROM uswahl_2016');
            //sublayer.setSQL('SELECT * FROM usa_mod_3');
            //sublayer.setSQL('SELECT usa_mod_3.cartodb_id, usa_mod_3.the_geom_webmercator, usa_mod_3.the_geom,uswahl_2016.sieger AS prozent, bundesstaat, ergebnis_clinton, ergebnis_trump, ergebnis_sonstige, nichtwaehler FROM usa_mod_3,uswahl_2016');
            //sublayer.setSQL('SELECT usa_mod_3.cartodb_id, usa_mod_3.the_geom_webmercator, usa_mod_3.the_geom,uswahl_2016.sieger AS prozent, bundesstaat, ergebnis_clinton, ergebnis_trump, ergebnis_sonstige, nichtwaehler FROM usa_mod_3,uswahl_2016');

            sublayer.setSQL('SELECT lefttable.cartodb_id as cartodb_id, lefttable.the_geom as the_geom, lefttable.the_geom_webmercator as the_geom_webmercator, righttable.geo_id_1, righttable.bundesstaat, righttable.anteil_weisse, righttable.vorsprung_cat, righttable.anteil_hispanics, righttable.anteil_schwarze, righttable.anteil_arbeitslose, righttable.ergebnis_clinton, righttable.ergebnis_trump, righttable.ergebnis_sonstige,righttable.sieger, righttable.vorsprung, righttable.historie, righttable.nichtwaehler FROM (SELECT * FROM usa_mod_3) as lefttable LEFT JOIN (SELECT * FROM uswahl_2016) as righttable ON lefttable.affgeoid = righttable.geo_id_1');

            console.log(year,css[year]);
            sublayer.setCartoCSS(css[year]);
            setLegendWithDots(year);
          });
//console.log(location.hash.substr(1));
//console.log(css);
//  console.log(typeof css[location.hash.substr(1)]);
          if((window.location.hash !== '') && (typeof css[window.location.hash.substr(1)] !== 'undefined')) {
  //          console.log(location.hash.substr(1));
            $('#catswitch .'+window.location.hash.substr(1)).click();
          } else {
            $('#catswitch .weisse').click();
          }
        });
    };
    var locked = true;


    $('#lockbutton').on('click', function () {
      if (locked) {
        wt.sendinfo({linkId: '_PE_uswahl_1_unlock_'});
        $('#interactivity.activate').toggleClass('show');
        $('#interactivity.deactivate').removeClass('show');
      } else {
        wt.sendinfo({linkId: '_PE_uswahl_1_lock_'});
        $('#interactivity.deactivate').toggleClass('show');
        $('#interactivity.activate').removeClass('show');
        $('.cartodb-infowindow').hide();
      }
      locked = !locked;
      $('#map').toggleClass('locked');
      //refreshTimer();
    });
    $('#map').on('click', '.close', function () {
      $('.cartodb-infowindow').hide();
    });
    /*$('#map').on('mousemove hover click',function() {
     if(!$(this).hasClass('locked')) {
     refreshTimer();
     }
     });
     function refreshTimer() {
     window.clearTimeout(timer);
     timer = lockTimer();
     }
     function lockTimer() {
     return window.setTimeout(function() {
     $('#map').toggleClass('locked');
     },2000);
     }*/
  }




})(window,document,$,cartodb,Mustache);
