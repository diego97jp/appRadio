angular.module('radioCoomevaTV', ['ionic', 'ngCordova', 'radioCoomevaTV.controllers', 'cgBusy', 'ngAudio', "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls"])

.run(function($ionicPlatform, $cordovaStatusbar) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    //STATUS BAR
    $cordovaStatusbar.overlaysWebView(true)
    $cordovaStatusBar.style(3); //Black, opaque
    $cordovaStatusbar.show();
  });
})
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider

  .state('app', {
      url: '/app',
      abstract: true,
      cache: false,
      templateUrl: 'templates/tabs-menu.html',
      controller: 'AppCtrl'
    })

  .state('app.radios', {
      url: '/radios',
      cache: false,
      views: {
        'radio-tab': {
          templateUrl: 'templates/home.html'
        }
      }
    })
  .state('app.adulto', {
      url: '/adulto',
      cache: false,
      views: {
        'radio-tab': {
          templateUrl: 'templates/radios/adulto.html',
          controller: 'radioController'
        }
      }
    })

  .state('app.instrumental', {
      url: '/instrumental',
      cache: false,
      views: {
        'radio-tab': {
          templateUrl: 'templates/radios/instrumental.html',
          controller: 'radioController'
        }
      }
    })
  .state('app.jovenes', {
      url: '/jovenes',
      cache: false,
      views: {
        'radio-tab': {
          templateUrl: 'templates/radios/jovenes.html',
          controller: 'radioController'
        }
      }
    })

  .state('app.podcasts', {
      url: '/podcasts',
      views: {
        'podcast-tab': {
          templateUrl: 'templates/podcasts/podcasts.html',
          controller: 'podcastController'
        }
      }
    })
  .state('app.podcastCategory', {
      url: '/podcasts/{categoryName}/start-{start}/end-{end}',
      views: {
        'podcast-tab': {
          templateUrl: 'templates/podcasts/podcast.html',
          controller: 'podcastController'
        }
      }
    })

  .state('app.podcastPlayer', {
      url: '/podcasts/player/:podcastID',
      views: {
        'podcast-tab': {
          templateUrl: 'templates/podcasts/player.html',
          controller: 'podcastController',
        }
      }
    })

  .state('app.noticias', {
      url: '/noticias',
      views: {
        'notice-tab': {
          templateUrl: 'templates/noticias/newsList.html',
          controller: 'newsController'
        }
      }
    })

  .state('app.noticia', {
      url: '/noticia/:noticiaID',
      views: {
        'notice-tab': {
          templateUrl: 'templates/noticias/notice.html',
        }
      }
    })

  .state('app.programas', {
      url: '/programas',
      views: {
        'program-tab': {
          templateUrl: 'templates/programas/programs.html',
          controller: 'programController'
        }
      }
    })
  .state('app.programaCategory', {
      url: '/programas/:programaCategory',
      views: {
        'program-tab': {
          templateUrl: 'templates/programas/program.html',
          controller: 'programController'
        }
      }
    })

  .state('app.programPlayer', {
      url: '/programa/player/:programID',
      views: {
        'program-tab': {
          templateUrl: 'templates/programas/player.html',
          controller: 'programController'
        }
      },
    })

  .state('app.search', {
      url: '/search',
      views: {
        'search-tab': {
          templateUrl: 'templates/search.html',
          controller: 'searchController',
        }
      }
    })

    .state('app.help', {
        url: '/help',
        views: {
          'search-tab': {
            templateUrl: 'templates/help.html'
          }
        }
      })

      .state('app.about', {
          url: '/about',
          views: {
            'search-tab': {
              templateUrl: 'templates/about.html'
            }
          }
        })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/radios');

})
.controller('NavCtrl', function($scope, $ionicSideMenuDelegate){
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };

  /*$scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams){
    $scope.navigation.currentState = to.name;
    $scope.navigation.prevState = from.name;
    if($scope.navigation.currentState == 'app.radios' || $scope.navigation.currentState == 'app.podcasts' || $scope.navigation.currentState == 'app.noticias' || $scope.navigation.currentState == 'app.programas' || $scope.navigation.currentState == 'app.search'){
      $scope.navigation.showBackButton == false;
    }else{
      //$scope.navigation.showBackButton = true;
    }
    //console.log($scope.navigation);
  });*/
})
.controller('HomeTabCtrl', function($scope) {
});
