'use strict';

/* App Module */
var app2 = angular.module('app2', ['ui.router','angularValidator','ngCookies','ui.bootstrap','ngFileUpload','ui.tinymce']);









app2.controller('addcontent', function($compile,$scope,$state,$http,$cookieStore,$rootScope,Upload,$sce,$stateParams,$window) {



    $rootScope.editcontent= function (evalue) {

        console.log(evalue);
    }



    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            'advlist autolink link  lists charmap   hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code  insertdatetime  nonbreaking',
            'save table contextmenu directionality  template paste textcolor'
        ],
        // toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
        toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link  |   media fullpage | forecolor backcolor',
        valid_elements : "a[href|target| href=javascript:void(0)],strong,b,img,div[align|class],br,span,label,i[class],ul[class],ol[class],li[class],iframe[width|height|src|frameborder|allowfullscreen]",
        force_p_newlines : false,
        forced_root_block:'',
        extended_valid_elements : "label,span,i[class]"
    };

    $scope.form={};
    $scope.form.resume = '';
    $scope.form.resumearrn = new Array();
    $scope.form.resumearrp = new Array();
    $scope.form.resume = null;;


    $scope.caclismultiple=function(){

        if($scope.form.ismultiple=='yes'){

            $scope.ismultipleval=true;
        }
        else   $scope.ismultipleval=false;

    }

    $scope.delcopy=function(ev){

        console.log('test ...');

        var target = ev.target || ev.srcElement || ev.originalTarget;

        if($scope.cimage==true) {

            var spval = ($('.imgc').find('.delb').index(target));
            $scope.form.resumearrn.splice(spval, 1);
            $scope.form.resumearrp.splice(spval, 1);
            $(target).parent().remove();
        }

        if($scope.ctext==true || $scope.chtml==true){
            console.log($(target).prev().prev().attr('indexval'));
            // $scope.form.ctext.splice($(target).prev().attr('indexval'),1);
            // /delete $scope.form.ctext.$(target).prev().attr('indexval');
            var key = $(target).prev().prev().attr('indexval');
            if(key!=0){
                ;
                if($scope.ctext==true) $scope.form.ctext[key]=null;
                if($scope.chtml==true) $scope.form.chtml[key]=null;
                var res= $(target).parent().parent();
                $(target).parent().remove()
                $compile(res)($scope);

            }else{
                alert('You can not delete default content area' );
            }

        }

    }
    $scope.addcopy=function(ev){

        var target = ev.target || ev.srcElement || ev.originalTarget;

        if($scope.cimage!=true) {
            if ($scope.ctext == true ) {

                var addedval =parseInt(parseInt($(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                var res=$(target).prev().prev().clone().appendTo($(target).parent().find('.clearfix1').last());

                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval',addedval);
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('ng-model','form.ctext['+addedval+']');
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('name','ctext['+addedval+']');
                //$compile(res)($scope);
                $compile($(target).prev().find('.copyarea').last())($scope);
                $(target).prev().find('.copyarea').last().find('button').removeClass('delb');

                $scope.add_Admin.$setDirty(true);

            }
            if ($scope.chtml == true) {
                var addedval =parseInt(parseInt($('div[ng-show="chtml"]').find('textarea').last().attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                $(target).parent().find('.clearfix1').last().append("\<div class='copyarea'>\
                \<textarea ui-tinymce='tinymceOptions'   name='chtml["+addedval+"]'  indexval ="+addedval+"  \
             \ ng-model='form.chtml["+addedval+"]'   \
                \ required\
              \  ></textarea>\
        \<div class='clearfix'></div>\
               \ <button type='button' ng-click='delcopy($event)' class='btn btn-primary'>Delete</button>\
               \ </div>\
                \<div class='clearfix'></div>");

                var res=$(target).parent().find('.copyarea').last();

                $compile(res)($scope || $rootScope);
                //$rootScope.$digest();

            }
        }
        else {
            $('input.uploadbtn').click();
            console.log($('button.uploadbtn').text());
        }

    }
    $scope.form.ismultiple='no';
    $scope.cimage=false;
    $scope.chtml=false;
    $scope.ctext=false;


    $scope.ctype=function(ctype){

        $scope.cimage=false;
        $scope.chtml=false;
        $scope.ctext=false;

        if(ctype=='html') {

            // $('textarea[name^="chtml"]').attr('required','');
            $scope.chtml=true;
        }
        if(ctype=='text') {
            //$('textarea[name^="ctext"]').attr('required','');
            $scope.ctext=true;
        }
        if(ctype=='image') $scope.cimage=true;

    }


    $scope.$watch('cfile', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            $scope.upload($scope.cfile);
            $rootScope.stateIsLoading = true;
        }
    });

    $scope.upload = function (file) {
        Upload.upload({
            url: $scope.adminUrl+'uploads',//webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (response) { //upload function returns a promise
            if(response.data.error_code === 0){ //validate success
                //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');

                console.log(response.data.filename);

                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                if($scope.form.ismultiple=='yes'){

                    $scope.form.resumearrn.push(response.data.filename);
                    $scope.form.resumearrp.push(response.data.filename);

                    $scope.form.resume = null;
                    $scope.form.event_image = null;

                }
                else {

                    $scope.form.resume = response.data.filename;
                    $scope.form.image_url_url = response.data.filename;
                    $scope.form.event_image = response.data.filename;

                    $scope.form.resumearrn=new Array();
                    $scope.form.resumearrp=new Array();
                }
                $rootScope.stateIsLoading = false;

                //$('#loaderDiv').addClass('ng-hide');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };



    /*file upload end */



    $scope.contentValidator=function(){


        if($scope.add_Admin.$submitted){


            if($scope.form.ismultiple=='yes'){

                $scope.ismultipleval=true;
            }
            else   $scope.ismultipleval=false;

            if(typeof ($scope.form.ismultiple)!='undefined') return true;

            else return 'Required !' ;

        }

    }
    $scope.contenetv=function(){




        if($scope.add_Admin.$submitted){

            console.log($scope.form.ctext);
            if(typeof ($scope.form.ctext)!='undefined')
                console.log(Object.keys($scope.form.ctext).length);
            console.log($('textarea[name^="ctext"]').length);

            console.log('in cont validator');

        }

    }

    $scope.submitadminForm=function(){


        if($scope.chtml == true ){

            $scope.form.chtml=JSON.stringify($scope.form.chtml);

        }
        if($scope.ctext == true ){

            $scope.form.ctext=JSON.stringify($scope.form.ctext);

        }


        console.log($scope.form);
        console.log($.param($scope.form));

        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adddata',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            //$('#employmentmodal').modal('show');
            console.log(data);
            $state.go('contentlist');

        });

    }

});




app2.controller('contentlist', function($scope,$state,$http,$cookieStore,$rootScope,$uibModal) {
    $scope.getTextToCopy = function() {
        return "ngClip is awesome!";
    }
    $scope.doSomething = function () {
        console.log("NgClip...");
    }

    var clipboard = new Clipboard('.btn');
    $scope.predicate = 'id';
    $scope.reverse = true;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.currentPage=1;
    $scope.perPage=10;

    $scope.totalItems = 0;

    $scope.filterResult = [];    $http({
        method  : 'GET',
        async:   false,
        url     : $scope.adminUrl+'listcontent',
        // data    : $.param($scope.form),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        $rootScope.stateIsLoading = false;
        //console.log(data);
        $scope.contentlist=[];
        $scope.conf=[];
        $scope.contenttype=[];

        angular.forEach(data, function(value, key){
            //console.log(value.type);
            $scope.tempval=value;
            if(value.ctype == "html" || value.ctype=='text') {
                $scope.tempval.content=JSON.parse(value.content);
            }
            $scope.contentlist.splice(value.id,0,$scope.tempval);

            $scope.conf[value.id]= $scope.tempval.content;
            $scope.contenttype[value.id]= $scope.tempval.ctype;
            //array.splice(2, 0, "three");
            if(value.parentid!=0) {

                $scope.conf[value.parentid]= $scope.tempval.content;
                $scope.contenttype[value.parentid]= $scope.tempval.ctype;
            }
        });
        console.log($scope.contentlist);
        $scope.contentlistp = $scope.contentlist.slice($scope.begin, parseInt($scope.begin+$scope.perPage));

    });

    $scope.searchkey = '';
    $scope.search = function(item){

        if ( (item.cname.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) || (item.content.toString().toLowerCase().indexOf($scope.searchkey.toString().toLowerCase()) != -1) ){
            return true;
        }
        return true;
    };

    $scope.deladmin = function(item,size){

        $scope.currentindex=$scope.userlist.indexOf(item);

        $uibModal.open({
            animation: true,
            templateUrl: 'delconfirm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            scope:$scope
        });
    }

    $scope.changeStatus = function(item){
        $rootScope.stateIsLoading = true;
        var idx = $scope.userlist.indexOf(item);
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'updatestatus',
            data    : $.param({uid: $scope.userlist[idx].uid}),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            $rootScope.stateIsLoading = false;
            if($scope.userlist[idx].status == 0){
                $scope.userlist[idx].status = 1;
            }else{
                $scope.userlist[idx].status = 0;
            }
            // $scope.userlist[idx].status = !$scope.userlist[idx].status;
        });
    }





});


app2.controller('editcontent', function(contentservice,$compile,$scope,$state,$http,$cookieStore,$rootScope,Upload,$sce,$stateParams,$uibModalInstance,items) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.form={};
    $scope.form.resume = '';
    $scope.form.resumearrn = new Array();
    $scope.form.resumearrp = new Array();
    $scope.form.resume = null;;
    if(typeof (items)=='undefined')$scope.id=$stateParams.id;
    else $scope.id=items;

    $http({
        method  : 'GET',
        async:   false,
        url     :     $scope.adminUrl+'contentlistbyid/'+$scope.id,
        data    : $.param({'id':$scope.userid}),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) .success(function(data) {
        console.log(data.length);
        //console.log($scope.form);
        console.log('after form');
        $rootScope.currentlistdata=data;
        $scope.form = {
            cname: data[data.length-1].cname,
            ctype: data[data.length-1].ctype,
            description: data[data.length-1].description,
            parentid:data[data.length-1].id
        }

        if(data[data.length-1].parentid!=0) $scope.form.parentid=data[data.length-1].parentid;
        if(data[data.length-1].ctype!='image') {
            data[data.length-1].content = JSON.parse(data[data.length-1].content);

            if (data[data.length-1].content.length > 1) $scope.form.ismultiple = 'yes';
            else $scope.form.ismultiple = 'no';
        }else {

            $scope.form.ismultiple = 'no';
        }
        if(data[data.length-1].ctype=='html') {
            $scope.chtml=true;
            $scope.form.chtml=data[data.length-1].content;
        }
        if(data[data.length-1].ctype=='text') {
            $scope.form.ctext=data[data.length-1].content;
            $scope.ctext=true;
        }
        if(data[data.length-1].ctype=='image'){
            $scope.form.cimage=data[data.length-1].content;
            $scope.form.resume=data[data.length-1].content;
            $scope.form.image_url_url=data[data.length-1].content;
            $scope.cimage=true;
            $scope.form.ismultiple='no';
        }
        console.log($scope.form);
        console.log('after form');
    });

    $scope.tinymceOptions = {
        trusted: true,
        theme: 'modern',
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons",
        valid_elements : "a[href|target],strong,b,img[src|alt],div[align|class],br,span,label,h3,h4,h2,h1,strong,i[class],ul[class],ol[class],li[class],iframe[width|height|src|frameborder|allowfullscreen]",
        extended_valid_elements : "label,span,i[class]",
        'force_p_newlines'  : false,
        'forced_root_block' : '',
    };

    $scope.caclismultiple=function(){
        if($scope.form.ismultiple=='yes'){
            $scope.ismultipleval=true;
        }
        else   $scope.ismultipleval=false;
    }

    $scope.delcopy=function(ev){

        console.log('test ...');

        var target = ev.target || ev.srcElement || ev.originalTarget;

        if($scope.cimage==true) {

            var spval = ($('.imgc').find('.delb').index(target));
            $scope.form.resumearrn.splice(spval, 1);
            $scope.form.resumearrp.splice(spval, 1);
            $(target).parent().remove();
        }
        if($scope.ctext==true || $scope.chtml==true){
            console.log($(target).prev().prev().attr('indexval'));

            var key = $(target).prev().prev().attr('indexval');
            if(key!=0){
                ;
                if($scope.ctext==true) $scope.form.ctext[key]=null;
                if($scope.chtml==true) $scope.form.chtml[key]=null;
                var res= $(target).parent().parent();
                $(target).parent().remove()
                $compile(res)($scope);

            }else{
                alert('You can not delete default content area' );
            }
        }
    }
    $scope.addcopy=function(ev){

        var target = ev.target || ev.srcElement || ev.originalTarget;

        //console.log($( target).parentsUntil('.copyarea').html());
        if($scope.cimage!=true) {
            if ($scope.ctext == true ) {

                var addedval =parseInt(parseInt($(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                var res=$(target).prev().prev().clone().appendTo($(target).parent().find('.clearfix1').last());

                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('indexval',addedval);
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('ng-model','form.ctext['+addedval+']');
                $(target).parent().find('.clearfix1').last().find('.copyarea').last().find('textarea').attr('name','ctext['+addedval+']');
                //$compile(res)($scope);
                $compile($(target).prev().find('.copyarea').last())($scope);
                $(target).prev().find('.copyarea').last().find('button').removeClass('delb');

                $scope.add_Admin.$setDirty(true);

            }
            if ($scope.chtml == true) {
                var addedval =parseInt(parseInt($('div[ng-show="chtml"]').find('textarea').last().attr('indexval'))+1);
                if(isNaN(addedval)) addedval=1;

                $(target).parent().find('.clearfix1').last().append("\<div class='copyarea'>\
                \<textarea ui-tinymce='tinymceOptions'   name='chtml["+addedval+"]'  indexval ="+addedval+"  \
             \ ng-model='form.chtml["+addedval+"]'   \
                \ required\
              \  ></textarea>\
             \<div class='clearfix'></div>\
               \ <button type='button' ng-click='delcopy($event)' class='btn btn-primary'>Delete</button>\
               \ </div>\
                \<div class='clearfix'></div>");

                var res=$(target).parent().find('.copyarea').last();

                $compile(res)($scope || $rootScope);
            }
        }
        else {
            $('input.uploadbtn').click();
            console.log($('button.uploadbtn').text());
        }

    }
    $scope.form.ismultiple='no';
    $scope.cimage=false;
    $scope.chtml=false;
    $scope.ctext=false;

    $scope.ctype=function(ctype){

        $scope.cimage=false;
        $scope.chtml=false;
        $scope.ctext=false;

        if(ctype=='html') {

            $scope.chtml=true;
        }
        if(ctype=='text') {
            $scope.ctext=true;
        }
        if(ctype=='image') $scope.cimage=true;
    }

    /*file upload part start */

    $scope.$watch('cfile', function (files) {
        $scope.formUpload = false;
        if (files != null) {
            $scope.upload($scope.cfile);
            $rootScope.stateIsLoading = true;
        }
    });

    $scope.upload = function (file) {
        Upload.upload({
            url: $scope.adminUrl+'uploads',//webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (response) { //upload function returns a promise
            if(response.data.error_code === 0){ //validate success
                //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');

                console.log(response.data.filename);

                $('.progress').removeClass('ng-hide');
                file.result = response.data;

                if($scope.form.ismultiple=='yes'){

                    $scope.form.resumearrn.push(response.data.filename);
                    $scope.form.resumearrp.push(response.data.filename);

                    $scope.form.resume = null;
                    $scope.form.event_image = null;

                }
                else {

                    $scope.form.resume = response.data.filename;
                    $scope.form.image_url_url = response.data.filename;
                    $scope.form.event_image = response.data.filename;

                    $scope.form.resumearrn=new Array();
                    $scope.form.resumearrp=new Array();
                }
                $rootScope.stateIsLoading = false;

            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

    /*file upload end */

    setTimeout(function(){
        $scope.form.country={};
        $scope.form.country.s_name='Belize';
        $('#country').val(20);
    },2000);


    $scope.contentValidator=function(){
        if($scope.add_Admin.$submitted){
            if($scope.form.ismultiple=='yes'){
                $scope.ismultipleval=true;
            }
            else   $scope.ismultipleval=false;
            if(typeof ($scope.form.ismultiple)!='undefined') return true;
            else return 'Required !' ;
        }
    }
    $scope.contenetv=function(){
        if($scope.add_Admin.$submitted){
            console.log($scope.form.ctext);
            if(typeof ($scope.form.ctext)!='undefined')
                console.log(Object.keys($scope.form.ctext).length);
            console.log($('textarea[name^="ctext"]').length);
            console.log('in cont validator');
        }
    }

    $scope.submitadminForm=function(){


        if($scope.chtml == true ){

            $scope.form.chtml=JSON.stringify($scope.form.chtml);

        }
        if($scope.ctext == true ){

            $scope.form.ctext=JSON.stringify($scope.form.ctext);

        }
        console.log($scope.form);
        console.log($.param($scope.form));
        $http({
            method  : 'POST',
            async:   false,
            url     : $scope.adminUrl+'adddata',
            data    : $.param($scope.form),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) .success(function(data) {
            console.log(data);
            if($state.current!='edit-content'){
                $rootScope.refreshcontent();
                setTimeout(function(){
                    $rootScope.refreshcontent();
                    $scope.cancel();
                },1900);
            }
            else{
                if(typeof ($rootScope.previousState)!='undefined') $state.go($rootScope.previousState);
                else $state.go('contentlist');
            }
        });

    }

    $scope.iseditableformon=true

    $rootScope.getpreview=function(){
        $scope.iseditableformon=false;

        if($scope.chtml == true ){

            $scope.previewcontent=$scope.form.chtml[0];

        }
        if($scope.ctext == true ){

            $scope.previewcontent=$scope.form.ctext[0];

        }
        if($scope.cimage == true ){

            $scope.previewcontent="<img src=nodeserver/uploads/"+$scope.form.image_url_url+" /> ";

        }
    }

    $rootScope.update=function(){
        console.log($scope.contenetselected);


        console.log($scope.contenetselected.ctype+'==type');


        $scope.form = {
            cname: $scope.contenetselected.cname,
            ctype: $scope.contenetselected.ctype,
            description: $scope.contenetselected.description,
            parentid:$scope.contenetselected.id
        }

        if($scope.contenetselected.parentid!=0) $scope.form.parentid=$scope.contenetselected.parentid;
        if($scope.contenetselected.ctype!='image') {
            console.log($scope.contenetselected.content);
            console.log($scope.contenetselected.content[0]);
            if(typeof ($scope.contenetselected.content)!='object')$scope.contenetselected.content = JSON.parse($scope.contenetselected.content);
            console.log($scope.contenetselected.content);

            if ($scope.contenetselected.content.length > 1) $scope.form.ismultiple = 'yes';
            else $scope.form.ismultiple = 'no';
        }else {

            $scope.form.ismultiple = 'no';
        }
        if($scope.contenetselected.ctype=='html') {
            $scope.chtml=true;
            $scope.cimage=false;
            $scope.ctext=false;
            $scope.form.chtml=$scope.contenetselected.content;
            $scope.previewcontent=$scope.contenetselected.content[0];
        }
        if($scope.contenetselected.ctype=='text') {
            $scope.form.ctext=$scope.contenetselected.content;
            $scope.ctext=true;
            $scope.cimage=false;
            $scope.chtml=false;
            $scope.previewcontent=$scope.contenetselected.content[0];
        }
        if($scope.contenetselected.ctype=='image'){
            $scope.form.cimage=$scope.contenetselected.content;
            $scope.form.resume=$scope.contenetselected.content;
            $scope.form.image_url_url=$scope.contenetselected.content;
            $scope.cimage=true;
            $scope.ctext=false;
            $scope.chtml=false;
            $scope.form.ismultiple='no';
            $scope.previewcontent="<img src=nodeserver/uploads/"+$scope.form.image_url_url+" /> ";
        }
    }
});


app2.controller('home', function($scope,$state,$cookieStore,$rootScope,contentservice) {



});
app2.controller('home1', function($scope,$state,$cookieStore,$rootScope,contentservice) {

    $scope.name = "Bob A";

});

app2.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {


});
