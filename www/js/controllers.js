angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {


  // var CheckIn = Parse.Object.extend("CheckIn");
  // var gameScore = new CheckIn();
  //
  // gameScore.set('user', Parse.User.current());
  // gameScore.set("from", moment('2015-11-20 12:00:00').toDate());
  // gameScore.set("to", moment('2015-11-20 13:30:00').toDate());
  //
  //
  // gameScore.save(null, {
  //   success: function(gameScore) {
  //     // Execute any logic that should take place after the object is saved.
  //     alert('New object created with objectId: ' + gameScore.id);
  //   },
  //   error: function(gameScore, error) {
  //     // Execute any logic that should take place if the save fails.
  //     // error is a Parse.Error with an error code and message.
  //     alert('Failed to create new object, with error code: ' + error.message);
  //   }
  // });

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
    $scope.beacon = BeaconService.get('D0:49:15:04:0F:14');

  }, 1000);
})

.controller('WeekController', function($scope, $ionicLoading) {

  $ionicLoading.show({
      template: 'Loading...'
    });

  $scope.weekDays = {};

  function load() {
    $scope.weekDays = {};

    var date = moment('2015-11-16');
    for(var i = 0; i < 5; i++) {
      $scope.weekDays[date.format('YYYY-MM-DD')] = {
        date: date.format('dddd - DD.MM.YYYY'),
        realDate: date.format('YYYY-MM-DD'),
        minutes: 0
      };
      date.add(1, 'day');
    }

    var Checkin = Parse.Object.extend('CheckIn');
    var query = new Parse.Query(Checkin);
    query.equalTo('user', Parse.User.current());
    query.find({
      success: function(results) {
        //  console.log('results',JSON.stringify(results));
        for(var i = 0; i < results.length; i++) {
          var from = moment(results[i].get('from'));
          var to = moment(results[i].get('to'));
          console.log(from.format('YYYY-MM-DD'), to.diff(from, 'minutes'));

          $scope.weekDays[from.format('YYYY-MM-DD')].minutes += Math.abs(to.diff(from, 'minutes'));
        }
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      },
      error: function(error) {
        alert('Error: ' + error.code + ' ' + error.message);
      }
    });
  }
  load();

  $scope.load = load;
}).controller('DayController', function($scope, $stateParams, $ionicLoading) {
  console.log('day', $stateParams.date)


  $ionicLoading.show({
    template: 'Loading...'
  });


  $scope.day = {
    date: moment($stateParams.date).format('dddd - DD.MM.YYYY'),
    minutes: 0
  };

  $scope.checkins = [

  ];


  var Checkin = Parse.Object.extend('CheckIn');
  var query = new Parse.Query(Checkin);
  query.greaterThan('from', moment($stateParams.date).startOf('day').toDate());
  query.lessThan('to', moment($stateParams.date).endOf('day').toDate());
  query.equalTo('user', Parse.User.current());
  query.find({
    success: function(results) {
      //console.log('results',JSON.stringify(results));
      for(var i = 0; i < results.length; i++) {
        var from = moment(results[i].get('from'));
        var to = moment(results[i].get('to'));
        console.log(from.format('YYYY-MM-DD'), to.diff(from, 'minutes'));

        $scope.day.minutes += Math.abs(to.diff(from, 'minutes'));

        $scope.checkins.push({
          start: from.format('HH:mm'),
          to: from.format('HH:mm')
        })
      }
      $ionicLoading.hide();
    },
    error: function(error) {
      alert('Error: ' + error.code + ' ' + error.message);
    }
  });


})
