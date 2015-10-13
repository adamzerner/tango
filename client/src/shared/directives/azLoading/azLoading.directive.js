angular
  .module('tango')
  .directive('azLoading', azLoading)
;

function azLoading($parse) {
  return {
    restrict: 'A',

    link: function(scope, iEl, iAttrs) {
      var tagName = iEl[0].tagName;
      var loadingText = iAttrs.loading;
      var azBlockAction = !!iAttrs.azBlockAction;
      var submitButton, onClick, onSubmit;


      if (tagName === 'BUTTON') {
        submitButton = iEl;
        onClick = $parse(iAttrs.onClick);
        iEl.on('click', function() {
          scope.$apply(function() {
            execute(scope, onClick, submitButton, loadingText, azBlockAction);
          });
        });
      }

      else if (tagName === 'FORM') {
        submitButton = angular.element(iEl[0].querySelector('button[type=submit]'));
        onSubmit = $parse(iAttrs.onSubmit);
        iEl.on('submit', function() {
          scope.$apply(function() {
            execute(scope, onSubmit, submitButton, loadingText, azBlockAction);
          });
        });
      }
    }

  };
}

function execute(scope, fn, submitButton, loadingText, blockAction) {
  var $body = angular.element(document.body);
  var $azLightbox = angular.element(document.querySelector('.az-lightbox')); // http://stackoverflow.com/questions/1298034/disable-all-the-elements-in-html
  var oldText = submitButton.text();

  if (blockAction) {
    $body.addClass('az-block-action');
    $azLightbox.css('display', 'block');
  }

  // apply loading styles
  $body.addClass('az-loading');
  submitButton.addClass('az-loading');
  submitButton.text(loadingText);
  submitButton.prop('disabled', true);

  var returnValue = fn(scope);

  if (!returnValue.then) {
    console.error('clickFn needs to return a promise for the loading directive to work.');
    return;
  }

  returnValue
    .then(function(response) {
      // remove block action stuff
      $body.removeClass('az-block-action');
      $azLightbox.css('display', 'none');

      // re-apply old styles
      $body.removeClass('az-loading');
      submitButton.removeClass('az-loading');
      submitButton.text(oldText);
      submitButton.prop('disabled', false);
    }, function(response) {
      // remove block action stuff
      $body.removeClass('az-block-action');
      $azLightbox.css('display', 'none');

      // re-apply old styles
      $body.removeClass('az-loading');
      submitButton.removeClass('az-loading');
      submitButton.text(oldText);
      submitButton.prop('disabled', false);

      console.error('clickFn error caught.');
      return response;
    })
  ;
}
