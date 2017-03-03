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
reactiveController.controller('GlobalCtrl', ['$scope', '$route','$location','scoreService','$rootScope', function ($scope,$route,$location,scoreService,$rootScope) {
     $scope.gameParent=new Game();
     $rootScope.loadingView="";
     // $scope.isMenuActive=false;
     $scope.newGame=function(){

          $scope.gameParent.newGame();
          $location.url('/game/new');
          $scope.$broadcast('updateState','');
     }
     $scope.newGameAndHideMenu=function(){
          $scope.newGame();
          $scope.isMenuActive=!$scope.isMenuActive;
     }
     $scope.$on('newGame',function(){
          $scope.newGame();
     })
     $scope.$on('hideMenu',function(){
          $scope.isMenuActive=false;
     })
     $scope.$on('gameOver',function(){          
          var gameData=$scope.gameParent.getGameData();
          var maxCombo=gameData.combo.length!=0?Math.max.apply( Math, gameData.combo):0;
          if(maxCombo==undefined){
               maxCombo=0;
          }
          scoreService.saveHighScore({score:gameData.score,
                                      date:new Date(),
                                      level:gameData.level.current,
                                      max_combo:maxCombo,
                                      turn:gameData.turn.turnCount 
                                      });
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
     $scope.jValue;    

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
     $scope.mouseOver=function(j){
          if(j==0){
              j=$scope.uiState.currentTurn;
          }
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
          // console.log('caller'+caller);
          $scope.$emit('hideMenu');
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
                    $scope.$emit('gameOver');             
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
reactiveController.controller('HighScore',['$scope','scoreService', function($scope,scoreService){
     $scope.isHaveScore=scoreService.getPageCount()==0?false:true;

     $scope.scoreList=[];
     $scope.highscore=scoreService.getHighestScore();
     $scope.pageCount=0;
     $scope.sortBy="";
     $scope.page=1;
     $scope.isDesc=true;
     
     $scope.setList=function(sort,page){
          var desc='';
          if(sort==undefined){
               sort=$scope.sortBy;
          }
          if(page==undefined){
               page=$scope.page;
          }
          if($scope.isDesc){
               desc='-';
          }else{
               desc='';
          }
          $scope.scoreList=scoreService.getList(desc+sort,page);
          
          $scope.sortBy=sort;
          $scope.page=page;
     }
     $scope.sort=function(sort){
          if(sort==$scope.sortBy){
               $scope.isDesc=!$scope.isDesc;
          }
          // console.log(sort+' '+$scope.sortBy);
          $scope.setList(sort,$scope.page);

     }
     $scope.setPageCount=function(){
          $scope.pageCount=scoreService.getPageCount();
     }

     $scope.setPageCount();
     $scope.setList('-score',1); 

     $scope.next=function(){
          if($scope.page!=scoreService.getPageCount()){
               $scope.page=$scope.page+1;               
          }
          $scope.setList(undefined,undefined);
     }
     $scope.prev=function(){
          if($scope.page!=1){
               $scope.page=$scope.page-1;               
          }         
          $scope.setList(undefined,undefined);
     }

}]);
reactiveController.controller('Home',['$scope', function($scope){

}]);
reactiveController.controller('HowTo',['$scope','$http', function($scope, $http){
     $scope.langId='hide';
     $scope.langEng='show';
     $scope.changeLang=function(lang){
          if(lang=='id'){
               $scope.langId='show';
               $scope.langEng='hide';               
          }else if(lang=='en'){
               $scope.langId='hide';
               $scope.langEng='show';
          }
     }

}]);

reactiveController.controller('GameOver',['$scope','scoreService', function($scope,scoreService){

     $scope.gameData=$scope.$parent.$parent.game.getGameData();

     // console.log($scope.gameData);
     $scope.newGame=function(){
          $scope.$emit('newGame');
          $scope.closeThisDialog();
     }
     $scope.maxCombo=function(){
          return $scope.gameData.combo.length!=0?Math.max.apply( Math, $scope.gameData.combo):0;
     }
     $scope.getMotivationalText=function(){
          var score=$scope.gameData.score;
          fillHighScore();

          if(isHighScore()){
               // console.log('HighScore');
               return "New Highscore, Stunning!"
          }
          if(score<10000){
               return "Don't Worry, You can get higher";
          }else if(score>=10000 && score<15000){
               return "Good Job, you're doing great";
          }else if(score>=15000 && score<30000){
               return "Fantastic, Keep it up!";
          }else if(score>=30000 && score<80000){
               return "You're Amazing! Congrats";
          }else if(score>=80000){
               return "It's Unbelievable! You're Extraordinary";
          }else{
               return "Keep it up!";
          }
          //Numpang dieksekusi, mengingat lokasinya diatas dan dieksekusi lebih dulu

     }
     function isHighScore(){
          var gameData=$scope.gameData;

          if(gameData.score!=$scope.highScore_score){
               // console.log(gameData.score+' '+$scope.highScore_score);
               return false;
          }
          if(gameData.turn.turnCount!=$scope.highScore_turn){
               // console.log(gameData.score+' '+$scope.highScore_score);
               return false;
          }
          if(gameData.level.current!=$scope.highScore_level){
               // console.log(gameData.level.current+' '+$scope.highScore_score);
               return false;
          }
          if($scope.maxCombo()!=$scope.highScore_maxCombo){
               // console.log(gameData.maxCombo()+' '+$scope.highScore_maxCombo);
               return false;
          }
          return true;                   
     }
     $scope.saveScore=function(){

     }
     $scope.haveHighScore=true;
     $scope.highScore_score=0;
     $scope.highScore_maxCombo=0;
     $scope.highScore_turn=0;
     $scope.highScore_level=0;
     $scope.highScore_date=0;

     function fillHighScore(){
          var highest=scoreService.getHighestScore();
          if(highest==undefined){
               $scope.haveHighScore=false;
          }else{
               $scope.haveHighScore=true;
               $scope.highScore_score=highest.score;
               $scope.highScore_maxCombo=highest.max_combo;
               $scope.highScore_turn=highest.turn;
               $scope.highScore_level=highest.level;
               $scope.highScore_date=highest.date;
          }
     }
}]);