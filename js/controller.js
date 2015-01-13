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

          $scope.gameParent.newGame();
          $location.url('/game/new');
          $scope.$broadcast('updateState','');
     }
     $scope.$on('newGame',function(){
          $scope.newGame();
     })

}]);

reactiveController.controller('Game',['$scope', '$routeParams','$location', '$animate','ngDialog','$timeout',
function($scope, $routeParams,$location,$animate, ngDialog, $timeout) {


     $scope.command=$routeParams.command;
     $scope.game=$scope.$parent.gameParent;
     $scope.uiState={    multipolar:'',
                         bomb:'',
                         barSize:'',
                         barSizeAnimate:'anim',
                         blockClass:'',
                         currentTurn:''
     };
     $scope.currentLevel=0;               
     $scope.score=0;    

     if($scope.command=='continue'){
          $scope.game.continueGame();
          updateState("continue");
     }

     if($scope.command=='new' && $scope.game.getGameData()==undefined){
          $scope.game.newGame();
          updateState("new");
     }

     updateState("Main");
     $scope.multipolar=function(){
          $scope.game.bonus('multipolar');
          updateState("multipolar");
     }
     $scope.undo=function(){
          $scope.game.undo(); 
          updateState("undo"); 		
     }
     $scope.bomb=function(){
          $scope.game.bonus('bomb'); 		
          updateState("bomb");
     }  	

     $scope.turn=function(x,y){
          var r=$scope.game.turn(x,y);
          if(r.error.length==0){
               $timeout(function(){
                    $scope.game.popOutTurn();
                    updateState("turn");
               },500);               
          }
     }  	

     function updateState(caller){
          console.log('caller'+caller);
          if($scope.game.getGameData()!=undefined){
               $scope.uiState.multipolar=$scope.game.getGameData().bonus.multipolar.isActive?'active shake shake-constant':'shake';
               $scope.uiState.bomb=$scope.game.getGameData().bonus.bomb.isActive?'active shake':'shake';
               $scope.uiState.currentTurn=$scope.game.getGameData().bonus.bomb.isActive?'shake shake-constant':'';

               var totalThisLevel=$scope.game.getGameData().level.totalThisLevel;
               var toGo=$scope.game.getGameData().level.toGo;
               var barSize=$scope.uiState.barSize;
               var barSizeAnimate=$scope.uiState.barSizeAnimate;
               var emptyBlockMap=$scope.game.getEmptyBlockMap();

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

               //tentuka jika mau game over, di wiggle wiggleken
               if($scope.game.isGameOver()){
                    $scope.uiState.blockClass='gameOver';             
                    gameOverHandler();
               }else if(emptyBlockMap.length<=4){
                    $scope.uiState.blockClass='shake shake-little shake-constant';
               }else if(emptyBlockMap.length==1){ //game over
                    $scope.uiState.blockClass='shake shake-little shake-constant';
                    $scope.uiState.blockClass='shake shake-constant';             
               }else{
                    $scope.uiState.blockClass='';
               }

               //Dipanggil untuk multipolarismenya
               if($scope.game.getGameData().bonus.multipolar.isActive){
                    $scope.uiState.blockClass+=$scope.game.getGameData().turnValue[0]%2==0?' even-m':' odd-m';
               }
               if($scope.game.getGameData().bonus.bomb.isActive){
                    $scope.uiState.blockClass+='shake shake-hover';
               }
               $scope.uiState.barSizeAnimate=barSizeAnimate;
               $scope.uiState.barSize=barSize;
               // console.log(barSize+" "+barSizeAnimate+" "+totalThisLevel+" "+toGo);
          }
     }
     function gameOverHandler(){
          ngDialog.open({template:'html/_dialog-gameover.html',
                         scope:$scope
          });
     }

     $scope.openDialog=function(){
          ngDialog.open({template:'html/_dialog-gameover.html',
                        scope:$scope
          });
     }    
     $scope.getOddEvenStyle=function(j){
          var returnClass;
          if(j==0){
               returnClass=$scope.game.getGameData().turnValue[0]%2==0?'even number-hide':'odd number-hide';
               returnClass+=$scope.game.getGameData().turnValue[0]>999?' font-small':'';
          }else{
               returnClass=j%2==0?'even':'odd';
               returnClass+=j>999?' font-small':'';
          }
          return returnClass;
     }

     $scope.$on('updateState',function(event,e){
          updateState("broadcast");
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

reactiveController.controller('GameOver',['$scope', function($scope){

     $scope.gameData=$scope.$parent.$parent.game.getGameData();

     console.log($scope.gameData);
     $scope.newGame=function(){
          $scope.$emit('newGame');
          $scope.closeThisDialog();
     }
     $scope.maxCombo=function(){
          return $scope.gameData.combo.length!=0?Math.max.apply( Math, $scope.gameData.combo):0;
     }
}]);