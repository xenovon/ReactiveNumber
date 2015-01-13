 /*Game Design Documentation 
   Reactive Number
   By : Adnan HP

   TESTING A
   -> Peningkatan Kesulitan berdasarkan rentang angka yang muncul lebih besar seiring peningkatan level. 
   -> Jumlah yang popout tetap, yakni 1

   Testing B
   -> Peningkatan kesulitan berdasarkan jumlah yang popout
   -> Rentang angka tetap

   Testing C
   -> Gabungan A dan B
   Rule 
   1. Game terdiri dari kotak 9x9
   2. Diawal permainan ada 10 kotak yang terisi angka, dengan posisi acak dan angka acak 1-10.
   3. Buat 4 array angka acak 1-10, dan secara berurut dijadikan sebagai angka baru yang masuk ke 
   	  kotak
   4. Tiap meletakan angka ke kotak, maka angka sekelilingnya, 
   	akan bereaksi. Jika sama-sama ganjil/genap, maka angka sekelilingnya akan berkurang dan akan 
   	bertambah jika beda ganjil/genap. Angka yang berkurang dijadikan sebagai Score. Angka yang 
   	bertambah akan menambah tingkat kesulitan game. Jika angka setelah dikurangi <=0, maka angka 
   	akan hilang. 
   	  

   	Misinya adalah, hilangkan angka sebanyak mungkin dan minimalisir angka yang bertambah. 
      Game berakhir ketika papan penuh.
   5. Sistem Level
   	  Level Akan bertambah setelah x giliran. 
   	  Level 1 : 10 Giliran Pertama , range angka 1-10
   	  Level 2 : 15 Giliran Kedua, range angka 3-15
   	  Level 3 : 20 Giliran ketiga, range angka 5-20
   	  Level 4 : 25 Giliran keempat, range angka 7-25
   	  Level 5 : 30 Giliran kelima, range angka 9-30
   	  Level 6 : 35 Giliran keenam, range angka 11-35
   	  Level 7 : 40 Giliran ketuju, range angka 13-40
 	     dst
        Formula
        Sisa giliran= Jumlah giliran level berjalan - Level*5+5;
        Range Angka = [level*2-1]-[Level*5+5]
   4. Bonus : Multipolar : Bisa mengurangi baik angka ganjil maupun genap. (tidak ada angka bertambah)
			   			  : Syarat,  combo 6x;
			   Undo 	     : Mengembalikan  posisi kesebelumnya 
			   			  : Syarat awal 2 kali undo, tapi bisa bertambah. ketika nambah level. 
			   Bomb	     : Menghilangkan semua angka disekliling, 
			   			  :  Syarat : Bisa ngilangin angka >=4
      Bonus bisa dipakai ketika jumlahnya masih ada. 
   5. Score sesuai dengan jumlah pengurangan yg terjadi, dan dikalikan level.
   6. Bisa nyimpen score, untuk nyimpen, masukan nama, email atau social media.
   7. Jika udah nyimpen, bisa login
   8. Share ke facebook.
   
   Ketentuan Teknis
   1. Tiap ada perubahan, maka langsung disimpan di local storage
   2. Fast dan akurat
   3. Variabel obyek Game yang dibutuhkan
      a. Score
      b. Level {Level saat ini, level sisa giliran}
      c. List Combo
      d. Bonus {Nama Bonus, Jumlah Bonus, State (aktif apa ngga)}
      e. Game Map : Pemetaan posisi angka2 dalam board( array 2 dimensi).
      f. History : History untuk undo, cukup 1 yang disimpen
      g. Jumlah Giliran total, dan jumlah giliran level berjalan
      h. Range Angka acak
   4. Maksimalkan animasi dan clue visual

*/
var c={'bS':7, //BoardSize
       'bombMin':5, //JUmlah minimal kotak ilang untuk bisa dapet bomb;
       'mulMin':6, //jumlah combo yang bisa dapet multipolar;
       'sKey':'nananabatman', //kunci untuk local storage dan enkripsi
       'match':5, //variabel untuk ngacak kata
       'popCount':1,//jumlah angka yang muncul entah darimana ketika turn
       'undoStart':2, //Jumlah undo awal
       'initCount':5//Jumlah angka random diawal.
};
/* Fungsi Utama Game */
function GameData(){

   this.score=0;
   this.level={'current':0,'toGo':0,'totalThisLevel':0};
   this.comboCount=0;
   this.combo=[];
   this.bonus={
      multipolar:{count:1,isActive:false},
      undo:{count:c.undoStart},
      bomb:{count:1,isActive:false}
   }
   this.emptyBlockMap=[]; //key value array untuk memetakan kotak kosong di board. 
   this.gameMap=[];
   this.turn={'turnCount':0, 'turnCurrentLevel':0};
   this.turnValue=[0,0,0,0];
   this.scores=0; //Variabel untuk validasi game save. Untuk keamanan, biar orang gabisa ubah2 sembarangan.
}

