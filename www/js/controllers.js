angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;


    var currentUser = Parse.User.current();
    if (currentUser) {
      $scope.user = currentUser;
    } else {
      $scope.modal.show();
    }

  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  }

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.logout = function() {
    Parse.User.logOut();
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
      success: function(user) {
        $scope.closeLogin();
      },
      error: function(user, error) {
        alert('invalid login');
      }
    });

  };
})

.controller('CheckinController', function($scope, BeaconService, $interval) {
  $scope.seesBeacon = false;

  $interval(function() {
    // $scope.seesBeacon = BeaconService.isInRange('F0:66:6A:5E:49:6B'); // clemens
    // $scope.seesBeacon = BeaconService.isInRange('CA:FB:74:4E:C9:24'); // markus
    $scope.seesBeacon = BeaconService.isInRange('D0:49:15:04:0F:14'); // dominik

  }, 1000);
});
