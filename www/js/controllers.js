angular.module('radioCoomevaTV.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicLoading){

  //Detect Platform
  $scope.isWebView = ionic.Platform.isWebView();
  $scope.isIPad = ionic.Platform.isIPad();
  $scope.isIOS = ionic.Platform.isIOS();
  $scope.isAndroid = ionic.Platform.isAndroid();
  $scope.isWindowsPhone = ionic.Platform.isWindowsPhone();

  $scope.currentPlatform = ionic.Platform.platform();

  //Select Spinner
  $scope.spinner = '<ion-spinner icon="spiral" class="spinner spinner-ios"></ion-spinner>';
  if($scope.isWebView) $scope.spinner = '<ion-spinner icon="spiral" class="spinner spinner-ios"></ion-spinner>';
  if($scope.isIPad || $scope.isIOS) $scope.spinner = '<ion-spinner icon="ios" class="spinner spinner-ios"></ion-spinner>';
  if($scope.isAndroid) $scope.spinner = '<ion-spinner icon="android" class="spinner spinner-ios"></ion-spinner>';

  //Loading Functions
  $scope.showLoading = function(){
    $ionicLoading.show({
      template: '<img src="images/loading.svg" />'
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };


  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html',{
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('radioController', function($window, $scope, $state, $http, $interval, $timeout, $location, ngAudio){
  //$window.location.reload(true);
  $scope.checkUpdate = null;
  $scope.player = {
    canPlay: false
  };

  $scope.radioPromises = {
    source: {promise: null, message: 'Cargando Fuente...', backdrop: false, templateUrl: 'templates/busy/playermetadata.html'},
    metadata: {promise: null, message: 'Cargando Datos canción...', backdrop: false, templateUrl: 'templates/busy/playermetadata.html'}
  }
  $scope.radioInformation = {
    currentRadio: $state.current.name,
    source: null,
    type: null,
    metadata: null,
    getSource: function(){
      var radioURI = $scope.radioInformation.currentRadio.split('.');
      $scope.radioPromises.source.promise = $http.get('http://67.205.125.38/radio-new/public/api/v1.0/'+radioURI[1]+'/get-source')
                                                 .then(function(response){
                                                   $scope.radioInformation.source = response.data.source;
                                                   $scope.radioInformation.type = response.data.type;
                                                   $scope.player = ngAudio.load($scope.radioInformation.source);
                                                   $scope.player.play();
                                                   $scope.player.setVolume(0.7);
                                                 });
    },
    getMetadata: function(){
      var radioURI = $scope.radioInformation.currentRadio.split('.');
      $scope.radioPromises.metadata.promise = $http.get('http://67.205.125.38/radio-new/public/api/v1.0/'+radioURI[1]+'/get-xml')
                                                   .then(function(response){
                                                     $scope.radioInformation.metadata = response.data;
                                                     $scope.radioCheck();
                                                   });
    },
    getMetadataNoPromise: function(){
      var radioURI = $scope.radioInformation.currentRadio.split('.');
      $http.get('http://67.205.125.38/radio-new/public/api/v1.0/'+radioURI[1]+'/get-xml')
           .then(function(response){
             $scope.changeMetadata = $timeout(function(){
               $scope.radioInformation.metadata = response.data;
               $timeout.cancel($scope.changeMetadata);
             }, 10000);
             /*$http.get(response.data.current.album_art)
                  .then(function(response){
                    console.log('Image Response: ' + response);
                  });*/
           });
    }
  };

  $scope.playPause = function(){
    if($scope.player.canPlay){
      if($scope.player.paused){
          $scope.player.play();
      }else{
        $scope.player.stop();
      }
    }
  };

  $scope.radioInit = function(){
    $scope.radioInformation.getSource();
    $scope.radioInformation.getMetadata();
  };
  $scope.radioInit();

  $scope.radioCheck = function(){
    $scope.checkUpdate = $interval(function(){
      $scope.radioInformation.getMetadataNoPromise();
    }, 1000);
  };

  $scope.$on("$locationChangeStart",function(event, next, current){
    if($scope.player.canPlay){
      if(!$scope.player.paused){
        $scope.player.stop();
      }
    }else{
      $scope.radioPromises.source.promise == null;
      $scope.radioPromises.metadata.promise == null;
    }
    $timeout.cancel($scope.changeMetadata);
    $interval.cancel($scope.checkUpdate);
  });

  $scope.getClass = function (path) {
    if ($location.path().substr(0, path.length) === path) {
      return 'active';
    } else {
      return '';
    }
  }
})
.controller('podcastController', function($scope, $stateParams, $state, $http, ngAudio, $sce) {

  $scope.podcastName = $stateParams.categoryName;
  $scope.podcastCategories = null;
  $scope.podcastsList = null;
  $scope.podcasts = null;
  $scope.podcastCategoryName = null;
  $scope.podcast = null;
  $scope.videoPlayer = {
    instance: null,
    config: {
      autoHide: false,
			autoHideTime: 3000,
			autoPlay: true,
      theme: {
					url: "lib/videogular-themes-default/videogular.css"
			},
    },
    sources: null
  };
  $scope.podcastPlayer = null;
  $scope.playerActions = null;
  $scope.isAudio = false;
  $scope.isVideo = false;
  $scope.videoPlayer.fullScreen = function(){
    $scope.videoPlayer.instance.toggleFullScreen();
  };
  $scope.playerActions = {
    getAudio: function(){
      if($scope.isAudio){
        $scope.podcastPlayer = ngAudio.load($scope.podcast.local_media);
        $scope.podcastPlayer.play();
      }
    },
    audioPlayPause: function(){},
    getVideo: function(){

    },
    videoPlayPause: function(){},
    videoReady: function(API){
      $scope.videoPlayer.instance = API;
      $scope.videoPlayer.instance.config = $scope.videoPlayer.config;
    }
  }
  $scope.podcastsList = {
    getListCategory: function(){
      $scope.showLoading();
      $http.get('http://67.205.125.38/radio-new/public/api/v1.0/podcasts/lista-categorias')
           .then(function(response){
             $scope.podcastCategories = response.data;
             $scope.hideLoading();
           });
    },
    getPodcastByCategory: function(){
      $scope.showLoading();
      $http.get('http://radio.coomeva.com.co/live/api/podcast.php?bySubCategory='+$stateParams.categoryName+'&start='+$stateParams.start+'&end='+$stateParams.end)
           .then(function(response){
             $scope.podcasts = response.data;
             $scope.podcastCategoryName = response.data[0].subcategoria;
             $scope.hideLoading();
           });
    },
    getPodcast: function(){
      $scope.showLoading();
      $http.get('http://radio.coomeva.com.co/live/api/podcast.php?byId=' + $stateParams.podcastID)
           .then(function(response){
             $scope.podcast = response.data[0];

             if($scope.podcast != null){
               if($scope.podcast.local_media.indexOf('mp3') > 0){
                 $scope.podcast.local_media = 'http://www.letio.com/files/idc40/radiocoomeva/podcasts/audio/'+$scope.podcast.local_media;
                 $scope.isAudio = true;
                 $scope.isVideo = false;
                 $scope.playerActions.getAudio();
               }else if($scope.podcast.local_media.indexOf('mp4') > 0){
                 $scope.podcast.local_media = 'http://www.letio.com/files/idc40/radiocoomeva/podcasts/video/'+$scope.podcast.local_media;
                 $scope.videoPlayer.sources = [
                   {src: $sce.trustAsResourceUrl($scope.podcast.local_media), type: "video/mp4"}
                 ]
                 $scope.isAudio = false;
                 $scope.isVideo = true;
                 $scope.playerActions.getVideo();
               }else{
                 console.log('isNaN');
               }
             }else{
               $state.go('app.podcasts');
             }
             $scope.hideLoading();
           });
    },
  };

  $scope.showPodcast = function(item){
    $scope.podcast = item;
    $state.go('app.podcastPlayer', {podcastID: item.id});
  }
  $scope.$on('$stateChangeStart', function( event, toState, toParams, fromState, fromParams ){
    if($scope.isAudio){
      if($scope.podcast != null && $state.current.name == 'app.podcast'){
        if($scope.podcastPlayer.canPlay && !$scope.podcastPlayer.paused){
          $scope.podcastPlayer.stop();
          $scope.podcastPlayer = null;
        }
      }
    }
  });

  $scope.podcastsList.getListCategory();

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
})
.controller('newsController', function($scope, $stateParams, $http, $state) {

  $scope.listNews = null;
  $scope.notice = null;

  $scope.listNews = {
    list: null,
    getList: function(){
      $scope.showLoading();
      $http.get('http://radio.coomeva.com.co/live/api/noticias.php?getAll=1')
           .then(function(response){
             $scope.listNews.list = response.data;
             $scope.hideLoading();
           });
    },
    getNotice: function(){
      $scope.showLoading();
      console.log($stateParams.noticiaID);
      $http.get('http://radio.coomeva.com.co/live/api/noticias.php?getOne='+$stateParams.noticiaID)
           .then(function(response){
             $scope.notice = response.data[0];
             console.log($scope.notice);
             $scope.hideLoading();
           });
    }
  };

  $scope.showNotice = function(item){
    $scope.podcast = item;
    $state.go('app.noticia', {noticiaID: item.id});
  }
})
.controller('programController', function($scope, $stateParams, $state, $http, ngAudio, $sce){

  $scope.programName = $stateParams.categoryName;
  $scope.programCategories = null;
  $scope.programsList = null;
  $scope.programs = null;
  $scope.programCategoryName = null;
  $scope.program = null;
  $scope.programPlayer = null;
  $scope.interface = {};
  $scope.playerActions = null;
  $scope.videoPlayer = {
    instance: null,
    config: {
      autoHide: false,
			autoHideTime: 3000,
			autoPlay: true,
      theme: {
					url: "lib/videogular-themes-default/videogular.css"
			},
    },
    sources: null
  };

  $scope.playerActions = {
    getAudio: function(){
      $scope.programPlayer = ngAudio.load($scope.program.media);
      $scope.programPlayer.play();
    },
    audioPlayPause: function(){

    },
    getVideo: function(){

    },
    videoPlayPause: function(){

    }
  }
  $scope.programsList = {
    getListCategory: function(){
      $scope.showLoading();
      $http.get('http://67.205.125.38/radio-new/public/api/v1.0/programas/lista-programas')
           .then(function(response){
             $scope.programCategories = response.data;
             $scope.hideLoading();
           });
    },
    getprogramByCategory: function(){
      $scope.showLoading();
      $http.get('http://67.205.125.38/radio-new/public/api/v1.0/programas/programa/'+$stateParams.programaCategory)
           .then(function(response){
             $scope.programs = response.data;
             $scope.programCategoryName = response.data[0].catName;
             $scope.hideLoading();
           });
    },
    getprogram: function(){
      $scope.showLoading();
      $http.get('http://67.205.125.38/radio-new/public/api/v1.0/programas/programa/' + $stateParams.programID)
           .then(function(response){
             $scope.program = response.data[0];
             console.log($stateParams.programID);
             console.log($scope.program);
             if($scope.program != null){
               if($scope.program.media.indexOf('mp3') > 0){
                 $scope.isAudio = true;
                 $scope.isVideo = false;
                 $scope.playerActions.getAudio();
               }else if($scope.program.media.indexOf('mp4') > 0){
                 $scope.videoPlayer.sources = [
                   {src: $sce.trustAsResourceUrl($scope.program.media), type: "video/mp4"}
                 ]
                 $scope.isAudio = false;
                 $scope.isVideo = true;
                 $scope.playerActions.getVideo();
               }else{
                 console.log('isNaN');
               }
             }else{
               $state.go('app.programas');
             }
             $scope.hideLoading();
           });
    },
  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };

  $scope.showProgram = function(item){
    $scope.program = item;
    console.log(item);
    $state.go('app.programPlayer', {programID: item.id});
  }

  $scope.$on('$stateChangeStart', function( event, toState, toParams, fromState, fromParams ){
    if($scope.program != null && $state.current.name == 'app.programa'){
      if($scope.programPlayer.canPlay && !$scope.programPlayer.paused){
        $scope.programPlayer.stop();
        $scope.programPlayer = null;
      }
    }
  });

  $scope.programsList.getListCategory();
})
.controller('searchController', function($scope, $http) {

  $scope.search = {
    term: null,
    notices: null,
    podcasts: null,
    getResults: function(term){
      $http.get('http://radio.coomeva.com.co/live/api/noticias.php?getTerm=' + term)
           .then(function(response){
             $scope.search.notices = response.data;
           });
     $http.get('http://radio.coomeva.com.co/live/api/podcast.php?byTerm=' + term)
          .then(function(response){
            $scope.search.podcasts = response.data;
          });
    },
  }
})
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
});


