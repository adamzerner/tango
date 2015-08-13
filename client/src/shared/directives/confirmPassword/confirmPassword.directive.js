angular
  .module('mean-starter')
  .directive('confirmPassword', confirmPassword)
;

function confirmPassword() {
  return {
    require: 'ngModel',
    scope: {
      password: '=confirmPassword'
    },
    link: function(scope, iEl, iAttrs, ngModel) {
      ngModel.$validators.passwordsMatch = function(modelValue) {
        return modelValue === scope.password;
      };
      scope.$watch('password', function() {
        ngModel.$validate();
      });
    }
  };
}
