/*global window,document,$ */
/* jshint camelcase: false */

var deb;
(function (window,document,$) {
var $catswitch = $('#catswitch');
$catswitch.children('li').on('click',function() {

  var $ol = $('#pe_mietatlas');
  var selection = this.dataset.category;
  var $li = $ol.children('.'+selection);

  $catswitch.children().removeClass('active');
  $ol.children().removeClass('active');


  $(this).addClass('active');

  //$("#pe_mietatlas ."+selection).addClass("active");

  var $iframe = $($li.children('iframe'));
  deb = $iframe;
  if(!$li.hasClass('initialized')) {
    $iframe.attr('src',$iframe.data('src'));
  }
  $li.addClass('active initialized');

});

$('#catswitch .berlin').click();
})(window,document,$);