function Game(){
   var gameData;
   var gameHistory=[]; //menyimpan array value sebelumnya
                        //Setiap ada perubahan pada board, maka variabel itu diubah juga. 
   var keyGameData=enc(c.sKey+''+c.sKey);
   var keyGameHistory=enc(c.sKey+''+c.sKey+''+c.sKey);

   this.getGameData=function(){return gameData};
   this.getGameHistory=function(){return gameHistory};
   this.getEmptyBlockMap=function(){return gameData.emptyBlockMap};

   /*-------------- Public Method-------------- */
   this.newGame=function(){
      gameHistory=[];

      gameData=new GameData();
      gameData.emptyBlockMap=[];
      var map=gameData.gameMap;
      //inisialisasi
      map=new Array(c.bS);
      for(i=0;i<c.bS;i++){
            map[i]=new Array(c.bS);
            for(j=0;j<c.bS;j++){
               map[i][j]=0;
         }
      }


      for(var i=0;i<4;i++){
         gameData.turnValue[i]=getRandomInt(1,11);
      }
      gameData.gameMap=map;
      //inisialisasi gameMap
      for(i=0;i<c.bS;i++){
            for(j=0;j<c.bS;j++){
               updateBlockMap(i,j);
         }
      }
      //inisialisasi 15 angka di kordinat acak dan turn value
      popOut(c.initCount);
      //inisialisasi angka level togo
      gameData.level.toGo=10;

      // Uji Coba
      // for(i=0;i<c.bS;i++){
      //       for(j=0;j<c.bS;j++){
      //          console.log(map[i][j]);
      //    }
      //    console.log();
      // } 
      // console.log(gameData.turnValue);     
   }
   this.popOutTurn=function(){
      var count=0;
      var level=gameData.level.current;

      // if(level<3) count=1;
      // if(level>=3 && level<7) count=2;
      // if(level>=7 && level<10) count=3;
      // if(level>=10) count=4;

      console.log(count+' '+level);
      popOut(c.popCount);
      save();
   }
   /*Continue game*/
   this.isHasContinue=function(){
      if(localStorage.getItem(keyGameData)!=undefined){
         return true;
      }else{
         return false;
      }
   }
   this.continueGame=function(){

      var temp=localStorage.getItem(keyGameData);
      var temp2=localStorage.getItem(keyGameHistory);

      if(temp!=undefined && temp2!=undefined){
         gameData=JSON.parse(enc(temp));
         if(!isScoresValid()){
            this.newGame();
         }else{
            gameHistory=JSON.parse(enc(temp2));
         }
      }else{
         this.newGame();
      }
   }
   /*
      Fungsi untuk mengolah permainan
      Step 1: validasi x dan y, harus lebih kecil dari ukuran board dan validasi  bahwa board kosong.
      Step 2: Simpan riwayat dan check keaktifan Power Ups 
      Step 3: Hitung dan ubah data angka disekitar x dan y pada variabel gameMap
              angka yang berefek diberi rumus  
              f'(x,y)=x-1;f'(x,y)=y-1;f'(x,y)=y-1,x-1;
              f'(x,y)=x+1;f'(x,y)=y+1;f'(x,y)=y+1,x+1;
              Hitung jumlah angka yang hilang,
      Step 4: Tambahkan jumlah score
              Perhitungan Score : (Jumlah Selisih angka yang berkurang)*Combo; untuk combo >= 1;
      Step 5: Manipulasi jumlah kombo 
      Step 6: Evaluasi Level
      Step 7: Evaluasi bonus dan apakah  sesuai aturan.
      Step 8: Mengisi angka untuk pergerakan selanjutnya dan menghasilkan angka random muncul entah darimana
      Step 9: Simpan history dan save ke local storage
   */
   this.turn=function(x,y){
      console.time('turn');
      var r={'error':[],
             'state':'',
             'score':0,
             'isGameOver':false //status apakah game over atau tidak
            };
      var gameMap= gameData.gameMap;
      x=parseInt(x);
      y=parseInt(y);

      //Step 1  bs= Board size
      //cek kevalidan posisi
      if(!isInTheBox(x,y)){
         r.error.push(1);
         return r;
      }
      //Cek apakah x dan y kosong atau tidak
      if(gameMap[x][y]!=0){
         r.error.push(1);
         return r;
      }
      //Step 2
      if(gameHistory.length>50){
        gameHistory.pop();         
      }
      gameHistory.unshift(JSON.stringify(gameData));


      multipolar= gameData.bonus.multipolar.isActive;
      bomb= gameData.bonus.bomb.isActive;

      //step 3
      gameMap[x][y]=gameData.turnValue[0]; 
      updateBlockMap(x,y);
      // console.log(gameMap[x][y]);
      var isBonusActive=false;
      if(bomb){
         r.state=turnCounting(gameMap,'bomb',x,y);

         //Evaluasi jumlah bomb
         isBonusActive=gameData.bonus.bomb.isActive;
         gameData.bonus.bomb.count--;
         gameData.bonus.bomb.isActive=false;

      }
      else if(multipolar){
         r.state=turnCounting(gameMap,'mul',x,y);

         //evaluasi jumlah multipolar
         isBonusActive=gameData.bonus.multipolar.isActive;
         gameData.bonus.multipolar.count--;
         gameData.bonus.multipolar.isActive=false;

      }else{
         r.state=turnCounting(gameMap,'nor',x,y);
      }

      //Step 4
      var result=countScore(r.state,  gameData.comboCount);
      r.score=result.scoreTotal;
      gameData.score=gameData.score+r.score;
      //Tambah jumlah multipolar

      //step 7
      if(result.scoreCount>=c.bombMin && !isBonusActive ){ 
         gameData.bonus.bomb.count++;         
      }
      /*
      Step 5
      Jika pada giliran ini membuat score, maka dihitung sebagai combo
      JIka tidak, maka combo direset, dan history disimpan. */
      var combo=gameData.comboCount;

      if(isCombo(r.state)){
         gameData.comboCount=combo+1;
         if(gameData.comboCount==c.mulMin){ //step 7
            //Tambah jumlah Bomb
            gameData.bonus.multipolar.count++; 
         }
      }else{
         if(gameData.comboCount!=0){
            gameData.combo.push(gameData.comboCount);
            gameData.comboCount=0;            
         }
      }

      /*
      Step 6  Evaluasi level
      */
      levelEvaluation();

      /* 
         Step 8; Next step generator
        Range Angka = [level*2-1]-[Level*5+5]
      */
      var level=gameData.level.current;
      gameData.turnValue.shift();
      gameData.turnValue.push(getRandomInt(getMinValueTurn(),getMaxValueTurn()));


      // popOut(c.popCount);
      /*
         Step 9
      */
      save();


      r.isGameOver=this.isGameOver();
      // console.log(JSON.stringify(emptyBlockMap)+' '+r.isGameOver);
      console.log('kotak kosong '+gameData.emptyBlockMap.length)
      console.timeEnd('turn');
      
      return r;
   }

   //Mengembalikan apakah kotak dengan kordinat x dan y kosong atau tidak
   this.isBoxEmpty=function(x,y){
      if(gameData.gameMap[x][y]!=0){
         return false;
      }else{
         return true;
      }
   }

   //mengembalikan angka mana yang berkurang dan mana yang bertambah
   //Versi cepat dari turn()
   //Mengembalikan nilai state (lihat method turnCounting)
   this.turnPreview=function(x,y){
      //Step 2
      var multipolar=gameData.bonus.multipolar.isActive;
      var bomb=gameData.bonus.bomb.isActive;
    
      if(bomb){
        return turnCounting(gameMap,'bomb',x,y,true);
      }
      else if(multipolar){
         return turnCounting(gameMap,'mul',x,y,true);
      }else{
         return turnCounting(gameMap,'nor',x,y,true);
      }

   }   
   this.undo=function(){
      if(this.isCanUndo()){
         var currentUndo=gameData.bonus.undo.count;
         gameData=JSON.parse(gameHistory.shift());
         currentUndo--;
         gameData.bonus.undo.count=currentUndo;
      }
   }
   this.isCanUndo=function(){
      if(gameHistory==undefined){
         return false;
      }
      if(gameHistory.length>0 && gameData.bonus.undo.count > 0){
         return true;
      }else{
         return false;
      }  
   }
   /*
   Fungsi untuk mengaktifkan dan menonaktifkan bonus
      Multipolar 
      Bomb
   */
   this.bonus=function(bonusId){
      var bonus=gameData.bonus;
      if(!(bonusId=='multipolar' || bonusId=='bomb')){
         return false;
      }

      var active=bonus[bonusId].isActive;
      var count=bonus[bonusId].count;

      if(count<1){
         active=false;
      }else{
         if(active){
            active=false;                          
         }else{
            active=true;
         }
      }
      bonus[bonusId].isActive=active;
      if(active){
         bonusId=='multipolar'?bonus.bomb.isActive=false:'';
         bonusId=='bomb'?bonus.multipolar.isActive=false:'';
      }
      return active;
   }

   /*-------------- Private Method-------------- */
   //Untuk memastikan angka random yang udah muncul, ngga muncul lagi
   function isDuplicate(x,y,array){
      var search=x+''+y;
      var i = a.length;
      while (i--) {
         if (a[i] === obj) {
            return true;
         }
      }
      return false;
   }
   //Untuk menghasilkan angka acak berbatas pada lokasi acak di board
   function popOut(popCount){
      var count=0;
      var iter=0;
      var level=gameData.level.current;
          level=level==0?level+1:level;  //jika level masih 0, maka tambah 1, akomodasi untuk fungsi new game
      var map=gameData.gameMap;

      //populasikan array
      while(!(count==popCount)){
         var selected=gameData.emptyBlockMap[getRandomInt(0,gameData.emptyBlockMap.length)];
         if(selected==undefined){
            break;
         }
         var x=parseInt(selected.split('.')[0]);
         var y=parseInt(selected.split('.')[1]);
            // map[x][y]=getRandomInt(20,55); //sesuai batas level
         map[x][y]=getRandomInt(getMinValueTurn(),getMaxValueTurn()); //sesuai batas level
         updateBlockMap(x,y);
         count++;
         iter++;
         if(iter>1000){break;} //pengaaman
      }



   }
    // Web Storage simply provides a key-value mapping, e.g. localStorage["name"] = username;. Unfortunately, present implementations only support string-to-string mappings, so you need to serialise and de-serialise other data structures. You can do so using JSON.stringify() and JSON.parse().

   function save(){
      //update scores dulu.
      console.time('turn');
 
      generateScores();
      localStorage.setItem(keyGameData,enc(JSON.stringify(gameData)));
      localStorage.setItem(keyGameHistory,enc(JSON.stringify(gameHistory)));
      console.log("saved")
      console.timeEnd('turn');

      // console.log('gennerate scores aktif');
   }
   function enc(uncoded) {
       var key = 100; //Any integer value
       var result = "";
       var key=c.match;
       for(i=0; i<uncoded.length;i++)
       {
           result += String.fromCharCode(key^uncoded.charCodeAt(i));
       }
      return result;  
   }  

   /* Menghitung apakah game over atau tidak */
   this.isGameOver=function(){
      // console.log(!(emptyBlockMap.length==0));

      if(!(gameData.emptyBlockMap.length==0)){
         return false;
      }
      // for(i=0;i<c.bS;i++){
      //       for(j=0;j<c.bS;j++){
      //          if(gameData.gameMap[i][j]==0){
      //             return false;
      //          }
      //    }
      // }
      //Hapus save game
      gameData.bonus.undo.count=0;     
      clearStorage();

      // var map=gameData.gameMap;
      // //inisialisasi
      // map=new Array(c.bS);
      // for(i=0;i<c.bS;i++){
      //       map[i]=new Array(c.bS);
      //       for(j=0;j<c.bS;j++){
      //          map[i][j]=0;
      //    }
      // }
      // gameData.gameMap=map;
      return true;

   }
   function clearStorage(){
      localStorage.removeItem(keyGameHistory);
      localStorage.removeItem(keyGameData);
      delete localStorage[keyGameData];
      delete localStorage[keyGameHistory];
      console.log('deleted');
      gameHistory=[];

   }
   /* Blok fungsi untuk melakukan perhitungan validator--------------------- */
   function aa(a,b,c){
      return a*b*c+(a-c*b);
   }
   function bb(b,c,d){
      return b+c+d;
   } 
   function cc(c,d,e){
      return c*d+e;
   }
   function dd(d,e,f){
      return cc(e,d,d)+aa(f,e,e);
   }
   function generateScores(){
      var a=gameData.score;
      var b=gameData.level.current;
      var c=gameData.comboCount;
      var d=gameData.bonus.multipolar.count;
      var e=gameData.level.toGo;
      var f=gameData.turn.turnCount;
      // console.log(a+' '+b+' '+c+' '+d+' '+e+' '+f);
      gameData.scores=aa(a,b,c)+bb(b,c,e)+cc(c,d,e)-dd(d,e,f);
   }
   function isScoresValid(){
      var a=gameData.score;
      var b=gameData.level.current;
      var c=gameData.comboCount;
      var d=gameData.bonus.multipolar.count;
      var e=gameData.level.toGo;
      var f=gameData.turn.turnCount;

      return gameData.scores==aa(a,b,c)+bb(b,c,e)+cc(c,d,e)-dd(d,e,f)?true:false;
   }
   /* End Blok fungsi untuk melakukan perhitungan validator--------------------- */

   //Untuk evaluasi level dan aturan level
   /*
   5. Sistem Level
        Level Akan bertambah setelah x giliran. 
        Level 1 : 10 Giliran Pertama , range angka 1-10
        Level 2 : 15 Giliran Kedua, range angka 3-15
        Level 3 : 20 Giliran ketiga, range angka 5-20
        Level 4 : 25 Giliran keempat, range angka 7-25
        Level 5 : 30 Giliran kelima, range angka 9-30
        Level 6 : 35 Giliran keenam, range angka 11-35
        Level 7 : 40 Giliran ketuju, range angka 13-40
        dst
        Formula
        Sisa giliran= Jumlah giliran level berjalan - Level*5+5;
        Range Angka = [level*2-1]-[Level*5+5]
   */
   function countLevel(currentLevel){
      return currentLevel*5+5;
   }
   function levelEvaluation(){

      var currentLevel=gameData.level.current;
      var turnToGo=gameData.level.toGo;
      var totalTurn=countLevel(currentLevel);
      var turnCount=gameData.turn.turnCount;
      var turnCurrentLevel=gameData.turn.turnCurrentLevel;
      var totalThisLevel=gameData.level.totalThisLevel;
      //Jika game baru mulai, level==0;
      if(currentLevel==0){

         currentLevel=1;
         turnToGo=countLevel(currentLevel);
         turnCount=0;
         turnCurrentLevel=1;
         totalThisLevel=10;

      }

      remain=totalTurn-turnToGo;

      //Jika sisa == 0 maka level ditambah 1 dan direset.
      if(remain==totalTurn-1){
         currentLevel=currentLevel+1;
         turnToGo=countLevel(currentLevel); //reset
         //Tambah jumlah undo
         gameData.bonus.undo.count++; //step 7
         turnCurrentLevel=1;
         totalThisLevel=turnToGo;


      //jika masih ada sisa level;
      }else{
         turnToGo--;
         turnCurrentLevel++;
      }
      turnCount++;

      gameData.level.current=currentLevel;
      gameData.level.toGo=turnToGo;
      gameData.turn.turnCount=turnCount;
      gameData.turn.turnCurrentLevel=turnCurrentLevel;
      gameData.level.totalThisLevel=totalThisLevel;
   }

   //Mengetes apakah angka ganjil atau genap
   function isEven(val){
      return val%2==0?true:false;
   }
   /*Untuk mengurangi dan menambah sesuai giliran
      Mode : 'bomb','mul':Multipolar,'nor':normal
      Mengembalikan variabel state yang terdiri dari
      stateObject=newValue,oldValue,score
   */
   function turnCounting(gameMap,mode,x,y,isPreview){
      var position;

      //mengembalikan variabel state
      var state=new Array(c.bS);
      //inisialisasi state;
      for(i=0;i<c.bS;i++){
         state[i]=new Array(c.bS);
            for(j=0;j<c.bS;j++){
               state[i][j]={'score':undefined,'newV':undefined, 'oldV':undefined};
         }
      }
      if(mode=='bomb'){

         for(var i=-1;i<2;i++){
            for(var j=-1;j<2;j++){
               var x1=x+i; //x aksen, untuk mengelola sekitarnya
               var y1=y+j; //y aksen
               //cek apakah diluar batas kotak atau ngga
               var turnV;
               var oldV;
               //cek apakah diluar batas kotak atau ngga
               if(isInTheBox(x1,y1)){
                  turnV=gameMap[x][y];  
                  oldV=gameMap[x1][y1];
               }else{continue;}

               //cek apakah harus diproses apa tidak
               if(isMustProcessed(oldV,i,j,mode)){
                  //Jika bomb maka, semua dikurangi jadi 0;
                  var newV=0;
                  var score=oldV;
                  //simpan perhitungan di array
                  state[x1][y1]={'score':score,'newV':newV, 'oldV':oldV};
                  //Mengganti isi angka gameMap. Jika merupakan turn
                  if(!isPreview){
                     gameMap[x1][y1]=newV;
                     updateBlockMap(x1,y1)
                  }
               }

            }
         }

      }
      else if(mode=='mul'){

         for(var i=-1;i<2;i++){
            for(var j=-1;j<2;j++){
               var x1=x+i; //x aksen, untuk mengelola sekitarnya
               var y1=y+j; //y aksen 
               //cek apakah diluar batas kotak atau ngga
               var turnV;
               var oldV;
               //cek apakah diluar batas kotak atau ngga
               if(isInTheBox(x1,y1)){
                  turnV=gameMap[x][y];  
                  oldV=gameMap[x1][y1];
               }else{continue;}

               //cek apakah harus diproses apa tidak
               if(isMustProcessed(oldV,i,j,mode)){

                  var newV=oldV-turnV;
                      newV=newV<0?0:newV; //untuk memastikan tidak kurang dari 0;
                  var score=oldV-newV;

                  //simpan perhitungan di array
                  state[x1][y1]={'score':score,'newV':newV, 'oldV':oldV};
               
                  //Mengganti isi angka gameMap. Jika merupakan turn
                  if(!isPreview){
                     gameMap[x1][y1]=newV;
                     updateBlockMap(x1,y1)

                  }

               }

            }
         }
      //untuk situasi normal
      }else{

         for(var i=-1;i<2;i++){
            for(var j=-1;j<2;j++){
               var x1=x+i; //x aksen, untuk mengelola sekitarnya
               var y1=y+j; //y aksen
            
               // console.log(x1+''+y1);
               var turnV;
               var oldV;
               //cek apakah diluar batas kotak atau ngga
               if(isInTheBox(x1,y1)){
                  turnV=gameMap[x][y];  
                  oldV=gameMap[x1][y1];
               }else{continue;}

               //cek apakah harus diproses apa tidak
               if(isMustProcessed(oldV,i,j,mode)){
                  var newV=0;
                  var score=0;
                  // console.log(turnV+' '+oldV);
                  //Jika angka sama-sama genap / ganjil
                  if(isSinglePolar(oldV,turnV)){
                     newV=oldV-turnV;
                     newV=newV<0?0:newV; //untuk memastikan tidak kurang dari 0;
                     score=oldV-newV;
                     //Jika angka ganjil genap
                  }else{
                     //jika ngga singlepolar
                     newV=oldV+turnV;
                     score=0;
                  }
                  //simpan perhitungan di array
                  state[x1][y1]={'score':score,'newV':newV, 'oldV':oldV};
                  // console.log(state[x1][y1].score+' '+state[x1][y1].newV+' '+state[x1][y1].oldV);

                  //Mengganti isi angka gameMap. Jika merupakan turn
                  if(!isPreview){
                     gameMap[x1][y1]=newV;
                     updateBlockMap(x1,y1);
                  }

               }

            }
         }
      }

      return state;
   }
   //fungsi untuk menghitung apakah kombo atau tidak
   function isCombo(state){
       for(var i = 0; i < state.length; i++) {
         for(var j = 0; j < state[i].length; j++) {
            if(state[i][j].newV==0){
               return true;
            }
         }
      }
   }

   //Untuk menghitung jumlah score tiap giliran dan evaluasi bonus multiplier & bomb;
   function countScore(state, combo){
      var scoreTotal=0;
      var scoreCount=0;
      for(var i = 0; i < state.length; i++) {
         for(var j = 0; j < state[i].length; j++) {
            if(state[i][j].score!=undefined){
               scoreTotal=scoreTotal+state[i][j].score;
               
               if(state[i][j].newV==0){
                  scoreCount=scoreCount+1;
               }
            }
         }
      }

      // console.log('Score Count '+scoreCount);

      return {scoreTotal:scoreTotal*gameData.level.current,scoreCount:scoreCount};
   }
   function isSinglePolar(val1,val2){
      return isEven(val1)==isEven(val2)?true:false;
   }
   //fungsi untuk menentukan kotak diproses atau tidak
   //Jika kotak isinya 0, maka akan dibiarkan
   //dan jika kotak merupakan kotak yang diproses ditandai dengan i & j == 0
   //JIka bomb, maka ketika i & j==0 diulang juga.
   function isMustProcessed(oldV, i,j,mode){
      if(oldV==0 || (i==0 && j==0 && mode!='bomb')){
         return false;
      }else{
         return true;
      }
   }
   //Step 1  bs= Board size
   //cek kevalidan posisi
   function isInTheBox(x,y){
      if(!(x>(c.bS-1) || x<0 || y>(c.bS-1) || y<0)){
         return true;
      }else{
         return false;
      }
   }
   function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
   }
   //Update variabel blockMap
   //block map berfungsi untuk memetakan kotak yang kosong
   //digunakan untuk generate random angka dan deteksi game over
   //dipanggil setiap ada perubahan di block
   function updateBlockMap(x,y){
      var emptyBlockMap=gameData.emptyBlockMap;
      var value=x+'.'+y;
      // console.log(gameData.gameMap[x][y]);
      if(gameData.gameMap[x][y]==0){
         emptyBlockMap.push(value);
         // console.log(value);
      //jika pull, hapus array;
      }else{
         for (var i=emptyBlockMap.length-1; i>=0; i--) {
             if (emptyBlockMap[i] === value) {
                 emptyBlockMap.splice(i, 1);
                 break;       
             }
         }
            console.log(JSON.stringify(value));                           
      }
      // this.isGameOver();
      console.log(JSON.stringify(emptyBlockMap));
   }
   function getMinValueTurn(){
      //rule 1 
       
      var currLevel;
      if(gameData.level.current<1){
         currLevel=1;
      }else{
         currLevel=gameData.level.current;
      }
      return currLevel*2-1;
         
      
      // aturan 2
      // return 1;
   }
   function getMaxValueTurn(){
      // rule 1
      var currLevel;
      if(gameData.level.current<1){
         currLevel=1;
      }else{
         currLevel=gameData.level.current;
      }
      return currLevel*5+5; 
       // rule 2
      // return 10;
   }
}

/*fungsi untuk rule */


