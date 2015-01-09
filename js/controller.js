'use strict';

/*
  Kumpulan Library
  http://tobiasahlin.com/spinkit/ 
  http://www.minimamente.com/example/magic_animations/
  http://daneden.github.io/animate.css/
  https://github.com/lvivski/anima/tree/master/example
  http://bouncejs.com/#
  http://unicorn-ui.com/buttons/builder/
  http://anijs.github.io/
  http://elrumordelaluz.github.io/csshake/#1

  http://github.hubspot.com/odometer/docs/welcome/
  
*/

var reactiveController = angular.module('reactiveController',[]);
var modalInstance;
reactiveController.controller('GlobalCtrl', ['$scope', '$route','$location', function ($scope,$route,$location) {
  $scope.gameParent=new Game();

	$scope.newGame=function(){
      var map=$scope.gameParent.getGameData().gameMap;
      //inisialisasi
      map=new Array(c.bS);
      for(var i=0;i<c.bS;i++){
            map[i]=new Array(c.bS);
            for(var j=0;j<c.bS;j++){
               map[i][j]=0;
         }
      }

      
      $scope.gameParent.getGameData().gameMap=map;

      $scope.gameParent.newGame();
      $location.url('/game/new');
      $scope.gameParent.newGame();

      $scope.$broadcast('updateState','');
	}

}]);

reactiveController.controller('Game',['$scope', '$routeParams','$location',
  function($scope, $routeParams,$location) {
  

  	$scope.command=$routeParams.command;
  	$scope.game=$scope.$parent.gameParent;
  	$scope.uiState={multipolar:'',
  					        bomb:'',
                    barSize:'',
                    barSizeAnimate:'anim'
				           };
    $scope.currentLevel=0;               
    $scope.score=0;    

  	if($scope.command=='continue'){
  		$scope.game.continueGame();
      updateState();
  	}

    if($scope.command=='new' && $scope.game.getGameData()==undefined){
      $scope.game.newGame();
      updateState();
    }

    updateState();
  	$scope.multipolar=function(){
  		$scope.game.bonus('multipolar');
  		updateState();
  	}
  	$scope.undo=function(){
  		$scope.game.undo(); 
      updateState(); 		
  	}
  	$scope.bomb=function(){
   		$scope.game.bonus('bomb'); 		
  		updateState();
  	}  	

  	$scope.turn=function(x,y){
  		$scope.game.turn(x,y);
      updateState();
  	}  	

  	function updateState(){
      if($scope.game.getGameData()!=undefined){
        $scope.uiState.multipolar=$scope.game.getGameData().bonus.multipolar.isActive?'active shake shake-constant':'shake';
        $scope.uiState.bomb=$scope.game.getGameData().bonus.bomb.isActive?'active shake shake-constant':'shake';
        
        var totalThisLevel=$scope.game.getGameData().level.totalThisLevel;
        var toGo=$scope.game.getGameData().level.toGo;
        var barSize=$scope.uiState.barSize;
        var barSizeAnimate=$scope.uiState.barSizeAnimate;
        if(totalThisLevel==0){
          barSize=0;
        }else{
          if(toGo==totalThisLevel){
            barSizeAnimate='no-anim';
          }else{
            barSizeAnimate='anim';
          }
          var turn=totalThisLevel-toGo;
          barSize=Math.round(((turn*totalThisLevel+turn)/totalThisLevel)/(totalThisLevel)*100);
          if(barSize==99){
            barSize='100%';
          }else{
            barSize=barSize+'%';
          }
        }
        $scope.uiState.barSizeAnimate=barSizeAnimate;
        $scope.uiState.barSize=barSize;
        console.log(barSize+" "+barSizeAnimate+" "+totalThisLevel+" "+toGo);

      }
    }
    $scope.getOddEvenStyle=function(j){
      var returnClass;
      if(j==0){
        returnClass=$scope.game.getGameData().turnValue[0]%2==0?'even number-hide':'odd number-hide';
      }else{
        returnClass=j%2==0?'even':'odd';
      }

      return returnClass;
    }
    $scope.$on('updateState',function(event,e){
      updateState();
    });

}]);

reactiveController.controller('About',['$scope', function($scope){

}]);
reactiveController.controller('HighScore',['$scope', function($scope){

}]);
reactiveController.controller('Home',['$scope', function($scope){

}]);
reactiveController.controller('HowTo',['$scope','$http', function($scope, $http){

}]);